import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Card, Button, Badge, Input, Dialog, useToast } from '../../../components/ui';
import { Plus, Search, ExternalLink, Globe, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiProject, getApiErrorMessage, projectsApi } from '../../../lib/api';

const getProjectUrl = (domain: string) => {
  if (/^https?:\/\//i.test(domain)) {
    return domain;
  }

  return `https://${domain}`;
};

export const Projects: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ApiProject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectDomain, setProjectDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchParams.get('addProject') === 'true') {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    projectsApi.list()
      .then((items) => {
        if (isMounted) {
          setProjects(items);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Unable to load projects.'));
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

  const closeAddProject = () => {
    setIsAddOpen(false);

    if (searchParams.has('addProject')) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete('addProject');
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const closeDeleteProject = () => {
    if (isSaving) {
      return;
    }

    setIsDeleteOpen(false);
    setSelectedProject(null);
    setDeleteError('');
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, project: ApiProject) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedProject(project);
    setDeleteError('');
    setIsDeleteOpen(true);
  };

  const createProject = async () => {
    if (!projectName || !projectDomain) {
      setError('Project name and domain are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const project = await projectsApi.create({ name: projectName, domain: projectDomain });
      setProjects((items) => [project, ...items]);
      setProjectName('');
      setProjectDomain('');
      closeAddProject();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create project.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProject) {
      return;
    }

    setIsSaving(true);
    setDeleteError('');

    try {
      await projectsApi.remove(selectedProject.id);
      setProjects((items) => items.filter((project) => project.id !== selectedProject.id));
      setIsDeleteOpen(false);
      setSelectedProject(null);
      toast.success('Project deleted', `${selectedProject.name} was removed from your workspace.`);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, 'Unable to delete project.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Projects</h1>
          <p className="text-neutral-500 text-[13px] md:text-sm mt-1">Manage and monitor your connected websites.</p>
        </div>
        <Button size="sm" onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
          <Plus size={14} className="mr-2" />
          Add Project
        </Button>
      </div>

      {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}

      {/* Add Project Dialog */}
      <Dialog isOpen={isAddOpen} onClose={closeAddProject} title="Register New Project">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Project Name</label>
            <Input placeholder="Marketing Site" value={projectName} onChange={(event) => setProjectName(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Domain</label>
            <Input placeholder="example.com" value={projectDomain} onChange={(event) => setProjectDomain(event.target.value)} />
          </div>
          <Button className="w-full mt-4" onClick={createProject} isLoading={isSaving} disabled={isSaving}>Add Project</Button>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteOpen} 
        onClose={closeDeleteProject} 
        title="Delete Project"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-red-50 text-red-900 rounded-lg border border-red-100">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div className="space-y-2">
              <p className="text-sm font-bold">This action is irreversible.</p>
              <p className="text-[12px] leading-relaxed opacity-90">
                Deleting <span className="font-bold">{selectedProject?.name}</span> will stop all active element injections and banners immediately.
              </p>
            </div>
          </div>

          {deleteError && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{deleteError}</p>}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={closeDeleteProject}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={confirmDelete}
              isLoading={isSaving}
              disabled={isSaving}
            >
              <Trash2 size={14} className="mr-2" />
              Delete Permanently
            </Button>
          </div>
        </div>
      </Dialog>

      <div className="flex items-center gap-3 w-full sm:max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <Input 
            placeholder="Filter projects..." 
            className="pl-9 h-10 text-[13px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading && Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width={40} height={40} borderRadius={4} />
              <Skeleton width={86} height={22} borderRadius={999} />
            </div>
            <Skeleton width="70%" height={22} />
            <Skeleton width="55%" height={16} className="mt-2" />
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
              <Skeleton width={92} height={12} />
              <Skeleton width={76} height={32} borderRadius={6} />
            </div>
          </Card>
        ))}

        {filteredProjects.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={project.id}
          >
            <Card className="hover:border-neutral-400 transition-colors duration-300 group h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-neutral-50 border border-border rounded flex items-center justify-center">
                  <Globe size={18} className="text-neutral-400 group-hover:text-black transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={project.status === 'connected' ? 'success' : 'neutral'}>
                    {project.status}
                  </Badge>
                  <button 
                    onClick={(event) => handleDeleteClick(event, project)}
                    className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                    title="Delete Project"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-base md:text-lg">{project.name}</h3>
                <a
                  href={getProjectUrl(project.domain)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[12px] md:text-sm text-neutral-500 hover:text-black hover:underline flex items-center gap-1.5 w-fit"
                >
                  {project.domain}
                  <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <div className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                  Updated {project.updatedAt.split('T')[0]}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 py-0"
                  onClick={() => navigate('/controls')}
                >
                  Manage
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        <button 
          onClick={() => setIsAddOpen(true)}
          className="border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-neutral-50 transition-colors group min-h-45 md:min-h-40"
        >
          <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-neutral-400 transition-colors">
            <Plus size={18} className="text-neutral-400 group-hover:text-black" />
          </div>
          <span className="text-[13px] md:text-sm font-medium text-neutral-500 group-hover:text-black">Create New Project</span>
        </button>
      </div>

      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-dashed border-neutral-200 rounded-lg">
          <Globe size={48} className="text-neutral-100 mb-4" />
          <h3 className="font-bold text-neutral-400">No projects found</h3>
          <p className="text-neutral-400 text-sm">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
};
