import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Plus, Layout } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-extrabold tracking-tight text-[#111827]">Overview</h2>
          <p className="text-[13px] text-[#6b7280]">Manage your active projects and visibility controls.</p>
        </div>
        <Button size="md">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-[#d1d5db] transition-colors cursor-pointer group bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-bold text-[#111827]">Main Storefront</CardTitle>
            <Layout className="h-4 w-4 text-[#9ca3af]" />
          </CardHeader>
          <CardContent>
            <div className="text-[24px] font-extrabold text-[#111827]">12 Active</div>
            <p className="text-[10px] text-[#9ca3af] font-mono mt-1 tracking-wider uppercase">VC_PROJ_928374</p>
            <div className="mt-6 flex gap-2">
              <div className="h-1 flex-1 bg-[#111827] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#111827] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#f3f4f6] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:border-[#d1d5db] transition-colors cursor-pointer group bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-bold text-[#111827]">Admin Portal</CardTitle>
            <Layout className="h-4 w-4 text-[#9ca3af]" />
          </CardHeader>
          <CardContent>
            <div className="text-[24px] font-extrabold text-[#111827]">3 Active</div>
            <p className="text-[10px] text-[#9ca3af] font-mono mt-1 tracking-wider uppercase">VC_PROJ_102938</p>
            <div className="mt-6 flex gap-2">
              <div className="h-1 flex-1 bg-[#111827] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#f3f4f6] rounded-full"></div>
              <div className="h-1 flex-1 bg-[#f3f4f6] rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-[#e5e7eb] flex flex-col items-center justify-center py-10 text-[#9ca3af] hover:text-[#111827] hover:border-[#d1d5db] transition-all cursor-pointer bg-white/50">
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Add project</span>
        </Card>
      </div>

      <div className="mt-16 space-y-4">
        <h3 className="text-[14px] font-bold text-[#111827] uppercase tracking-widest">Recent activity</h3>
        <div className="rounded-lg border border-[#f3f4f6] overflow-hidden bg-white">
          {[
            { action: "Updated selector", target: ".hero-cta", project: "Main Storefront", time: "2 min ago" },
            { action: "Paused banner", target: "Summer Promo", project: "Admin Portal", time: "1 hour ago" },
            { action: "Created project", target: "Documentation", project: "System", time: "5 hours ago" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#fafafa] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-[#f9fafb] flex items-center justify-center border border-[#f3f4f6] text-[10px] font-bold text-[#111827]">VC</div>
                <div>
                  <div className="text-[13px] font-bold text-[#111827]">{item.action}: <span className="font-mono text-[11px] bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[#4b5563] ml-1">{item.target}</span></div>
                  <div className="text-[12px] text-[#6b7280]">{item.project}</div>
                </div>
              </div>
              <div className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-widest">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
