"use client";

import Link from "next/link";
import { useState } from "react";
import { FileDownloadButton } from "@/components/forms/file-download-button";
import { FormBanner } from "@/components/form-banner";
import { formatBytes, formatDate } from "@/lib/format";
import { statusLabel, vehicleLabel } from "@/lib/file-history/labels";
import type {
  TuningFileRead,
  TuningRequestDetailRead,
} from "@/lib/types/file-history";

type FileHistoryDetailInteractiveProps = {
  request: TuningRequestDetailRead;
  files: TuningFileRead[];
  options: string;
  hasProcessed: boolean;
};

function roleLabel(role: TuningFileRead["role"], version: number): string {
  if (role === "processed") {
    return version > 1 ? `Processed (v${version})` : "Processed";
  }
  return "Original";
}

export function FileHistoryDetailInteractive({
  request,
  files,
  options,
  hasProcessed,
}: FileHistoryDetailInteractiveProps) {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  return (
    <section className="shop-panel file-history-panel">
      <div className="file-history-main">
        <p className="file-history-name">{vehicleLabel(request)}</p>
        <p className="file-history-meta muted">
          <span
            className={["file-history-status", `is-${request.status}`].join(
              " ",
            )}
          >
            {statusLabel(request.status)}
          </span>
          {" · "}
          {request.file_kind.toUpperCase()} · {request.gearbox} ·{" "}
          {request.tuning_points_spent} TuningPoints ·{" "}
          {formatDate(request.created)}
        </p>
        {options ? (
          <p className="file-history-meta muted">Options: {options}</p>
        ) : null}
      </div>

      {downloadError ? (
        <FormBanner tone="error">{downloadError}</FormBanner>
      ) : null}

      {!hasProcessed ? (
        <p className="muted file-history-empty-processed">
          No processed file yet. It will appear here when your request is ready.
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="file-history-list file-history-files">
          {files.map((file) => (
            <li key={file.uuid} className="file-history-item">
              <div className="file-history-main">
                <p className="file-history-name">{file.original_filename}</p>
                <p className="file-history-meta muted">
                  {roleLabel(file.role, file.version)} ·{" "}
                  {formatBytes(file.file_size_bytes)} ·{" "}
                  {formatDate(file.created)}
                </p>
              </div>
              <FileDownloadButton
                requestId={request.uuid}
                fileId={file.uuid}
                onError={setDownloadError}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No files on this request yet.</p>
      )}

      <div className="shop-result-actions">
        <Link href="/file-history" className="cta cta-secondary">
          Back to history
        </Link>
      </div>
    </section>
  );
}
