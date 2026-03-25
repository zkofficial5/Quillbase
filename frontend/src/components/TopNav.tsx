import { useState } from "react";
import { Github, Copy, Check } from "lucide-react";

// const BASE_URL = "https://api.Quillbase.dev/v1";
const BASE_URL = "http://localhost:8000/api/v1";

export function TopNav() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BASE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="h-14 border-b border-border bg-surface-1/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          Base URL:
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-0 border border-border font-mono text-xs text-foreground hover:border-primary/40 transition-colors group"
        >
          <span>{BASE_URL}</span>
          {copied ? (
            <Check className="h-3 w-3 text-method-get" />
          ) : (
            <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>
      </div>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <Github className="h-4 w-4" />
        View on GitHub
      </a>
    </header>
  );
}
