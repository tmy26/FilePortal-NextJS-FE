"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { FileDropZone } from "@/components/forms/file-drop-zone";
import { FormBanner } from "@/components/form-banner";
import { SummaryList } from "@/components/summary-list";
import { readErrorDetail } from "@/lib/http/api-error";
import {
  totalTuningPoints,
  type TuningOptionRead,
} from "@/lib/types/tuning";
import { appendVehicleFieldsToFormData } from "@/lib/types/vehicle";
import {
  clearUploadDraft,
  readUploadDraft,
  saveUploadDraft,
  UPLOAD_EDIT_HREF,
  type UploadDraft,
} from "@/lib/upload/draft";

type TuningOptionsFormProps = {
  currentPoints: number;
  initialOptions: TuningOptionRead[];
  optionsLoadFailed?: boolean;
};

function subscribeNoop() {
  return () => {};
}

/** false during SSR / hydration; true after client mount. */
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function TuningOptionsForm({
  currentPoints,
  initialOptions,
  optionsLoadFailed = false,
}: TuningOptionsFormProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<UploadDraft | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [selectedOverride, setSelectedOverride] = useState<string[] | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    optionsLoadFailed ? "Could not load tuning options." : null,
  );

  // Load draft after client mount (sessionStorage). Microtask avoids the
  // react-hooks/set-state-in-effect lint for cascading renders.
  useEffect(() => {
    if (!isClient) return;
    const next = readUploadDraft();
    if (!next) {
      router.replace("/upload");
      queueMicrotask(() => setDraftReady(true));
      return;
    }
    queueMicrotask(() => {
      setDraft(next);
      setDraftReady(true);
    });
  }, [isClient, router]);

  const selectedOptions =
    selectedOverride ??
    (draft?.tuningOptionIds?.filter((id) =>
      initialOptions.some((option) => option.uuid === id),
    ) ??
      []);

  function persistTuningOptions(optionIds: string[]) {
    const current = readUploadDraft();
    if (!current) return;
    saveUploadDraft({
      ...current,
      tuningOptionIds: optionIds,
    });
  }

  function toggleOption(optionId: string) {
    const next = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOverride(next);
    persistTuningOptions(next);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !selectedFile || pending) return;

    const pointsNeeded = totalTuningPoints(initialOptions, selectedOptions);

    if (selectedOptions.length === 0) {
      setError("Select at least one tuning option.");
      return;
    }

    if (pointsNeeded > currentPoints) {
      setError(
        `This selection needs ${pointsNeeded} TuningPoints. Buy more in the shop or choose fewer options.`,
      );
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".bin")) {
      setError("Only .bin files are allowed.");
      return;
    }

    const body = new FormData();
    body.append("file", selectedFile);
    body.append("file_kind", draft.fileKind);
    appendVehicleFieldsToFormData(body, draft.vehicle);
    body.append("tuning_option_ids", JSON.stringify(selectedOptions));

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/files/upload", {
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

      clearUploadDraft();
      window.location.href = "/";
      return;
    } catch {
      setError("Could not upload file. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (!isClient || !draftReady) {
    return (
      <div className="shop-panel">
        <p className="muted">Loading your vehicle selection…</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="shop-panel">
        <p className="muted">No vehicle selection found. Redirecting…</p>
      </div>
    );
  }

  const pointsNeeded = totalTuningPoints(initialOptions, selectedOptions);
  const insufficientPoints =
    selectedOptions.length > 0 && pointsNeeded > currentPoints;

  const canSubmit =
    Boolean(selectedFile) &&
    selectedOptions.length > 0 &&
    !pending &&
    initialOptions.length > 0;

  const summaryRows = [
    { label: "File type", value: draft.fileKind.toUpperCase() },
    { label: "Vehicle type", value: draft.summary.vehicleType },
    { label: "Brand", value: draft.summary.brand },
    { label: "Model", value: draft.summary.model },
    { label: "Generation", value: draft.summary.generation },
    { label: "Engine", value: draft.summary.engine },
    { label: "ECU", value: draft.summary.ecu },
    { label: "Gearbox", value: draft.summary.gearbox },
  ];

  return (
    <form onSubmit={handleSubmit} className="shop-panel">
      {error ? <FormBanner tone="error">{error}</FormBanner> : null}

      <section className="upload-summary">
        <div className="upload-summary-header">
          <h2 className="shop-section-title">Vehicle details</h2>
          <Link href={UPLOAD_EDIT_HREF} className="text-link">
            Edit selection
          </Link>
        </div>
        <SummaryList rows={summaryRows} />
      </section>

      <fieldset className="upload-tuning">
        <legend className="shop-section-title">Tuning options</legend>
        <p className="shop-section-lead muted">
          Choose one or more options for this upload.
        </p>
        {initialOptions.length === 0 && !optionsLoadFailed ? (
          <p className="muted">No tuning options are available yet.</p>
        ) : (
          <div className="upload-tuning-grid">
            {initialOptions.map((option) => {
              const checked = selectedOptions.includes(option.uuid);
              return (
                <label
                  key={option.uuid}
                  className={[
                    "upload-tuning-option",
                    checked ? "is-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(option.uuid)}
                  />
                  <span className="upload-tuning-option-body">
                    <span className="upload-tuning-option-title">
                      {option.name}
                    </span>
                    <span className="upload-tuning-option-points">
                      {option.tuning_points_cost} TuningPoint
                      {option.tuning_points_cost === 1 ? "" : "s"}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
        {selectedOptions.length > 0 ? (
          <p className="upload-tuning-total muted">
            Selected total: {pointsNeeded} TuningPoint
            {pointsNeeded === 1 ? "" : "s"}
            {insufficientPoints
              ? ` · You have ${currentPoints} — buy more in the shop before uploading`
              : null}
          </p>
        ) : null}
      </fieldset>

      {insufficientPoints ? (
        <FormBanner>
          This selection needs {pointsNeeded} TuningPoint
          {pointsNeeded === 1 ? "" : "s"}. You can finish your choices now and
          buy points in the{" "}
          <Link href="/shop" className="text-link">
            shop
          </Link>{" "}
          before uploading.
        </FormBanner>
      ) : null}

      <FileDropZone
        label={selectedFile ? "Change file" : "Browse files"}
        description={
          selectedFile ? undefined : "Choose a .bin file from your device"
        }
        file={selectedFile}
        inputRef={fileInputRef}
        onFileChange={setSelectedFile}
        onError={(message) => setError(message || null)}
      />

      <button type="submit" className="submit-btn" disabled={!canSubmit}>
        {pending
          ? "Uploading…"
          : `Upload ${draft.fileKind === "ecu" ? "ECU" : "Gearbox"} file`}
      </button>
    </form>
  );
}
