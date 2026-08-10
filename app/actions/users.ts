"use server";

import {
  createUser,
  resendVerificationEmail,
  verifyEmail,
} from "@/lib/api";
import {
  validatePhoneNumber,
  type PhoneErrorKey,
} from "@/lib/phone";
import type {
  CreateUserFormValues,
  UserCreate,
  UserRead,
} from "@/lib/types/user";

export type CreateUserState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof UserCreate, string>>;
  termsError?: string;
  values?: CreateUserFormValues;
  /** Changes on every failed submit so the form can remount with preserved values. */
  formId?: string;
  user?: UserRead;
};

export type VerifyEmailState = {
  ok: boolean;
  error?: string;
  user?: UserRead;
};

export type ResendVerificationState = {
  ok: boolean;
  error?: string;
  detail?: string;
  fieldErrors?: { email?: string };
  email?: string;
};

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

const PHONE_ERROR_MESSAGES: Record<PhoneErrorKey, string> = {
  phoneRequired: "Please enter your telephone number.",
  phoneCountry: "Please select a valid country code.",
  phoneInvalid:
    "Please enter a valid telephone number for the selected country.",
  phoneTooLong:
    "Phone number is too long. International numbers can have at most 15 digits.",
};

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readFormValues(formData: FormData): CreateUserFormValues {
  return {
    username: readString(formData, "username"),
    email: readString(formData, "email"),
    password:
      typeof formData.get("password") === "string"
        ? (formData.get("password") as string)
        : "",
    retype_password:
      typeof formData.get("retype_password") === "string"
        ? (formData.get("retype_password") as string)
        : "",
    first_name: readString(formData, "first_name"),
    last_name: readString(formData, "last_name"),
    country: readString(formData, "country"),
    phone:
      typeof formData.get("phone") === "string"
        ? (formData.get("phone") as string)
        : "",
    phoneCountry: readString(formData, "phoneCountry"),
    acceptTerms: formData.get("accept_terms") === "on",
  };
}

function optionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toUserCreate(
  values: CreateUserFormValues,
  telephoneNumber: string | null,
): UserCreate {
  return {
    username: values.username,
    email: values.email,
    password: values.password,
    retype_password: values.retype_password,
    first_name: optionalText(values.first_name),
    last_name: optionalText(values.last_name),
    telephone_number: telephoneNumber,
    country: optionalText(values.country),
  };
}

function validate(
  data: UserCreate,
  phoneNational: string,
  phoneCountry: string,
): CreateUserState["fieldErrors"] {
  const errors: NonNullable<CreateUserState["fieldErrors"]> = {};

  if (data.username.length < 3 || data.username.length > 255) {
    errors.username = "Username must be 3–255 characters.";
  } else if (!USERNAME_PATTERN.test(data.username)) {
    errors.username =
      "Username may only contain letters, numbers, and underscores.";
  }

  if (data.email.length < 5 || !data.email.includes("@")) {
    errors.email = "Enter a valid email address.";
  }

  if (data.password.length < 6 || data.password.length > 24) {
    errors.password = "Password must be 6–24 characters.";
  }

  if (data.password !== data.retype_password) {
    errors.retype_password = "Passwords do not match.";
  }

  if (data.first_name && data.first_name.length < 2) {
    errors.first_name = "First name must be at least 2 characters.";
  }

  if (data.last_name && data.last_name.length > 255) {
    errors.last_name = "Last name must be at most 255 characters.";
  }

  if (phoneNational.trim()) {
    const phoneResult = validatePhoneNumber(phoneNational, phoneCountry);
    if (!phoneResult.ok) {
      errors.telephone_number = PHONE_ERROR_MESSAGES[phoneResult.errorKey];
    }
  }

  if (data.country && data.country.length > 64) {
    errors.country = "Country must be at most 64 characters.";
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const values = readFormValues(formData);
  const phoneNational = values.phone.trim();
  const phoneResult = phoneNational
    ? validatePhoneNumber(phoneNational, values.phoneCountry)
    : null;
  const telephoneNumber =
    phoneResult?.ok === true
      ? phoneResult.e164
      : phoneNational
        ? phoneNational
        : null;
  const data = toUserCreate(values, telephoneNumber);

  if (!values.acceptTerms) {
    return {
      ok: false,
      termsError: "Please accept the Terms of Service and Privacy Policy.",
      values,
      formId: crypto.randomUUID(),
      error: "Please fix the highlighted fields.",
    };
  }

  const fieldErrors = validate(data, values.phone, values.phoneCountry);
  if (fieldErrors) {
    return {
      ok: false,
      fieldErrors,
      values,
      formId: crypto.randomUUID(),
      error: "Please fix the highlighted fields.",
    };
  }

  try {
    const user = await createUser(data);
    return { ok: true, user };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create account.";
    return {
      ok: false,
      error: message,
      values,
      formId: crypto.randomUUID(),
    };
  }
}

export async function verifyEmailAction(
  token: string,
): Promise<VerifyEmailState> {
  const cleaned = token.trim();
  if (!cleaned) {
    return { ok: false, error: "Missing verification token." };
  }

  try {
    const user = await verifyEmail(cleaned);
    return { ok: true, user };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not verify this email link.";
    return { ok: false, error: message };
  }
}

export async function resendVerificationAction(
  _prev: ResendVerificationState,
  formData: FormData,
): Promise<ResendVerificationState> {
  const email = readString(formData, "email");

  if (!email || !email.includes("@")) {
    return {
      ok: false,
      email,
      fieldErrors: { email: "Enter a valid email address." },
      error: "Please fix the highlighted fields.",
    };
  }

  try {
    const result = await resendVerificationEmail(email);
    return { ok: true, detail: result.detail, email };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not resend the verification email.";
    return { ok: false, error: message, email };
  }
}
