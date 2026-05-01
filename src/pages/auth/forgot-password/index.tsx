import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter your email and we will send instructions to reset access."
      footerText="Back to"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        navigate('/reset');
      }}>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
          <Input type="email" placeholder="you@example.com" autoComplete="email" />
        </div>
        <Button className="w-full mt-2" type="submit">Send Reset Link</Button>
      </form>
    </AuthShell>
  );
};
