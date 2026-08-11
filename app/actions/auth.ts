"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, loginUser, logoutUser } from "@/lib/api";
import {
  clearAuthTokens,
  getAccessToken,
  setAuthTokens,
} from "@/lib/auth/session";

export type LoginState = {
  ok: boolean;
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validate(email: string, password: string): LoginState["fieldErrors"] {
  const fieldErrors: NonNullable<LoginState["fieldErrors"]> = {};

  if (!email || !email.includes("@")) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = readString(formData, "email");
  const password =
    typeof formData.get("password") === "string"
      ? (formData.get("password") as string)
      : "";

  const fieldErrors = validate(email, password);
  if (fieldErrors) {
    return {
      ok: false,
      fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  try {
    const result = await loginUser({ email, password });
    await setAuthTokens(result.token);

    // Confirm the access token works against BE get-user.
    await getCurrentUser(result.token.access);
  } catch (error) {
    await clearAuthTokens();
    const message =
      error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("verify your email")) {
      return {
        ok: false,
        error: message,
      };
    }
    return {
      ok: false,
      error:
        "Oops, something went wrong. Please check your email and password and try again.",
    };
  }

  // Client sets localStorage, then navigates — do not redirect here.
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const accessToken = await getAccessToken();

  if (accessToken) {
    try {
      await logoutUser(accessToken);
    } catch {
      // Still clear local cookies even if the BE call fails (expired token, etc.).
    }
  }

  await clearAuthTokens();
  revalidatePath("/", "layout");
  redirect("/");
}
