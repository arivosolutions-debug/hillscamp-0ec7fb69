import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Surface background — warm off-white, no full border
          "flex min-h-[120px] w-full rounded-t-xl bg-hc-bg-alt px-4 py-3",
          // Bottom stroke only
          "border-0 border-b-2 border-b-hc-text-light/20",
          // Typography
          "font-body text-sm text-hc-text placeholder:text-hc-text-light",
          "leading-relaxed resize-none",
          // Focus: bottom stroke to primary
          "outline-hidden transition-colors duration-200",
          "focus-visible:border-b-hc-primary",
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
Textarea.displayName = "Textarea";

export { Textarea };
