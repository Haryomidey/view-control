import React from 'react';
import { Card, Button, Input, Switch, Badge } from '../../../components/ui';
import { 
  User, 
  Lock, 
  Trash2, 
  CreditCard, 
  Bell, 
  Globe,
  Copy,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto lg:mx-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">Workspace Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your workspace configuration and billing.</p>
      </div>

      <div className="space-y-6">
        <Card title="General Information" description="How your workspace appears to your team.">
          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Workspace Name</label>
              <Input defaultValue="ViewControl Engineering" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Workspace ID</label>
              <div className="relative">
                <Input defaultValue="ws_9281_viewc" readOnly className="bg-neutral-50 pr-10" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <Button size="sm">Save Changes</Button>
          </div>
        </Card>

        <Card title="Security & API" description="Critical keys for integrating with our API.">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-50 border border-border flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-white border border-border flex items-center justify-center">
                     <Lock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Production API Key</p>
                    <p className="text-xs text-neutral-500">Last used 2 minutes ago</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="font-mono text-sm tracking-widest">{revealed ? 'vc_live_9281_k820_f293_3920' : '••••••••••••••••3920'}</div>
                 <Button variant="outline" size="sm" onClick={() => setRevealed(!revealed)}>
                   {revealed ? 'Hide' : 'Reveal'}
                 </Button>
               </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
               <div className="space-y-0.5">
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-neutral-500">Add an extra layer of security to your account.</p>
               </div>
               <Switch checked={true} />
            </div>
          </div>
        </Card>

        <Card title="Subscription" description="You are currently on the Pro Annual plan.">
           <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-black text-white flex flex-col justify-between h-32 w-56 shadow-premium">
                 <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-widest">VIEWCONTROL</span>
                    <CreditCard size={14} className="opacity-50" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-medium opacity-50 uppercase tracking-tighter">Pro Monthly</p>
                    <p className="text-lg font-bold tracking-tighter">$49.00/mo</p>
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-border rounded-lg">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Invoices</p>
                       <p className="text-xs font-bold font-mono">INV-2024-001</p>
                    </div>
                    <div className="p-3 border border-border rounded-lg">
                       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Next Payment</p>
                       <p className="text-xs font-bold">Apr 24, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Manage Billing Portal <ChevronRight size={14} className="ml-2" /></Button>
              </div>
           </div>
        </Card>

        <Card title="Danger Zone" className="border-red-100 shadow-none bg-red-50/10">
           <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                 <p className="text-sm font-bold text-red-950">Delete Workspace</p>
                 <p className="text-xs text-red-900/60 leading-relaxed">
                   Once you delete a workspace, there is no going back. Please be certain.
                 </p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 size={14} className="mr-2" />
                Delete
              </Button>
           </div>
        </Card>
      </div>
    </div>
  );
};
