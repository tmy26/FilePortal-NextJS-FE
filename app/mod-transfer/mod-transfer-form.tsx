"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FileDropZone } from "@/components/forms/file-drop-zone";
import { FormBanner } from "@/components/form-banner";
import { SummaryList } from "@/components/summary-list";
import { readErrorDetail } from "@/lib/http/api-error";
import {
  isTransferTerminal,
  type TransferJobRead,
} from "@/lib/types/transfer";

const POLL_MS = 1200;

/** BE placeholders — vehicle catalog is omitted (all unknown). */
const TRANSFER_FILE_KIND = "ecu";
const TRANSFER_GEARBOX = "automatic";

type FirmwareSlot = "original" | "tuned" | "target";

const FIRMWARE_SLOTS: Array<{
  key: FirmwareSlot;
  label: string;
  description: string;
}> = [
  {
    key: "original",
    label: "Original (untuned)",
    description: "Source firmware the existing tune was built from",
  },
  {
    key: "tuned",
    label: "Tuned",
    description: "Tuned version of the original file",
  },
  {
    key: "target",
    label: "Target (untuned)",
    description: "Firmware to transfer the tune onto",
  },
];

function statusLabel(status: TransferJobRead["status"]): string {
  switch (status) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "succeeded":
      return "Succeeded";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function ModTransferForm() {
  const router = useRouter();
  const originalInputRef = useRef<HTMLInputElement>(null);
  const tunedInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Record<FirmwareSlot, File | null>>({
    original: null,
    tuned: null,
    target: null,
  });
  const [pending, setPending] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<TransferJobRead | null>(null);

  useEffect(() => {
    if (!job || isTransferTerminal(job.status)) {
      setPolling(false);
      return;
    }

    const jobId = job.uuid;
    setPolling(true);
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(`/api/transfers/${jobId}`, {
          credentials: "same-origin",
        });
        if (!response.ok) {
          let payload: unknown = null;
          try {
            payload = await response.json();
          } catch {
            payload = null;
          }
          if (!cancelled) {
            setError(readErrorDetail(payload, response.status));
            setPolling(false);
          }
          return;
        }
        const next = (await response.json()) as TransferJobRead;
        if (cancelled) return;
        setJob(next);
        if (isTransferTerminal(next.status)) {
          setPolling(false);
          router.refresh();
        }
      } catch {
        if (!cancelled) {
          setError("Could not check transfer status. Try refreshing.");
          setPolling(false);
        }
      }
    }

    const timer = window.setInterval(() => {
      void poll();
    }, POLL_MS);
    void poll();

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [job?.uuid, job?.status, router]);

  function inputRefFor(slot: FirmwareSlot) {
    if (slot === "original") return originalInputRef;
    if (slot === "tuned") return tunedInputRef;
    return targetInputRef;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || polling) return;

    const { original, tuned, target } = files;

    if (!original || !tuned || !target) {
      setError("Upload original, tuned, and target .bin files.");
      return;
    }

    if (original.size !== tuned.size || original.size !== target.size) {
      setError(
        "All three firmware files must be the same size. Check you picked matching binaries.",
      );
      return;
    }

    const body = new FormData();
    body.append("original", original);
    body.append("tuned", tuned);
    body.append("target", target);
    body.append("file_kind", TRANSFER_FILE_KIND);
    body.append("gearbox", TRANSFER_GEARBOX);

    setPending(true);
    setError(null);
    setJob(null);

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        body,
        credentials: "same-origin",
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/sign-in";
          return;
        }

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
        setError(readErrorDetail(payload, response.status));
        return;
      }

      const created = (await response.json()) as TransferJobRead;
      setJob(created);
      router.refresh();
    } catch {
      setError("Could not start transfer. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (job && isTransferTerminal(job.status)) {
    const succeeded = job.status === "succeeded";
    return (
      <div className="shop-panel">
        <FormBanner tone={succeeded ? "success" : "info"}>
          {succeeded
            ? `Transfer complete. Patched ${job.target_filename}.`
            : job.error_detail || "The transfer could not be completed."}
        </FormBanner>

        <SummaryList
          className="transfer-result-summary"
          rows={[
            { label: "Status", value: statusLabel(job.status) },
            job.summary
              ? {
                  label: "Patches",
                  value: `${job.summary.logical_patches} logical · ${Math.round(job.summary.accounted_patch_coverage * 100)}% coverage`,
                }
              : { label: "Patches", value: "" },
          ]}
        />

        {job.warnings.length > 0 ? (
          <FormBanner>{job.warnings.join(" ")}</FormBanner>
        ) : null}

        <div className="shop-result-actions">
          {succeeded && job.download_available ? (
            <a href={`/api/transfers/${job.uuid}/download`} className="cta">
              Download patched file
            </a>
          ) : null}
          <button
            type="button"
            className="cta cta-secondary"
            onClick={() => {
              setJob(null);
              setFiles({ original: null, tuned: null, target: null });
              setError(null);
              if (originalInputRef.current) originalInputRef.current.value = "";
              if (tunedInputRef.current) tunedInputRef.current.value = "";
              if (targetInputRef.current) targetInputRef.current.value = "";
            }}
          >
            New transfer
          </button>
          <Link href="/" className="cta cta-secondary">
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (job && !isTransferTerminal(job.status)) {
    return (
      <div className="shop-panel">
        <FormBanner>
          Transfer {statusLabel(job.status).toLowerCase()}… This usually takes a
          few seconds.
        </FormBanner>
        <SummaryList
          rows={[
            { label: "Original", value: job.original_filename },
            { label: "Tuned", value: job.tuned_filename },
            { label: "Target", value: job.target_filename },
          ]}
        />
      </div>
    );
  }

  const filesReady = Boolean(files.original && files.tuned && files.target);
  const canSubmit = filesReady && !pending && !polling;

  return (
    <form onSubmit={handleSubmit} className="shop-panel">
      {error ? <FormBanner tone="error">{error}</FormBanner> : null}

      <fieldset className="upload-tuning">
        <legend className="shop-section-title">Firmware files</legend>
        <p className="shop-section-lead muted">
          Upload three matching .bin files. Original and tuned define the tune;
          target receives it. All three must be the same size.
        </p>

        <div className="transfer-file-grid">
          {FIRMWARE_SLOTS.map((slot) => (
            <FileDropZone
              key={slot.key}
              label={slot.label}
              description={slot.description}
              file={files[slot.key]}
              inputRef={inputRefFor(slot.key)}
              onFileChange={(file) => {
                setFiles((prev) => ({ ...prev, [slot.key]: file }));
                setError(null);
              }}
              onError={(message) => setError(message || null)}
            />
          ))}
        </div>
      </fieldset>

      <button type="submit" className="submit-btn" disabled={!canSubmit}>
        {pending ? "Starting transfer…" : "Start transfer"}
      </button>
    </form>
  );
}
