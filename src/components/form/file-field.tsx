"use client";

import { useRef, useState } from "react";

import { REQUEST_FORM } from "@/content/request-form";
import { cn } from "@/lib/cn";
import { MAX_FILE_BYTES, MAX_FILES_PER_REQUEST } from "@/lib/files/verify";

import { FieldShell, type FieldShellProps } from "./field-shell";

/**
 * The dropzone and its file list.
 *
 * Files are held as File objects in memory and uploaded only on final submit,
 * so no orphaned object can exist in storage. Once submission starts each row
 * shows the artboard's 3px track, its percentage and a Cancel affordance.
 *
 * These checks are a convenience. The server re-checks the count, the size and
 * the actual bytes of every file; see src/lib/files/verify.ts.
 */

const copy = REQUEST_FORM.requirements.files;

/** Extensions matching the accepted types, for the native picker's filter. */
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.dwg,.xlsx";

const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "webp", "dwg", "xlsx"];

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function rejectionFor(file: File, existing: number): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) return copy.rejectedBody;
  if (file.size > MAX_FILE_BYTES) return copy.rejectedBody;
  if (existing >= MAX_FILES_PER_REQUEST) return copy.rejectedBody;
  return null;
}

export type UploadState = {
  /** 0-100 while uploading; absent before an upload starts. */
  percent?: number;
  cancel?: () => void;
};

export function FileField({
  value,
  onChange,
  uploads = {},
  locked = false,
  ...shell
}: Omit<FieldShellProps, "children"> & {
  value: readonly File[];
  onChange: (files: File[]) => void;
  /** Per-file upload progress, keyed by index. */
  uploads?: Record<number, UploadState>;
  /** During submission the list is read-only apart from Cancel. */
  locked?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rejected, setRejected] = useState<{
    name: string;
    reason: string;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const add = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    let firstRejection: { name: string; reason: string } | null = null;

    for (const file of Array.from(incoming)) {
      const reason = rejectionFor(file, value.length + accepted.length);
      if (reason) {
        firstRejection ??= { name: file.name, reason };
        continue;
      }
      // Same name and size twice is a re-pick, not a second file.
      const duplicate = value.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (!duplicate) accepted.push(file);
    }

    setRejected(firstRejection);
    if (accepted.length) onChange([...value, ...accepted]);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setRejected(null);
  };

  return (
    <FieldShell {...shell}>
      {({ id, describedBy }) => (
        <>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              add(event.dataTransfer.files);
            }}
            className={cn(
              "rounded-16 border border-dashed px-6 py-8 text-center transition-colors",
              rejected
                ? "border-err bg-err-field-bg"
                : dragging
                  ? "border-accent bg-surface-dropzone"
                  : "border-border-dropzone bg-surface-dropzone",
            )}
          >
            {rejected ? (
              <>
                <p className="t-dropzone-title text-err-heading">
                  {copy.rejectedTitle(rejected.name)}
                </p>
                <p className="t-field-desc text-err-body mt-2">
                  {rejected.reason}
                </p>
              </>
            ) : (
              <>
                <p className="t-dropzone-title text-text-label">
                  {copy.dropTitle}
                </p>
                <p className="t-field-desc text-muted mt-2">
                  {copy.browsePrefix}
                </p>
              </>
            )}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="t-field-link text-accent focus-visible:focus-outline mt-2 underline underline-offset-[3px]"
            >
              {rejected ? copy.chooseAnother : copy.browseLabel}
            </button>

            {rejected ? null : (
              <p className="t-hint text-text-small mt-3.5">
                {copy.constraints}
              </p>
            )}

            <input
              ref={inputRef}
              id={id}
              name={shell.name}
              type="file"
              multiple
              accept={ACCEPT}
              aria-describedby={describedBy}
              className="sr-only"
              onChange={(event) => {
                add(event.target.files);
                // Let the same file be picked again after a removal.
                event.target.value = "";
              }}
            />
          </div>

          {value.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2.5">
              {value.map((file, index) => {
                const upload = uploads[index];
                const uploading =
                  upload?.percent !== undefined && upload.percent < 100;
                const meta = uploading
                  ? copy.uploadingLabel(upload?.percent ?? 0)
                  : upload?.percent === 100
                    ? copy.uploadedLabel
                    : copy.readyLabel;
                return (
                  <li
                    key={`${file.name}-${file.size}`}
                    className="rounded-12 border-line bg-surface border px-4 py-3.5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="t-label text-text-label truncate">
                          {file.name}
                        </p>
                        <p className="t-hint text-text-small mt-1">
                          {formatSize(file.size)} · {meta}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          uploading ? upload?.cancel?.() : remove(index)
                        }
                        disabled={locked && !uploading}
                        className="t-btn-xs border-line text-muted rounded-8 hover:text-err hover:border-err-border-hover focus-visible:focus-outline shrink-0 border px-3 py-[7px] transition-colors disabled:cursor-not-allowed"
                      >
                        {uploading ? copy.cancelLabel : copy.removeLabel}
                        <span className="sr-only"> {file.name}</span>
                      </button>
                    </div>
                    {upload?.percent === undefined ? null : (
                      <div
                        className="bg-track rounded-2 mt-3 h-[3px]"
                        role="progressbar"
                        aria-valuenow={upload.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Uploading ${file.name}`}
                      >
                        <div
                          className="bg-accent rounded-2 h-[3px] transition-[width]"
                          style={{ width: `${upload.percent}%` }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </>
      )}
    </FieldShell>
  );
}
