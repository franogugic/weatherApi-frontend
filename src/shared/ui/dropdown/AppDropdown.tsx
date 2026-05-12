import { Check, ChevronDown } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type AppDropdownOption = {
  value: string;
  label: string;
  leading?: ReactNode;
  description?: string;
};

type AppDropdownProps = {
  value: string;
  options: AppDropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "left" | "right";
  placement?: "auto" | "top" | "bottom";
};

export function AppDropdown({
  value,
  options,
  onChange,
  placeholder = "Select option",
  emptyMessage = "No options available.",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "right",
  placement = "auto",
}: AppDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateMenuPosition() {
      const dropdownElement = dropdownRef.current;

      if (!dropdownElement) {
        return;
      }

      const rect = dropdownElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const resolvedPlacement =
        placement === "auto"
          ? spaceBelow < 280 && spaceAbove > spaceBelow
            ? "top"
            : "bottom"
          : placement;
      const availableHeight =
        resolvedPlacement === "top"
          ? Math.max(120, spaceAbove - 16)
          : Math.max(120, window.innerHeight - rect.bottom - 16);
      const horizontalPosition =
        align === "right"
          ? { right: window.innerWidth - rect.right }
          : { left: rect.left };

      setMenuStyle({
        ...horizontalPosition,
        ...(resolvedPlacement === "top"
          ? { bottom: window.innerHeight - rect.top + 8 }
          : { top: rect.bottom + 8 }),
        minWidth: rect.width,
        maxHeight: availableHeight,
      });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [align, isOpen, placement]);

  const menu = isOpen ? (
    <div
      ref={menuRef}
      style={menuStyle}
      className={`fixed z-[9999] overflow-y-auto rounded-3xl border border-white/10 bg-[#1F2026]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl ${menuClassName}`}
    >
      {options.length ? options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
            className={`group flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
              isSelected
                ? "bg-linear-to-br from-accent-secondary/22 to-accent-primary/18 text-white"
                : "text-white/62 hover:bg-white/7 hover:text-white"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              {option.leading ? (
                <span className="shrink-0">{option.leading}</span>
              ) : null}
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="block truncate text-[11px] text-white/45">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </span>
            {isSelected ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-secondary to-accent-primary text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]">
                <Check size={13} />
              </span>
            ) : null}
          </button>
        );
      }) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/50">
          {emptyMessage}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div ref={dropdownRef} className={`min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1F2026]/90 px-3 py-2 text-left text-sm text-white shadow-[0_8px_22px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] outline-none backdrop-blur-xl transition hover:border-white/20 hover:bg-[#252a31]/95 focus:border-accent-primary ${buttonClassName}`}
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.leading ? (
            <span className="shrink-0">{selectedOption.leading}</span>
          ) : null}
          <span className="min-w-0 truncate font-semibold">
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-white/55 transition ${
            isOpen ? "rotate-180 text-accent-primary" : ""
          }`}
        />
      </button>

      {menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
