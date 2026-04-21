import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ALL_TASKS } from "@/lib/task-history";
import { Search, Plus, Sparkles, Clock, Activity, History as HistoryIcon, Globe2, Layers3, ArrowUpRight, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WORLDS, STATUS_MAP as statusMap, TIER_MAP as tierMap, type World } from "@/lib/worlds-data";

export default function Worlds() {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<string>("all");
  const [tierF, setTierF] = useState<string>("all");
  const [sort, setSort] = useState<string>("recent");
  const [weaveOpen, setWeaveOpen] = useState<World | null>(null);
  const [chronicles, setChronicles] = useState("");

  const stats = useMemo(() => {
    const tasksByWorld = ALL_TASKS.reduce<Record<string, { total: number; running: number; last?: string; lastHeadline?: string }>>((acc, t) => {
      const w = (acc[t.worldId] ||= { total: 0, running: 0 });
      w.total += 1;
      if (t.status === "running" || t.status === "queued") w.running += 1;
      if (!w.last) { w.last = t.startedAt; w.lastHeadline = t.headline; }
      return acc;
    }, {});
    return tasksByWorld;
  }, []);

  const totalRunning = Object.values(stats).reduce((a, b) => a + b.running, 0);
  const totalTasks = Object.values(stats).reduce((a, b) => a + b.total, 0);

  const filtered = useMemo(() => {
    let list = WORLDS.filter(w => {
      if (statusF !== "all" && w.status !== statusF) return false;
      if (tierF !== "all" && w.tier !== tierF) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!(w.name.toLowerCase().includes(s) || w.era.toLowerCase().includes(s) || w.description.toLowerCase().includes(s))) return false;
      }
      return true;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "entropy") list = [...list].sort((a, b) => b.entropy - a.entropy);
    else if (sort === "tasks") list = [...list].sort((a, b) => (stats[b.id]?.total ?? 0) - (stats[a.id]?.total ?? 0));
    return list;
  }, [q, statusF, tierF, sort, stats]);

  const submitWeave = () => {
    if (!weaveOpen) return;
    toast.success(`Weave dispatched to ${weaveOpen.name}`, {
      description: `Pipeline queued · era ${weaveOpen.era}`,
    });
    setWeaveOpen(null);
    setChronicles("");
  };

  return (
    <>
      <TopBar
        title="Worlds"
        subtitle="Universe library — manage realms, eras, and chronicle sources"
        action={
          <Button className="gap-1.5"><Plus className="h-4 w-4" /> New World</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Globe2 className="h-4 w-4" />} label="Worlds" value={WORLDS.length} />
          <StatCard icon={<Activity className="h-4 w-4" />} label="Active weaves" value={totalRunning} accent="text-info" />
          <StatCard icon={<Layers3 className="h-4 w-4" />} label="Total tasks" value={totalTasks} />
          <StatCard icon={<Sparkles className="h-4 w-4" />} label="Avg entropy" value={(WORLDS.reduce((a, w) => a + w.entropy, 0) / WORLDS.length).toFixed(2)} />
        </div>

        {/* Filter bar */}
        <Card className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search worlds, eras, lore…" className="pl-9 h-9 bg-background" />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="volatile">Volatile</SelectItem>
              <SelectItem value="dormant">Dormant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tierF} onValueChange={setTierF}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Tier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="Chân Thực">Chân Thực</SelectItem>
              <SelectItem value="Mơ Hồ">Mơ Hồ</SelectItem>
              <SelectItem value="Huyền Sử">Huyền Sử</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Sort: Recent</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="entropy">Sort: Entropy</SelectItem>
              <SelectItem value="tasks">Sort: Tasks</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Globe2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No worlds match your filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((w, i) => {
              const s = stats[w.id] ?? { total: 0, running: 0 };
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card className="overflow-hidden group hover:border-primary/40 transition-colors">
                    {/* Cover */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={w.cover}
                        alt={`${w.name} — ${w.era}`}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md bg-card/60", statusMap[w.status].cls)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", statusMap[w.status].dot, w.status === "active" && "animate-pulse")} />
                          {statusMap[w.status].label}
                        </span>
                        <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md bg-card/60", tierMap[w.tier])}>
                          {w.tier}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{w.id}</div>
                        <h3 className="font-display text-xl font-semibold leading-tight">{w.name}</h3>
                        <div className="text-xs text-muted-foreground mt-0.5">{w.era}</div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{w.description}</p>

                      {/* Entropy bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> Entropy</span>
                          <span className="font-mono">{w.entropy.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              w.entropy < 0.25 ? "bg-success" : w.entropy < 0.5 ? "bg-info" : w.entropy < 0.7 ? "bg-warning" : "bg-destructive",
                            )}
                            style={{ width: `${Math.min(100, w.entropy * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Mini stats */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <MiniStat label="Tasks" value={s.total} />
                        <MiniStat label="Active" value={s.running} accent={s.running > 0 ? "text-info" : undefined} />
                        <MiniStat label="Last weave" value={s.last ?? "—"} small />
                      </div>

                      {s.lastHeadline && (
                        <div className="rounded-md border border-border bg-muted/30 p-2.5">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 inline-flex items-center gap-1">
                            <HistoryIcon className="h-3 w-3" /> Latest headline
                          </div>
                          <div className="text-xs italic line-clamp-2 leading-snug">"{s.lastHeadline}"</div>
                        </div>
                      )}

                      {/* Factions */}
                      <div className="flex flex-wrap gap-1">
                        {w.factions.map(f => (
                          <Badge key={f} variant="secondary" className="font-normal text-[10px] px-1.5 py-0">{f}</Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1 gap-1.5" onClick={() => setWeaveOpen(w)}>
                          <Wand2 className="h-3.5 w-3.5" /> Quick weave
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-1">
                          <Link to={`/history?world=${encodeURIComponent(w.name)}`}>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick weave dialog */}
      <Dialog open={!!weaveOpen} onOpenChange={() => setWeaveOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Wand2 className="h-4 w-4 text-primary" />
              Quick weave — {weaveOpen?.name}
            </DialogTitle>
            <DialogDescription>
              Submit a fast pipeline run for <span className="font-mono">{weaveOpen?.id}</span> · era <span className="italic">{weaveOpen?.era}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Epistemic tier</Label>
                <Select defaultValue={weaveOpen?.tier ?? "Chân Thực"}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chân Thực">Chân Thực</SelectItem>
                    <SelectItem value="Mơ Hồ">Mơ Hồ</SelectItem>
                    <SelectItem value="Huyền Sử">Huyền Sử</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Pipeline preset</Label>
                <Select defaultValue="full">
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full (18 nodes)</SelectItem>
                    <SelectItem value="fast">Fast (engines + wordsmith)</SelectItem>
                    <SelectItem value="headline">Headline only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Raw chronicles (optional)</Label>
              <Textarea
                value={chronicles}
                onChange={e => setChronicles(e.target.value)}
                placeholder="Paste raw events JSON or leave empty to fetch from /loom/v1/narrative/chronicles…"
                className="mt-1 font-mono text-xs h-28 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-md border border-border bg-muted/30 p-2.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Estimated duration ~64s · 18 agents · revision cap 2</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWeaveOpen(null)}>Cancel</Button>
            <Button onClick={submitWeave} className="gap-1.5"><Sparkles className="h-4 w-4" /> Dispatch weave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className={cn("mt-1.5 font-display text-2xl font-semibold tabular-nums", accent)}>{value}</div>
    </Card>
  );
}

function MiniStat({ label, value, accent, small }: { label: string; value: React.ReactNode; accent?: string; small?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-medium tabular-nums truncate", small ? "text-[11px]" : "text-sm", accent)}>{value}</div>
    </div>
  );
}