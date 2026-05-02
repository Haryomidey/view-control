import React from 'react';
import { createPortal } from 'react-dom';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { Button, Input, Switch, Dialog, useToast } from '../../../components/ui';
import { Search, MoreHorizontal, Terminal, Zap, Layers, Type, EyeOff, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ApiControl, getApiErrorMessage, controlsApi, projectsApi } from '../../../lib/api';

const ActionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'hide': return <EyeOff size={14} />;
    case 'opacity': return <Layers size={14} />;
    case 'replace_text': return <Type size={14} />;
    case 'display': return <Zap size={14} />;
    default: return <Terminal size={14} />;
  }
};

const controlActions: ApiControl['action'][] = ['hide', 'show', 'text', 'replace', 'html', 'opacity', 'display', 'class', 'style'];

const ControlActionsMenu: React.FC<{
  rule: ApiControl;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (rule: ApiControl) => void;
  onDelete: (rule: ApiControl) => void;
}> = ({ rule, isOpen, onToggle, onEdit, onDelete }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setPosition({
        top: rect.bottom + 6,
        left: Math.max(12, rect.right - 152),
      });
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        onToggle();
      }
    };

    updatePosition();
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, onToggle]);

  const menu = (
    <div
      className="fixed z-[110] w-38 overflow-hidden rounded-lg border border-border bg-white p-1 text-left shadow-premium"
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black"
        onClick={() => onEdit(rule)}
      >
        <Pencil size={13} />
        Edit
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
        onClick={() => onDelete(rule)}
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>
  );

  return (
    <div className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className="rounded-md p-1.5 text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-black"
        onClick={onToggle}
        aria-label={`Open actions for ${rule.name}`}
        aria-expanded={isOpen}
      >
        <MoreHorizontal size={14} />
      </button>

      {isOpen && typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </div>
  );
};

