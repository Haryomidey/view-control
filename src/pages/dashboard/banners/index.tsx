import React, { useState } from 'react';
import { Card, Button, Input, Switch, Badge, Dialog } from '../../../components/ui';
import { Search, Bell, Monitor, Smartphone, Plus, ArrowRight, MessageSquare, Layout } from 'lucide-react';
import { banners } from '../../../lib/data';
import { motion } from 'motion/react';

export const Banners: React.FC = () => {
  const [activeBannerId, setActiveBannerId] = useState(banners[0].id);
  const [isNewBannerOpen, setIsNewBannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerMessages, setBannerMessages] = useState<Record<string, string>>(
    Object.fromEntries(banners.map(b => [b.id, b.message]))
  );

  const handleMessageChange = (id: string, newMessage: string) => {
    setBannerMessages(prev => ({ ...prev, [id]: newMessage }));
  };

  const filteredBanners = banners.filter(banner => 
    banner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bannerMessages[banner.id] || banner.message).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBanner = banners.find(b => b.id === activeBannerId) || banners[0];
  const activeMessage = bannerMessages[activeBannerId] || activeBanner.message;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Global Banners</h1>
          <p className="text-neutral-500 text-[12px] md:text-sm mt-1">Inject announcements and notices directly into your client sites.</p>
        </div>
        <Button size="sm" onClick={() => setIsNewBannerOpen(true)} className="w-full sm:w-auto">
          <Plus size={14} className="mr-2" />
          Create Banner
        </Button>
      </div>

      <Dialog 
        isOpen={isNewBannerOpen} 
        onClose={() => setIsNewBannerOpen(false)} 
        title="Create New Global Banner"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Banner Name</label>
            <Input placeholder="e.g., Summer Promotion" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Message Content</label>
            <textarea className="w-full h-24 border border-border rounded-lg p-3 text-[13px] focus:outline-none focus:border-black resize-none" placeholder="Enter banner text..." />
          </div>
          <Button className="w-full mt-4" onClick={() => setIsNewBannerOpen(false)}>Create banner</Button>
        </div>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: List & Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Active Banners</h3>
                <div className="relative">
                   <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                   <Input 
                      placeholder="Search..." 
                      className="h-7 w-32 pl-8 text-[11px]" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {filteredBanners.map((banner) => (
                <button
                  key={banner.id}
                  onClick={() => setActiveBannerId(banner.id)}
                  className={`w-full text-left p-4 border rounded-lg transition-all group ${
                    activeBannerId === banner.id 
                      ? "border-black bg-neutral-50 shadow-sm" 
                      : "border-border hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${banner.enabled ? 'bg-green-500' : 'bg-neutral-300'}`} />
                      <span className="text-[12px] font-bold">{banner.name}</span>
                    </div>
                    <Badge>{banner.position}</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">{bannerMessages[banner.id] || banner.message}</p>
                </button>
              ))}
            </div>
          </div>

          <Card title="Quick Edit">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Message</label>
                <textarea 
                  className="w-full h-24 border border-border rounded-lg p-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-black/10 resize-none"
                  value={activeMessage}
                  onChange={(e) => handleMessageChange(activeBannerId, e.target.value)}
                  placeholder="Paste banner content here..."
                />
              </div>
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border mt-4">
                <Switch label="Active" checked={activeBanner.enabled} />
                <Button size="sm" className="w-full sm:w-auto">Update</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Preview Canvas</h3>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8"><Monitor size={14} /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8"><Smartphone size={14} /></Button>
              </div>
           </div>

           <div className="flex-1 bg-neutral-100 rounded-xl border border-border p-4 md:p-12 min-h-100 md:min-h-125 flex flex-col relative overflow-hidden">
              <div className="w-full h-full bg-white rounded-lg border border-border shadow-premium flex flex-col relative">
                {/* Browser UI */}
                <div className="p-2 md:p-3 border-b border-border flex items-center gap-2 md:gap-3">
                   <div className="flex gap-1 md:gap-1.5">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-200" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-200" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-200" />
                   </div>
                   <div className="flex-1 h-5 md:h-6 bg-neutral-50 border border-border rounded text-[9px] md:text-[10px] flex items-center px-2 md:px-3 text-neutral-400 font-mono truncate">
                      https://client-site.com{activeBanner.targetPage}
                   </div>
                </div>

                {/* Banner Injection Simulation */}
                {activeBanner.position === 'top' && (
                  <motion.div 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black text-white p-3 text-center text-xs font-medium z-10"
                  >
                    {activeMessage}
                  </motion.div>
                )}

                <div className="flex-1 p-12 space-y-6">
                   <div className="h-8 w-1/3 bg-neutral-100 rounded" />
                   <div className="space-y-2">
                      <div className="h-3 w-full bg-neutral-50 rounded" />
                      <div className="h-3 w-5/6 bg-neutral-50 rounded" />
                      <div className="h-3 w-4/6 bg-neutral-50 rounded" />
                   </div>
                   <div className="h-32 w-full border border-dashed border-neutral-100 rounded flex items-center justify-center text-neutral-300">
                      <Layout size={32} />
                   </div>
                </div>

                {activeBanner.position === 'bottom' && (
                   <motion.div 
                     initial={{ y: 10, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="bg-white border-t border-border p-4 shadow-2xl flex items-center justify-between gap-4"
                   >
                     <div className="flex items-center gap-3 text-sm">
                        <MessageSquare size={16} className="text-black" />
                        <span className="font-medium text-xs">{activeBanner.message}</span>
                     </div>
                     <Button size="sm" className="h-7 text-[10px] px-3">Learn More</Button>
                   </motion.div>
                )}
              </div>

              {/* Annotation */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-premium">
                 <ArrowRight size={12} />
                 Position: {activeBanner.position}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
