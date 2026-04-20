import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PIPELINE_NODES, type PipelineNode, type NodeStatus } from "@/lib/loom-data";
import { CategoryDot, StatusBadge, categoryLabel } from "@/components/loom/Tokens";
import { Play, Pause, RotateCcw, Cpu, GitBranch, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const phase1 = PIPELINE_NODES.filter(n => n.phase === 1);
const phase2 = PIPELINE_NODES.filter(n => n.phase === 2);

export default function Pipeline() {
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(() =>
    Object.fromEntries(PIPELINE_NODES.map(n => [n.id, "idle"])) as Record<string, NodeStatus>
  );
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selected, setSelected] = useState<PipelineNode | null>(null);

  useEffect(() => {
    if (!running) return;
    if (activeIdx >= PIPELINE_NODES.length) { setRunning(false); return; }
    const node = PIPELINE_NODES[activeIdx];
    setStatuses(s => ({ ...s, [node.id]: "running" }));
    const t = setTimeout(() => {
      setStatuses(s => ({ ...s, [node.id]: "done" }));
      setActiveIdx(i => i + 1);
    }, 700);
    return () => clearTimeout(t);
  }, [running, activeIdx]);

  const reset = () => {
    setRunning(false);
    setActiveIdx(-1);
    setStatuses(Object.fromEntries(PIPELINE_NODES.map(n => [n.id, "idle"])) as Record<string, NodeStatus>);
  };
  const start = () => { reset(); setActiveIdx(0); setRunning(true); };

  const doneCount = Object.values(statuses).filter(s => s === "done").length;

  return (
    <>
      <TopBar
        title="Pipeline Visualizer"
        subtitle={`LangGraph DAG · ${PIPELINE_NODES.length} nodes · 2 phases`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            {running ? (
              <Button size="sm" variant="secondary" onClick={() => setRunning(false)} className="gap-1.5">
                <Pause className="h-3.5 w-3.5" /> Pause
              </Button>
            ) : (
              <Button size="sm" onClick={start} className="gap-1.5">
                <Play className="h-3.5 w-3.5" /> Run demo
              </Button>
            )}
          </div>
        }
      />

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-[1600px]">
          {/* Progress bar */}
          <Card className="p-4 mb-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span className="inline-flex items-center gap-1.5"><GitBranch className="h-3 w-3" /> Pipeline progress</span>
                <span className="font-mono">{doneCount}/{PIPELINE_NODES.length} nodes</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary"
                  animate={{ width: `${(doneCount / PIPELINE_NODES.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {(Object.keys(categoryLabel) as Array<keyof typeof categoryLabel>).map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <CategoryDot category={c} /> {categoryLabel[c]}
                </span>
              ))}
            </div>
          </Card>

          <PhaseSection
            title="Phase 1 — Engines"
            subtitle="Data analysis · normalize, score, detect patterns"
            nodes={phase1}
            statuses={statuses}
            onSelect={setSelected}
          />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-3">State handoff · NarrativeState</div>
            <div className="flex-1 h-px bg-border" />
          </div>

          <PhaseSection
            title="Phase 2 — Agents"
            subtitle="Creative writing · with Critic ↔ Wordsmith revision loop"
            nodes={phase2}
            statuses={statuses}
            onSelect={setSelected}
          />

          {/* Revision loop indicator */}
          <Card className="mt-6 p-4 bg-accent/40 border-dashed">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-9 w-9 rounded-lg bg-warning/20 text-warning flex items-center justify-center">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Revision loop: Critic ↔ Wordsmith</div>
                <div className="text-xs text-muted-foreground">If quality fails, prose is re-drafted (max 2 revisions) before reaching Archivist.</div>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">max_revisions=2</Badge>
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Node detail drawer */}
      <AnimatePresence>
        {selected && <NodeDrawer node={selected} status={statuses[selected.id]} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

function PhaseSection({ title, subtitle, nodes, statuses, onSelect }: {
  title: string; subtitle: string; nodes: PipelineNode[];
  statuses: Record<string, NodeStatus>; onSelect: (n: PipelineNode) => void;
}) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {nodes.map((n, i) => (
          <NodeCard key={n.id} node={n} status={statuses[n.id]} onClick={() => onSelect(n)} index={i} />
        ))}
      </div>
    </div>
  );
}

function NodeCard({ node, status, onClick, index }: { node: PipelineNode; status: NodeStatus; onClick: () => void; index: number }) {
  const ring =
    status === "running" ? "ring-2 ring-info animate-pulse-ring border-info/40" :
    status === "done" ? "border-success/40 bg-success/[0.04]" :
    status === "error" ? "border-destructive/50 bg-destructive/[0.04]" :
    "border-border";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className={cn("text-left rounded-xl border bg-card p-4 transition-all hover:shadow-elev", ring)}
    >
      <div className="flex items-start justify-between mb-3">
        <CategoryDot category={node.category} />
        <StatusBadge status={status} />
      </div>
      <div className="font-medium leading-tight">{node.name}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{node.vi}</div>
      <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span className="inline-flex items-center gap-1"><Cpu className="h-2.5 w-2.5" /> {node.model}</span>
        <span>{node.avgDuration}s</span>
      </div>
    </motion.button>
  );
}

function NodeDrawer({ node, status, onClose }: { node: PipelineNode; status: NodeStatus; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
      />
      <motion.aside
        initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-elev-lg"
      >
        <div className="flex items-start justify-between p-5 border-b">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CategoryDot category={node.category} />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{categoryLabel[node.category]} · Phase {node.phase}</span>
            </div>
            <h3 className="font-display text-xl font-semibold">{node.name}</h3>
            <p className="text-sm text-muted-foreground">{node.vi}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-2"><StatusBadge status={status} /></div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Description</div>
              <p className="text-sm">{node.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Model</div>
                <div className="font-mono text-sm mt-0.5">{node.model}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg duration</div>
                <div className="font-mono text-sm mt-0.5">{node.avgDuration}s</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Wrapper config</div>
              <div className="rounded-lg border bg-muted/30 p-3 font-mono text-xs space-y-1">
                <div><span className="text-muted-foreground">@agent_node</span></div>
                <div>retry: <span className="text-info">tenacity(3, exp_backoff)</span></div>
                <div>publish: <span className="text-info">centrifugo</span></div>
                <div>logs: <span className="text-info">structlog</span></div>
                <div>metrics: <span className="text-info">duration_seconds</span></div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Reads from state</div>
              <div className="flex flex-wrap gap-1.5">
                {["raw_chronicles", "world_id", "world_era"].map(k => (
                  <Badge key={k} variant="secondary" className="font-mono text-[10px]">{k}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Writes to state</div>
              <div className="flex flex-wrap gap-1.5">
                {["event_scores", "narrative_phase"].map(k => (
                  <Badge key={k} className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">{k}</Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </motion.aside>
    </>
  );
}
