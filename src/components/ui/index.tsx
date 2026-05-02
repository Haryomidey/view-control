import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

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
      {...(props as any)}
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

export const Switch: React.FC<{ checked?: boolean; onChange?: (checked: boolean) => void; label?: string; disabled?: boolean }> = ({ 
  checked, 
  onChange,
  label,
  disabled
}) => {
  return (
    <label className={cn("inline-flex items-center group", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)} 
        />
        <div className={cn(
          "block w-8 h-4.5 rounded-full duration-200 transition-all",
          checked ? "bg-black" : "bg-neutral-200"
        )}></div>
        <div className={cn(
          "absolute top-0.5 bg-white w-3.5 h-3.5 rounded-full transition-all duration-200 shadow-sm",
          checked ? "left-4" : "left-0.5"
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
  const dialog = (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-all duration-300",
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

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
};

type ToastVariant = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  success: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-green-600',
    barClassName: 'bg-green-600',
  },
  info: {
    icon: Info,
    iconClassName: 'text-black',
    barClassName: 'bg-black',
  },
  warning: {
    icon: TriangleAlert,
    iconClassName: 'text-amber-600',
    barClassName: 'bg-amber-500',
  },
  error: {
    icon: TriangleAlert,
    iconClassName: 'text-red-600',
    barClassName: 'bg-red-600',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((variant: ToastVariant, title: string, description?: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((items) => [...items, { id, title, description, variant }].slice(-4));
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(() => ({
    success: (title, description) => show('success', title, description),
    info: (title, description) => show('info', title, description),
    warning: (title, description) => show('warning', title, description),
    error: (title, description) => show('error', title, description),
  }), [show]);

  const viewport = (
    <div className="fixed right-4 top-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const style = toastStyles[toast.variant];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 32, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 32, scale: 0.96, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto relative overflow-hidden rounded-lg border border-border bg-white shadow-premium"
            >
              <div className={cn('absolute left-0 top-0 h-full w-1', style.barClassName)} />
              <div className="flex items-start gap-3 p-4 pl-5">
                <div className="mt-0.5 shrink-0">
                  <Icon size={18} className={style.iconClassName} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-black">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{toast.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 text-neutral-400 hover:text-black transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={15} />
                </button>
              </div>
              <motion.div
                className={cn('h-0.5 origin-left', style.barClassName)}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4.2, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' ? createPortal(viewport, document.body) : viewport}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
