import React from 'react';
import { Card, Button, Badge, Input } from '../components/ui';
import { 
  Zap, 
  Bell, 
  Globe, 
  Search, 
  Filter, 
  Download,
  Terminal,
  Calendar
} from 'lucide-react';
import { activities } from '../lib/data';
import { motion } from 'motion/react';

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'rule': return <Zap size={14} className="text-black" />;
    case 'banner': return <Bell size={14} className="text-black" />;
    case 'system': return <Globe size={14} className="text-black" />;
    default: return <Terminal size={14} className="text-black" />;
  }
};

export const Activity: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? activity.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const toggleTypeFilter = () => {
    // Basic cycle through types for demo purposes
    const types = [null, 'rule', 'banner', 'system'];
    const currentIndex = types.indexOf(typeFilter as any);
    const nextIndex = (currentIndex + 1) % types.length;
    setTypeFilter(types[nextIndex] as any);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Activity Log</h1>
          <p className="text-neutral-500 text-[12px] md:text-sm mt-1">Audit trail of all changes made via ViewControl.</p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download size={14} className="mr-2" />
          Download Logs
        </Button>
      </div>

      <Card className="p-0 border-border bg-white shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <Input 
                placeholder="Filter activity..." 
                className="pl-9 h-9 text-[13px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-none" onClick={() => alert("Date filtering usually opens a calendar overlay.")}>
                <Calendar size={14} className="mr-2" />
                Date
              </Button>
              <Button 
                variant={typeFilter ? "primary" : "outline"} 
                size="sm" 
                className="h-9 flex-1 sm:flex-none"
                onClick={toggleTypeFilter}
              >
                <Filter size={14} className="mr-2" />
                {typeFilter ? `Type: ${typeFilter}` : "All Types"}
              </Button>
           </div>
        </div>

        <div className="divide-y divide-border">
          {filteredActivities.map((activity, i) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={activity.id} 
              className="p-4 md:p-6 flex gap-4 md:gap-6 group hover:bg-neutral-50/50 transition-colors"
            >
              <div className="shrink-0">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-neutral-100 flex items-center justify-center border border-border group-hover:border-neutral-300 transition-colors">
                  <ActivityIcon type={activity.type} />
                </div>
              </div>
              
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <h4 className="text-[13px] md:text-sm font-bold truncate">{activity.message}</h4>
                  <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-neutral-200" />
                    <span className="text-[10px] md:text-[11px] text-neutral-500 font-medium">User: Janus S.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-neutral-200" />
                    <Badge variant="neutral">API-V2</Badge>
                  </div>
                </div>
                
                {activity.type === 'rule' && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded border border-border">
                    <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mb-2">Payload Diff</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] text-neutral-400">Previous</p>
                          <code className="text-[10px] md:text-[11px] text-neutral-600 block truncate font-mono">{"{ status: 'active' }"}</code>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-neutral-400">New</p>
                          <code className="text-[10px] md:text-[11px] text-neutral-950 font-bold block truncate font-mono">{"{ status: 'disabled' }"}</code>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-4 md:p-6 border-t border-border flex justify-center">
           <Button variant="ghost" size="sm" className="text-xs">Load More History</Button>
        </div>
      </Card>
    </div>
  );
};
