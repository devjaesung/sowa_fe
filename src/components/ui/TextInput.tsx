import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export default function TextInput({ className, onChange, onValueChange, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line-strong bg-card px-3 text-sm text-text-main placeholder:text-text-subtle",
        className,
      )}
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      }}
      {...props}
    />
  );
}
