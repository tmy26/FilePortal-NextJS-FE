import {
  getCountryCallingCode,
  getCountries,
  type CountryCode,
} from "libphonenumber-js";

export type { CountryCode };

export type PhoneCountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
};

export const DEFAULT_PHONE_COUNTRY: CountryCode = "BG";

/** E.164 allows at most 15 digits after `+` (country calling code + national number). */
export const E164_MAX_DIGITS = 15;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

function countryDisplayName(code: CountryCode): string {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function toOption(code: CountryCode): PhoneCountryOption | null {
  try {
    return {
      code,
      name: countryDisplayName(code),
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: countryFlagEmoji(code),
    };
  } catch {
    return null;
  }
}

export const PHONE_COUNTRIES: PhoneCountryOption[] = getCountries()
  .map(toOption)
  .filter((option): option is PhoneCountryOption => option !== null)
  .sort((a, b) => {
    if (a.code === DEFAULT_PHONE_COUNTRY) return -1;
    if (b.code === DEFAULT_PHONE_COUNTRY) return 1;
    return a.name.localeCompare(b.name, "en");
  });

export function getPhoneCountry(
  code: CountryCode,
): PhoneCountryOption | undefined {
  return PHONE_COUNTRIES.find((country) => country.code === code);
}

export function isSupportedPhoneCountry(
  value: string,
): value is CountryCode {
  return PHONE_COUNTRIES.some((country) => country.code === value);
}

export function maxNationalDigitsForCountry(country: CountryCode): number {
  const callingCodeLength = String(getCountryCallingCode(country)).length;
  return Math.max(1, E164_MAX_DIGITS - callingCodeLength);
}
