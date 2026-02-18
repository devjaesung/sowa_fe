import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Select({
  options,
  value,
  placeholder = "선택",
  onChange,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-line-strong bg-card px-3 text-sm text-text-main"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selectedLabel ? "text-text-main" : "text-text-subtle"}>
          {selectedLabel ?? placeholder}
        </span>
        <span className={cn("transition", open ? "rotate-180" : "")}>▾</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-11 z-30 w-full overflow-hidden rounded-md border border-line bg-card shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-muted"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted",
                option.value === value ? "bg-brand/40 text-text-main" : "text-text-main",
              )}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
