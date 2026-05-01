import React from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <main className="min-h-screen bg-white px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 w-fit">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M3 9h18" />
          </svg>
          <span className="font-bold text-[18px] tracking-[-0.03em]">ViewControl</span>
        </Link>

        <section className="border border-border rounded-lg bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{eyebrow}</p>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black mt-2">{title}</h1>
            <p className="text-[13px] md:text-sm text-neutral-500 mt-1">{description}</p>
          </div>

          <div className="p-6">
            {children}
          </div>
        </section>

        {footerText && footerLinkText && footerLinkTo && (
          <p className="text-center text-[13px] text-neutral-500 mt-5">
            {footerText}{' '}
            <Link to={footerLinkTo} className="font-semibold text-black hover:underline">
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </main>
  );
};
