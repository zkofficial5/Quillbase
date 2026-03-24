import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { type Endpoint } from "@/data/apiEndpoints";
import { MethodBadge } from "./MethodBadge";
import { JsonBlock } from "./JsonBlock";

interface EndpointPanelProps {
  endpoint: Endpoint;
  onTryIt: () => void;
}

export function EndpointPanel({ endpoint, onTryIt }: EndpointPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={endpoint.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-3xl mx-auto p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={endpoint.method} />
              <h2 className="text-xl font-bold text-foreground">{endpoint.title}</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-2 border border-border font-mono text-sm text-muted-foreground">
              <span className="text-foreground/60 select-none">BASE_URL</span>
              <span className="text-foreground">{endpoint.path}</span>
            </div>
          </div>
          <button
            onClick={onTryIt}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all glow-primary"
          >
            <Play className="h-3.5 w-3.5" />
            Try it
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{endpoint.description}</p>

        {/* Params */}
        {endpoint.params && endpoint.params.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Parameters</h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Required</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.params.map((p) => (
                    <tr key={p.name} className="border-t border-border">
                      <td className="px-4 py-2.5 font-mono text-xs text-primary">{p.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.type}</td>
                      <td className="px-4 py-2.5">
                        {p.required ? (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-method-delete/15 text-method-delete">Required</span>
                        ) : (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground">Optional</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Body */}
        {endpoint.requestBody && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Request Body</h3>
            <JsonBlock code={endpoint.requestBody} label="JSON" />
          </div>
        )}

        {/* Response */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Response</h3>
          <JsonBlock code={endpoint.response} label="200 OK" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
