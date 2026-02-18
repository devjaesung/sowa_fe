import { cn } from "./cn";

export type ButtonVariant = "brand" | "outline" | "ghost";
export type ButtonShape = "pill" | "rounded";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  full?: boolean;
}

export const buttonStyles = ({
  variant = "brand",
  shape = "rounded",
  full = false,
}: ButtonStyleOptions = {}) => {
  const base = "inline-flex items-center justify-center text-sm font-semibold transition cursor-pointer";

  const variantClass =
    variant === "brand"
      ? "border border-brand-border bg-brand text-text-main hover:bg-brand-hover"
      : variant === "outline"
        ? "border border-brand-border bg-card text-text-main hover:bg-brand"
        : "bg-transparent text-text-muted hover:text-text-main";

  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-md";
  const widthClass = full ? "w-full" : "";

  return cn(base, variantClass, shapeClass, widthClass);
};
