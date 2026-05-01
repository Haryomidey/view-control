import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input, Switch, Badge } from '../../../components/ui';
import { Search, Filter, MoreHorizontal, Terminal, Zap, Layers, Type, EyeOff } from 'lucide-react';
import { rules } from '../../../lib/data';
import { motion } from 'motion/react';

const ActionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'hide': return <EyeOff size={14} />;
    case 'opacity': return <Layers size={14} />;
    case 'replace_text': return <Type size={14} />;
    case 'display': return <Zap size={14} />;
    default: return <Terminal size={14} />;
  }
};

export const Rules: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredRules = rules.filter(rule => 
    rule.selector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-black">Active Controls</h1>
          <p className="text-neutral-500 text-[12px] md:text-[13px] mt-1">Currently active element injections across your sites.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <Input 
              placeholder="Search rules..." 
              className="pl-9 h-9 text-[13px] w-full sm:w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Export</Button>
            <Link to="/controls" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full">+ New Control</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-border bg-neutral-50/30">
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Selector</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Action</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Target Page</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Status</th>
                <th className="px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#666]">Updated</th>
                <th className="px-4 md:px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={rule.id} 
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/30 transition-colors group"
                >
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <code className="text-[12px] md:text-[13px] font-mono text-black">{rule.selector}</code>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <span className="text-[12px] md:text-[13px] font-medium text-neutral-900">{rule.action.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <code className="text-[11px] md:text-[13px] font-mono text-neutral-500">{rule.path}</code>
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4">
                    <Switch checked={rule.enabled} />
                  </td>
                  <td className="px-4 md:px-5 py-3 md:py-4 text-[11px] md:text-[13px] text-neutral-400">
                    {rule.lastUpdated}
                  </td>
                  <td className="px-4 md:px-5 py-2 md:py-4 text-right">
                    <button className="text-neutral-300 hover:text-black transition-colors p-1">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
