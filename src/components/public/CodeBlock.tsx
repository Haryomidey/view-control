import React from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';

interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, className }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={cn('group relative', className)}>
      <div className="absolute right-3 top-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8 border border-neutral-800 bg-neutral-950 text-white opacity-100 hover:bg-neutral-900 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-black p-3 pr-14 text-[11px] leading-relaxed text-neutral-100 sm:p-4 sm:text-[12px]">
        <code className="border-0 bg-transparent p-0 text-neutral-100">{code}</code>
      </pre>
    </div>
  );
};
