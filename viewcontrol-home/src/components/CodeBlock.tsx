import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/src/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language, className }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group font-mono text-sm leading-relaxed", className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyToClipboard}
          className="h-7 w-7 p-0 bg-white border border-neutral-200"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="p-4 rounded-md bg-[#111827] border border-[#374151] overflow-x-auto text-[#e5e7eb]">
        <code>{code}</code>
      </pre>
    </div>
  );
};
