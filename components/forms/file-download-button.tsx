"use client";

import { useState } from "react";
import { readErrorDetail } from "@/lib/http/api-error";

type FileDownloadButtonProps = {
  requestId: string;
  fileId: string;
  className?: string;
  label?: string;
  onError?: (message: string) => void;
};

export function FileDownloadButton({
  requestId,
  fileId,
  className = "cta cta-secondary file-history-download",
  label = "Download",
  onError,
}: FileDownloadButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleDownload() {
    if (pending) return;
    setPending(true);

    try {
      const response = await fetch(
        `/api/files/download?requestId=${encodeURIComponent(requestId)}&fileId=${encodeURIComponent(fileId)}`,
        { credentials: "same-origin" },
      );

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        onError?.(readErrorDetail(payload, response.status));
        return;
      }

      const downloadUrl =
        payload &&
        typeof payload === "object" &&
        "download_url" in payload &&
        typeof (payload as { download_url: unknown }).download_url === "string"
          ? (payload as { download_url: string }).download_url
          : null;

      if (!downloadUrl) {
        onError?.("Could not download file.");
        return;
      }

      window.location.href = downloadUrl;
    } catch {
      onError?.("Could not download file. Check your connection.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        void handleDownload();
      }}
    >
      {pending ? "Preparing…" : label}
    </button>
  );
}
