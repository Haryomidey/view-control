import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Input, Dialog } from '../../../components/ui';
import { Plus, Search, ExternalLink, Globe, Trash2, AlertCircle } from 'lucide-react';
import { projects } from '../../../lib/data';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchParams.get('addProject') === 'true') {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const closeAddProject = () => {
    setIsAddOpen(false);

    if (searchParams.has('addProject')) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete('addProject');
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const handleDeleteClick = (project: any) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would be an API call
    setIsDeleteOpen(false);
    setSelectedProject(null);
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

      {/* Add Project Dialog */}
      <Dialog isOpen={isAddOpen} onClose={closeAddProject} title="Register New Project">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Project Name</label>
            <Input placeholder="Marketing Site" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Domain</label>
            <Input placeholder="example.com" />
          </div>
          <Button className="w-full mt-4" onClick={closeAddProject}>Add Project</Button>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
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

          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Important Note</p>
            <p className="text-[12px] text-neutral-600 leading-relaxed">
              Deletions only remove the project from the ViewControl dashboard. 
              <span className="font-bold text-black"> Your source code and deployments </span> 
              on platforms like <span className="underline italic">GitHub</span>, 
              <span className="underline italic">Vercel</span>, or 
              <span className="underline italic">Render</span> will not be affected.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={confirmDelete}
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
                    onClick={() => handleDeleteClick(project)}
                    className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-base md:text-lg">{project.name}</h3>
                <p className="text-[12px] md:text-sm text-neutral-500 flex items-center gap-1.5">
                  {project.domain}
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <div className="text-[9px] md:text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                  Updated {project.lastUpdated.split('T')[0]}
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

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-dashed border-neutral-200 rounded-lg">
          <Globe size={48} className="text-neutral-100 mb-4" />
          <h3 className="font-bold text-neutral-400">No projects found</h3>
          <p className="text-neutral-400 text-sm">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
};
