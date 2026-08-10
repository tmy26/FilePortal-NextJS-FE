"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import type { FileKind } from "@/lib/types/file";
import { isVehicleSelectionComplete } from "@/lib/types/vehicle";
import type { VehicleTypeRead } from "@/lib/types/vehicle";
import {
  buildVehicleSummary,
  entityNameMap,
  readUploadDraft,
  saveUploadDraft,
} from "@/lib/upload/draft";
import { FormBanner } from "@/components/form-banner";
import { SelectableCard } from "@/components/forms/selectable-card";
import { useVehicleCascade } from "@/components/forms/use-vehicle-cascade";
import { VehicleCascadeFields } from "@/components/forms/vehicle-cascade-fields";

const FILE_OPTIONS = [
  {
    kind: "ecu" as const,
    label: "ECU",
    description: "Engine control unit binary",
  },
  {
    kind: "gearbox" as const,
    label: "Gearbox",
    description: "Transmission control binary",
  },
] as const;

type UploadFileFormProps = {
  currentPoints: number;
  initialVehicleTypes: VehicleTypeRead[];
  catalogLoadFailed?: boolean;
  /** Only true when opened via Edit selection (`?edit=1`). */
  restoreDraft?: boolean;
};

export function UploadFileForm({
  currentPoints,
  initialVehicleTypes,
  catalogLoadFailed = false,
  restoreDraft = false,
}: UploadFileFormProps) {
  const router = useRouter();
  const formId = useId();
  const [fileKind, setFileKind] = useState<FileKind>("ecu");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const cascade = useVehicleCascade({
    initialVehicleTypes,
    catalogLoadFailed,
    restoreDraft,
  });
  const {
    restoredFileKind,
    catalogError,
    vehicleReady,
    vehicle,
    vehicleTypes,
    brands,
    models,
    generations,
    engines,
    ecus,
    loadingField,
  } = cascade;

  useEffect(() => {
    if (restoredFileKind) {
      setFileKind(restoredFileKind);
    }
  }, [restoredFileKind]);

  // Match prior patchVehicle behavior: clear form errors when selection changes.
  useEffect(() => {
    setFormError(null);
  }, [vehicle]);

  const canUpload = currentPoints > 0;
  const canContinue = vehicleReady && !pending && loadingField === null;

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;

    if (!isVehicleSelectionComplete(vehicle)) {
      setFormError(
        "Complete the vehicle details (or choose Unknown where needed) and select a gearbox.",
      );
      return;
    }

    setPending(true);
    try {
      const summary = buildVehicleSummary(vehicle, {
        vehicleTypes: entityNameMap(vehicleTypes),
        brands: entityNameMap(brands),
        models: entityNameMap(models),
        generations: entityNameMap(generations),
        engines: entityNameMap(engines),
        ecus: entityNameMap(ecus),
      });

      saveUploadDraft({
        fileKind,
        vehicle,
        summary,
        tuningOptionIds: readUploadDraft()?.tuningOptionIds ?? [],
      });
      router.push("/upload/options");
    } catch {
      setFormError("Could not continue. Please try again.");
      setPending(false);
    }
  }

  if (!canUpload) {
    return (
      <div className="shop-panel">
        <FormBanner>
          You need TuningPoints to upload a file. Buy points in the shop to
          continue.
        </FormBanner>
        <div className="shop-result-actions">
          <Link href="/shop" className="cta">
            Buy TuningPoints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="shop-panel">
      {formError ? <FormBanner tone="error">{formError}</FormBanner> : null}

      {catalogError ? (
        <FormBanner tone="error">{catalogError}</FormBanner>
      ) : null}

      <fieldset className="shop-packs upload-kinds">
        <legend className="shop-section-title">File type</legend>
        <p className="shop-section-lead muted">
          Choose whether this is an ECU or gearbox file.
        </p>
        <div className="upload-kind-grid">
          {FILE_OPTIONS.map((option) => (
            <SelectableCard
              key={option.kind}
              className="upload-kind"
              selected={fileKind === option.kind}
              onSelect={() => setFileKind(option.kind)}
            >
              <span className="upload-kind-label">{option.label}</span>
              <span className="upload-kind-desc">{option.description}</span>
            </SelectableCard>
          ))}
        </div>
      </fieldset>

      <VehicleCascadeFields
        {...cascade}
        formId={formId}
        fileKind={fileKind}
      />

      <button type="submit" className="submit-btn" disabled={!canContinue}>
        {pending ? "Continuing…" : "Continue to tuning options"}
      </button>
    </form>
  );
}
