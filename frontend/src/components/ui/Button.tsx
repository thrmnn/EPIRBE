import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-radio-primary text-radio-surface-1 hover:bg-radio-primary-hover active:bg-radio-primary-active active:scale-[0.97]",
  secondary:
    "bg-radio-surface-2 text-radio-text-secondary border border-radio-border-default hover:bg-radio-surface-highlight",
  danger:
    "bg-radio-error text-white hover:brightness-110",
  ghost:
    "bg-transparent text-radio-text-secondary hover:bg-radio-surface-2",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-[44px] min-w-[44px] px-3 py-1.5 text-sm",
  md: "min-h-[48px] min-w-[48px] px-4 py-2 text-base",
  lg: "min-h-[56px] min-w-[56px] px-6 py-3 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-base",
          "focus-visible:ring-2 focus-visible:ring-radio-primary focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
