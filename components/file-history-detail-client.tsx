"use client";

import Link from "next/link";
import { useState } from "react";
import { FileDownloadButton } from "@/components/forms/file-download-button";
import { FormBanner } from "@/components/form-banner";
import { formatBytes, formatDate } from "@/lib/format";
import { statusLabel } from "@/lib/file-history/labels";
import type {
  TuningFileRead,
  TuningRequestDetailRead,
} from "@/lib/types/file-history";

type FileHistoryDetailInteractiveProps = {
  request: TuningRequestDetailRead;
  files: TuningFileRead[];
  hasProcessed: boolean;
};

function roleLabel(role: TuningFileRead["role"], version: number): string {
  if (role === "processed") {
    return version > 1 ? `Processed v${version}` : "Processed";
  }
  return "Original";
}

function vehicleTitle(request: TuningRequestDetailRead): string {
  const parts = [
    request.brand?.name,
    request.model?.name,
    request.generation?.name,
    request.engine?.name,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Unknown vehicle";
}

function formatPoints(count: number): string {
  return `${count} TuningPoint${count === 1 ? "" : "s"}`;
}

function FileGlyph() {
  return (
    <svg
      className="file-history-file-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M7 3.75A2.75 2.75 0 0 0 4.25 6.5v11A2.75 2.75 0 0 0 7 20.25h10A2.75 2.75 0 0 0 19.75 17.5V9.31c0-.73-.29-1.43-.8-1.95l-3.31-3.31a2.75 2.75 0 0 0-1.95-.8H7Z"
      />
    </svg>
  );
}

export function FileHistoryDetailInteractive({
  request,
  files,
  hasProcessed,
}: FileHistoryDetailInteractiveProps) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const optionNames = request.tuning_options.map((option) => option.name);
  const title = vehicleTitle(request);
  const typeName = request.vehicle_type?.name;

  return (
    <section className="shop-panel file-history-panel file-history-detail">
      <header className="file-history-detail-head">
        <div className="file-history-detail-titles">
          {typeName ? (
            <p className="file-history-detail-kicker">{typeName}</p>
          ) : null}
          <h2 className="file-history-detail-title">{title}</h2>
        </div>
        <span
          className={[
            "file-history-status-pill",
            `is-${request.status}`,
          ].join(" ")}
        >
          {statusLabel(request.status)}
        </span>
      </header>

      <ul className="file-history-chips">
        <li>{request.file_kind.toUpperCase()}</li>
        <li className="file-history-chip-caps">{request.gearbox}</li>
        <li>{formatPoints(request.tuning_points_spent)}</li>
        {request.ecu?.name ? <li>{request.ecu.name}</li> : null}
        <li>{formatDate(request.created)}</li>
      </ul>

      {optionNames.length > 0 ? (
        <ul className="file-history-options" aria-label="Selected options">
          {optionNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : null}

      {downloadError ? (
        <FormBanner tone="error">{downloadError}</FormBanner>
      ) : null}

      {!hasProcessed ? (
        <p className="file-history-wait">
          Processed file will appear here when this request is ready.
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="file-history-list file-history-files">
          {files.map((file) => (
            <li key={file.uuid} className="file-history-item">
              <div className="file-history-file-lead">
                <span className="file-history-file-mark">
                  <FileGlyph />
                </span>
                <div className="file-history-main">
                  <p className="file-history-name">{file.original_filename}</p>
                  <p className="file-history-meta muted">
                    <span className="file-history-role">
                      {roleLabel(file.role, file.version)}
                    </span>
                    {" · "}
                    {formatBytes(file.file_size_bytes)} ·{" "}
                    {formatDate(file.created)}
                  </p>
                </div>
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
        <Link href="/file-history" className="file-history-back">
          Back to history
        </Link>
      </div>
    </section>
  );
}
