import { Link, type LinkProps } from "react-router";
import { buttonStyles, type ButtonShape, type ButtonVariant } from "./buttonStyles";
import { cn } from "./cn";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  full?: boolean;
  className?: string;
}

export default function ButtonLink({
  variant = "brand",
  shape = "rounded",
  full = false,
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, shape, full }), className)} {...props} />;
}
