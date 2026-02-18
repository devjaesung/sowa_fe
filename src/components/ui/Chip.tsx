import type { HTMLAttributes } from "react";
import { cn } from "./cn";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "soft";
}

export default function Chip({ tone = "brand", className, ...props }: ChipProps) {
  const toneClass = tone === "brand" ? "bg-brand text-text-main" : "bg-card-soft text-text-main";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-4 py-2 text-xs font-semibold",
        toneClass,
        className,
      )}
      {...props}
    />
  );
}
