import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { authApi, getApiErrorMessage } from '../../../lib/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await authApi.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to log in.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your workspace"
      description="Continue managing controls, banners, and project visibility."
      footerText="New to ViewControl?"
      footerLinkText="Create an account"
      footerLinkTo="/signup"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
          <Input type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Password</label>
            <Link to="/forgot-password" className="text-[12px] font-semibold text-black hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-1.5">
            <PasswordInput placeholder="Enter your password" autoComplete="current-password" aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
        </div>
        <Button className="w-full mt-2" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log In'}</Button>
      </form>
    </AuthShell>
  );
};
