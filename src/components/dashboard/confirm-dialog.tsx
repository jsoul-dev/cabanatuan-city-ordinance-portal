"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional controlled textarea value for reject-reason dialogs */
  reason?: string;
  onReasonChange?: (v: string) => void;
  reasonLabel?: string;
  reasonRequired?: boolean;
}

const variantMap = {
  danger:  { btn: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-2 focus-visible:ring-red-500", icon: "⚠️" },
  warning: { btn: "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-2 focus-visible:ring-amber-400", icon: "❗" },
  default: { btn: "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]", icon: "ℹ️" },
};

/**
 * A11Y-compliant modal dialog.
 * – role="alertdialog" for destructive confirmations
 * – Full focus trap (Tab/Shift-Tab loop)
 * – Escape key cancels
 * – Focus returns to trigger element on close (caller's responsibility via autoFocusRef)
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Kumpirmahin",
  cancelLabel = "Kanselahin",
  variant = "default",
  onConfirm,
  onCancel,
  reason,
  onReasonChange,
  reasonLabel,
  reasonRequired = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const style = variantMap[variant];

  // Move focus inside dialog when it opens
  useEffect(() => {
    if (open) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape key closes dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    },
    [open, onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  const canConfirm = !reasonRequired || (reason?.trim().length ?? 0) > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">{style.icon}</span>
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-lg font-bold text-[var(--text-ink)] leading-tight"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-desc"
              className="text-sm text-[var(--text-body)] mt-1"
            >
              {description}
            </p>
          </div>
        </div>

        {/* Optional reason textarea */}
        {onReasonChange !== undefined && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-reason"
              className="text-sm font-medium text-[var(--text-ink)]"
            >
              {reasonLabel ?? "Dahilan"}{reasonRequired && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
              {reasonRequired && <span className="sr-only"> (kinakailangan)</span>}
            </label>
            <textarea
              id="confirm-reason"
              rows={3}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Ilagay ang dahilan dito…"
              required={reasonRequired}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-mute)] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              aria-required={reasonRequired}
            />
          </div>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] min-w-[100px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:bg-[var(--border-hairline)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
            aria-disabled={!canConfirm}
            className={`min-h-[44px] min-w-[100px] rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none ${style.btn} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
