import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../../../components/ui';
import { ArrowUpRight, Globe, Zap, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { activities } from '../../../lib/data';

const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <Card className="flex flex-col gap-1 border-border">
    <div className="flex items-center justify-between">
      <div className="stat-label text-neutral-500 font-bold tracking-widest uppercase text-[10px]">{title}</div>
      <div className="text-[10px] font-bold text-neutral-400">+{change}%</div>
    </div>
    <div className="mt-2">
      <h3 className="text-[24px] font-bold tracking-tight text-black">{value}</h3>
    </div>
  </Card>
);

export const Overview: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 h-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Projects" value="12" change="4" icon={Globe} />
        <StatCard title="Active Controls" value="48" change="12" icon={Zap} />
        <StatCard title="Live Rules" value="142" change="2" icon={Terminal} />
        <StatCard title="Last 24h" value="842k" change="8" icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base md:text-lg font-bold tracking-tight">Recent Activity</h2>
              <p className="text-[12px] md:text-sm text-neutral-500">Currently active element injections</p>
            </div>
            <Link to="/controls" className="w-fit">
              <Button size="sm">+ New Control</Button>
            </Link>
          </div>
          
          <Card className="p-0 border-border">
            <div className="divide-y divide-border">
              {activities.slice(0, 4).map((activity, i) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={activity.id} 
                  className="px-4 py-3 md:px-6 md:py-4 flex items-start gap-3 md:gap-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] md:text-[13px] font-medium leading-tight">{activity.message}</p>
                    <p className="text-[10px] md:text-[11px] text-neutral-400 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • by System
                    </p>
                  </div>
                </motion.div>
              ))}
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
                  &lt;script src="https://cdn.viewcontrol.dev/v1.js" data-id="vc_4812x"&gt;&lt;/script&gt;
                </code>
             </div>

             <div className="bg-neutral-50 border border-border rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Package</span>
                   <span className="text-[10px] font-bold text-neutral-400 uppercase cursor-pointer hover:text-black">Copy</span>
                </div>
                <code className="text-[11px] md:text-[12px] block text-neutral-800 font-mono">npm install viewcontrol</code>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
