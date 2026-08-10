"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { FileKind } from "@/lib/types/file";
import {
  EMPTY_VEHICLE_SELECTION,
  isUnknownVehicleValue,
  isVehicleCascadeReady,
  isVehicleSelectionComplete,
  type BrandRead,
  type Gearbox,
  type VehicleEcuRead,
  type VehicleEngineRead,
  type VehicleGenerationRead,
  type VehicleModelRead,
  type VehicleSelection,
  type VehicleTypeRead,
} from "@/lib/types/vehicle";
import { clearUploadDraft, readUploadDraft, type UploadDraft } from "@/lib/upload/draft";
import {
  listBrands,
  listEcusByEngine,
  listEnginesByGeneration,
  listGearboxes,
  listGenerationsByModel,
  listModelsByBrand,
} from "@/lib/vehicles/client";

export type LoadingField =
  | "brands"
  | "models"
  | "generations"
  | "engines"
  | "ecus"
  | "gearboxes"
  | null;

type UseVehicleCascadeOptions = {
  initialVehicleTypes: VehicleTypeRead[];
  catalogLoadFailed?: boolean;
  restoreDraft?: boolean;
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function subscribeNoop() {
  return () => {};
}

function readRestoreDraft(restoreDraft: boolean): UploadDraft | null {
  if (!restoreDraft) return null;
  return readUploadDraft();
}

function getServerDraftSnapshot(): UploadDraft | null {
  return null;
}

export type UseVehicleCascadeResult = {
  vehicle: VehicleSelection;
  vehicleTypes: VehicleTypeRead[];
  brands: BrandRead[];
  models: VehicleModelRead[];
  generations: VehicleGenerationRead[];
  engines: VehicleEngineRead[];
  ecus: VehicleEcuRead[];
  gearboxes: Gearbox[];
  loadingField: LoadingField;
  catalogError: string | null;
  /** Restored from upload draft when `restoreDraft` is true; otherwise null. */
  restoredFileKind: FileKind | null;
  vehicleReady: boolean;
  handleVehicleTypeChange: (vehicleTypeId: string) => Promise<void>;
  handleBrandChange: (brandId: string) => Promise<void>;
  handleModelChange: (modelId: string) => Promise<void>;
  handleGenerationChange: (generationId: string) => Promise<void>;
  handleEngineChange: (engineId: string) => Promise<void>;
  handleEcuChange: (ecuId: string) => Promise<void>;
  handleGearboxChange: (gearbox: Gearbox | "") => void;
};

export function useVehicleCascade({
  initialVehicleTypes,
  catalogLoadFailed = false,
  restoreDraft = false,
}: UseVehicleCascadeOptions): UseVehicleCascadeResult {
  const draft = useSyncExternalStore(
    subscribeNoop,
    () => readRestoreDraft(restoreDraft),
    getServerDraftSnapshot,
  );
  const draftSeed =
    draft?.vehicle != null
      ? `${draft.fileKind}:${JSON.stringify(draft.vehicle)}`
      : null;

  const [vehicle, setVehicle] = useState<VehicleSelection>(
    EMPTY_VEHICLE_SELECTION,
  );
  const [brands, setBrands] = useState<BrandRead[]>([]);
  const [models, setModels] = useState<VehicleModelRead[]>([]);
  const [generations, setGenerations] = useState<VehicleGenerationRead[]>([]);
  const [engines, setEngines] = useState<VehicleEngineRead[]>([]);
  const [ecus, setEcus] = useState<VehicleEcuRead[]>([]);
  const [vehicleTypes] = useState(initialVehicleTypes);
  const [gearboxes, setGearboxes] = useState<Gearbox[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(
    catalogLoadFailed ? "Could not load vehicle catalog." : null,
  );
  const [loadingField, setLoadingField] = useState<LoadingField>(null);
  const [restoredFileKind, setRestoredFileKind] = useState<FileKind | null>(
    null,
  );
  const [seededDraft, setSeededDraft] = useState<string | null>(null);

  // Seed restored draft during render (React-recommended store sync).
  if (restoreDraft && draftSeed && draft?.vehicle && seededDraft !== draftSeed) {
    setSeededDraft(draftSeed);
    setVehicle(draft.vehicle);
    if (draft.fileKind === "ecu" || draft.fileKind === "gearbox") {
      setRestoredFileKind(draft.fileKind);
    }
  }

  const vehicleReady = isVehicleSelectionComplete(vehicle);

  useEffect(() => {
    if (!restoreDraft) {
      clearUploadDraft();
      return;
    }

    if (!draft?.vehicle) return;

    const selection = draft.vehicle;
    let cancelled = false;

    async function hydrate(nextSelection: VehicleSelection) {
      setLoadingField("brands");
      try {
        const vehicleTypeId = nextSelection.vehicleTypeId;
        if (!vehicleTypeId) return;

        if (isUnknownVehicleValue(vehicleTypeId)) {
          if (isVehicleCascadeReady(nextSelection)) {
            const nextGearboxes = await listGearboxes();
            if (!cancelled) setGearboxes(nextGearboxes);
          }
          return;
        }

        const nextBrands = await listBrands(vehicleTypeId);
        if (cancelled) return;
        setBrands(nextBrands);

        if (
          !nextSelection.brandId ||
          isUnknownVehicleValue(nextSelection.brandId)
        ) {
          if (isVehicleCascadeReady(nextSelection)) {
            const nextGearboxes = await listGearboxes();
            if (!cancelled) setGearboxes(nextGearboxes);
          }
          return;
        }

        const nextModels = await listModelsByBrand(
          nextSelection.brandId,
          vehicleTypeId,
        );
        if (cancelled) return;
        setModels(nextModels);

        if (
          !nextSelection.modelId ||
          isUnknownVehicleValue(nextSelection.modelId)
        ) {
          if (isVehicleCascadeReady(nextSelection)) {
            const nextGearboxes = await listGearboxes();
            if (!cancelled) setGearboxes(nextGearboxes);
          }
          return;
        }

        const nextGenerations = await listGenerationsByModel(
          nextSelection.modelId,
        );
        if (cancelled) return;
        setGenerations(nextGenerations);

        if (
          !nextSelection.generationId ||
          isUnknownVehicleValue(nextSelection.generationId)
        ) {
          if (isVehicleCascadeReady(nextSelection)) {
            const nextGearboxes = await listGearboxes();
            if (!cancelled) setGearboxes(nextGearboxes);
          }
          return;
        }

        const nextEngines = await listEnginesByGeneration(
          nextSelection.generationId,
        );
        if (cancelled) return;
        setEngines(nextEngines);

        if (
          !nextSelection.engineId ||
          isUnknownVehicleValue(nextSelection.engineId)
        ) {
          if (isVehicleCascadeReady(nextSelection)) {
            const nextGearboxes = await listGearboxes();
            if (!cancelled) setGearboxes(nextGearboxes);
          }
          return;
        }

        const nextEcus = await listEcusByEngine(nextSelection.engineId);
        if (cancelled) return;
        setEcus(nextEcus);

        if (isVehicleCascadeReady(nextSelection)) {
          const nextGearboxes = await listGearboxes();
          if (!cancelled) setGearboxes(nextGearboxes);
        }
      } catch (error) {
        if (!cancelled) {
          setCatalogError(
            errorMessage(error, "Could not restore vehicle selection."),
          );
        }
      } finally {
        if (!cancelled) setLoadingField(null);
      }
    }

    void hydrate(selection);

    return () => {
      cancelled = true;
    };
  }, [restoreDraft, draftSeed, draft?.vehicle]);

  function clearDownstreamLists(
    level: "brand" | "model" | "generation" | "engine" | "ecu",
  ) {
    if (level === "brand") {
      setBrands([]);
      setModels([]);
      setGenerations([]);
      setEngines([]);
      setEcus([]);
      return;
    }
    if (level === "model") {
      setModels([]);
      setGenerations([]);
      setEngines([]);
      setEcus([]);
      return;
    }
    if (level === "generation") {
      setGenerations([]);
      setEngines([]);
      setEcus([]);
      return;
    }
    if (level === "engine") {
      setEngines([]);
      setEcus([]);
      return;
    }
    setEcus([]);
  }

  function patchVehicle(patch: Partial<VehicleSelection>) {
    setVehicle((prev) => ({ ...prev, ...patch }));
    setCatalogError(null);
  }

  async function maybeLoadGearboxes(nextSelection: VehicleSelection) {
    if (!isVehicleCascadeReady(nextSelection)) {
      setGearboxes([]);
      return;
    }

    setLoadingField("gearboxes");
    try {
      const next = await listGearboxes();
      setGearboxes(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load gearboxes."));
      setGearboxes([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleVehicleTypeChange(vehicleTypeId: string) {
    const nextSelection: VehicleSelection = {
      ...vehicle,
      vehicleTypeId,
      brandId: "",
      modelId: "",
      generationId: "",
      engineId: "",
      ecuId: "",
      gearbox: "",
    };
    patchVehicle(nextSelection);
    clearDownstreamLists("brand");

    if (!vehicleTypeId) {
      setGearboxes([]);
      return;
    }

    if (isUnknownVehicleValue(vehicleTypeId)) {
      await maybeLoadGearboxes(nextSelection);
      return;
    }

    setGearboxes([]);
    setLoadingField("brands");
    try {
      const next = await listBrands(vehicleTypeId);
      setBrands(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load brands."));
      setBrands([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleBrandChange(brandId: string) {
    const vehicleTypeId = vehicle.vehicleTypeId;
    const nextSelection: VehicleSelection = {
      ...vehicle,
      brandId,
      modelId: "",
      generationId: "",
      engineId: "",
      ecuId: "",
      gearbox: "",
    };
    patchVehicle(nextSelection);
    clearDownstreamLists("model");

    if (!brandId) {
      setGearboxes([]);
      return;
    }

    if (isUnknownVehicleValue(brandId)) {
      await maybeLoadGearboxes(nextSelection);
      return;
    }

    if (!vehicleTypeId) return;

    setGearboxes([]);
    setLoadingField("models");
    try {
      const next = await listModelsByBrand(brandId, vehicleTypeId);
      setModels(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load models."));
      setModels([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleModelChange(modelId: string) {
    const nextSelection: VehicleSelection = {
      ...vehicle,
      modelId,
      generationId: "",
      engineId: "",
      ecuId: "",
      gearbox: "",
    };
    patchVehicle(nextSelection);
    clearDownstreamLists("generation");

    if (!modelId) {
      setGearboxes([]);
      return;
    }

    if (isUnknownVehicleValue(modelId)) {
      await maybeLoadGearboxes(nextSelection);
      return;
    }

    setGearboxes([]);
    setLoadingField("generations");
    try {
      const next = await listGenerationsByModel(modelId);
      setGenerations(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load generations."));
      setGenerations([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleGenerationChange(generationId: string) {
    const nextSelection: VehicleSelection = {
      ...vehicle,
      generationId,
      engineId: "",
      ecuId: "",
      gearbox: "",
    };
    patchVehicle(nextSelection);
    clearDownstreamLists("engine");

    if (!generationId) {
      setGearboxes([]);
      return;
    }

    if (isUnknownVehicleValue(generationId)) {
      await maybeLoadGearboxes(nextSelection);
      return;
    }

    setGearboxes([]);
    setLoadingField("engines");
    try {
      const next = await listEnginesByGeneration(generationId);
      setEngines(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load engines."));
      setEngines([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleEngineChange(engineId: string) {
    const nextSelection: VehicleSelection = {
      ...vehicle,
      engineId,
      ecuId: "",
      gearbox: "",
    };
    patchVehicle(nextSelection);
    clearDownstreamLists("ecu");

    if (!engineId) {
      setGearboxes([]);
      return;
    }

    if (isUnknownVehicleValue(engineId)) {
      await maybeLoadGearboxes(nextSelection);
      return;
    }

    setGearboxes([]);
    setLoadingField("ecus");
    try {
      const next = await listEcusByEngine(engineId);
      setEcus(next);
    } catch (error) {
      setCatalogError(errorMessage(error, "Could not load ECUs."));
      setEcus([]);
    } finally {
      setLoadingField(null);
    }
  }

  async function handleEcuChange(ecuId: string) {
    const nextSelection: VehicleSelection = {
      ...vehicle,
      ecuId,
      gearbox: "",
    };
    patchVehicle(nextSelection);

    if (!ecuId) {
      setGearboxes([]);
      return;
    }

    await maybeLoadGearboxes(nextSelection);
  }

  function handleGearboxChange(gearbox: Gearbox | "") {
    patchVehicle({ gearbox });
  }

  return {
    vehicle,
    vehicleTypes,
    brands,
    models,
    generations,
    engines,
    ecus,
    gearboxes,
    loadingField,
    catalogError,
    restoredFileKind,
    vehicleReady,
    handleVehicleTypeChange,
    handleBrandChange,
    handleModelChange,
    handleGenerationChange,
    handleEngineChange,
    handleEcuChange,
    handleGearboxChange,
  };
}
