import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import { BrandMark } from '../BrandMark';

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-[15px] font-bold sm:text-[16px]">
            <BrandMark size={22} />
            ViewControl
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: 'Docs', to: '/docs' },
              { label: 'Dashboard', to: '/dashboard' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'rounded-md px-3 py-2 text-[13px] font-semibold transition-colors',
                  isActive ? 'bg-neutral-50 text-black' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black',
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden rounded-md px-3 py-2 text-[13px] font-semibold text-neutral-500 transition-colors hover:text-black sm:block">
            Log in
          </Link>
          <Link to="/signup">
            <Button className="h-8 px-3 text-[12px] sm:h-9 sm:px-4 sm:text-[13px]">Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
