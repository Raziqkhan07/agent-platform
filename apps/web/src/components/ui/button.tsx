import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevation-1 dark:shadow-elevation-2",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elevation-1 dark:shadow-elevation-2",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-elevation-1 dark:shadow-elevation-2",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
        contained: 
          "bg-primary text-primary-foreground shadow-elevation-1 hover:bg-primary/90 active:shadow-elevation-2 dark:shadow-elevation-2",
        outlined:
          "border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10 dark:border-primary/80",
        text:
          "text-primary hover:bg-primary/5 active:bg-primary/10 dark:text-primary/90 dark:hover:bg-primary/20",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 shadow-elevation-1 dark:shadow-elevation-2",
        info:
          "bg-info text-info-foreground hover:bg-info/90 shadow-elevation-1 dark:shadow-elevation-2",
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-elevation-1 dark:shadow-elevation-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
