import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}

const variantStyles: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "border-radio-success bg-radio-success-subtle",
  error: "border-radio-error bg-radio-error-subtle",
  info: "border-radio-info bg-radio-info-subtle",
};

const iconColors: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "text-radio-success",
  error: "text-radio-error",
  info: "text-radio-info",
};

const iconMap: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u2139",
};

export default function Toast({ message, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    const duration = variant === "error" ? 6000 : 4000;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, variant]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "flex items-center gap-3 rounded-lg border-l-4",
        "bg-radio-surface-3 px-4 py-3 text-radio-text-primary shadow-lg",
        "max-w-[400px] animate-slide-up",
        variantStyles[variant],
      ].join(" ")}
    >
      <span className={`text-lg ${iconColors[variant]}`} aria-hidden="true">
        {iconMap[variant]}
      </span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-radio-text-tertiary hover:text-radio-text-primary transition-colors"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
