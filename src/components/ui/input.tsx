import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

/**
 * Input component — Geist text-input spec with explicit label association.
 *
 * A11Y §3 Understandable: Forms MUST have explicit labels connected via id/for.
 * A11Y §6: MUST NOT use placeholder as sole label.
 * A11Y §3: Error state uses icon + text + color (never color alone).
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, icon, id, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {/* A11Y: Explicit <label> element with for/id association */}
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-ink)]"
        >
          {label}
        </label>

        <div className="relative">
          {icon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)]"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "flex h-10 w-full rounded-[var(--radius-sm)]",
              "border border-[var(--border-hairline)]",
              "bg-[var(--bg-card)] text-[var(--text-ink)]",
              "px-3 py-2 text-sm",
              "placeholder:text-[var(--text-faint)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error &&
                "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
        </div>

        {/* A11Y §3: Helper text visible outside the field */}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-[var(--text-mute)]">
            {helperText}
          </p>
        )}

        {/* A11Y: Error with icon + text + color (never color alone) */}
        {error && (
          <p
            id={errorId}
            className="flex items-center gap-1.5 text-xs text-[var(--color-error)]"
            role="alert"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 10.5a.75.75 0 100 1.5.75.75 0 000-1.5zM8 4a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 008 4z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
