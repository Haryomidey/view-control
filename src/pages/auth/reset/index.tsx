import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';

export const Reset: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
      description="Use a strong password you have not used before."
      footerText="Remembered your password?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        navigate('/login');
      }}>
        <PasswordInput label="New Password" placeholder="Enter new password" autoComplete="new-password" />
        <PasswordInput label="Confirm Password" placeholder="Confirm new password" autoComplete="new-password" />
        <Button className="w-full mt-2" type="submit">Reset Password</Button>
      </form>
    </AuthShell>
  );
};
