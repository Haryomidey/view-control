import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Eye } from "lucide-react";

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f3f4f6] bg-white/80 backdrop-blur-md font-sans">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-lg tracking-[-0.02em]">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#111827] text-white">
              <Eye className="h-3.5 w-3.5" />
            </div>
            <span>ViewControl</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6b7280]">
            <Link to="/docs" className="hover:text-[#111827] transition-colors">Docs</Link>
            <a href="#" className="hover:text-[#111827] transition-colors">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/login" className="hidden sm:block text-[13px] font-medium text-[#6b7280] hover:text-[#111827]">
            Log in
          </Link>
          <Link to="/signup">
            <Button className="h-9 px-4 sm:px-6 text-[13px] sm:text-[14px]">Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
