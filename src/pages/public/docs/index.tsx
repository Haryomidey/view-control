import React from 'react';
import { BookOpen, ExternalLink, HelpCircle, Info, Menu, Shield, Terminal, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { PublicHeader } from '../../../components/public/PublicHeader';
import { PublicFooter } from '../../../components/public/PublicFooter';
import { CodeBlock } from '../../../components/public/CodeBlock';
import { VIEWCONTROL_API_URL, VIEWCONTROL_CDN_URL } from '../../../lib/viewcontrol';

const sections = [
  { id: 'intro', title: 'Introduction', icon: BookOpen },
  { id: 'quickstart', title: 'Quick Start', icon: Zap },
  { id: 'cdn', title: 'CDN Install', icon: ExternalLink },
  { id: 'npm', title: 'NPM Install', icon: Terminal },
  { id: 'options', title: 'Runtime Options', icon: Menu },
  { id: 'rules', title: 'Controls & Banners', icon: BookOpen },
  { id: 'security', title: 'Security Notes', icon: Shield },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: HelpCircle },
];

const quickStart = [
  ['Create a project', 'Open the dashboard, add your site, and include the domains that are allowed to load the runtime.'],
  ['Copy your project key', 'Go to the Install page and copy the generated project key for the selected project.'],
  ['Install the runtime', 'Add the CDN script to your HTML or import the runtime package and call init from your app code.'],
  ['Publish a control', 'Create a selector control or banner, then keep it active when you want the runtime to apply it.'],
];

