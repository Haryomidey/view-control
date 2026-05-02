import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Card, Button, Input, Switch, Dialog, useToast, Badge } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { 
  Zap, 
  MousePointer2, 
  EyeOff, 
  Eye, 
  Type, 
  Layers,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';
import { ApiControl, ApiProject, controlsApi, getApiErrorMessage, projectsApi } from '../../../lib/api';

const ProjectDropdown: React.FC<{
  projects: ApiProject[];
  selectedProjectId: string;
  onChange: (projectId: string) => void;
  isLoading: boolean;
}> = ({ projects, selectedProjectId, onChange, isLoading }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const filteredProjects = projects.filter((project) => {
    const value = `${project.name} ${project.domain}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  if (isLoading) {
    return (
      <div className="p-3 border border-border rounded-lg">
        <Skeleton width="55%" height={14} />
        <Skeleton width="70%" height={11} className="mt-2" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-[12px] text-neutral-500">Create a project before saving controls.</p>;
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="w-full p-3 text-left border border-border rounded-lg transition-all hover:border-neutral-300 bg-white"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] md:text-xs font-bold truncate">{selectedProject?.name || 'Select project'}</p>
            <p className="text-[10px] text-neutral-500 truncate">{selectedProject?.domain || 'Choose where this control applies'}</p>
          </div>
          <span className={cn("text-neutral-400 text-xs transition-transform", isOpen && "rotate-180")}>⌄</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-border bg-white shadow-premium">
          <div className="p-2 border-b border-border">
            <Input
              autoFocus
              placeholder="Search projects..."
              className="h-8 text-[12px]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onChange(project.id);
                  setIsOpen(false);
                  setQuery('');
                }}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left transition-colors",
                  selectedProjectId === project.id ? "bg-neutral-50 text-black" : "hover:bg-neutral-50 text-neutral-600"
                )}
              >
                <p className="text-[12px] font-bold truncate">{project.name}</p>
                <p className="text-[10px] text-neutral-500 truncate">{project.domain}</p>
              </button>
            ))}
            {filteredProjects.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="text-[12px] font-medium text-neutral-500">No matching projects</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Controls: React.FC = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState<'build' | 'preview'>('build');
  const [selectedAction, setSelectedAction] = useState<ApiControl['action']>('hide');
  const [ruleName, setRuleName] = useState('');
  const [selector, setSelector] = useState('');
  const [pathPattern, setPathPattern] = useState('*');
  const [value, setValue] = useState('');
  const [isActiveInstantly, setIsActiveInstantly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [isNewControlOpen, setIsNewControlOpen] = useState(false);
  const [savedControls, setSavedControls] = useState<ApiControl[]>([]);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  React.useEffect(() => {
    let isMounted = true;

    projectsApi.list()
      .then((items) => {
        if (isMounted) {
          setProjects(items);
          setSelectedProjectId((current) => current || items[0]?.id || '');
        }
      })
      .catch((err) => toast.error('Unable to load projects', getApiErrorMessage(err)))
      .finally(() => {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [toast]);

  React.useEffect(() => {
    if (!selectedProjectId) {
      setSavedControls([]);
      return;
    }

    let isMounted = true;
    setIsLoadingControls(true);

    controlsApi.list(selectedProjectId)
      .then((items) => {
        if (isMounted) {
          setSavedControls(items);
        }
      })
      .catch((err) => toast.error('Unable to load controls', getApiErrorMessage(err)))
      .finally(() => {
        if (isMounted) {
          setIsLoadingControls(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId, toast]);

  const handleSave = async () => {
    if (!selectedProjectId || !ruleName || !selector) {
      toast.warning('Missing control details', 'Choose a project, name the rule, and add a selector.');
      return;
    }

    setIsSaving(true);

    try {
      const control = await controlsApi.create({
        projectId: selectedProjectId,
        name: ruleName,
        selector,
        action: selectedAction,
        pathPattern: pathPattern || '*',
        value: value || null,
        isActive: isActiveInstantly,
      });
      setSavedControls((items) => [control, ...items]);
      setRuleName('');
      setSelector('');
      setPathPattern('*');
      setValue('');
      toast.success('Control rule saved', 'Your visibility rule is active on the selected project.');
    } catch (err) {
      toast.error('Unable to save control', getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const previewPayload = {
    project: selectedProject ? {
      id: selectedProject.id,
      key: selectedProject.projectKey,
      name: selectedProject.name,
      domain: selectedProject.domain,
    } : {
      id: 'PROJECT_ID',
      key: 'PROJECT_KEY',
      name: 'Select a project',
      domain: 'example.com',
    },
    projectId: selectedProjectId || 'PROJECT_ID',
    name: ruleName || 'Untitled control',
    selector: selector || '.hero-title',
    pathPattern,
    action: selectedAction,
    value: value || null,
    isActive: isActiveInstantly,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Control Builder</h1>
          <p className="text-neutral-500 text-[13px] md:text-sm mt-1">Design real-time visibility and content rules for your site.</p>
        </div>
        <Button size="sm" onClick={() => setIsNewControlOpen(true)} className="w-full sm:w-auto">+ New Control</Button>
      </div>

      <Dialog 
        isOpen={isNewControlOpen} 
        onClose={() => setIsNewControlOpen(false)} 
        title="Create New Control"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Rule Name</label>
            <Input placeholder="e.g., Hide Pricing Banner" value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Target Selector</label>
            <Input placeholder=".hero-banner" className="font-mono" value={selector} onChange={(event) => setSelector(event.target.value)} />
          </div>
          <Button className="w-full mt-4" onClick={() => setIsNewControlOpen(false)}>Use Details</Button>
        </div>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Builder Panel */}
        <div className="lg:col-span-3 space-y-6">
          <Card title="Quick Configuration" description="Configure your selector and action below.">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Target Project</label>
                <ProjectDropdown
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onChange={setSelectedProjectId}
                  isLoading={isLoadingProjects}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Rule Name</label>
                <Input placeholder="e.g. Hide hero banner" value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Page Path</label>
                <div className="flex bg-neutral-50 border border-border rounded-lg overflow-hidden h-10 px-3 items-center">
                  <span className="text-neutral-400 text-sm">/</span>
                  <input 
                    type="text" 
                    placeholder="e.g. pricing, blog/*" 
                    className="flex-1 bg-transparent border-none outline-none pl-1 text-[13px] md:text-sm font-mono"
                    value={pathPattern === '*' ? '' : pathPattern.replace(/^\//, '')}
                    onChange={(event) => setPathPattern(event.target.value ? `/${event.target.value.replace(/^\//, '')}` : '*')}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">CSS Selector</label>
                <div className="relative">
                  <Input placeholder=".hero-title, #cta-button" className="font-mono pl-9 text-[13px] md:text-sm" value={selector} onChange={(event) => setSelector(event.target.value)} />
                  <MousePointer2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Action</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {([
                    { id: 'hide', icon: EyeOff, label: 'Hide' },
                    { id: 'show', icon: Eye, label: 'Show' },
                    { id: 'opacity', icon: Layers, label: 'Opacity' },
                    { id: 'text', icon: Type, label: 'Add Text' },
                    { id: 'replace', icon: Type, label: 'Replace' },
                    { id: 'display', icon: Zap, label: 'Display' },
                  ] as Array<{ id: ApiControl['action']; icon: React.ElementType; label: string }>).map((action) => (
                    <button 
                      key={action.id} 
                      onClick={() => setSelectedAction(action.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 border rounded-lg text-[12px] md:text-xs transition-colors",
                        selectedAction === action.id ? "bg-black text-white border-black" : "border-border hover:bg-neutral-50"
                      )}
                    >
                      <action.icon size={14} className={selectedAction === action.id ? "text-white" : "text-neutral-400"} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {['text', 'replace', 'opacity', 'display'].includes(selectedAction) && (
                <div className="space-y-3">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Value</label>
                  <Input placeholder="Replacement text, opacity, or display value" value={value} onChange={(event) => setValue(event.target.value)} />
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border mt-6 md:mt-8">
                <Switch label="Active instantly on save" checked={isActiveInstantly} onChange={setIsActiveInstantly} />
                <Button className="h-10 px-8 w-full sm:w-auto" onClick={handleSave} isLoading={isSaving}>
                  {!isSaving && <Save size={14} className="mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Rule'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Simulation */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="flex bg-neutral-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('build')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                  activeTab === 'build' ? "bg-white shadow-subtle text-black" : "text-neutral-500"
                )}
              >
                Simulation
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                  activeTab === 'preview' ? "bg-white shadow-subtle text-black" : "text-neutral-500"
                )}
              >
                Full JSON
              </button>
            </div>

            <Card className="min-h-100 flex flex-col p-0">
              {activeTab === 'build' ? (
                <>
                  <div className="bg-neutral-50 border-b border-border p-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    </div>
                    <div className="flex-1 px-2 py-1 bg-white border border-border rounded text-[10px] text-neutral-400 font-mono truncate">
                      https://viewcontrol.dev/demo/hero
                    </div>
                  </div>

                  <div className="flex-1 p-8 bg-neutral-50/30 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                    <div className="w-full max-w-60 space-y-4">
                      <div className="h-4 w-3/4 bg-neutral-200 rounded mx-auto" />
                      <div className="h-8 w-full bg-black rounded" id="sim-hero" />
                      <div className="h-3 w-1/2 bg-neutral-200 rounded mx-auto" />
                      <div className="h-10 w-2/3 bg-neutral-200 rounded mx-auto" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border-2 border-dashed border-black m-6 pointer-events-none flex items-center justify-center"
                    >
                      <div className="absolute top-0 left-0 bg-black text-white text-[8px] font-mono px-1.5 py-0.5 uppercase tracking-tighter">
                        {selector || '#hero-title'}
                      </div>
                    </motion.div>
                  </div>
                </>
              ) : (
                <div className="flex-1 bg-neutral-950 p-4 overflow-auto">
                  <pre className="text-[11px] leading-relaxed text-neutral-100 font-mono whitespace-pre-wrap">
                    {JSON.stringify(previewPayload, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Card title="Saved Controls" description={selectedProject ? `Controls for ${selectedProject.name}` : 'Select a project to view controls.'}>
        <div className="space-y-3">
          {isLoadingControls && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <Skeleton width="35%" height={16} />
              <Skeleton width="65%" height={12} className="mt-3" />
            </div>
          ))}

          {!isLoadingControls && savedControls.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center">
              <h3 className="text-sm font-bold text-black">No controls yet</h3>
              <p className="mt-1 text-[12px] text-neutral-500">Saved controls for this project will appear here.</p>
            </div>
          )}

          {!isLoadingControls && savedControls.map((control) => (
            <div key={control.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[14px] font-bold text-black">{control.name}</h3>
                    <Badge variant={control.isActive ? 'success' : 'neutral'}>{control.isActive ? 'Active' : 'Paused'}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-[12px] text-neutral-500 md:grid-cols-2">
                    <p className="min-w-0">
                      <span className="font-bold text-neutral-700">Selector:</span>{' '}
                      <code className="break-all">{control.selector}</code>
                    </p>
                    <p>
                      <span className="font-bold text-neutral-700">Path:</span>{' '}
                      <code>{control.pathPattern}</code>
                    </p>
                    <p>
                      <span className="font-bold text-neutral-700">Action:</span> {control.action}
                    </p>
                    <p className="min-w-0">
                      <span className="font-bold text-neutral-700">Value:</span>{' '}
                      <span className="break-all">{control.value == null || control.value === '' ? 'None' : String(control.value)}</span>
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-neutral-400">
                  {new Date(control.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
