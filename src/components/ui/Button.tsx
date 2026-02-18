import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonShape, type ButtonVariant } from "./buttonStyles";
import { cn } from "./cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  full?: boolean;
}

export default function Button({
  variant = "brand",
  shape = "rounded",
  full = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, shape, full }), className)}
      {...props}
    />
  );
}
