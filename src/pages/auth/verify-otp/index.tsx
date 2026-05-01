import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      eyebrow="Verification"
      title="Enter your security code"
      description="We sent a one-time code to your email address."
    >
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        navigate('/');
      }}>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">One-Time Code</label>
          <Input inputMode="numeric" placeholder="000000" autoComplete="one-time-code" className="text-center tracking-widest text-base" />
        </div>
        <Button className="w-full mt-2" type="submit">Verify Code</Button>
        <p className="text-center text-[12px] text-neutral-500">
          Did not receive it?{' '}
          <Link to="/verify-otp" className="font-semibold text-black hover:underline">
            Resend code
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};
