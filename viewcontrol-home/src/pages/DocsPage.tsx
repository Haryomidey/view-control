import * as React from "react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";
import { CodeBlock } from "../components/CodeBlock";
import { 
  Menu, 
  ChevronRight, 
  Info, 
  ExternalLink,
  BookOpen,
  Terminal,
  Shield,
  HelpCircle,
  Zap
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const sections = [
  { id: "intro", title: "Introduction", icon: <BookOpen className="h-4 w-4" /> },
  { id: "quickstart", title: "Quick Start", icon: <Zap className="h-4 w-4" /> },
  { id: "cdn", title: "CDN Install", icon: <ExternalLink className="h-4 w-4" /> },
  { id: "npm", title: "NPM Install", icon: <Terminal className="h-4 w-4" /> },
  { id: "options", title: "Runtime Options", icon: <Menu className="h-4 w-4" /> },
  { id: "security", title: "Security Notes", icon: <Shield className="h-4 w-4" /> },
  { id: "troubleshooting", title: "Troubleshooting", icon: <HelpCircle className="h-4 w-4" /> },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = React.useState("intro");

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white text-[#1a1a1a]">
      <PublicHeader />
      <div className="container mx-auto flex-1 px-6 sm:px-10 py-8 sm:py-12 max-w-[1024px]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 md:gap-16">
          {/* Sidebar */}
          <aside className="hidden md:block sticky top-24 h-fit">
            <nav className="space-y-1">
              <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4">Documentation</div>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center justify-between group px-3 py-2 text-[13px] font-medium rounded-md transition-colors",
                    activeSection === section.id 
                      ? "bg-[#f3f4f6] text-[#111827]" 
                      : "text-[#6b7280] hover:text-[#111827] hover:bg-[#fafafa]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </div>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="max-w-2xl space-y-12 sm:space-y-16 pb-20">
            {/* Introduction */}
            <section id="intro" className="scroll-mt-24 space-y-5 sm:space-y-6">
              <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#111827] leading-tight">Documentation</h1>
              <p className="text-[15px] sm:text-[16px] text-[#4b5563] leading-relaxed">
                ViewControl allows you to manage website visibility, text, and announcements remotely. By installing a lightweight script, you can target specific elements on your page and apply rules from the ViewControl dashboard.
              </p>
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-lg bg-[#fafafa] border border-[#f3f4f6]">
                <info className="h-4 w-4 text-[#9ca3af] mt-1 shrink-0" />
                <div className="text-[12px] sm:text-[13px] text-[#6b7280] leading-relaxed">
                  <span className="font-bold text-[#111827]">CDN vs NPM:</span> Use the CDN snippet for static sites. Use the NPM package for React/Next.js applications to get full TypeScript support.
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="scroll-mt-24 space-y-5 sm:space-y-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#111827] border-b border-[#f3f4f6] pb-4">Quick Start</h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create a project", content: "Visit the dashboard and create a new project. Enter your production domains." },
                  { step: "2", title: "Copy your Project Key", content: "Locate the Project Key (e.g., VC_PROJ_XXXX) in your settings." },
                  { step: "3", title: "Install the runtime", content: "Add the CDN script below to your HTML or use the NPM package." },
                  { step: "4", title: "Create your first control", content: "Create a 'Banner' or 'Selector' control and toggle it on." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-[#111827]">{item.title}</h3>
                      <p className="text-[#6b7280] text-[12px] sm:text-[13px] mt-1">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CDN Install */}
            <section id="cdn" className="scroll-mt-24 space-y-5 sm:space-y-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#111827] border-b border-[#f3f4f6] pb-4">CDN Install</h2>
              <p className="text-[13px] sm:text-[14px] text-[#4b5563]">
                Add the following snippet to your HTML. We recommend placing it in the <code>&lt;head&gt;</code> tag.
              </p>
              <CodeBlock 
                code={`<script \n  src="https://cdn.viewcontrol.com/v1.js" \n  data-project-id="YOUR_PROJECT_KEY"\n  async\n></script>`} 
              />
            </section>

            {/* Runtime Options */}
            <section id="options" className="scroll-mt-24 space-y-5 sm:space-y-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#111827] border-b border-[#f3f4f6] pb-4">Runtime Options</h2>
              <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                <table className="w-full text-left text-[11px] sm:text-[12px]">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                      <th className="px-3 sm:px-4 py-3 font-bold text-[#111827]">Option</th>
                      <th className="px-3 sm:px-4 py-3 font-bold text-[#111827]">Type</th>
                      <th className="px-3 sm:px-4 py-3 font-bold text-[#111827]">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    <tr>
                      <td className="px-3 sm:px-4 py-3 font-mono text-[#111827]">projectId</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">string</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">Yes</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-3 font-mono text-[#111827]">apiUrl</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">string</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">No</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-3 font-mono text-[#111827]">debug</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">boolean</td>
                      <td className="px-3 sm:px-4 py-3 text-[#6b7280]">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24 space-y-5 sm:space-y-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#111827] border-b border-[#f3f4f6] pb-4">Troubleshooting</h2>
              <div className="space-y-6">
                {[
                  { q: "CORS error on runtime request", a: "Verify that the domain making the request is added to the 'Allowed Domains' list." },
                  { q: "Script installed but no changes", a: "Ensure the 'Active' toggle is ON in the dashboard. Use debug: true to see logs." },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-[#111827]">{item.q}</h4>
                    <p className="text-[12px] sm:text-[13px] text-[#6b7280]">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
