"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
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
  initialVehicleTypes: VehicleTypeRead[];
  catalogLoadFailed?: boolean;
};

export function UploadFileForm({
  initialVehicleTypes,
  catalogLoadFailed = false,
}: UploadFileFormProps) {
  const router = useRouter();
  const formId = useId();
  const [fileKindOverride, setFileKindOverride] = useState<FileKind | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const cascade = useVehicleCascade({
    initialVehicleTypes,
    catalogLoadFailed,
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
    hasDraft,
    clearSelection,
  } = cascade;

  const fileKind = fileKindOverride ?? restoredFileKind ?? "ecu";

  const canContinue = vehicleReady && !pending && loadingField === null;

  function clearErrorAndSelectKind(kind: FileKind) {
    setFileKindOverride(kind);
    setFormError(null);
  }

  function handleClearSelection() {
    clearSelection();
    setFileKindOverride(null);
    setFormError(null);
    setPending(false);
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue) return;

    if (!isVehicleSelectionComplete(vehicle)) {
      setFormError(
        "Complete the vehicle details (select vehicle type and brand, or choose Unknown from model onward where needed) and select a gearbox.",
      );
      return;
    }

    setPending(true);
    setFormError(null);
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

  return (
    <form onSubmit={handleContinue} className="shop-panel">
      {formError ? <FormBanner tone="error">{formError}</FormBanner> : null}

      {catalogError ? (
        <FormBanner tone="error">{catalogError}</FormBanner>
      ) : null}

      {hasDraft ? (
        <div className="upload-draft-actions">
          <button
            type="button"
            className="text-link upload-clear-selection"
            onClick={handleClearSelection}
          >
            Clear your selection
          </button>
        </div>
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
              onSelect={() => clearErrorAndSelectKind(option.kind)}
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
        onVehicleInteract={() => setFormError(null)}
      />

      <button type="submit" className="submit-btn" disabled={!canContinue}>
        {pending ? "Continuing…" : "Continue to tuning options"}
      </button>
    </form>
  );
}
