import { Link } from 'react-router-dom';
import { BrandMark } from '../BrandMark';

export const PublicFooter = () => {
  return (
    <footer className="border-t border-border bg-white px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <BrandMark size={18} />
            ViewControl
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
            A lightweight runtime for controlling banners, copy, and page elements from one dashboard.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Product</h4>
            <div className="mt-3 space-y-2 text-[13px] text-neutral-500">
              <Link to="/" className="block hover:text-black">Home</Link>
              <Link to="/docs" className="block hover:text-black">Docs</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Account</h4>
            <div className="mt-3 space-y-2 text-[13px] text-neutral-500">
              <Link to="/login" className="block hover:text-black">Log in</Link>
              <Link to="/signup" className="block hover:text-black">Sign up</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Workspace</h4>
            <div className="mt-3 space-y-2 text-[13px] text-neutral-500">
              <Link to="/dashboard" className="block hover:text-black">Dashboard</Link>
              <Link to="/dashboard/install" className="block hover:text-black">Install</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-[11px] text-neutral-400 md:col-span-2">
          © {new Date().getFullYear()} ViewControl. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
