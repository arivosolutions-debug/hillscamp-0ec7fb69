import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Surface background — warm off-white, no full border
          "flex h-12 w-full rounded-t-xl bg-hc-bg-alt px-4 py-3",
          // Bottom stroke only — felt not seen
          "border-0 border-b-2 border-b-hc-text-light/20",
          // Typography
          "font-body text-sm text-hc-text placeholder:text-hc-text-light",
          // Focus: bottom stroke transitions to brand primary
          "outline-hidden transition-colors duration-200",
          "focus-visible:border-b-hc-primary",
          // File input resets
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-hc-text",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
