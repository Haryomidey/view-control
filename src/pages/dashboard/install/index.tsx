import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { 
  Terminal, 
  Layers
} from 'lucide-react';
import { VIEWCONTROL_API_URL, VIEWCONTROL_CDN_URL } from '../../../lib/viewcontrol';
import { ApiProject, getApiErrorMessage, projectsApi } from '../../../lib/api';

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
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    projectsApi.list()
      .then((items) => {
        if (isMounted) {
          setProjects(items);
          setSelectedProjectId(items[0]?.id || '');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Unable to load projects.'));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const projectKey = selectedProject?.projectKey || 'PROJECT_KEY';

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black">Installation</h1>
        <p className="text-neutral-500 text-[12px] md:text-sm mt-1">Add the ViewControl runtime to your application to start controlling visibility.</p>
      </div>

      {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}

      {isLoading ? (
        <div className="max-w-sm">
          <Skeleton height={10} width={70} className="mb-2" />
          <Skeleton height={40} borderRadius={6} />
        </div>
      ) : (
        <div className="space-y-1.5 max-w-sm">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-neutral-400">Project</label>
          <select
            className="h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-[13px] focus:outline-none focus:border-black"
            value={selectedProjectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
            disabled={projects.length === 0}
          >
            {projects.length === 0 ? (
              <option value="">No projects yet</option>
            ) : (
              projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)
            )}
          </select>
        </div>
      )}

      <div className="space-y-8 md:space-y-12">
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
            code={`<script\n  src="${VIEWCONTROL_CDN_URL}"\n  data-project-id="${projectKey}"\n  data-api-url="${VIEWCONTROL_API_URL}"\n  data-debug="false"\n  async\n></script>`} 
          />
        </section>

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
              code={`import { init } from '@viewcontrol/runtime';\n\ninit({\n  projectId: '${projectKey}',\n  apiUrl: '${VIEWCONTROL_API_URL}',\n  debug: false\n});`} 
            />
          </div>
        </section>
      </div>
    </div>
  );
};
