import { type HttpMethod } from "@/data/apiEndpoints";

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-method-get/15 text-method-get border-method-get/30",
  POST: "bg-method-post/15 text-method-post border-method-post/30",
  PUT: "bg-method-put/15 text-method-put border-method-put/30",
  DELETE: "bg-method-delete/15 text-method-delete border-method-delete/30",
};

export function MethodBadge({ method, size = "sm" }: { method: HttpMethod; size?: "xs" | "sm" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded border font-mono font-semibold uppercase tracking-wider ${methodStyles[method]} ${
        size === "xs" ? "px-1.5 py-0.5 text-[10px] min-w-[42px]" : "px-2.5 py-1 text-xs min-w-[56px]"
      }`}
    >
      {method}
    </span>
  );
}
