import { useState } from "react";
import { Copy, Check } from "lucide-react";

function syntaxHighlight(json: string): React.ReactNode[] {
  const lines = json.split("\n");
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Match patterns in order
    const regex = /("(?:\\.|[^"\\])*")\s*:|("(?:\\.|[^"\\])*")|(true|false)|(null)|(-?\d+\.?\d*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{line.slice(lastIndex, match.index)}</span>);
      }

      if (match[1]) {
        // key
        parts.push(<span key={key++} className="text-code-key">{match[1]}</span>);
        parts.push(<span key={key++}>:</span>);
      } else if (match[2]) {
        // string value
        parts.push(<span key={key++} className="text-code-string">{match[2]}</span>);
      } else if (match[3]) {
        // boolean
        parts.push(<span key={key++} className="text-code-boolean">{match[3]}</span>);
      } else if (match[4]) {
        // null
        parts.push(<span key={key++} className="text-code-null">{match[4]}</span>);
      } else if (match[5]) {
        // number
        parts.push(<span key={key++} className="text-code-number">{match[5]}</span>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={key++}>{line.slice(lastIndex)}</span>);
    }

    return (
      <div key={i} className="leading-6">
        {parts.length > 0 ? parts : line || "\u00A0"}
      </div>
    );
  });
}

export function JsonBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-code-border bg-code-bg overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-code-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-method-get" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      <pre className="p-4 text-sm font-mono overflow-x-auto scrollbar-thin">
        <code>{syntaxHighlight(code)}</code>
      </pre>
    </div>
  );
}
