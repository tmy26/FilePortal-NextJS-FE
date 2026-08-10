type NamedEntityRead = {
  uuid: string;
  name: string;
};

export type BrandRead = NamedEntityRead;
export type VehicleTypeRead = NamedEntityRead;
export type VehicleModelRead = NamedEntityRead;
export type VehicleGenerationRead = NamedEntityRead;
export type VehicleEngineRead = NamedEntityRead;
export type VehicleEcuRead = NamedEntityRead;

export type Gearbox = "manual" | "automatic";

/** Virtual dropdown value — not a BE UUID. */
export const UNKNOWN_VEHICLE_VALUE = "unknown";

export type VehicleSelection = {
  vehicleTypeId: string;
  brandId: string;
  modelId: string;
  generationId: string;
  engineId: string;
  ecuId: string;
  gearbox: Gearbox | "";
};

export const EMPTY_VEHICLE_SELECTION: VehicleSelection = {
  vehicleTypeId: "",
  brandId: "",
  modelId: "",
  generationId: "",
  engineId: "",
  ecuId: "",
  gearbox: "",
};

export function isUnknownVehicleValue(value: string): boolean {
  return value === UNKNOWN_VEHICLE_VALUE;
}

export function shouldShowBrand(selection: VehicleSelection): boolean {
  return (
    Boolean(selection.vehicleTypeId) &&
    !isUnknownVehicleValue(selection.vehicleTypeId)
  );
}

export function shouldShowModel(selection: VehicleSelection): boolean {
  return (
    shouldShowBrand(selection) &&
    Boolean(selection.brandId) &&
    !isUnknownVehicleValue(selection.brandId)
  );
}

export function shouldShowGeneration(selection: VehicleSelection): boolean {
  return (
    shouldShowModel(selection) &&
    Boolean(selection.modelId) &&
    !isUnknownVehicleValue(selection.modelId)
  );
}

export function shouldShowEngine(selection: VehicleSelection): boolean {
  return (
    shouldShowGeneration(selection) &&
    Boolean(selection.generationId) &&
    !isUnknownVehicleValue(selection.generationId)
  );
}

export function shouldShowEcu(selection: VehicleSelection): boolean {
  return (
    shouldShowEngine(selection) &&
    Boolean(selection.engineId) &&
    !isUnknownVehicleValue(selection.engineId)
  );
}

/** True when the vehicle cascade is finished (Unknown cut-off or ECU chosen). */
export function isVehicleCascadeReady(selection: VehicleSelection): boolean {
  if (!selection.vehicleTypeId) {
    return false;
  }

  if (isUnknownVehicleValue(selection.vehicleTypeId)) {
    return true;
  }

  if (!selection.brandId) {
    return false;
  }
  if (isUnknownVehicleValue(selection.brandId)) {
    return true;
  }

  if (!selection.modelId) {
    return false;
  }
  if (isUnknownVehicleValue(selection.modelId)) {
    return true;
  }

  if (!selection.generationId) {
    return false;
  }
  if (isUnknownVehicleValue(selection.generationId)) {
    return true;
  }

  if (!selection.engineId) {
    return false;
  }
  if (isUnknownVehicleValue(selection.engineId)) {
    return true;
  }

  return Boolean(selection.ecuId);
}

export function shouldShowGearbox(selection: VehicleSelection): boolean {
  return isVehicleCascadeReady(selection);
}

export function isVehicleSelectionComplete(
  selection: VehicleSelection,
): boolean {
  return isVehicleCascadeReady(selection) && Boolean(selection.gearbox);
}

export function appendVehicleFieldsToFormData(
  body: FormData,
  selection: VehicleSelection,
): void {
  if (isUnknownVehicleValue(selection.vehicleTypeId)) {
    body.append("vehicle_type_unknown", "true");
  } else {
    body.append("vehicle_type_id", selection.vehicleTypeId);
  }

  if (shouldShowBrand(selection)) {
    if (isUnknownVehicleValue(selection.brandId)) {
      body.append("brand_unknown", "true");
    } else if (selection.brandId) {
      body.append("brand_id", selection.brandId);
    }
  }

  if (shouldShowModel(selection)) {
    if (isUnknownVehicleValue(selection.modelId)) {
      body.append("model_unknown", "true");
    } else if (selection.modelId) {
      body.append("model_id", selection.modelId);
    }
  }

  if (shouldShowGeneration(selection)) {
    if (isUnknownVehicleValue(selection.generationId)) {
      body.append("generation_unknown", "true");
    } else if (selection.generationId) {
      body.append("generation_id", selection.generationId);
    }
  }

  if (shouldShowEngine(selection)) {
    if (isUnknownVehicleValue(selection.engineId)) {
      body.append("engine_unknown", "true");
    } else if (selection.engineId) {
      body.append("engine_id", selection.engineId);
    }
  }

  if (shouldShowEcu(selection)) {
    if (isUnknownVehicleValue(selection.ecuId)) {
      body.append("ecu_unknown", "true");
    } else if (selection.ecuId) {
      body.append("ecu_id", selection.ecuId);
    }
  }

  body.append("gearbox", selection.gearbox);
}
