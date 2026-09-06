/**
 * Content-based file type verification.
 *
 * The extension and the browser-declared MIME type are both attacker-controlled
 * and neither is evidence. Everything here reads the actual bytes.
 *
 * No dependency: the two awkward formats are handled directly. DWG carries a
 * six-byte version code at offset 0. XLSX is a ZIP, and `PK\x03\x04` proves
 * only "this is a zip" — docx, pptx, jar and apk all start the same way — so
 * the central directory is walked and an `xl/` entry is required.
 */

export const MAX_FILE_BYTES = 4 * 1024 * 1024;

/**
 * Every signature this module recognises lives in the first 16 bytes. 64 is
 * read to leave room without a second round trip.
 */
export const HEAD_BYTES = 64;

/**
 * How much of a ZIP's tail to read when looking for the End of Central
 * Directory. The EOCD is within the last 64KB by spec, and the central
 * directory sits immediately before it, so this covers any realistic
 * spreadsheet in one read.
 */
export const ZIP_TAIL_BYTES = 256 * 1024;
export const MAX_FILES_PER_REQUEST = 5;

/** The whitelist. Nothing outside this is accepted. */
export const ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/vnd.dwg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export type AllowedMime = (typeof ALLOWED_MIME)[number];

export type VerifyResult =
  { ok: true; mime: AllowedMime } | { ok: false; reason: string };

function startsWith(bytes: Uint8Array, sig: readonly number[], offset = 0) {
  if (bytes.length < offset + sig.length) return false;
  return sig.every((b, i) => bytes[offset + i] === b);
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.subarray(offset, offset + length));
}

/**
 * DWG stores its format version as six ASCII bytes at offset 0. These are the
 * releases in circulation; DXF is a different, text-based format and is not on
 * the whitelist.
 */
const DWG_VERSIONS = new Set([
  "AC1014", // R14
  "AC1015", // 2000
  "AC1018", // 2004
  "AC1021", // 2007
  "AC1024", // 2010
  "AC1027", // 2013
  "AC1032", // 2018
]);

/** Guards against a zip bomb declared in the central directory. */
const ZIP_MAX_ENTRIES = 2000;
const ZIP_MAX_UNCOMPRESSED = 64 * 1024 * 1024;

/**
 * Walks a ZIP central directory and returns the entry names, or null when the
 * structure is not a readable ZIP.
 *
 * Only the central directory is parsed — no decompression happens, so a
 * malicious archive cannot be expanded here.
 */
