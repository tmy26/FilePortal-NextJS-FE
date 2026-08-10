import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className">;

export function TextField({
  id,
  name,
  label,
  error,
  hint,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <div className={["field", className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} name={name} aria-invalid={Boolean(error)} {...inputProps} />
      {error ? <p className="field-error">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}
