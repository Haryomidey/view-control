import React from 'react';
import { Card, Button, Input, useToast } from '../../../components/ui';
import { 
  Search, 
  Filter, 
  Download,
  Calendar
} from 'lucide-react';
import { ActivityLog } from '../../../types';

export const Activity: React.FC = () => {
  const toast = useToast();
  const [activities] = React.useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? activity.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const toggleTypeFilter = () => {
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
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-1 sm:flex-none"
                onClick={() => toast.info('Date filter coming soon', 'This will open a calendar overlay for narrowing activity history.')}
              >
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
          {filteredActivities.length === 0 && (
            <div className="px-4 py-12 text-center md:px-6">
              <h3 className="text-sm font-bold text-black">No activity yet</h3>
              <p className="mt-1 text-[12px] text-neutral-500">Project events will appear here after controls or banners are used.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 border-t border-border flex justify-center">
           <Button variant="ghost" size="sm" className="text-xs">Load More History</Button>
        </div>
      </Card>
    </div>
  );
};
