"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type ScrollSelectOption = {
  value: string;
  label: string;
};

type ScrollSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ScrollSelectOption[];
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
};

/** Approx. menu height: search + 14rem list + padding. */
const MENU_SPACE_PX = 300;

export function ScrollSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  searchable = true,
  className,
}: ScrollSelectProps) {
  const listboxId = useId();
  const searchId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"below" | "above">("below");

  const selected = options.find((option) => option.value === value);
  const queryNormalized = query.trim().toLowerCase();
  const filteredOptions = queryNormalized
    ? options.filter((option) =>
        option.label.toLowerCase().includes(queryNormalized),
      )
    : options;

  useLayoutEffect(() => {
    if (!isOpen || !rootRef.current) return;

    function updatePlacement() {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Prefer opening upward so long lists don't cover fields below.
      const openAbove =
        spaceAbove >= 200 ||
        (spaceBelow < MENU_SPACE_PX && spaceAbove > spaceBelow);
      setPlacement(openAbove ? "above" : "below");
    }

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (searchable) {
      searchRef.current?.focus();
    }

    function handlePointerDown(event: MouseEvent | PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, searchable]);

  if (disabled && isOpen) {
    setIsOpen(false);
    setQuery("");
  }

  function selectOption(next: string) {
    onChange(next);
    setIsOpen(false);
    setQuery("");
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <div
      className={["field", isOpen ? "is-open" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="field-label" id={`${id}-label`}>
        {label}
      </span>
      <div ref={rootRef} className="scroll-select">
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${id}-label`}
          onClick={() => {
            if (disabled) return;
            setIsOpen((open) => {
              if (open) setQuery("");
              return !open;
            });
          }}
          onKeyDown={handleTriggerKeyDown}
          className={[
            "scroll-select-trigger",
            !selected ? "is-placeholder" : "",
          ].join(" ")}
        >
          <span className="scroll-select-value">
            {selected?.label ?? placeholder}
          </span>
          <span
            aria-hidden="true"
            className={["scroll-select-chevron", isOpen ? "is-open" : ""].join(
              " ",
            )}
          >
            ▼
          </span>
        </button>

        {isOpen ? (
          <div
            className={[
              "scroll-select-menu",
              placement === "above" ? "is-above" : "",
            ].join(" ")}
          >
            {searchable ? (
              <label className="scroll-select-search" htmlFor={searchId}>
                <span className="sr-only">Search {label}</span>
                <input
                  ref={searchRef}
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${label.toLowerCase()}`}
                  autoComplete="off"
                />
              </label>
            ) : null}
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={`${id}-label`}
              className="scroll-select-list"
            >
              {filteredOptions.length === 0 ? (
                <li className="scroll-select-empty">No matches</li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        onClick={() => selectOption(option.value)}
                        className={[
                          "scroll-select-option",
                          isSelected ? "is-selected" : "",
                        ].join(" ")}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
