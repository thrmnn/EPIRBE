import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}

const borderColors: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "border-radio-success",
  error: "border-radio-error",
  info: "border-radio-info",
};

const iconMap: Record<NonNullable<ToastProps["variant"]>, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u2139",
};

export default function Toast({ message, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-center gap-3 rounded-lg border-l-4 bg-radio-surface px-4 py-3 text-radio-text shadow-lg",
        "animate-[slideUp_0.3s_ease-out]",
        borderColors[variant],
      ].join(" ")}
    >
      <span className="text-lg" aria-hidden="true">
        {iconMap[variant]}
      </span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-radio-muted hover:text-radio-text transition-colors"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
