import type { LabelHTMLAttributes } from "react";

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  label?: string;
}

export default function FieldLabel({
  children,
  label,
  required = false,
  className,
  ...props
}: FieldLabelProps) {
  return (
    <label className={`mt-2 block text-[14px] font-semibold text-text-main ${className ?? ""}`} {...props}>
      {children ?? label} {required ? <span className="text-danger">*</span> : null}
    </label>
  );
}
