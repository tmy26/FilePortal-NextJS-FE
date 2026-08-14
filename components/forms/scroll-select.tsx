"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

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
const COMPACT_QUERY = "(max-width: 899px)";

function subscribeCompact(onChange: () => void) {
  const media = window.matchMedia(COMPACT_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getCompactSnapshot() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

function getServerCompactSnapshot() {
  return false;
}

function useIsCompact() {
  return useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    getServerCompactSnapshot,
  );
}

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
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isCompact = useIsCompact();
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

  function close() {
    setIsOpen(false);
    setQuery("");
  }

  useLayoutEffect(() => {
    if (!isOpen || isCompact || !rootRef.current) return;

    function updatePlacement() {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
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
  }, [isOpen, isCompact]);

  useLayoutEffect(() => {
    if (!isOpen || !isCompact) return;

    function updateInset() {
      const menu = menuRef.current;
      if (!menu) return;
      const viewport = window.visualViewport;
      if (!viewport) {
        menu.style.bottom = "0px";
        menu.style.maxHeight = "88dvh";
        return;
      }
      menu.style.bottom = `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`;
      menu.style.maxHeight = `${Math.round(Math.min(viewport.height * 0.92, 576))}px`;
    }

    updateInset();
    window.visualViewport?.addEventListener("resize", updateInset);
    window.visualViewport?.addEventListener("scroll", updateInset);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateInset);
      window.visualViewport?.removeEventListener("scroll", updateInset);
    };
  }, [isOpen, isCompact]);

  useEffect(() => {
    if (!isOpen || !isCompact) return;
    document.documentElement.classList.add("scroll-select-sheet-open");
    return () => {
      document.documentElement.classList.remove("scroll-select-sheet-open");
    };
  }, [isOpen, isCompact]);

  useEffect(() => {
    if (!isOpen) return;

    if (searchable && !isCompact) {
      searchRef.current?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (isCompact) return;
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      close();
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, searchable, isCompact]);

  if (disabled && isOpen) {
    setIsOpen(false);
    setQuery("");
  }

  function selectOption(next: string) {
    onChange(next);
    close();
    if (isCompact) {
      requestAnimationFrame(() => {
        rootRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      });
    }
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

  const menu = (
    <div
      ref={menuRef}
      className={[
        "scroll-select-menu",
        isCompact ? "is-sheet" : "",
        !isCompact && placement === "above" ? "is-above" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={isCompact ? "dialog" : undefined}
      aria-modal={isCompact ? true : undefined}
      aria-labelledby={isCompact ? `${id}-sheet-title` : undefined}
    >
      {isCompact ? (
        <div className="scroll-select-sheet-header">
          <p className="scroll-select-sheet-title" id={`${id}-sheet-title`}>
            {label}
          </p>
          <button
            type="button"
            className="scroll-select-sheet-close"
            onClick={close}
            aria-label={`Close ${label}`}
          >
            ×
          </button>
        </div>
      ) : null}
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
            enterKeyHint="search"
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
              <li key={option.value} role="option" aria-selected={isSelected}>
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
  );

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

        {isOpen && !isCompact ? menu : null}
      </div>
      {isOpen && isCompact
        ? createPortal(
            <>
              <button
                type="button"
                className="scroll-select-backdrop"
                aria-label={`Close ${label}`}
                onClick={close}
              />
              {menu}
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
