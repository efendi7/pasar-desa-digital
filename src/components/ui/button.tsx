"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "soft" | "outline" | "ghost";
  size?: "default" | "icon";
  asChild?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  asChild = false,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const baseStyle =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm gap-2";

  const sizes = {
    default: "px-5 py-2.5 rounded-xl",
    icon: "h-14 w-14 rounded-full",
  };

  const variants = {
    primary:
      "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400",
    secondary:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 focus:ring-emerald-300",
    soft:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-200",
    outline:
      "border border-emerald-300 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-200",
    ghost:
      "text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-200",
  };

  return (
    <Comp
      className={cn(baseStyle, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