function zipEntryNames(bytes: Uint8Array): string[] | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // End of Central Directory: signature PK\x05\x06, within the last 64KB.
  const scanFrom = Math.max(0, bytes.length - 65_557);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= scanFrom; i--) {
    if (startsWith(bytes, [0x50, 0x4b, 0x05, 0x06], i)) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) return null;

  const entryCount = view.getUint16(eocd + 10, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (entryCount === 0 || entryCount > ZIP_MAX_ENTRIES) return null;
  if (cdOffset >= bytes.length) return null;

  const names: string[] = [];
  let p = cdOffset;
  let totalUncompressed = 0;

  for (let i = 0; i < entryCount; i++) {
    // Central directory file header: PK\x01\x02
    if (!startsWith(bytes, [0x50, 0x4b, 0x01, 0x02], p)) return null;
    if (p + 46 > bytes.length) return null;

    const uncompressed = view.getUint32(p + 24, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const flags = view.getUint16(p + 8, true);

    // Bit 0 set means the entry is encrypted. Nothing readable follows.
    if ((flags & 0x0001) !== 0) return null;

    totalUncompressed += uncompressed;
    if (totalUncompressed > ZIP_MAX_UNCOMPRESSED) return null;

    if (p + 46 + nameLen > bytes.length) return null;
    names.push(ascii(bytes, p + 46, nameLen));

    p += 46 + nameLen + extraLen + commentLen;
  }

  return names;
}

/**
 * Identifies the file from its bytes.
 *
 * `declaredMime` is not consulted. The caller compares the detected type with
 * the declared one and rejects a mismatch rather than correcting it.
 */
/**
 * Walks a ZIP central directory inside a window taken from the end of the file.
 *
 * `windowStart` is the window's absolute offset, so the End of Central
 * Directory's pointer — which is absolute — can be resolved against it. If the
 * central directory begins before the window, the caller is told where to read
 * from rather than being handed a wrong answer.
 */
export type ZipWalk =
  | { kind: "names"; names: string[] }
  | { kind: "needFrom"; offset: number }
  | { kind: "unreadable" };

export function zipEntryNamesFromWindow(
  window: Uint8Array,
  windowStart: number,
  totalSize: number,
): ZipWalk {
  const view = new DataView(
    window.buffer,
    window.byteOffset,
    window.byteLength,
  );

  let eocd = -1;
  for (let i = window.length - 22; i >= 0; i--) {
    if (startsWith(window, [0x50, 0x4b, 0x05, 0x06], i)) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) return { kind: "unreadable" };

  const entryCount = view.getUint16(eocd + 10, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (entryCount === 0 || entryCount > ZIP_MAX_ENTRIES)
    return { kind: "unreadable" };
  if (cdOffset >= totalSize) return { kind: "unreadable" };

  if (cdOffset < windowStart) return { kind: "needFrom", offset: cdOffset };

  const names: string[] = [];
  let p = cdOffset - windowStart;
  let totalUncompressed = 0;

  for (let i = 0; i < entryCount; i++) {
    if (!startsWith(window, [0x50, 0x4b, 0x01, 0x02], p))
      return { kind: "unreadable" };
    if (p + 46 > window.length) return { kind: "unreadable" };

    const uncompressed = view.getUint32(p + 24, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const flags = view.getUint16(p + 8, true);

    if ((flags & 0x0001) !== 0) return { kind: "unreadable" };

    totalUncompressed += uncompressed;
    if (totalUncompressed > ZIP_MAX_UNCOMPRESSED) return { kind: "unreadable" };

    if (p + 46 + nameLen > window.length) return { kind: "unreadable" };
    names.push(ascii(window, p + 46, nameLen));

    p += 46 + nameLen + extraLen + commentLen;
  }

  return { kind: "names", names };
}

/**
 * What the first bytes say, without reading the rest of the file.
 *
 * A ZIP cannot be identified from its signature alone — docx, pptx, jar and apk
 * all start `PK\x03\x04` — so it is reported as `zip` and the caller reads the
 * central directory to decide.
 */
export type Signature =
  | { kind: "mime"; mime: AllowedMime }
  | { kind: "zip" }
  | { kind: "unknown"; reason: string };

export function detectSignature(head: Uint8Array): Signature {
  if (head.length === 0) return { kind: "unknown", reason: "empty file" };

  // %PDF-
  if (startsWith(head, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { kind: "mime", mime: "application/pdf" };
  }
  if (startsWith(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { kind: "mime", mime: "image/png" };
  }
  if (startsWith(head, [0xff, 0xd8, 0xff])) {
    return { kind: "mime", mime: "image/jpeg" };
  }
  if (
    startsWith(head, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(head, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { kind: "mime", mime: "image/webp" };
  }
  if (head.length >= 6 && DWG_VERSIONS.has(ascii(head, 0, 6))) {
    return { kind: "mime", mime: "image/vnd.dwg" };
  }
  if (startsWith(head, [0x50, 0x4b, 0x03, 0x04])) {
    return { kind: "zip" };
  }
  return { kind: "unknown", reason: "file type not recognised" };
}

/** Turns a ZIP's entry names into a verdict. Only xlsx is on the whitelist. */
export function classifyZipEntries(names: string[]): VerifyResult {
  if (names.some((n) => n === "xl/workbook.xml" || n.startsWith("xl/"))) {
    return {
      ok: true,
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }
  if (names.some((n) => n.startsWith("word/"))) {
    return { ok: false, reason: "Word documents are not accepted" };
  }
  if (names.some((n) => n.startsWith("ppt/"))) {
    return { ok: false, reason: "PowerPoint files are not accepted" };
  }
  return { ok: false, reason: "archives are not accepted" };
}

export function detectFileType(bytes: Uint8Array): VerifyResult {
  if (bytes.length === 0) return { ok: false, reason: "empty file" };
  if (bytes.length > MAX_FILE_BYTES) {
    return { ok: false, reason: "over the 4MB limit" };
  }

  // %PDF-
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { ok: true, mime: "application/pdf" };
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ok: true, mime: "image/png" };
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { ok: true, mime: "image/jpeg" };
  }
  // RIFF....WEBP
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { ok: true, mime: "image/webp" };
  }
  if (bytes.length >= 6 && DWG_VERSIONS.has(ascii(bytes, 0, 6))) {
    return { ok: true, mime: "image/vnd.dwg" };
  }

  // PK\x03\x04 — a ZIP of some kind. Only xlsx is on the whitelist.
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) {
    const names = zipEntryNames(bytes);
    if (!names) return { ok: false, reason: "unreadable or encrypted archive" };
    const isXlsx =
      names.includes("xl/workbook.xml") ||
      names.some((n) => n.startsWith("xl/"));
    if (isXlsx) {
      return {
        ok: true,
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    }
    if (names.some((n) => n.startsWith("word/"))) {
      return { ok: false, reason: "Word documents are not accepted" };
    }
    if (names.some((n) => n.startsWith("ppt/"))) {
      return { ok: false, reason: "PowerPoint files are not accepted" };
    }
    return { ok: false, reason: "archives are not accepted" };
  }

  return { ok: false, reason: "file type not recognised" };
}

/**
 * Browsers and operating systems disagree about some of these types. An alias
 * is not a lie, so it must not be treated as one — a DWG announced as
 * `application/acad` is still a DWG.
 *
 * `application/acad` is also in the dev bucket's own MIME whitelist, so a real
 * upload can arrive carrying it.
 */
const MIME_ALIASES: Record<string, AllowedMime> = {
  "application/acad": "image/vnd.dwg",
  "application/x-acad": "image/vnd.dwg",
  "application/dwg": "image/vnd.dwg",
  "image/x-dwg": "image/vnd.dwg",
  "drawing/dwg": "image/vnd.dwg",
  "image/jpg": "image/jpeg",
  "application/x-pdf": "application/pdf",
};

export function normaliseDeclaredMime(mime: string): string {
  const bare = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  return MIME_ALIASES[bare] ?? bare;
}

/**
 * Full check for one uploaded file: size, content type, and agreement between
 * the declared and detected types.
 *
 * The bytes decide. The declared type is only used to catch a file that claims
 * to be something it is not — a PNG announced as a PDF is rejected even though
 * PNG is itself on the whitelist.
 */
export function verifyUpload(
  bytes: Uint8Array,
  declaredMime: string,
): VerifyResult {
  const detected = detectFileType(bytes);
  if (!detected.ok) return detected;

  const declared = normaliseDeclaredMime(declaredMime);
  if (declared && declared !== detected.mime) {
    return {
      ok: false,
      reason: `declared ${declaredMime} but the bytes are ${detected.mime}`,
    };
  }
  return detected;
}
