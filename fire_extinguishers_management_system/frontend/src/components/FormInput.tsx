import type { InputHTMLAttributes, ReactNode } from "react";
import { colors } from "../theme/color.theme";

type FormInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  onChange: (value: string) => void;
  rightElement?: ReactNode;
  value: string;
};

const FormInput = ({ label, onChange, rightElement, value, ...props }: FormInputProps) => (
  <label className="block w-full">
    <span className="mb-3 block text-base font-medium" style={{ color: colors.label }}>
      {label}
    </span>
    <span className="flex items-center border-b pb-3" style={{ borderColor: colors.inputBorder }}>
      <input
        className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-black"
        onChange={(event) => onChange(event.target.value)}
        value={value}
        {...props}
      />
      {rightElement}
    </span>
  </label>
);

export default FormInput;
