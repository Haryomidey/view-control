import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";
import { CodeBlock } from "../components/CodeBlock";
import { 
  Zap, 
  Eye, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Search, 
  Settings,
  Bell,
  Code
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-white text-[#1a1a1a]">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-12 pb-16 px-6 sm:px-10 lg:pt-24 lg:pb-32">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="container relative z-10 mx-auto max-w-[1100px] grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full bg-[#f3f4f6] text-[#4b5563] px-3 py-1 text-[11px] sm:text-[12px] font-semibold mb-6 w-fit"
              >
                No redeploy required
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[40px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.04em] leading-[1.05] mb-6 text-[#111827]"
              >
                Control your UI <br className="hidden lg:block" /> from one place.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-[480px] text-[16px] sm:text-[18px] lg:text-[20px] text-[#4b5563] mb-8 leading-relaxed lg:pr-8"
              >
                Ship a tiny runtime once. Manage selectors, banners, and copy changes directly from your dashboard without another deploy.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                <Link to="/signup">
                  <Button className="h-11 px-8 w-full sm:w-auto text-[14px]">Get Started Free</Button>
                </Link>
                <Link to="/docs">
                  <Button variant="outline" className="h-11 px-8 w-full sm:w-auto text-[14px]">Read Docs</Button>
                </Link>
              </motion.div>
            </div>

            {/* Product Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative product-preview bg-white border border-[#e5e7eb] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden lg:rotate-[-1deg] hover:rotate-0 transition-transform duration-500"
            >
              <div className="preview-header bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#e5e7eb]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e5e7eb]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#e5e7eb]"></div>
                  </div>
                  <span className="text-[11px] font-bold text-[#374151] ml-2">Main Storefront</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#9ca3af]">viewcontrol.io/v1</span>
              </div>
              <div className="preview-body p-4 sm:p-6">
                <div className="mb-6">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#9ca3af] mb-4">Active Rules</div>
                  <div className="space-y-0 text-sm">
                    {[
                      { title: "Hide Hero Promo", detail: "Selector: .top-banner" },
                      { title: "Global Holiday Mode", detail: "Replacement: Seasonal Assets" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3.5 border-b border-[#f3f4f6] last:border-0">
                        <div>
                          <div className="text-[13px] font-bold text-[#111827]">{item.title}</div>
                          <div className="text-[11px] text-[#6b7280]">{item.detail}</div>
                        </div>
                        <div className="w-8 h-4.5 bg-[#111827] rounded-full relative after:content-[''] after:absolute after:right-0.5 after:top-0.5 after:w-3.5 after:h-3.5 after:bg-white after:rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#9ca3af] mb-3">Installation</div>
                  <div className="bg-[#111827] rounded-lg p-4 text-[11px] sm:text-[12px] font-mono text-[#e5e7eb] leading-relaxed border border-[#374151]">
                    <span className="text-[#9ca3af]">&lt;script</span> <span className="text-white">src</span>=<span className="text-[#6ee7b7]">"https://v.io/v1.js"</span><br />
                    &nbsp;&nbsp;<span className="text-white">data-id</span>=<span className="text-[#6ee7b7]">"vc_839210"</span><br />
                    &nbsp;&nbsp;<span className="text-white">async</span><span className="text-[#9ca3af]">&gt;&lt;/script&gt;</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#fafafa] py-16 sm:py-24 px-6 sm:px-10 border-y border-[#f3f4f6]">
          <div className="container mx-auto max-w-[1024px]">
            <div className="text-center mb-16">
              <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#111827] mb-3">Engineered for speed.</h2>
              <p className="text-[#6b7280] text-[15px] sm:text-[16px]">Everything you need to manage your frontend remotely.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: <Code className="h-5 w-5" />,
                  title: "Runtime Install",
                  description: "Drop a 2kb script into your head tag and you're ready to go."
                },
                {
                  icon: <Layers className="h-5 w-5" />,
                  title: "Selector Controls",
                  description: "Hide, show, or replace any DOM element using CSS selectors."
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "Global Banners",
                  description: "Push alerts or seasonal promos without updating your site code."
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  title: "Domain-Locked",
                  description: "Your project keys only work on the domains you authorize."
                }
              ].map((feature, i) => (
                <div key={i} className="feature-card p-6 border border-[#e5e7eb] rounded-xl bg-white hover:border-[#111827] transition-colors duration-300 group">
                  <div className="text-[#6b7280] group-hover:text-[#111827] transition-colors mb-4">{feature.icon}</div>
                  <h3 className="text-[14px] font-bold text-[#111827] mb-2">{feature.title}</h3>
                  <p className="text-[12px] text-[#6b7280] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white py-16 sm:py-24 px-6 sm:px-10">
          <div className="container mx-auto max-w-[1024px]">
            <div className="security-banner bg-white border border-[#e5e7eb] rounded-2xl px-6 py-8 sm:px-12 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div className="security-text max-w-[500px]">
                <h4 className="text-[18px] sm:text-[20px] font-extrabold text-[#111827] mb-2 leading-tight">Enterprise-grade security by default</h4>
                <p className="text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed">Public project keys are strictly read-only and restricted to your specific registered domains. Your dashboard requires secondary authentication.</p>
              </div>
              <Button variant="outline" className="h-10 px-8 text-[12px] font-bold uppercase tracking-wider bg-[#f9fafb]">Security Whitepaper</Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#111827] py-20 sm:py-32 px-10 text-center">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="container relative z-10 mx-auto max-w-[600px]">
            <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight text-white mb-6 leading-tight">Start controlling <br /> your site today.</h2>
            <p className="text-[#9ca3af] text-[16px] sm:text-[18px] mb-10">Join thousands of developers managing their site UI remotely and safely.</p>
            <Link to="/signup">
              <Button className="h-12 px-12 text-[14px] font-bold bg-white text-[#111827] hover:bg-neutral-100 uppercase tracking-widest shadow-xl">Create Free Project</Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
