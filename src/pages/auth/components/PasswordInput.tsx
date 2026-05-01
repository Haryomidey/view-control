import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../../components/ui';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, className, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">{label}</label>
      )}
      <div className="relative">
        <Input
          type={isVisible ? 'text' : 'password'}
          className={className ? `${className} pr-10` : 'pr-10'}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};
