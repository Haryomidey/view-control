import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Settings, 
  Zap, 
  Terminal, 
  Bell, 
  Code2, 
  Box, 
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  History,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, Input } from '../ui';
import { ApiProject, ApiUser, AUTH_USER_KEY, authApi, projectsApi } from '../../lib/api';
import { BrandMark } from '../BrandMark';

const sidebarLinks = [
  { name: 'Overview', icon: BarChart3, path: '/dashboard' },
  { name: 'Projects', icon: Box, path: '/dashboard/projects' },
  { name: 'Controls', icon: Zap, path: '/dashboard/controls' },
  { name: 'Rules', icon: Terminal, path: '/dashboard/rules' },
  { name: 'Banners', icon: Bell, path: '/dashboard/banners' },
  { name: 'Activity', icon: History, path: '/dashboard/activity' },
  { name: 'Install', icon: Code2, path: '/dashboard/install' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const getStoredUser = (): ApiUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) as ApiUser : null;
  } catch {
    return null;
  }
};

const getInitials = (user: ApiUser | null) => {
  const source = user?.name?.trim() || user?.email?.trim() || 'VC';
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [selectedProject, setSelectedProject] = useState("No project selected");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(getStoredUser);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    authApi.me()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
        }
      })
      .catch(() => undefined);

    projectsApi.list()
      .then((items) => {
        if (isMounted) {
          setProjects(items);
          setSelectedProject(items[0]?.domain || 'No project selected');
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjects([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddProject = () => {
    setIsProjectDropdownOpen(false);
    navigate('/dashboard/projects?addProject=true');
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Search Palette Dialog */}
      <Dialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        title="Global Search"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <Input 
              autoFocus
              placeholder="Search across projects, rules, and activity..." 
              className="pl-10 h-14 text-base" 
            />
          </div>
          <div className="space-y-1 max-h-75 overflow-y-auto">
             <div className="px-2 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Available Actions</div>
             {sidebarLinks.map(link => (
               <NavLink 
                 key={link.path}
                 to={link.path}
                 end={link.path === '/dashboard'}
                 onClick={() => setIsSearchOpen(false)}
                 className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium text-black"
               >
                 <div className="flex items-center gap-3">
                    <link.icon size={16} className="text-neutral-400" />
                    {link.name}
                 </div>
                 <ChevronRight size={14} className="text-neutral-300" />
               </NavLink>
             ))}
          </div>
        </div>
      </Dialog>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border h-screen py-6 px-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <BrandMark />
          <span className="font-bold text-[18px] tracking-[-0.03em]">ViewControl</span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all duration-200 text-[13px]",
                isActive 
                  ? "bg-black text-white" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
              )}
            >
              <link.icon size={16} />
              {link.name}
            </NavLink>
          ))}
          
        </nav>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-border z-50 md:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <BrandMark />
                  <span className="font-bold text-[18px] tracking-[-0.03em]">ViewControl</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-500">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {sidebarLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/dashboard'}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all duration-200 text-[13px]",
                      isActive 
                        ? "bg-black text-white" 
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 border-b border-border bg-white sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-neutral-500"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center relative min-w-0">
              <div 
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center gap-2 px-2 md:px-3 py-1.5 border border-border rounded-md text-[12px] md:text-[13px] font-medium cursor-pointer hover:bg-neutral-50 transition-colors truncate"
              >
                 <span className="truncate">{selectedProject}</span>
                 <ChevronDown size={12} className={cn("opacity-50 shrink-0 transition-transform", isProjectDropdownOpen && "rotate-180")} />
               </div>

               {/* Project Dropdown */}
               <AnimatePresence>
                 {isProjectDropdownOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsProjectDropdownOpen(false)} />
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute top-full left-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-premium z-20 overflow-hidden"
                     >
                       <div className="p-2 space-y-1">
                         {projects.map((p) => (
                           <button
                             key={p.id}
                             onClick={() => {
                               setSelectedProject(p.domain);
                               setIsProjectDropdownOpen(false);
                             }}
                             className={cn(
                               "w-full text-left px-3 py-2 text-[13px] hover:bg-neutral-50 rounded-md transition-colors font-medium",
                               selectedProject === p.domain ? "bg-neutral-50 text-black font-bold" : "text-neutral-500"
                             )}
                           >
                             {p.domain}
                           </button>
                         ))}
                         <button
                           onClick={handleAddProject}
                           className="w-full text-left px-3 py-2 text-[13px] hover:bg-neutral-50 rounded-md border-t border-border mt-1 pt-2 text-neutral-400"
                         >
                           + Add Project
                         </button>
                       </div>
                     </motion.div>
                   </>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-neutral-400 cursor-pointer hover:text-black transition-colors hidden sm:block p-1"
            >
              <Search size={18} />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              title={user?.name || user?.email || 'ViewControl user'}
              aria-label={user?.name || user?.email || 'ViewControl user'}
            >
              {getInitials(user)}
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-400 cursor-pointer hover:text-black transition-colors p-1"
              title="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <div ref={scrollContainerRef} className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
