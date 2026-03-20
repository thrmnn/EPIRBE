import { forwardRef } from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variantClasses: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "bg-radio-accent text-white hover:brightness-110",
  secondary: "bg-radio-border text-radio-text hover:bg-radio-muted/30",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-radio-text hover:bg-radio-border",
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
          "inline-flex items-center justify-center rounded-md transition-all",
          "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface",
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
