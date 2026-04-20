import { cn } from "@/lib/utils";
import type { AgentCategory, NodeStatus } from "@/lib/loom-data";

export const categoryLabel: Record<AgentCategory, string> = {
  engine: "Engine",
  creative: "Creative",
  quality: "Quality",
  output: "Output",
};

export function CategoryDot({ category, className }: { category: AgentCategory; className?: string }) {
  const map: Record<AgentCategory, string> = {
    engine: "bg-info",
    creative: "bg-agent-creative",
    quality: "bg-success",
    output: "bg-warning",
  };
  return <span className={cn("inline-block h-2 w-2 rounded-full", map[category], className)} />;
}

export function StatusBadge({ status }: { status: NodeStatus | "queued" | "running" | "done" | "error" | "idle" }) {
  const map: Record<string, { label: string; cls: string }> = {
    idle:    { label: "Idle",    cls: "bg-muted text-muted-foreground" },
    queued:  { label: "Queued",  cls: "bg-secondary text-secondary-foreground" },
    running: { label: "Running", cls: "bg-info/15 text-info border border-info/20" },
    done:    { label: "Done",    cls: "bg-success/15 text-success border border-success/20" },
    error:   { label: "Error",   cls: "bg-destructive/15 text-destructive border border-destructive/30" },
  };
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium", m.cls)}>
      {status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />}
      {m.label}
    </span>
  );
}
