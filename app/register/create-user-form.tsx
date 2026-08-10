"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createUserAction,
  type CreateUserState,
} from "@/app/actions/users";
import { FormBanner } from "@/components/form-banner";
import {
  DEFAULT_PHONE_COUNTRY,
  PhoneField,
} from "@/components/forms/phone-field";
import { TextField } from "@/components/forms/text-field";
import {
  digitsOnly,
  formatNationalPhoneInput,
  isSupportedPhoneCountry,
  type CountryCode,
} from "@/lib/phone";
import type { CreateUserFormValues } from "@/lib/types/user";
import { isCreateUserFormReady } from "@/lib/users/create-user-validation";

const initialState: CreateUserState = { ok: false };

const emptyValues: CreateUserFormValues = {
  username: "",
  email: "",
  password: "",
  retype_password: "",
  first_name: "",
  last_name: "",
  country: "",
  phone: "",
  phoneCountry: DEFAULT_PHONE_COUNTRY,
  acceptTerms: false,
};

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(
    createUserAction,
    initialState,
  );

  if (state.ok && state.user) {
    const resendHref = `/resend-verification?email=${encodeURIComponent(state.user.email)}`;
    return (
      <div className="success-panel" role="status">
        <h2>Account created</h2>
        <p>
          Welcome, <strong>{state.user.username}</strong>. Check{" "}
          <strong>{state.user.email}</strong> to verify your account before
          signing in.
        </p>
        {!state.user.is_active ? (
          <p className="muted">
            Didn&apos;t get the email?{" "}
            <Link href={resendHref} className="text-link">
              Resend verification email
            </Link>
            .
          </p>
        ) : null}
        <p className="muted">
          Already verified?{" "}
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  const values = state.values ?? emptyValues;
  const formKey = state.formId ?? "new";

  return (
    <CreateUserFormFields
      key={formKey}
      action={formAction}
      pending={pending}
      state={state}
      initialValues={values}
    />
  );
}

function CreateUserFormFields({
  action,
  pending,
  state,
  initialValues,
}: {
  action: (payload: FormData) => void;
  pending: boolean;
  state: CreateUserState;
  initialValues: CreateUserFormValues;
}) {
  const initialCountry = isSupportedPhoneCountry(initialValues.phoneCountry)
    ? initialValues.phoneCountry
    : DEFAULT_PHONE_COUNTRY;

  const [values, setValues] = useState<CreateUserFormValues>({
    ...initialValues,
    phoneCountry: initialCountry,
  });
  const [phoneCountry, setPhoneCountry] =
    useState<CountryCode>(initialCountry);
  const [phoneNational, setPhoneNational] = useState(() =>
    initialValues.phone
      ? formatNationalPhoneInput(initialValues.phone, initialCountry)
      : "",
  );
  const [termsError, setTermsError] = useState<string | null>(
    state.termsError ?? null,
  );

  const canSubmit = isCreateUserFormReady({
    ...values,
    phone: digitsOnly(phoneNational),
    phoneCountry,
  });

  function updateField<K extends keyof CreateUserFormValues>(
    key: K,
    value: CreateUserFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form action={action} className="create-user-form" noValidate>
      {state.error ? (
        <FormBanner tone="error">{state.error}</FormBanner>
      ) : null}

      <div className="field-grid">
        <Field
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={255}
          value={values.username}
          onChange={(value) => updateField("username", value)}
          error={state.fieldErrors?.username}
          hint="Letters, numbers, and underscores only"
        />
        <Field
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          minLength={5}
          maxLength={320}
          value={values.email}
          onChange={(value) => updateField("email", value)}
          error={state.fieldErrors?.email}
        />
        <Field
          id="first_name"
          label="First name"
          name="first_name"
          autoComplete="given-name"
          minLength={2}
          maxLength={255}
          value={values.first_name}
          onChange={(value) => updateField("first_name", value)}
          error={state.fieldErrors?.first_name}
          hint="Optional"
        />
        <Field
          id="last_name"
          label="Last name"
          name="last_name"
          autoComplete="family-name"
          maxLength={255}
          value={values.last_name}
          onChange={(value) => updateField("last_name", value)}
          error={state.fieldErrors?.last_name}
          hint="Optional"
        />
        <Field
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          maxLength={24}
          value={values.password}
          onChange={(value) => updateField("password", value)}
          error={state.fieldErrors?.password}
        />
        <Field
          id="retype_password"
          label="Confirm password"
          name="retype_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          maxLength={24}
          value={values.retype_password}
          onChange={(value) => updateField("retype_password", value)}
          error={state.fieldErrors?.retype_password}
        />
        <PhoneField
          nationalNumber={phoneNational}
          countryCode={phoneCountry}
          onNationalNumberChange={setPhoneNational}
          onCountryCodeChange={setPhoneCountry}
          required={false}
          error={state.fieldErrors?.telephone_number}
          disabled={pending}
        />
        <Field
          id="country"
          label="Country"
          name="country"
          autoComplete="country-name"
          maxLength={64}
          value={values.country}
          onChange={(value) => updateField("country", value)}
          error={state.fieldErrors?.country}
          hint="Optional"
        />
      </div>

      <div className="shop-terms">
        <label className="shop-terms-label" htmlFor="accept-terms">
          <input
            id="accept-terms"
            name="accept_terms"
            type="checkbox"
            checked={values.acceptTerms}
            required
            onChange={(event) => {
              updateField("acceptTerms", event.target.checked);
              if (termsError) setTermsError(null);
            }}
          />
          <span>
            I accept the{" "}
            <Link href="/terms" className="shop-terms-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="shop-terms-link">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {termsError ? (
          <p className="field-error" role="alert">
            {termsError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={pending || !canSubmit}
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
};

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required,
  minLength,
  maxLength,
  value,
  onChange,
  error,
  hint,
}: FieldProps) {
  return (
    <TextField
      id={id}
      label={required ? `${label} *` : label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={error}
      hint={hint}
    />
  );
}
