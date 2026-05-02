import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components/ui';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { authApi, getApiErrorMessage } from '../../../lib/api';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await authApi.signup({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Start building"
      title="Create your account"
      description="Set up a workspace and connect your first website."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
          <Input placeholder="Jane Doe" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
          <Input type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <PasswordInput label="Password" placeholder="Create a password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <Button className="w-full mt-2" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Account'}</Button>
      </form>
    </AuthShell>
  );
};
