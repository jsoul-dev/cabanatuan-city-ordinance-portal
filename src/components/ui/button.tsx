import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button component — Geist bimodal system (pills for marketing, squares for app).
 * Cabanatuan LGU brand colors: emerald green primary, gold secondary.
 *
 * A11Y: Uses native <button>, minimum 44×44px touch target (House Rule).
 * Never a clickable <div> (A11Y §6 anti-pattern).
 */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium whitespace-nowrap select-none",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--accent-primary)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "min-h-[44px]", // A11Y: 44px touch target House Rule
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--accent-primary)] text-white",
          "hover:bg-[var(--color-lgu-green-deep)]",
          "active:bg-[var(--color-lgu-green)]",
        ].join(" "),
        secondary: [
          "bg-[var(--bg-card)] text-[var(--text-ink)]",
          "border border-[var(--border-hairline)]",
          "hover:bg-[var(--border-hairline-soft,#f2f2f2)]",
        ].join(" "),
        outline: [
          "bg-transparent text-[var(--text-ink)] border border-[var(--border-hairline)]",
          "hover:bg-[var(--border-hairline-soft,#f2f2f2)] hover:text-[var(--text-ink)]",
        ].join(" "),
        gold: [
          "bg-[var(--accent-gold)] text-white",
          "hover:bg-[var(--color-lgu-gold-deep)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--text-body)]",
          "hover:bg-[var(--bg-card)] hover:text-[var(--text-ink)]",
        ].join(" "),
        destructive: [
          "bg-[var(--color-error)] text-white",
          "hover:bg-[var(--color-error-deep)]",
        ].join(" "),
        link: [
          "bg-transparent text-[var(--color-link)] underline-offset-4",
          "hover:underline",
          "min-h-[auto]",
        ].join(" "),
      },
      size: {
        lg: "h-11 px-6 text-base rounded-[var(--radius-pill)]", // Marketing pill
        md: "h-10 px-4 text-sm rounded-[var(--radius-pill)]", // Default pill
        sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]", // App/nav square (6px)
        icon: "h-10 w-10 rounded-[var(--radius-full)]", // Circular icon button
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
