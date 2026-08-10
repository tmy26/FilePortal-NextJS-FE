"use server";

import { redirect } from "next/navigation";
import { deleteUser } from "@/lib/api";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/session";

export type DeleteAccountState = {
  ok: boolean;
  error?: string;
};

export async function deleteAccountAction(
  _prev: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const confirmed = formData.get("confirm_delete");
  if (confirmed !== "DELETE") {
    return {
      ok: false,
      error: 'Type DELETE to confirm account deletion.',
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/sign-in");
  }

  try {
    await deleteUser(accessToken);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete account.";
    return { ok: false, error: message };
  }

  await clearAuthTokens();
  redirect("/");
}