export const Rules: React.FC = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rules, setRules] = React.useState<ApiControl[]>([]);
  const [projectNames, setProjectNames] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [openMenuId, setOpenMenuId] = React.useState('');
  const [editingRule, setEditingRule] = React.useState<ApiControl | null>(null);
  const [deletingRule, setDeletingRule] = React.useState<ApiControl | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editSelector, setEditSelector] = React.useState('');
  const [editPathPattern, setEditPathPattern] = React.useState('*');
  const [editAction, setEditAction] = React.useState<ApiControl['action']>('hide');
  const [editValue, setEditValue] = React.useState('');
  const [editIsActive, setEditIsActive] = React.useState(true);
  const [isMutating, setIsMutating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    Promise.all([controlsApi.list(), projectsApi.list()])
      .then(([controls, projects]) => {
        if (isMounted) {
          setRules(controls);
          setProjectNames(Object.fromEntries(projects.map((project) => [project.id, project.name])));
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Unable to load controls.'));
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

  const toggleRule = async (rule: ApiControl, checked: boolean) => {
    setRules((items) => items.map((item) => item.id === rule.id ? { ...item, isActive: checked } : item));

    try {
      const updated = await controlsApi.update(rule.id, { isActive: checked });
      setRules((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (err) {
      setRules((items) => items.map((item) => item.id === rule.id ? rule : item));
      setError(getApiErrorMessage(err, 'Unable to update control.'));
    }
  };

  const openEditDialog = (rule: ApiControl) => {
    setOpenMenuId('');
    setEditingRule(rule);
    setEditName(rule.name);
    setEditSelector(rule.selector);
    setEditPathPattern(rule.pathPattern || '*');
    setEditAction(rule.action);
    setEditValue(rule.value == null ? '' : String(rule.value));
    setEditIsActive(rule.isActive);
    setError('');
  };

  const openDeleteDialog = (rule: ApiControl) => {
    setOpenMenuId('');
    setDeletingRule(rule);
    setError('');
  };

  const closeEditDialog = () => {
    if (isMutating) {
      return;
    }

    setEditingRule(null);
  };

  const closeDeleteDialog = () => {
    if (isMutating) {
      return;
    }

    setDeletingRule(null);
  };

  const saveEdit = async () => {
    if (!editingRule || !editName || !editSelector) {
      setError('Rule name and selector are required.');
      return;
    }

    setIsMutating(true);
    setError('');

    try {
      const updated = await controlsApi.update(editingRule.id, {
        name: editName,
        selector: editSelector,
        pathPattern: editPathPattern || '*',
        action: editAction,
        value: editValue || null,
        isActive: editIsActive,
      });
      setRules((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditingRule(null);
      toast.success('Control updated', `${updated.name} was saved.`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update control.'));
    } finally {
      setIsMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingRule) {
      return;
    }

    setIsMutating(true);
    setError('');

    try {
      await controlsApi.remove(deletingRule.id);
      setRules((items) => items.filter((item) => item.id !== deletingRule.id));
      toast.success('Control deleted', `${deletingRule.name} was removed.`);
      setDeletingRule(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete control.'));
    } finally {
      setIsMutating(false);
    }
  };

  const filteredRules = rules.filter(rule => 
    rule.selector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.pathPattern.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-black">Active Controls</h1>
          <p className="text-neutral-500 text-[12px] md:text-[13px] mt-1">Currently active element injections across your sites.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <Input 
              placeholder="Search rules..." 
              className="pl-9 h-9 text-[13px] w-full sm:w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Export</Button>
            <Link to="/dashboard/controls" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full">+ New Control</Button>
            </Link>
          </div>
        </div>
      </div>

      {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}

      <Dialog isOpen={Boolean(editingRule)} onClose={closeEditDialog} title="Edit Control">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Rule Name</label>
            <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">CSS Selector</label>
            <Input className="font-mono" value={editSelector} onChange={(event) => setEditSelector(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Page Path</label>
            <Input className="font-mono" value={editPathPattern} onChange={(event) => setEditPathPattern(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Action</label>
            <select
              value={editAction}
              onChange={(event) => setEditAction(event.target.value as ApiControl['action'])}
              className="h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-[13px] capitalize transition-all duration-200 focus:border-black focus-visible:outline-none"
            >
              {controlActions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Value</label>
            <Input value={editValue} onChange={(event) => setEditValue(event.target.value)} />
          </div>
          <Switch label="Active" checked={editIsActive} onChange={setEditIsActive} />
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={closeEditDialog} disabled={isMutating}>Cancel</Button>
            <Button className="flex-1" onClick={saveEdit} isLoading={isMutating} disabled={isMutating}>Save Changes</Button>
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={Boolean(deletingRule)} onClose={closeDeleteDialog} title="Delete Control">
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-lg border border-red-100 bg-red-50 p-4 text-red-900">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div className="space-y-2">
              <p className="text-sm font-bold">Delete this control?</p>
              <p className="text-[12px] leading-relaxed opacity-90">
                <span className="font-bold">{deletingRule?.name}</span> will stop applying to the installed site.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={closeDeleteDialog} disabled={isMutating}>Cancel</Button>
            <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete} isLoading={isMutating} disabled={isMutating}>
              <Trash2 size={14} className="mr-2" />
              Delete Control
            </Button>
          </div>
        </div>
      </Dialog>

      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-border bg-neutral-50/30">
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Selector</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Action</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Target Page</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Status</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Updated</th>
                <th className="px-4 md:px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={150} height={16} /></td>
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={90} height={16} /></td>
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={110} height={16} /></td>
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={32} height={18} borderRadius={999} /></td>
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={80} height={16} /></td>
                  <td className="px-4 md:px-5 py-3 md:py-4"><Skeleton width={16} height={16} /></td>
                </tr>
              ))}
              {!isLoading && filteredRules.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center md:px-5">
                    <h3 className="text-sm font-bold text-black">No controls found</h3>
                    <p className="mt-1 text-[12px] text-neutral-500">Create a control rule and it will appear in this table.</p>
                  </td>
                </tr>
              )}
              {filteredRules.map((rule, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={rule.id} 
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/30 transition-colors group"
                >
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <code className="text-[12px] md:text-[13px] font-mono text-black">{rule.selector}</code>
                    <p className="text-[10px] text-neutral-400 mt-1">{projectNames[rule.projectId] || 'Project'}</p>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <span className="inline-flex items-center gap-2 text-[12px] md:text-[13px] font-medium text-neutral-900">
                      <ActionIcon type={rule.action} />
                      {rule.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <code className="text-[11px] md:text-[13px] font-mono text-neutral-500">{rule.pathPattern}</code>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <Switch checked={rule.isActive} onChange={(checked) => toggleRule(rule, checked)} />
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4 text-[11px] md:text-[13px] text-neutral-400">
                    {new Date(rule.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-5 py-2 md:py-4 text-right">
                    <ControlActionsMenu
                      rule={rule}
                      isOpen={openMenuId === rule.id}
                      onToggle={() => setOpenMenuId((id) => id === rule.id ? '' : rule.id)}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
