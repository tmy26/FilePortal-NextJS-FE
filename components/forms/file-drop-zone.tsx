"use client";

import { useId, type ChangeEvent, type RefObject } from "react";
import { formatBytes } from "@/lib/format";

const DEFAULT_MAX_BYTES = 200 * 1024 * 1024;

type FileDropZoneProps = {
  label: string;
  description?: string;
  accept?: string;
  file: File | null;
  disabled?: boolean;
  maxBytes?: number;
  requireBinExtension?: boolean;
  onFileChange: (file: File | null) => void;
  onError?: (message: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function FileDropZone({
  label,
  description,
  accept = ".bin,application/octet-stream",
  file,
  disabled = false,
  maxBytes = DEFAULT_MAX_BYTES,
  requireBinExtension = true,
  onFileChange,
  onError,
  inputRef,
}: FileDropZoneProps) {
  const generatedId = useId();
  const inputId = `${generatedId}-file`;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    if (next && requireBinExtension && !next.name.toLowerCase().endsWith(".bin")) {
      event.target.value = "";
      onFileChange(null);
      onError?.("Only .bin files are allowed.");
      return;
    }
    if (next && next.size > maxBytes) {
      event.target.value = "";
      onFileChange(null);
      onError?.(
        `File is too large (max ${Math.round(maxBytes / (1024 * 1024))} MB).`,
      );
      return;
    }
    onFileChange(next);
    onError?.("");
  }

  return (
    <div className="upload-drop">
      <input
        ref={inputRef}
        id={inputId}
        className="upload-file-input"
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
      />
      <label htmlFor={inputId} className="upload-drop-label">
        <span className="upload-drop-cta">{label}</span>
        {description ? (
          <span className="upload-drop-hint">{description}</span>
        ) : null}
        <span className="muted">
          {file
            ? `${file.name} · ${formatBytes(file.size)}`
            : "Browse .bin file"}
        </span>
      </label>
    </div>
  );
}
