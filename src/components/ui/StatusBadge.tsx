import type { HTMLAttributes } from "react";
import { cn } from "./cn";

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone: "success" | "warn";
}

export default function StatusBadge({ tone, className, ...props }: StatusBadgeProps) {
  const toneClass = tone === "success" ? "bg-success-bg text-success-text" : "bg-warn-bg text-warn-text";

  return (
    <span
      className={cn("inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold", toneClass, className)}
      {...props}
    />
  );
}
