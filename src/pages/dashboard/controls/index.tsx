import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Card, Button, Input, Switch, Dialog, useToast } from '../../../components/ui';
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
  const [isNewControlOpen, setIsNewControlOpen] = useState(false);

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

  const handleSave = async () => {
    if (!selectedProjectId || !ruleName || !selector) {
      toast.warning('Missing control details', 'Choose a project, name the rule, and add a selector.');
      return;
    }

    setIsSaving(true);

    try {
      await controlsApi.create({
        projectId: selectedProjectId,
        name: ruleName,
        selector,
        action: selectedAction,
        pathPattern: pathPattern || '*',
        value: value || null,
        isActive: isActiveInstantly,
      });
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {isLoadingProjects && Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <Skeleton width="55%" height={14} />
                      <Skeleton width="70%" height={11} className="mt-2" />
                    </div>
                  ))}
                  {projects.slice(0, 2).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={cn(
                        "p-3 text-left border rounded-lg transition-all",
                        selectedProjectId === p.id 
                          ? "border-black bg-neutral-50" 
                          : "border-border hover:border-neutral-300"
                      )}
                    >
                      <p className="text-[12px] md:text-xs font-bold">{p.name}</p>
                      <p className="text-[10px] text-neutral-500">{p.domain}</p>
                    </button>
                  ))}
                </div>
                {!isLoadingProjects && projects.length === 0 && <p className="text-[12px] text-neutral-500">Create a project before saving controls.</p>}
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
                  {/* Mock Website Elements */}
                  <div className="w-full max-w-60 space-y-4">
                    <div className="h-4 w-3/4 bg-neutral-200 rounded mx-auto" />
                    <div className="h-8 w-full bg-black rounded" id="sim-hero" />
                    <div className="h-3 w-1/2 bg-neutral-200 rounded mx-auto" />
                    <div className="h-10 w-2/3 bg-neutral-200 rounded mx-auto" />
                  </div>

                  {/* Overlay indicating selection */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-dashed border-black m-6 pointer-events-none flex items-center justify-center"
                  >
                    <div className="absolute top-0 left-0 bg-black text-white text-[8px] font-mono px-1.5 py-0.5 uppercase tracking-tighter">
                      #hero-title
                    </div>
                  </motion.div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
