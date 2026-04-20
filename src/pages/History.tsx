import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/loom/Tokens";
import { ALL_TASKS } from "@/lib/task-history";
import type { TaskRun } from "@/lib/loom-data";
import { SAMPLE_PROSE, PIPELINE_NODES, SAMPLE_LOGS } from "@/lib/loom-data";
import { Search, Filter, X, ChevronLeft, ChevronRight, Download, RotateCcw, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const worlds = Array.from(new Set(ALL_TASKS.map(t => t.worldName)));
const PAGE_SIZE = 10;

export default function History() {
  const [q, setQ] = useState("");
  const [world, setWorld] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TaskRun | null>(null);

  const filtered = useMemo(() => {
    return ALL_TASKS.filter(t => {
      if (world !== "all" && t.worldName !== world) return false;
      if (status !== "all" && t.status !== status) return false;
      if (tier !== "all" && t.epistemicTier !== tier) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!(t.id.toLowerCase().includes(s) ||
              t.worldName.toLowerCase().includes(s) ||
              t.era.toLowerCase().includes(s) ||
              (t.headline?.toLowerCase().includes(s) ?? false))) return false;
      }
      return true;
    });
  }, [q, world, status, tier]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const reset = () => { setQ(""); setWorld("all"); setStatus("all"); setTier("all"); setPage(1); };
  const activeFilters = [
    world !== "all" && { k: "world", v: world, clear: () => setWorld("all") },
    status !== "all" && { k: "status", v: status, clear: () => setStatus("all") },
    tier !== "all" && { k: "tier", v: tier, clear: () => setTier("all") },
    q && { k: "search", v: `"${q}"`, clear: () => setQ("") },
  ].filter(Boolean) as { k: string; v: string; clear: () => void }[];

  const counts = {
    total: filtered.length,
    done: filtered.filter(t => t.status === "done").length,
    running: filtered.filter(t => t.status === "running").length,
    error: filtered.filter(t => t.status === "error").length,
    queued: filtered.filter(t => t.status === "queued").length,
  };

  return (
    <>
      <TopBar
        title="Task History"
        subtitle={`${ALL_TASKS.length} weaves recorded · browse, filter, replay`}
        action={
          <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Export started", { description: `${filtered.length} rows → CSV` })}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-5 max-w-[1600px]">
          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total",   value: counts.total,   tone: "text-foreground" },
              { label: "Done",    value: counts.done,    tone: "text-success" },
              { label: "Running", value: counts.running, tone: "text-info" },
              { label: "Queued",  value: counts.queued,  tone: "text-muted-foreground" },
              { label: "Error",   value: counts.error,   tone: "text-destructive" },
            ].map(s => (
              <Card key={s.label} className="p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</div>
                <div className={cn("font-display text-2xl font-semibold mt-1", s.tone)}>{s.value}</div>
              </Card>
            ))}
          </div>

          {/* Filter bar */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search by task id, world, era, or headline…"
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={world} onValueChange={(v) => { setWorld(v); setPage(1); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="World" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All worlds</SelectItem>
                    {worlds.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tier} onValueChange={(v) => { setTier(v); setPage(1); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Epistemic tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tiers</SelectItem>
                    <SelectItem value="Chân Thực">Chân Thực</SelectItem>
                    <SelectItem value="Mơ Hồ">Mơ Hồ</SelectItem>
                    <SelectItem value="Huyền Sử">Huyền Sử</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={reset} title="Reset filters">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Active
                </span>
                {activeFilters.map((f) => (
                  <Badge key={f.k} variant="secondary" className="gap-1 pr-1">
                    <span className="text-[10px] uppercase opacity-60">{f.k}</span>
                    <span>{f.v}</span>
                    <button onClick={f.clear} className="ml-0.5 rounded hover:bg-foreground/10 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Task</th>
                    <th className="text-left font-medium px-4 py-3">World / Era</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-left font-medium px-4 py-3">Headline</th>
                    <th className="text-left font-medium px-4 py-3">Tier</th>
                    <th className="text-right font-medium px-4 py-3">Noise</th>
                    <th className="text-right font-medium px-4 py-3">Rev.</th>
                    <th className="text-right font-medium px-4 py-3">Duration</th>
                    <th className="text-right font-medium px-4 py-3">Started</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="border-t hover:bg-accent/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{t.worldName}</div>
                        <div className="text-xs text-muted-foreground">{t.era}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge status={t.status} />
                          {t.status === "running" && (
                            <div className="w-24"><Progress value={t.progress * 100} className="h-1" /></div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        {t.headline ? (
                          <span className="truncate block">{t.headline}</span>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">{t.epistemicTier}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">{t.noiseLevel.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {t.revisionCount > 0 ? (
                          <Badge variant="secondary" className="font-mono text-[10px]">×{t.revisionCount}</Badge>
                        ) : <span className="text-muted-foreground">0</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {t.duration ? `${t.duration.toFixed(1)}s` : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">{t.startedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground inline" />
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="text-sm text-muted-foreground">No tasks match your filters.</div>
                        <Button variant="ghost" size="sm" onClick={reset} className="mt-2">Clear filters</Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{(safePage - 1) * PAGE_SIZE + 1}</span>–<span className="font-medium text-foreground">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                  Math.max(0, safePage - 3),
                  Math.max(0, safePage - 3) + 5
                ).map(p => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === safePage ? "default" : "ghost"}
                    className="h-8 w-8 p-0 font-mono"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button size="icon" variant="ghost" disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>

      <TaskDetailDialog task={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function TaskDetailDialog({ task, onClose }: { task: TaskRun | null; onClose: () => void }) {
  if (!task) return null;
  const node = PIPELINE_NODES.find(n => n.id === task.currentNode);
  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-5 border-b shrink-0">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                <StatusBadge status={task.status} />
                <Badge variant="outline" className="text-[10px]">{task.epistemicTier}</Badge>
                {task.revisionCount > 0 && <Badge variant="secondary" className="font-mono text-[10px]">×{task.revisionCount} revisions</Badge>}
              </div>
              <DialogTitle className="font-display text-xl text-left leading-tight">
                {task.headline ?? <span className="italic text-muted-foreground">Untitled weave</span>}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{task.worldName} · {task.era}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(task.id); toast.success("Task ID copied"); }}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 min-h-0 flex flex-col">
          <div className="px-5 pt-3 shrink-0">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="prose" disabled={task.status !== "done"}>Prose</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="state">State</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <TabsContent value="overview" className="m-0 p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { l: "Status",   v: task.status },
                  { l: "Duration", v: task.duration ? `${task.duration.toFixed(1)}s` : "—" },
                  { l: "Noise",    v: task.noiseLevel.toFixed(2) },
                  { l: "Revisions", v: task.revisionCount },
                ].map(s => (
                  <div key={s.l} className="rounded-lg border bg-muted/30 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                    <div className="font-display font-semibold mt-0.5 capitalize">{s.v}</div>
                  </div>
                ))}
              </div>

              {task.status === "running" && node && (
                <Card className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Currently executing</div>
                  <div className="font-medium">{node.name}</div>
                  <div className="text-xs text-muted-foreground">{node.vi} · {node.model}</div>
                  <Progress value={task.progress * 100} className="mt-3 h-1.5" />
                </Card>
              )}

              {task.status === "error" && (
                <Card className="p-4 border-destructive/30 bg-destructive/5">
                  <div className="text-[10px] uppercase tracking-wider text-destructive font-medium mb-1">Error</div>
                  <div className="font-mono text-xs">RetryError: max attempts (3) reached on agent <span className="text-destructive">wordsmith</span></div>
                  <div className="text-xs text-muted-foreground mt-2">Last log: <span className="font-mono">stream timeout after 45s · upstream 503</span></div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="prose" className="m-0 p-6">
              <article className="prose prose-neutral max-w-none">
                {SAMPLE_PROSE.split("\n\n").map((p, i) => (
                  <p key={i} className="text-foreground/90 leading-[1.85] text-[15px] mb-4">{p}</p>
                ))}
              </article>
            </TabsContent>

            <TabsContent value="timeline" className="m-0 p-5">
              <div className="font-mono text-[11px] space-y-1">
                {SAMPLE_LOGS.map((log, i) => (
                  <div key={i} className="flex gap-2 px-2 py-1 rounded hover:bg-accent/40">
                    <span className="text-muted-foreground shrink-0">{log.t}</span>
                    <span className={cn("shrink-0 font-semibold uppercase",
                      log.level === "warn" ? "text-warning" :
                      log.level === "error" ? "text-destructive" : "text-info")}>{log.level}</span>
                    <span className="text-primary shrink-0">{log.agent}</span>
                    <span className="text-foreground/80 break-words min-w-0">{log.msg}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="state" className="m-0 p-5">
              <pre className="font-mono text-xs bg-muted/50 rounded-md p-4 overflow-x-auto leading-relaxed">{JSON.stringify({
                task_id: task.id,
                world_id: task.worldId,
                world_era: task.era,
                status: task.status,
                progress: task.progress,
                epistemic_tier: task.epistemicTier,
                noise_level: task.noiseLevel,
                revision_count: task.revisionCount,
                duration_seconds: task.duration,
                headline: task.headline,
                completed_agents: task.status === "done" ? 18 : Math.floor(task.progress * 18),
              }, null, 2)}</pre>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
