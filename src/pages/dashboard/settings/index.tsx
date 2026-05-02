import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Card, Button, Input } from '../../../components/ui';
import {
  Lock,
  Trash2,
  CreditCard,
  Copy,
  KeyRound,
  User,
} from 'lucide-react';
import { ApiProject, ApiUser, AUTH_USER_KEY, authApi, getApiErrorMessage, projectsApi } from '../../../lib/api';

const getStoredUser = (): ApiUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const maskKey = (key: string) => `${key.slice(0, 6)}${'*'.repeat(12)}${key.slice(-4)}`;

export const Settings: React.FC = () => {
  const [user, setUser] = React.useState<ApiUser | null>(getStoredUser);
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [revealedProjectIds, setRevealedProjectIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    Promise.all([authApi.me(), projectsApi.list()])
      .then(([currentUser, projectItems]) => {
        if (isMounted) {
          setUser(currentUser);
          setProjects(projectItems);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Unable to load settings.'));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const copyValue = async (label: string, value?: string) => {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1800);
  };

  const toggleProjectKey = (projectId: string) => {
    setRevealedProjectIds((items) => {
      const nextItems = new Set(items);
      if (nextItems.has(projectId)) {
        nextItems.delete(projectId);
      } else {
        nextItems.add(projectId);
      }
      return nextItems;
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto lg:mx-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">Workspace Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your account and project integration details.</p>
      </div>

      {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}

      <div className="space-y-6">
        <Card title="Account Information" description="The profile attached to your ViewControl workspace.">
          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
              {isLoading ? <Skeleton height={40} borderRadius={6} /> : <Input value={user?.name || ''} readOnly className="bg-neutral-50" />}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
              {isLoading ? <Skeleton height={40} borderRadius={6} /> : <Input value={user?.email || ''} readOnly className="bg-neutral-50" />}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">User ID</label>
              {isLoading ? (
                <Skeleton height={40} borderRadius={6} />
              ) : (
                <div className="relative">
                  <Input value={user?.id || ''} readOnly className="bg-neutral-50 pr-10 font-mono" />
                  <button
                    type="button"
                    onClick={() => copyValue('user-id', user?.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                    aria-label="Copy user ID"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
            {copied === 'user-id' && <p className="text-[12px] font-medium text-green-600">User ID copied.</p>}
          </div>
        </Card>

        <Card title="Project Keys" description="Public runtime keys for installing ViewControl on client sites.">
          <div className="space-y-3">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 rounded-lg bg-neutral-50 border border-border">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton width={40} height={40} borderRadius={6} />
                    <div>
                      <Skeleton width={130} height={16} />
                      <Skeleton width={180} height={12} className="mt-2" />
                    </div>
                  </div>
                  <Skeleton width={120} height={34} borderRadius={6} />
                </div>
              </div>
            ))}

            {!isLoading && projects.length === 0 && (
              <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
                <KeyRound size={24} className="mx-auto text-neutral-300 mb-3" />
                <h3 className="text-sm font-bold text-black">No project keys yet</h3>
                <p className="mt-1 text-[12px] text-neutral-500">Create a project and its runtime key will appear here.</p>
              </div>
            )}

            {!isLoading && projects.map((project) => {
              const isRevealed = revealedProjectIds.has(project.id);

              return (
                <div key={project.id} className="p-4 rounded-lg bg-neutral-50 border border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded bg-white border border-border flex items-center justify-center shrink-0">
                      <Lock size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{project.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{project.domain}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <code className="font-mono text-[12px] tracking-wider text-neutral-700 break-all">
                      {isRevealed ? project.projectKey : maskKey(project.projectKey)}
                    </code>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleProjectKey(project.id)}>
                        {isRevealed ? 'Hide' : 'Reveal'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyValue(project.id, project.projectKey)}>
                        <Copy size={13} className="mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  {copied === project.id && <p className="text-[12px] font-medium text-green-600 md:absolute">Project key copied.</p>}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Security" description="Authentication settings for your account.">
          <div className="flex items-start gap-4 rounded-lg border border-border bg-neutral-50 p-4">
            <div className="w-10 h-10 rounded bg-white border border-border flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Password authentication</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Your account is protected by email and password. Two-factor authentication is not available in this backend yet.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Subscription" description="Billing data has not been connected yet.">
          <div className="flex items-start gap-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-4">
            <div className="w-10 h-10 rounded bg-white border border-border flex items-center justify-center shrink-0">
              <CreditCard size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">No billing provider connected</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Plan, invoice, and payment controls will appear here once a billing integration is added.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Danger Zone" className="border-red-100 shadow-none bg-red-50/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-red-950">Delete Account</p>
              <p className="text-xs text-red-900/60 leading-relaxed">
                Account deletion is not connected to a backend endpoint yet.
              </p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" disabled>
              <Trash2 size={14} className="mr-2" />
              Delete
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
