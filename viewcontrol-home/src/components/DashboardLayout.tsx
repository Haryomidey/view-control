import { Link, Outlet } from "react-router-dom";
import { Eye, LayoutDashboard, Settings, Plus, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans text-[#1a1a1a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#f3f4f6] bg-white flex flex-col">
        <div className="h-16 border-b border-[#f3f4f6] flex items-center px-6 gap-2 font-bold text-sm tracking-tight text-[#111827]">
          <Eye className="h-4 w-4" />
          <span>ViewControl</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md bg-[#f3f4f6] text-[#111827]">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md text-[#6b7280] hover:text-[#111827] hover:bg-[#fafafa]">
            <Plus className="h-4 w-4" />
            Projects
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md text-[#6b7280] hover:text-[#111827] hover:bg-[#fafafa]">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-[#f3f4f6]">
          <Button variant="ghost" className="w-full justify-start text-[#6b7280] hover:text-red-600 gap-3 text-[13px]">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-14 sm:h-16 border-b border-[#f3f4f6] bg-white flex items-center px-4 sm:px-8 justify-between sticky top-0 z-10">
          <h1 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#9ca3af]">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button className="h-8 sm:h-9 px-3 sm:px-4 text-[12px] sm:text-[13px]">New Project</Button>
          </div>
        </header>

        <div className="p-6 sm:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
