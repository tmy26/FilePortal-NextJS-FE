import type { ReactNode } from "react";

export type SummaryRow = {
  label: string;
  value: ReactNode;
};

type SummaryListProps = {
  rows: SummaryRow[];
  className?: string;
};

export function SummaryList({ rows, className }: SummaryListProps) {
  const visible = rows.filter(
    (row) => row.value !== null && row.value !== undefined && row.value !== "",
  );
  if (visible.length === 0) return null;

  return (
    <dl
      className={["upload-summary-list", className].filter(Boolean).join(" ")}
    >
      {visible.map((row) => (
        <div key={row.label} className="upload-summary-row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
