import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';

export const Signup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      eyebrow="Start building"
      title="Create your account"
      description="Set up a workspace and connect your first website."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        navigate('/verify-otp');
      }}>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
          <Input placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
          <Input type="email" placeholder="you@example.com" autoComplete="email" />
        </div>
        <PasswordInput label="Password" placeholder="Create a password" autoComplete="new-password" />
        <Button className="w-full mt-2" type="submit">Create Account</Button>
      </form>
    </AuthShell>
  );
};
