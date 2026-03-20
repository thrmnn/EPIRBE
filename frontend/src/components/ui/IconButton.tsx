import { forwardRef } from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variantClasses: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary:
    "bg-radio-primary text-radio-surface-1 hover:bg-radio-primary-hover active:bg-radio-primary-active active:scale-[0.97]",
  secondary:
    "bg-radio-surface-2 text-radio-text-secondary border border-radio-border-default hover:bg-radio-surface-highlight",
  danger:
    "bg-radio-error text-white hover:brightness-110",
  ghost:
    "bg-transparent text-radio-text-secondary hover:bg-radio-surface-2",
};

const sizeClasses: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = "md", variant = "ghost", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={[
          "inline-flex items-center justify-center rounded-md transition-all duration-base",
          "focus-visible:ring-2 focus-visible:ring-radio-primary focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
