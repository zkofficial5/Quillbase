import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { type Endpoint } from "@/data/apiEndpoints";
import { MethodBadge } from "./MethodBadge";
import { JsonBlock } from "./JsonBlock";
import api from "@/lib/api";

interface TryItPanelProps {
  endpoint: Endpoint;
  open: boolean;
  onClose: () => void;
}

export function TryItPanel({ endpoint, open, onClose }: TryItPanelProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState(endpoint.requestBody || "");
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);

    const startTime = Date.now();

    try {
      const method = endpoint.method.toLowerCase();

      // Build path — replace all :paramName patterns with user-provided values
      let path = endpoint.path.replace("/api/v1", "");
      Object.keys(paramValues).forEach((key) => {
        path = path.replace(`:${key}`, paramValues[key] || "");
      });
      // Fallback: replace any remaining :param with "1" so request still goes through
      path = path.replace(/:([a-zA-Z]+)/g, "1");

      let parsedBody = null;
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = null;
        }
      }

      const res = await api[method](path, parsedBody || undefined);

      // If login or register, save the token automatically
      if (endpoint.id === "auth-login" || endpoint.id === "auth-register") {
        const token = res.data?.data?.token;
        if (token) {
          localStorage.setItem("quillbase_token", token);
        }
      }

      setResponseStatus(res.status);
      setResponseTime(Date.now() - startTime);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setResponseStatus(err.response?.status || 500);
      setResponseTime(Date.now() - startTime);
      setResponse(
        JSON.stringify(
          err.response?.data || { error: "Request failed" },
          null,
          2,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset when endpoint changes
  const [prevId, setPrevId] = useState(endpoint.id);
  if (prevId !== endpoint.id) {
    setPrevId(endpoint.id);
    setParamValues({});
    setBody(endpoint.requestBody || "");
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);
    setLoading(false);
  }

  const isSuccess = responseStatus && responseStatus < 400;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-surface-1 border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MethodBadge method={endpoint.method} />
                <span className="font-semibold text-sm text-foreground">
                  {endpoint.title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              {/* URL */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                  Endpoint
                </label>
                <div className="px-3 py-2 rounded-md bg-surface-0 border border-border font-mono text-xs text-foreground">
                  {endpoint.path}
                </div>
              </div>

              {/* Params */}
              {endpoint.params && endpoint.params.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Parameters
                  </label>
                  <div className="space-y-2">
                    {endpoint.params.map((p) => (
                      <div key={p.name}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-primary">
                            {p.name}
                          </span>
                          {p.required && (
                            <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-method-delete/15 text-method-delete">
                              REQ
                            </span>
                          )}
                        </div>
                        <input
                          value={paramValues[p.name] || ""}
                          onChange={(e) =>
                            setParamValues((prev) => ({
                              ...prev,
                              [p.name]: e.target.value,
                            }))
                          }
                          placeholder={p.description}
                          className="w-full px-3 py-2 rounded-md bg-surface-0 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {endpoint.requestBody && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                    Request Body
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 rounded-md bg-surface-0 border border-border text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow resize-none scrollbar-thin"
                  />
                </div>
              )}

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all glow-primary disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Sending..." : "Send Request"}
              </button>

              {/* Response */}
              <AnimatePresence>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                      Response
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`h-2 w-2 rounded-full animate-pulse ${
                          isSuccess ? "bg-method-get" : "bg-method-delete"
                        }`}
                      />
                      <span
                        className={`text-xs font-mono ${
                          isSuccess ? "text-method-get" : "text-method-delete"
                        }`}
                      >
                        {responseStatus} {isSuccess ? "OK" : "Error"}
                      </span>
                      {responseTime && (
                        <span className="text-xs text-muted-foreground">
                          • {responseTime}ms
                        </span>
                      )}
                    </div>
                    <JsonBlock code={response} label="Response Body" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
