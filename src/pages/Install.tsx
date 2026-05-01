import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

const CodeSnippet = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="bg-neutral-50 border border-border rounded-lg p-4 font-mono text-[12px] leading-relaxed text-neutral-800 overflow-x-auto">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">{language}</span>
          <span 
            onClick={copy}
            className="text-[10px] font-bold text-neutral-400 uppercase cursor-pointer hover:text-black transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-all">{code}</pre>
      </div>
    </div>
  );
};

export const Install: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Installation</h1>
        <p className="text-neutral-500 text-[12px] md:text-sm mt-1">Add the ViewControl runtime to your application to start controlling visibility.</p>
      </div>

      <div className="space-y-8 md:space-y-12">
        {/* Method 1: CDN */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-neutral-100 border border-border flex items-center justify-center">
                <Layers size={16} />
             </div>
             <h2 className="text-base md:text-lg font-bold">Standard CDN Implementation</h2>
          </div>
          <p className="text-[12px] md:text-sm text-neutral-600">
            For static sites or fast implementation, add this script tag to the <code className="bg-neutral-100 px-1 rounded">&lt;head&gt;</code> of your website.
          </p>
          <CodeSnippet 
            language="HTML/Javascript"
            code={`<script \n  src="https://cdn.viewcontrol.dev/runtime.js" \n  data-project-id="vc_9281_prj_main" \n  async\n></script>`} 
          />
        </section>

        {/* Method 2: NPM */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-neutral-100 border border-border flex items-center justify-center">
                <Terminal size={16} />
             </div>
             <h2 className="text-base md:text-lg font-bold">NPM / Package Manager</h2>
          </div>
          <p className="text-[12px] md:text-sm text-neutral-600">
            Ideal for React, Vue, or Next.js applications using modern build chains.
          </p>
          <div className="space-y-4 mt-2">
            <CodeSnippet language="Terminal" code="npm install @viewcontrol/runtime" />
            <CodeSnippet 
              language="TypeScript / Javascript" 
              code={`import { init } from '@viewcontrol/runtime';\n\ninit({\n  projectId: 'vc_9281_prj_main',\n  debug: process.env.NODE_ENV === 'development'\n});`} 
            />
          </div>
        </section>

        {/* Integration Check */}
        <Card className="bg-neutral-50/50 border-neutral-200">
           <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1 space-y-2">
                 <h3 className="text-sm md:text-base font-bold flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" />
                    Integration Status
                 </h3>
                 <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">
                    Once installed, our servers will attempt to handshake with your domain. 
                    Ensure your CORS settings allow requests from <code className="text-black font-mono">*.viewcontrol.dev</code>.
                 </p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                 <div className="text-left md:text-right">
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current Health</p>
                    <p className="text-[11px] md:text-xs font-bold text-green-600">Awaiting Signal...</p>
                 </div>
                 <Button variant="outline" className="h-9 md:h-10 text-[12px] md:text-sm">Run Debugger</Button>
              </div>
           </div>
        </Card>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 grayscale opacity-40">
           <span className="text-[10px] font-bold uppercase tracking-widest block w-full sm:w-auto">Works with</span>
           <div className="flex flex-wrap gap-4">
              <span className="text-[11px] md:text-xs font-bold">React</span>
              <span className="text-[11px] md:text-xs font-bold">Next.js</span>
              <span className="text-[11px] md:text-xs font-bold">Vue</span>
              <span className="text-[11px] md:text-xs font-bold">Webflow</span>
              <span className="text-[11px] md:text-xs font-bold">Shopify</span>
           </div>
        </div>
      </div>
    </div>
  );
};
