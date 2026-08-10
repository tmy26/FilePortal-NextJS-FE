"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type SelectableCardProps = {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "children" | "className" | "disabled"
>;

/** Shared selectable tile chrome (shop packs, file kinds, etc.). */
export function SelectableCard({
  selected,
  onSelect,
  children,
  className = "",
  disabled = false,
  ...rest
}: SelectableCardProps) {
  return (
    <button
      type="button"
      className={[className, selected ? "is-selected" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      {...rest}
    >
      {children}
    </button>
  );
}
