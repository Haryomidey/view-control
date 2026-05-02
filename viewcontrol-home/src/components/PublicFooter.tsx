import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const PublicFooter = () => {
  return (
    <footer className="border-t border-[#f3f4f6] bg-white px-6 sm:px-10 py-10 sm:py-16 font-sans">
      <div className="container mx-auto max-w-[1024px]">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-12">
          <div className="space-y-4 max-w-xs text-center md:text-left mx-auto md:mx-0">
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-sm tracking-tight text-[#111827]">
              <Eye className="h-4 w-4" />
              <span>ViewControl</span>
            </div>
            <p className="text-[12px] text-[#6b7280] leading-relaxed">
              The lightweight runtime for remote website control. Manage banners, text, and visibility without a redeploy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-[12px] text-[#6b7280]">
                <li><Link to="/docs" className="hover:text-[#111827]">Features</Link></li>
                <li><a href="#" className="hover:text-[#111827]">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-[12px] text-[#6b7280]">
                <li><Link to="/docs" className="hover:text-[#111827]">Docs</Link></li>
                <li><a href="#" className="hover:text-[#111827]">Status</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-[12px] text-[#6b7280]">
                <li><a href="#" className="hover:text-[#111827]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#111827]">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#f3f4f6] text-[10px] text-[#9ca3af] text-center md:text-left">
          © {new Date().getFullYear()} ViewControl Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