export const Docs = () => {
  const [activeSection, setActiveSection] = React.useState('intro');

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-10 md:grid-cols-[240px_1fr] md:gap-10 md:px-8 md:py-14">
        <aside className="hidden md:block">
          <nav className="sticky top-24">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Documentation</div>
            <div className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors',
                    activeSection === section.id ? 'bg-neutral-50 text-black' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black',
                  )}
                >
                  <section.icon size={15} />
                  {section.title}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <main className="min-w-0 max-w-3xl space-y-10 pb-12 sm:space-y-12 sm:pb-16 md:space-y-14">
          <section id="intro" className="scroll-mt-24">
            <h1 className="text-[30px] font-black leading-tight sm:text-[36px] md:text-[46px]">Documentation</h1>
            <p className="mt-4 text-[14px] leading-6 text-neutral-500 sm:mt-5 sm:text-[16px] sm:leading-8">
              ViewControl lets you manage website visibility, text, HTML, styles, classes, and announcements remotely. Install the runtime, then publish active controls and banners from the dashboard.
            </p>
            <div className="mt-5 flex gap-3 rounded-lg border border-border bg-neutral-50 p-4 sm:mt-6">
              <Info size={17} className="mt-0.5 shrink-0 text-neutral-500" />
              <p className="text-[12px] leading-5 text-neutral-600 sm:text-[13px] sm:leading-6">
                <span className="font-bold text-black">CDN vs NPM:</span> use the CDN snippet for static sites or quick installs. Use the NPM package when your app has a build step and you want to start ViewControl manually with <code>init</code>.
              </p>
            </div>
          </section>

          <section id="quickstart" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">Quick Start</h2>
            <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
              {quickStart.map(([title, content], index) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold sm:text-[14px]">{title}</h3>
                    <p className="mt-1 text-[12px] leading-5 text-neutral-500 sm:text-[13px] sm:leading-6">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="cdn" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">CDN Install</h2>
            <p className="mt-4 text-[13px] leading-6 text-neutral-500 sm:mt-5 sm:text-[14px] sm:leading-7">
              Add this snippet to your HTML. The runtime reads <code>data-project-id</code>, <code>data-api-url</code>, <code>data-poll-interval</code>, and <code>data-debug</code> from the current script.
            </p>
            <CodeBlock
              className="mt-5"
              code={`<script
  src="${VIEWCONTROL_CDN_URL}"
  data-project-id="YOUR_PROJECT_KEY"
  data-api-url="${VIEWCONTROL_API_URL}"
  data-poll-interval="30000"
  data-debug="false"
  async
></script>`}
            />
          </section>

          <section id="npm" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">NPM Install</h2>
            <p className="mt-4 text-[13px] leading-6 text-neutral-500 sm:mt-5 sm:text-[14px] sm:leading-7">
              Install the runtime package when you want to initialize ViewControl from application code. The package exports <code>init</code> and <code>Runtime</code>.
            </p>
            <CodeBlock
              className="mt-5"
              code={`npm install @viewcontrol/runtime

import { init } from '@viewcontrol/runtime';

init({
  projectId: 'YOUR_PROJECT_KEY',
  apiUrl: '${VIEWCONTROL_API_URL}',
  pollInterval: 30000,
  debug: false,
});`}
            />
          </section>

          <section id="options" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">Runtime Options</h2>
            <div className="mt-5 overflow-x-auto rounded-lg border border-border">
              <table className="min-w-160 w-full text-left text-[11px] sm:text-[12px]">
                <thead className="border-b border-border bg-neutral-50">
                  <tr>
                    <th className="px-3 py-3 font-bold sm:px-4">Option</th>
                    <th className="px-3 py-3 font-bold sm:px-4">Type</th>
                    <th className="px-3 py-3 font-bold sm:px-4">Required</th>
                    <th className="px-3 py-3 font-bold sm:px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['projectId', 'string', 'Yes', 'Use the project key from the dashboard.'],
                    ['apiUrl', 'string', 'No', 'Defaults to the runtime package default. Set this to your ViewControl API URL.'],
                    ['pollInterval', 'number', 'No', 'Defaults to 30000ms. Values below 5000ms do not start polling.'],
                    ['debug', 'boolean', 'No', 'Logs runtime activity to the browser console when true.'],
                  ].map(([option, type, required, notes]) => (
                    <tr key={option}>
                      <td className="px-3 py-3 font-mono text-black sm:px-4">{option}</td>
                      <td className="px-3 py-3 text-neutral-500 sm:px-4">{type}</td>
                      <td className="px-3 py-3 text-neutral-500 sm:px-4">{required}</td>
                      <td className="px-3 py-3 text-neutral-500 sm:px-4">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="rules" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">Controls & Banners</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-[13px] font-bold">Selector controls</h3>
                <p className="mt-2 text-[12px] leading-5 text-neutral-500">
                  Controls target matching DOM elements with a CSS selector and optional path pattern. Supported actions are <code>hide</code>, <code>show</code>, <code>text</code>, <code>replace</code>, <code>html</code>, <code>opacity</code>, <code>display</code>, <code>class</code>, and <code>style</code>.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-[13px] font-bold">Banners</h3>
                <p className="mt-2 text-[12px] leading-5 text-neutral-500">
                  Banners render fixed messages at the <code>top</code> or <code>bottom</code> of the page. Supported tones are <code>neutral</code>, <code>success</code>, <code>warning</code>, and <code>critical</code>.
                </p>
              </div>
            </div>
          </section>

          <section id="security" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">Security Notes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Read-only keys', 'Public project keys can fetch active controls but cannot mutate dashboard data.'],
                ['Allowed domains', 'Runtime config and event requests are rejected when the site domain is not registered on the project.'],
              ].map(([title, content]) => (
                <div key={title} className="rounded-lg border border-border p-4">
                  <h3 className="text-[13px] font-bold">{title}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-neutral-500">{content}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="troubleshooting" className="scroll-mt-24">
            <h2 className="border-b border-border pb-3 text-[18px] font-black sm:pb-4 sm:text-[20px]">Troubleshooting</h2>
            <div className="mt-5 space-y-5 sm:space-y-6">
              {[
                ['Project not found', 'Check that data-project-id or projectId uses the project key from the dashboard install page.'],
                ['Domain not allowed', 'Add the current origin or referrer domain to the project allowed domains list.'],
                ['Script installed but no changes appear', 'Confirm the control or banner is active, the selector matches the current DOM, and debug logging is enabled while testing.'],
              ].map(([question, answer]) => (
                <div key={question}>
                  <h3 className="text-[13px] font-bold sm:text-[14px]">{question}</h3>
                  <p className="mt-1 text-[12px] leading-5 text-neutral-500 sm:text-[13px] sm:leading-6">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <PublicFooter />
    </div>
  );
};
