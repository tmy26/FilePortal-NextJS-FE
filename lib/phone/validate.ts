import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { E164_MAX_DIGITS, isSupportedPhoneCountry } from "./countries";
import { digitsOnly } from "./format";

export type PhoneErrorKey =
  | "phoneRequired"
  | "phoneCountry"
  | "phoneInvalid"
  | "phoneTooLong";

export type PhoneValidationResult =
  | {
      ok: true;
      e164: string;
      international: string;
      country: CountryCode;
    }
  | { ok: false; errorKey: PhoneErrorKey };

export function validatePhoneNumber(
  nationalNumber: string,
  countryCode: string,
): PhoneValidationResult {
  const trimmed = nationalNumber.trim();

  if (!trimmed) {
    return { ok: false, errorKey: "phoneRequired" };
  }

  if (!isSupportedPhoneCountry(countryCode)) {
    return { ok: false, errorKey: "phoneCountry" };
  }

  const parsed = parsePhoneNumberFromString(trimmed, countryCode);

  if (!parsed || !parsed.isValid()) {
    return { ok: false, errorKey: "phoneInvalid" };
  }

  if (parsed.country && parsed.country !== countryCode) {
    return { ok: false, errorKey: "phoneInvalid" };
  }

  const e164 = parsed.format("E.164");
  if (digitsOnly(e164).length > E164_MAX_DIGITS) {
    return { ok: false, errorKey: "phoneTooLong" };
  }

  return {
    ok: true,
    e164,
    international: parsed.formatInternational(),
    country: countryCode,
  };
}
