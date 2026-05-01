import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your workspace"
      description="Continue managing controls, banners, and project visibility."
      footerText="New to ViewControl?"
      footerLinkText="Create an account"
      footerLinkTo="/signup"
    >
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        navigate('/');
      }}>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
          <Input type="email" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Password</label>
            <Link to="/forgot-password" className="text-[12px] font-semibold text-black hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-1.5">
            <PasswordInput placeholder="Enter your password" autoComplete="current-password" aria-label="Password" />
          </div>
        </div>
        <Button className="w-full mt-2" type="submit">Log In</Button>
      </form>
    </AuthShell>
  );
};
