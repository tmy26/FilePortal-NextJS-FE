import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import {
  maxNationalDigitsForCountry,
  type CountryCode,
} from "./countries";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Pull national significant digits from typed/pasted input.
 * Length varies by country — only the E.164 total (≤15) is enforced by the formatter.
 */
function extractNationalDigits(
  value: string,
  country: CountryCode,
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.includes("+") || trimmed.startsWith("00")) {
    const parsed = parsePhoneNumberFromString(trimmed, country);
    if (parsed?.nationalNumber) {
      return parsed.nationalNumber;
    }
  }

  const digits = digitsOnly(value);
  if (!digits) return "";

  const callingCode = String(getCountryCallingCode(country));
  const maxNational = maxNationalDigitsForCountry(country);

  // Digits pasted with calling code but without `+` (e.g. 359881234567).
  // Do not strip when the national number itself starts with the calling-code
  // digits (e.g. KZ `771…` with calling code `7`).
  if (digits.startsWith(callingCode) && digits.length > callingCode.length) {
    const rest = digits.slice(callingCode.length);
    if (rest.length >= 4) {
      const asNational = parsePhoneNumberFromString(digits, country);
      const asIntl = parsePhoneNumberFromString(
        `+${callingCode}${rest}`,
        country,
      );
      const nationalWithoutTrunk = digits.replace(/^0+/, "");

      if (
        asNational?.isValid() &&
        asNational.nationalNumber === nationalWithoutTrunk
      ) {
        return asNational.nationalNumber;
      }

      if (
        asIntl?.nationalNumber &&
        (!asNational?.isValid() || digits.length > maxNational)
      ) {
        return asIntl.nationalNumber;
      }
    }
  }

  // AsYouType knows each country's trunk prefix / national length rules.
  const typer = new AsYouType(country);
  typer.input(digits);
  const fromTyper = typer.getNationalNumber();
  if (fromTyper) {
    return fromTyper;
  }

  // Partial input before libphonenumber recognizes a pattern: drop trunk `0`.
  if (digits.startsWith("0")) {
    return digits.replace(/^0+/, "");
  }

  return digits;
}

/**
 * Formats the national part as-you-type using that country's international
 * spacing rules. Example (BG): `881234567` → `88 123 4567` (shown beside `+359`).
 * Digit length follows the selected country; only E.164 (≤15 total) caps input.
 */
export function formatNationalPhoneInput(
  value: string,
  country: CountryCode,
): string {
  const maxNational = maxNationalDigitsForCountry(country);
  const nationalDigits = extractNationalDigits(value, country).slice(
    0,
    maxNational,
  );
  if (!nationalDigits) return "";

  const dial = `+${getCountryCallingCode(country)}`;
  // Pass the selected country so shared calling codes (+1, +7) format correctly.
  const formattedInternational = new AsYouType(country).input(
    `${dial}${nationalDigits}`,
  );

  if (formattedInternational.startsWith(dial)) {
    return formattedInternational.slice(dial.length).trimStart();
  }

  return formattedInternational;
}

/** Country-specific placeholder from libphonenumber example numbers. */
export function getPhonePlaceholder(country: CountryCode): string {
  const example = getExampleNumber(country, examples);
  if (!example) return "Phone number";

  const dial = `+${getCountryCallingCode(country)}`;
  const international = example.formatInternational();
  if (international.startsWith(dial)) {
    return international.slice(dial.length).trimStart();
  }

  return example.formatNational();
}
