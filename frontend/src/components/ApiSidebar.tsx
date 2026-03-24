import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import endpoints, { groups, type Endpoint } from "@/data/apiEndpoints";
import { MethodBadge } from "./MethodBadge";
import { useState } from "react";

interface ApiSidebarProps {
  selectedId: string;
  onSelect: (endpoint: Endpoint) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function ApiSidebar({ selectedId, onSelect }: ApiSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groups),
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <aside className="w-72 min-w-[288px] bg-surface-0 border-r border-border h-full overflow-y-auto scrollbar-thin">
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm font-mono">
              {"{}"}
            </span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none">
              Acme API
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">v1.0.0</p>
          </div>
        </div>
      </div>

      <motion.nav
        variants={container}
        initial="hidden"
        animate="show"
        className="px-3 pb-6"
      >
        {groups.map((group) => {
          const groupEndpoints = endpoints.filter((e) => e.group === group);
          const isExpanded = expandedGroups.has(group);

          return (
            <motion.div key={group} variants={item} className="mb-1">
              <button
                onClick={() => toggleGroup(group)}
                className="flex items-center w-full px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
              >
                <ChevronRight
                  className={`h-3 w-3 mr-1.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                />
                {group}
                <span className="ml-auto text-[10px] font-normal opacity-50">
                  {groupEndpoints.length}
                </span>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                > */}
                  {groupEndpoints.map((ep) => (
                    <motion.button
                      key={ep.id}
                      variants={item}
                      onClick={() => onSelect(ep)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-left text-sm transition-all duration-150 group ${
                        selectedId === ep.id
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <MethodBadge method={ep.method} size="xs" />
                      <span className="truncate text-xs font-medium">
                        {ep.title}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.nav>
    </aside>
  );
}
