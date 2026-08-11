"use client";

import type { FileKind } from "@/lib/types/file";
import {
  shouldShowBrand,
  shouldShowEcu,
  shouldShowEngine,
  shouldShowGearbox,
  shouldShowGeneration,
  shouldShowModel,
  UNKNOWN_VEHICLE_VALUE,
  type Gearbox,
} from "@/lib/types/vehicle";
import { formatGearboxLabel } from "@/lib/vehicles/client";
import { ScrollSelect } from "@/components/forms/scroll-select";
import type { UseVehicleCascadeResult } from "@/components/forms/use-vehicle-cascade";

type VehicleCascadeFieldsProps = UseVehicleCascadeResult & {
  formId: string;
  /** Reserved for shouldShow* gating when file-kind-specific cascade rules are added. */
  fileKind: FileKind;
  onVehicleInteract?: () => void;
};

export function VehicleCascadeFields({
  formId,
  fileKind,
  vehicle,
  vehicleTypes,
  brands,
  models,
  generations,
  engines,
  ecus,
  gearboxes,
  loadingField,
  handleVehicleTypeChange,
  handleBrandChange,
  handleModelChange,
  handleGenerationChange,
  handleEngineChange,
  handleEcuChange,
  handleGearboxChange,
  onVehicleInteract,
}: VehicleCascadeFieldsProps) {
  // Reserved for future shouldShow* gating by file kind.
  void fileKind;

  function wrapChange<T>(handler: (value: T) => void | Promise<void>) {
    return (value: T) => {
      onVehicleInteract?.();
      return handler(value);
    };
  }

  return (
    <fieldset className="upload-vehicle">
      <legend className="shop-section-title">Vehicle details</legend>
      <p className="shop-section-lead muted">
        Select vehicle type and brand first. From model onward you can pick Unknown
        to skip the rest of the cascade. Gearbox is selected last.
      </p>

      <div className="field-grid">
        <ScrollSelect
          id={`${formId}-vehicle-type`}
          label="Vehicle type"
          className="field-span"
          value={vehicle.vehicleTypeId}
          disabled={loadingField !== null}
          onChange={(next) => {
            void wrapChange(handleVehicleTypeChange)(next);
          }}
          placeholder="Select vehicle type"
          options={vehicleTypes.map((item) => ({
            value: item.uuid,
            label: item.name,
          }))}
        />

        {shouldShowBrand(vehicle) ? (
          <ScrollSelect
            id={`${formId}-brand`}
            label="Brand"
            className="field-cascade-enter"
            value={vehicle.brandId}
            disabled={loadingField !== null}
            onChange={(next) => {
              void wrapChange(handleBrandChange)(next);
            }}
            placeholder={
              loadingField === "brands" ? "Loading brands…" : "Select brand"
            }
            options={brands.map((brand) => ({
              value: brand.uuid,
              label: brand.name,
            }))}
          />
        ) : null}

        {shouldShowModel(vehicle) ? (
          <ScrollSelect
            id={`${formId}-model`}
            label="Model"
            className="field-cascade-enter"
            value={vehicle.modelId}
            disabled={loadingField !== null}
            onChange={(next) => {
              void wrapChange(handleModelChange)(next);
            }}
            placeholder={
              loadingField === "models" ? "Loading models…" : "Select model"
            }
            options={[
              ...models.map((model) => ({
                value: model.uuid,
                label: model.name,
              })),
              { value: UNKNOWN_VEHICLE_VALUE, label: "Unknown" },
            ]}
          />
        ) : null}

        {shouldShowGeneration(vehicle) ? (
          <ScrollSelect
            id={`${formId}-generation`}
            label="Vehicle generation"
            className="field-cascade-enter"
            value={vehicle.generationId}
            disabled={loadingField !== null}
            onChange={(next) => {
              void wrapChange(handleGenerationChange)(next);
            }}
            placeholder={
              loadingField === "generations"
                ? "Loading generations…"
                : "Select generation"
            }
            options={[
              ...generations.map((item) => ({
                value: item.uuid,
                label: item.name,
              })),
              { value: UNKNOWN_VEHICLE_VALUE, label: "Unknown" },
            ]}
          />
        ) : null}

        {shouldShowEngine(vehicle) ? (
          <ScrollSelect
            id={`${formId}-engine`}
            label="Vehicle engine"
            className="field-cascade-enter"
            value={vehicle.engineId}
            disabled={loadingField !== null}
            onChange={(next) => {
              void wrapChange(handleEngineChange)(next);
            }}
            placeholder={
              loadingField === "engines"
                ? "Loading engines…"
                : "Select engine"
            }
            options={[
              ...engines.map((item) => ({
                value: item.uuid,
                label: item.name,
              })),
              { value: UNKNOWN_VEHICLE_VALUE, label: "Unknown" },
            ]}
          />
        ) : null}

        {shouldShowEcu(vehicle) ? (
          <ScrollSelect
            id={`${formId}-ecu`}
            label="Vehicle ECU"
            className="field-cascade-enter"
            value={vehicle.ecuId}
            disabled={loadingField !== null}
            onChange={(next) => {
              void wrapChange(handleEcuChange)(next);
            }}
            placeholder={
              loadingField === "ecus" ? "Loading ECUs…" : "Select ECU"
            }
            options={[
              ...ecus.map((item) => ({
                value: item.uuid,
                label: item.name,
              })),
              { value: UNKNOWN_VEHICLE_VALUE, label: "Unknown" },
            ]}
          />
        ) : null}

        {shouldShowGearbox(vehicle) ? (
          <ScrollSelect
            id={`${formId}-gearbox`}
            label="Gearbox"
            className="field-cascade-enter"
            value={vehicle.gearbox}
            disabled={loadingField !== null}
            searchable={false}
            onChange={(next) =>
              wrapChange(handleGearboxChange)(next as Gearbox | "")
            }
            placeholder={
              loadingField === "gearboxes"
                ? "Loading gearboxes…"
                : "Select gearbox"
            }
            options={gearboxes.map((item) => ({
              value: item,
              label: formatGearboxLabel(item),
            }))}
          />
        ) : null}
      </div>
    </fieldset>
  );
}
