import { validatePhoneNumber } from "@/lib/phone";
import type { CreateUserFormValues } from "@/lib/types/user";

/** Client/server-shared readiness check for the create-user form. */
export function isCreateUserFormReady(values: CreateUserFormValues): boolean {
  const username = values.username.trim();
  const email = values.email.trim();
  const firstName = values.first_name.trim();
  const lastName = values.last_name.trim();
  const country = values.country.trim();
  const phone = values.phone.trim();

  if (username.length < 3 || username.length > 255) return false;
  if (!/^[A-Za-z0-9_]+$/.test(username)) return false;
  if (email.length < 5 || !email.includes("@")) return false;
  if (values.password.length < 6 || values.password.length > 24) return false;
  if (values.password !== values.retype_password) return false;
  if (!values.acceptTerms) return false;

  // Optional fields: validate only when provided.
  if (firstName && firstName.length < 2) return false;
  if (lastName && lastName.length > 255) return false;
  if (country && country.length > 64) return false;
  if (phone && !validatePhoneNumber(phone, values.phoneCountry).ok) return false;

  return true;
}
