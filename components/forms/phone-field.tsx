"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  digitsOnly,
  formatNationalPhoneInput,
  getPhoneCountry,
  getPhonePlaceholder,
  type CountryCode,
} from "@/lib/phone";

type PhoneFieldProps = {
  id?: string;
  nationalNumber: string;
  countryCode: CountryCode;
  onNationalNumberChange: (value: string) => void;
  onCountryCodeChange: (value: CountryCode) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
};

export function PhoneField({
  id = "telephone_number",
  nationalNumber,
  countryCode,
  onNationalNumberChange,
  onCountryCodeChange,
  required = true,
  disabled = false,
  error = null,
}: PhoneFieldProps) {
  const listboxId = useId();
  const searchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const selected = getPhoneCountry(countryCode) ?? PHONE_COUNTRIES[0];
  const phoneDigits = digitsOnly(nationalNumber);
  const placeholder = getPhonePlaceholder(countryCode);

  const countryQueryNormalized = countryQuery.trim().toLowerCase();
  const filteredCountries = countryQueryNormalized
    ? PHONE_COUNTRIES.filter((country) => {
        return (
          country.name.toLowerCase().includes(countryQueryNormalized) ||
          country.dialCode.includes(countryQueryNormalized) ||
          country.code.toLowerCase().includes(countryQueryNormalized)
        );
      })
    : PHONE_COUNTRIES;

  useEffect(() => {
    if (!isOpen) return;

    searchRef.current?.focus();

    function handlePointerDown(event: MouseEvent | PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setCountryQuery("");
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setCountryQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function selectCountry(code: CountryCode) {
    onCountryCodeChange(code);
    onNationalNumberChange(formatNationalPhoneInput(phoneDigits, code));
    setIsOpen(false);
    setCountryQuery("");
  }

  function handleNationalChange(value: string) {
    onNationalNumberChange(formatNationalPhoneInput(value, countryCode));
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <div className="field field-span">
      <label htmlFor={id} className="field-label">
        Phone
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>

      <div ref={rootRef} className="phone-field">
        <div className="phone-field-control">
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-label={`Country code ${selected.flag} ${selected.dialCode}`}
            onClick={() =>
              setIsOpen((open) => {
                if (open) setCountryQuery("");
                return !open;
              })
            }
            onKeyDown={handleTriggerKeyDown}
            className="phone-country-trigger"
          >
            <span aria-hidden="true">{selected.flag}</span>
            <span>{selected.dialCode}</span>
            <span
              aria-hidden="true"
              className={["phone-chevron", isOpen ? "is-open" : ""].join(" ")}
            >
              ▼
            </span>
          </button>

          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            disabled={disabled}
            value={nationalNumber}
            placeholder={placeholder}
            onChange={(event) => handleNationalChange(event.target.value)}
            className="phone-national-input"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          {/* Digits only — API path strips further to E.164 */}
          <input type="hidden" name="phone" value={phoneDigits} />
          <input type="hidden" name="phoneCountry" value={countryCode} />
        </div>

        {isOpen ? (
          <div className="phone-country-menu">
            <label className="phone-country-search" htmlFor={searchId}>
              <span className="sr-only">Search countries</span>
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={countryQuery}
                onChange={(event) => setCountryQuery(event.target.value)}
                placeholder="Search country or code"
                autoComplete="off"
              />
            </label>
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Country code"
              className="phone-country-list"
            >
              {filteredCountries.length === 0 ? (
                <li className="phone-country-empty">No countries found</li>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = country.code === countryCode;

                  return (
                    <li
                      key={country.code}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        onClick={() => selectCountry(country.code)}
                        className={[
                          "phone-country-option",
                          isSelected ? "is-selected" : "",
                        ].join(" ")}
                      >
                        <span aria-hidden="true">{country.flag}</span>
                        <span className="phone-country-name">{country.name}</span>
                        <span className="phone-country-dial">
                          {country.dialCode}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      ) : !required ? (
        <p className="field-hint">Optional</p>
      ) : null}
    </div>
  );
}

export { DEFAULT_PHONE_COUNTRY };
