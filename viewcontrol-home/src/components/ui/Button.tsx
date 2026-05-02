import * as React from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-[#111827] text-white hover:bg-black border-transparent shadow-sm",
      secondary: "bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb] border-transparent shadow-sm",
      outline: "bg-white text-[#111827] border-[#e5e7eb] hover:bg-[#f9fafb] shadow-sm border",
      ghost: "bg-transparent text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] border-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs leading-none",
      md: "h-10 px-4 text-sm leading-none font-medium",
      lg: "h-12 px-6 text-base leading-none font-medium",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
