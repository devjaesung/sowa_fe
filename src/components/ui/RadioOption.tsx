interface RadioOptionProps {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}

export default function RadioOption({ checked, label, name, onChange }: RadioOptionProps) {
  return (
    <label className="inline-flex items-center gap-2 text-[16px] font-medium text-text-main">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}
