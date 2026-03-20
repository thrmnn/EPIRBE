import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
      cancelButtonRef.current?.focus();
    } else {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCancel();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onCancel]);

  const confirmButtonClass =
    variant === "danger"
      ? "bg-radio-error text-white hover:brightness-110"
      : "bg-radio-primary text-radio-surface-1 hover:bg-radio-primary-hover active:bg-radio-primary-active";

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      className="m-auto rounded-lg border border-radio-border-default bg-radio-surface-2 p-0 text-radio-text-primary shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm animate-scale-in"
    >
      <div className="flex flex-col gap-4 p-6 max-w-md">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold font-display">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="text-sm text-radio-text-secondary">
          {message}
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className={[
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-base",
              "bg-radio-surface-3 text-radio-text-secondary border border-radio-border-default hover:bg-radio-surface-highlight",
              "focus-visible:ring-2 focus-visible:ring-radio-primary focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface-2",
              "min-h-[44px]",
            ].join(" ")}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={[
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-base",
              confirmButtonClass,
              "focus-visible:ring-2 focus-visible:ring-radio-primary focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface-2",
              "min-h-[44px]",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
