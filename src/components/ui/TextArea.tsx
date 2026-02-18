import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
}

export default function TextArea({ className, onChange, onValueChange, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full rounded-md border border-line-strong bg-card px-3 text-sm text-text-main placeholder:text-text-subtle",
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
