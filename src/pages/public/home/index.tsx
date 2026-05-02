import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, Code2, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui';
import { PublicHeader } from '../../../components/public/PublicHeader';
import { PublicFooter } from '../../../components/public/PublicFooter';

const features = [
  {
    icon: Code2,
    title: 'Install once',
    description: 'Drop in the runtime and keep UI changes out of your deploy pipeline.',
  },
  {
    icon: Layers,
    title: 'Selector controls',
    description: 'Hide, show, or replace page elements using standard CSS selectors.',
  },
  {
    icon: Bell,
    title: 'Global banners',
    description: 'Publish announcements, promos, and maintenance notes across projects.',
  },
  {
    icon: ShieldCheck,
    title: 'Domain locked',
    description: 'Project keys are read-only and constrained to the domains you approve.',
  },
];

export const Home = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border px-4 py-12 sm:py-16 md:px-8 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mx-auto max-w-170 text-[34px] font-black leading-[1.06] sm:text-[48px] md:text-[58px] lg:text-[72px]"
              >
                Control your UI from one place.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-neutral-500 sm:mt-6 sm:text-[16px] sm:leading-7 md:text-[18px]"
              >
                Ship a tiny runtime once. Manage selectors, banners, copy changes, and those awkward post-handoff moments when the invoice is still doing hide-and-seek.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row"
              >
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">Get started free</Button>
                </Link>
                <Link to="/docs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Read docs</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-neutral-50 px-4 py-12 sm:py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[24px] font-black leading-tight sm:text-[28px] md:text-[34px]">Built for fast, careful changes.</h2>
              <p className="mt-3 text-[14px] leading-6 text-neutral-500 sm:text-[15px] sm:leading-7">The public runtime stays small while the dashboard carries the operational weight.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-border bg-white p-5 transition-colors hover:border-black">
                  <feature.icon size={20} className="text-neutral-500" />
                  <h3 className="mt-4 text-[14px] font-bold">{feature.title}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-neutral-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12 sm:py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[25px] font-black leading-tight sm:text-[32px] md:text-[42px]">
                Your site can nudge too.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-6 text-neutral-500 sm:text-[15px] sm:leading-7">
                You delivered the project. They got the login. Everyone smiled. Then the final payment entered witness protection. ViewControl lets you add gentle reminders, temporary handoff states, and funny little nudges without opening the codebase again.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white sm:mt-10">
              {[
                ['Day 1', 'Soft nudge', '“Hey, the final invoice is still waiting by the door.”'],
                ['Day 7', 'Polite banner', '“Handoff resumes after payment. No hard feelings, just accounting.”'],
                ['Paid', 'Back to business', 'Everything goes back to normal. Everybody wins.'],
              ].map(([label, title, copy], index) => (
                <div key={title} className="grid gap-2 border-b border-border p-4 last:border-b-0 sm:gap-4 sm:p-5 md:grid-cols-[120px_220px_1fr] md:items-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 sm:text-[11px]">{label}</div>
                  <h3 className="text-[15px] font-black sm:text-[16px]">{title}</h3>
                  <p className="text-[12px] leading-5 text-neutral-500 sm:text-[13px] sm:leading-6">{copy}</p>
                  {index === 1 && (
                    <div className="hidden" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-border bg-neutral-50 p-3">
              <div className="flex flex-col gap-3 rounded-md border border-neutral-800 bg-black p-4 text-white md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Live site banner</p>
                  <p className="mt-1 text-[13px] font-bold leading-5 sm:text-[15px]">Tiny reminder: this project loves cleared invoices.</p>
                </div>
                <Link to="/signup">
                  <Button className="w-full bg-white text-black hover:bg-neutral-100 md:w-auto">Prepare my nudge</Button>
                </Link>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-[12px] leading-6 text-neutral-500">
              Use it with permission, contracts, and common sense. The goal is friendly leverage, not chaos.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16 md:px-8 md:py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-lg border border-border p-5 text-center sm:gap-8 sm:p-6 md:p-10">
            <div className="max-w-2xl">
              <h2 className="text-[22px] font-black leading-tight sm:text-[24px] md:text-[32px]">Ready when the site needs a quick decision.</h2>
              <p className="mt-3 text-[13px] leading-6 text-neutral-500 sm:text-[14px]">Use ViewControl for launches, incidents, seasonal copy, and anything else that should not wait for the next deploy.</p>
            </div>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Create a project</Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};