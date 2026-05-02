import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { Card, Button } from '../../../components/ui';
import { ArrowUpRight, Globe, Zap, Terminal } from 'lucide-react';
import { bannersApi, controlsApi, projectsApi } from '../../../lib/api';
import { ActivityLog } from '../../../types';

const StatCard = ({ title, value, change, isLoading }: any) => (
  <Card className="flex flex-col gap-1 border-border">
    <div className="flex items-center justify-between">
      <div className="stat-label text-neutral-500 font-bold tracking-widest uppercase text-[10px]">{title}</div>
      <div className="text-[10px] font-bold text-neutral-400">+{change}%</div>
    </div>
    <div className="mt-2">
      {isLoading ? <Skeleton width={48} height={32} /> : <h3 className="text-[24px] font-bold tracking-tight text-black">{value}</h3>}
    </div>
  </Card>
);

export const Overview: React.FC = () => {
  const [activities] = React.useState<ActivityLog[]>([]);
  const [stats, setStats] = React.useState({
    projects: 0,
    controls: 0,
    liveRules: 0,
    banners: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    Promise.all([projectsApi.list(), controlsApi.list(), bannersApi.list()])
      .then(([projects, controls, banners]) => {
        if (isMounted) {
          setStats({
            projects: projects.length,
            controls: controls.length,
            liveRules: controls.filter((control) => control.isActive).length,
            banners: banners.filter((banner) => banner.isActive).length,
          });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 h-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Projects" value={stats.projects} change="0" icon={Globe} isLoading={isLoadingStats} />
        <StatCard title="Active Controls" value={stats.controls} change="0" icon={Zap} isLoading={isLoadingStats} />
        <StatCard title="Live Rules" value={stats.liveRules} change="0" icon={Terminal} isLoading={isLoadingStats} />
        <StatCard title="Banners" value={stats.banners} change="0" icon={ArrowUpRight} isLoading={isLoadingStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base md:text-lg font-bold tracking-tight">Recent Activity</h2>
              <p className="text-[12px] md:text-sm text-neutral-500">Currently active element injections</p>
            </div>
            <Link to="/dashboard/controls" className="w-fit">
              <Button size="sm">+ New Control</Button>
            </Link>
          </div>

          <Card className="p-0 border-border">
            <div className="divide-y divide-border">
              {activities.length === 0 && (
                <div className="px-4 py-10 text-center md:px-6">
                  <h3 className="text-sm font-bold text-black">No recent activity</h3>
                  <p className="mt-1 text-[12px] text-neutral-500">Activity from project changes and runtime events will show here.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-base md:text-lg font-bold tracking-tight">Quick Install</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-neutral-50 border border-border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">CDN Script</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase cursor-pointer hover:text-black">Copy</span>
              </div>
              <code className="text-[11px] md:text-[12px] break-all block text-neutral-800 leading-relaxed font-mono">
                &lt;script src="https://cdn.viewcontrol.dev/v1.js" data-id="project-key"&gt;&lt;/script&gt;
              </code>
            </div>

            <div className="bg-neutral-50 border border-border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Package</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase cursor-pointer hover:text-black">Copy</span>
              </div>
              <code className="text-[11px] md:text-[12px] block text-neutral-800 font-mono">npm install @viewcontrol/runtime</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
