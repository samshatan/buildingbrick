import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  ariaLabel?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  ariaLabel,
}) => (
  <div className="space-y-2.5">
    <label htmlFor={id} className="text-sm font-bold text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="flex h-11 w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm shadow-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400 font-medium"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={ariaLabel || label}
    />
  </div>
);

export default FormField;
