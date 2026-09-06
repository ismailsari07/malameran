/**
 * Direct-to-Storage upload with progress.
 *
 * fetch() cannot report upload progress, so this is XMLHttpRequest: the
 * progress event drives the artboard's 3px track and abort() backs the Cancel
 * affordance. The browser never holds a Supabase credential — only a
 * single-use URL the server signed for one specific path.
 */

export type UploadHandle = {
  done: Promise<void>;
  cancel: () => void;
};

export function uploadToSignedUrl({
  signedUrl,
  file,
  onProgress,
}: {
  signedUrl: string;
  file: File;
  onProgress: (percent: number) => void;
}): UploadHandle {
  const xhr = new XMLHttpRequest();

  const done = new Promise<void>((resolve, reject) => {
    xhr.open("PUT", signedUrl, true);
    // The declared type is advisory; the server identifies the bytes itself.
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`upload failed with ${xhr.status}`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("upload failed")));
    xhr.addEventListener("abort", () => reject(new Error("upload cancelled")));

    xhr.send(file);
  });

  return { done, cancel: () => xhr.abort() };
}
