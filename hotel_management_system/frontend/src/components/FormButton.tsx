import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors } from "../theme/color.theme";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "soft";
};

const FormButton = ({ children, className = "", disabled, variant = "primary", ...props }: FormButtonProps) => {
  const isPrimary = variant === "primary";

  return (
    <button
      className={`flex h-16 w-full items-center justify-center gap-3 rounded-[32px] text-base font-medium transition hover:opacity-90 ${className}`}
      disabled={disabled}
      style={{
        background: isPrimary ? colors.primary : colors.mutedPanel,
        color: isPrimary ? colors.background : colors.title,
        opacity: disabled ? 0.65 : undefined,
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default FormButton;
