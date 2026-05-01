import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0";
  
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-[#f5f5f5] text-black border border-border hover:bg-neutral-100",
    outline: "bg-transparent border border-border text-black hover:bg-neutral-50",
    ghost: "bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-black",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-[13px]",
    md: "px-4 py-2 md:px-5 md:py-2.5 text-[13px] md:text-sm",
    lg: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
    icon: "p-1.5 md:p-2"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, description }) => {
  return (
    <div className={cn("bg-white border border-border rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          {description && <p className="text-[13px] text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      <div className={cn("p-6", title ? "" : "p-5")}>
        {children}
      </div>
    </div>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13px] focus-visible:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export const Switch: React.FC<{ checked?: boolean; onChange?: (checked: boolean) => void; label?: string }> = ({ 
  checked, 
  onChange,
  label
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          onChange={(e) => onChange?.(e.target.checked)} 
        />
        <div className={cn(
          "block w-8 h-[18px] rounded-full transition-colors duration-200 transition-all",
          checked ? "bg-black" : "bg-neutral-200"
        )}></div>
        <div className={cn(
          "absolute top-[2px] bg-white w-3.5 h-3.5 rounded-full transition-all duration-200 shadow-sm",
          checked ? "left-[16px]" : "left-[2px]"
        )}></div>
      </div>
      {label && <span className="ml-3 text-[13px] font-medium text-neutral-600">{label}</span>}
    </label>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'error' | 'neutral' }> = ({ 
  children, 
  variant = 'neutral' 
}) => {
  const variants = {
    success: "bg-neutral-50 text-black border-border",
    error: "bg-red-50 text-red-700 border-red-100",
    neutral: "bg-[#f5f5f5] text-[#666] border border-border",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
      variants[variant]
    )}>
      {children}
    </span>
  );
};

export const Dialog: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "bg-white border border-border rounded-xl shadow-premium w-full max-w-lg overflow-hidden transition-all duration-300",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-neutral-50/50">
          <h3 className="font-bold text-[15px]">{title}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
