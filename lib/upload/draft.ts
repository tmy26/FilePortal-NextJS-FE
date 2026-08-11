import type { FileKind } from "@/lib/types/file";
import type { Gearbox, VehicleSelection } from "@/lib/types/vehicle";
import { isUnknownVehicleValue } from "@/lib/types/vehicle";
import { formatGearboxLabel } from "@/lib/vehicles/client";

type VehicleSummary = {
  vehicleType: string;
  brand: string | null;
  model: string | null;
  generation: string | null;
  engine: string | null;
  ecu: string | null;
  gearbox: string;
};

export type UploadDraft = {
  fileKind: FileKind;
  vehicle: VehicleSelection;
  summary: VehicleSummary;
  /** Preserved when editing vehicle selection and returning to options. */
  tuningOptionIds?: string[];
};

const DRAFT_KEY = "file-portal-upload-draft";

/** Link back to the vehicle selection step (draft is preserved). */
export const UPLOAD_EDIT_HREF = "/upload";

/** Cache so useSyncExternalStore getSnapshot returns a stable reference. */
let cachedRaw: string | null = null;
let cachedDraft: UploadDraft | null = null;
let cacheReady = false;

function writeCache(raw: string | null, draft: UploadDraft | null): void {
  cachedRaw = raw;
  cachedDraft = draft;
  cacheReady = true;
}

export function saveUploadDraft(draft: UploadDraft): void {
  const raw = JSON.stringify(draft);
  sessionStorage.setItem(DRAFT_KEY, raw);
  writeCache(raw, draft);
}

export function readUploadDraft(): UploadDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (cacheReady && raw === cachedRaw) {
      return cachedDraft;
    }
    if (!raw) {
      writeCache(null, null);
      return null;
    }
    const draft = JSON.parse(raw) as UploadDraft;
    writeCache(raw, draft);
    return draft;
  } catch {
    cacheReady = false;
    return null;
  }
}

export function clearUploadDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
  writeCache(null, null);
}

function labelFor(id: string, names: Map<string, string>): string {
  if (!id) return "—";
  if (isUnknownVehicleValue(id)) return "Unknown";
  return names.get(id) ?? id;
}

export function buildVehicleSummary(
  selection: VehicleSelection,
  names: {
    vehicleTypes: Map<string, string>;
    brands: Map<string, string>;
    models: Map<string, string>;
    generations: Map<string, string>;
    engines: Map<string, string>;
    ecus: Map<string, string>;
  },
): VehicleSummary {
  const vehicleType = labelFor(selection.vehicleTypeId, names.vehicleTypes);

  if (isUnknownVehicleValue(selection.vehicleTypeId)) {
    return {
      vehicleType,
      brand: null,
      model: null,
      generation: null,
      engine: null,
      ecu: null,
      gearbox: selection.gearbox
        ? formatGearboxLabel(selection.gearbox as Gearbox)
        : "—",
    };
  }

  const brand = selection.brandId
    ? labelFor(selection.brandId, names.brands)
    : null;

  if (
    !selection.brandId ||
    isUnknownVehicleValue(selection.brandId)
  ) {
    return {
      vehicleType,
      brand,
      model: null,
      generation: null,
      engine: null,
      ecu: null,
      gearbox: selection.gearbox
        ? formatGearboxLabel(selection.gearbox as Gearbox)
        : "—",
    };
  }

  const model = selection.modelId
    ? labelFor(selection.modelId, names.models)
    : null;

  if (!selection.modelId || isUnknownVehicleValue(selection.modelId)) {
    return {
      vehicleType,
      brand,
      model,
      generation: null,
      engine: null,
      ecu: null,
      gearbox: selection.gearbox
        ? formatGearboxLabel(selection.gearbox as Gearbox)
        : "—",
    };
  }

  const generation = selection.generationId
    ? labelFor(selection.generationId, names.generations)
    : null;

  if (
    !selection.generationId ||
    isUnknownVehicleValue(selection.generationId)
  ) {
    return {
      vehicleType,
      brand,
      model,
      generation,
      engine: null,
      ecu: null,
      gearbox: selection.gearbox
        ? formatGearboxLabel(selection.gearbox as Gearbox)
        : "—",
    };
  }

  const engine = selection.engineId
    ? labelFor(selection.engineId, names.engines)
    : null;

  if (!selection.engineId || isUnknownVehicleValue(selection.engineId)) {
    return {
      vehicleType,
      brand,
      model,
      generation,
      engine,
      ecu: null,
      gearbox: selection.gearbox
        ? formatGearboxLabel(selection.gearbox as Gearbox)
        : "—",
    };
  }

  return {
    vehicleType,
    brand,
    model,
    generation,
    engine,
    ecu: selection.ecuId
      ? labelFor(selection.ecuId, names.ecus)
      : null,
    gearbox: selection.gearbox
      ? formatGearboxLabel(selection.gearbox as Gearbox)
      : "—",
  };
}

export function entityNameMap(
  items: Array<{ uuid: string; name: string }>,
): Map<string, string> {
  return new Map(items.map((item) => [item.uuid, item.name]));
}
