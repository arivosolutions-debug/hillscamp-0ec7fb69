import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: rounded-full, no default border, organic press feel
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-body font-bold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-hc-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Deep forest — primary brand action
        default:
          "bg-hc-primary text-white hover:bg-hc-primary-deep",
        // Terracotta — warm booking / WhatsApp CTA
        secondary:
          "bg-hc-secondary text-white hover:brightness-110",
        // Warm amber — accent highlight action
        accent:
          "bg-hc-accent text-[#360f00] hover:brightness-105",
        // Ghost — secondary action, glass feel
        ghost:
          "bg-transparent border border-hc-text-light/30 text-hc-primary hover:bg-hc-bg-alt hover:border-hc-text-light/50",
        // Outline on dark — used inside dark/primary containers
        outline:
          "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Link
        link: "text-hc-secondary underline-offset-4 hover:underline bg-transparent rounded-none active:scale-100",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm:      "h-9 px-4 text-xs",
        lg:      "h-12 px-10 text-base",
        xl:      "h-14 px-12 text-lg",
        icon:    "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
