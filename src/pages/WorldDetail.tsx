import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/loom/Tokens";
import { getWorld, getFactionGraph, STATUS_MAP, TIER_MAP, type ChronicleSource, type Faction, type FactionRelation } from "@/lib/worlds-data";
import { ALL_TASKS } from "@/lib/task-history";
import {
  ArrowLeft, Wand2, Sparkles, Activity, Clock, Plus, RefreshCw, Trash2,
  Webhook, Database, Upload, Plug, ChevronRight, Pause, Play, Settings2,
  TrendingUp, TrendingDown, Minus, ScrollText, Users, AlertCircle,
  Crown, Swords, Handshake, CircleDashed, Shield, Scale, Flame,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const sourceIcon: Record<ChronicleSource["type"], React.ReactNode> = {
  simulation: <Database className="h-3.5 w-3.5" />,
  webhook:    <Webhook className="h-3.5 w-3.5" />,
  manual:     <Upload className="h-3.5 w-3.5" />,
  api:        <Plug className="h-3.5 w-3.5" />,
};

export default function WorldDetail() {
  const { id } = useParams<{ id: string }>();
  const world = id ? getWorld(id) : undefined;
  const [sources, setSources] = useState<ChronicleSource[]>(world?.sources ?? []);
  const [addOpen, setAddOpen] = useState(false);
  const [newSource, setNewSource] = useState<{ name: string; type: ChronicleSource["type"]; endpoint: string }>({ name: "", type: "webhook", endpoint: "" });

  const tasks = useMemo(
    () => ALL_TASKS.filter(t => t.worldId === id).slice(0, 8),
    [id],
  );

  if (!world) return <Navigate to="/worlds" replace />;

  const status = STATUS_MAP[world.status];
  const tierCls = TIER_MAP[world.tier];

  const totalTasks = ALL_TASKS.filter(t => t.worldId === id).length;
  const runningTasks = ALL_TASKS.filter(t => t.worldId === id && (t.status === "running" || t.status === "queued")).length;
  const successRate = (() => {
    const finished = ALL_TASKS.filter(t => t.worldId === id && (t.status === "done" || t.status === "error"));
    if (finished.length === 0) return 0;
    return (finished.filter(t => t.status === "done").length / finished.length) * 100;
  })();

  const entropyDelta = world.entropyHistory[world.entropyHistory.length - 1] - world.entropyHistory[0];

  const toggleSource = (sid: string) => {
    setSources(s => s.map(x => x.id === sid ? { ...x, enabled: !x.enabled } : x));
  };
  const removeSource = (sid: string) => {
    setSources(s => s.filter(x => x.id !== sid));
    toast.success("Chronicle source removed");
  };
  const syncSource = (sid: string) => {
    toast.success("Sync triggered", { description: sources.find(s => s.id === sid)?.name });
  };
  const addSource = () => {
    if (!newSource.name || !newSource.endpoint) {
      toast.error("Name and endpoint are required");
      return;
    }
    setSources(s => [...s, {
      id: `src_${Date.now().toString(36)}`,
      name: newSource.name,
      type: newSource.type,
      endpoint: newSource.endpoint,
      events: 0,
      lastSync: "never",
      enabled: true,
    }]);
    setNewSource({ name: "", type: "webhook", endpoint: "" });
    setAddOpen(false);
    toast.success("Chronicle source added");
  };

  return (
    <>
      <TopBar
        title={world.name}
        subtitle={`${world.id} · ${world.era}`}
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/worlds"><ArrowLeft className="h-4 w-4" /> Worlds</Link>
            </Button>
            <Button className="gap-1.5"><Wand2 className="h-4 w-4" /> Quick weave</Button>
          </div>
        }
      />

      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden border-b border-border">
        <img
          src={world.cover}
          alt={`${world.name} cover`}
          width={1024}
          height={640}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="relative h-full flex items-end px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md bg-card/60", status.cls)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", status.dot, world.status === "active" && "animate-pulse")} />
                {status.label}
              </span>
              <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border backdrop-blur-md bg-card/60", tierCls)}>
                {world.tier}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{world.era}</span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight">{world.name}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{world.lore}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {world.factions.map(f => (
                <Badge key={f} variant="secondary" className="font-normal text-[11px]">
                  <Users className="h-3 w-3 mr-1" />{f}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Current entropy"
            value={world.entropy.toFixed(2)}
            delta={entropyDelta}
          />
          <StatCard icon={<Sparkles className="h-4 w-4" />} label="Total weaves" value={totalTasks} />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Active / queued" value={runningTasks} accent={runningTasks > 0 ? "text-info" : undefined} />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Success rate" value={`${successRate.toFixed(1)}%`} accent="text-success" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="entropy">Entropy</TabsTrigger>
            <TabsTrigger value="factions">Factions</TabsTrigger>
            <TabsTrigger value="tasks">Recent tasks</TabsTrigger>
            <TabsTrigger value="sources">Chronicle sources</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 p-5 space-y-3">
                <SectionTitle icon={<ScrollText className="h-4 w-4" />}>About this world</SectionTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{world.description}</p>
                <p className="text-sm leading-relaxed">{world.lore}</p>
              </Card>
              <Card className="p-5 space-y-3">
                <SectionTitle icon={<Settings2 className="h-4 w-4" />}>Quick actions</SectionTitle>
                <div className="space-y-2">
                  <Button className="w-full justify-start gap-2"><Wand2 className="h-4 w-4" /> Dispatch weave</Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-2">
                    <Link to={`/history?world=${encodeURIComponent(world.name)}`}>
                      <ScrollText className="h-4 w-4" /> View full history
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast.success("Sim re-initialized")}>
                    <RefreshCw className="h-4 w-4" /> Re-init simulation
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline of eras */}
          <TabsContent value="timeline">
            <Card className="p-5">
              <SectionTitle icon={<Clock className="h-4 w-4" />}>Era timeline</SectionTitle>
              <div className="mt-5 relative">
                <div className="absolute left-3 top-1 bottom-1 w-px bg-border" />
                <div className="space-y-5">
                  {world.eras.map((era, i) => {
                    const dot = era.status === "current" ? "bg-primary border-primary ring-4 ring-primary/15"
                              : era.status === "upcoming" ? "bg-card border-dashed border-warning/60"
                              : "bg-card border-border";
                    return (
                      <motion.div
                        key={era.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className="relative pl-10"
                      >
                        <span className={cn("absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2", dot)} />
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display text-base font-semibold">{era.name}</h4>
                          <span className="text-[10px] font-mono text-muted-foreground">{era.range}</span>
                          {era.status === "current" && <Badge variant="default" className="text-[10px] px-1.5 py-0">Current</Badge>}
                          {era.status === "upcoming" && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/40 text-warning">Predicted</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{era.summary}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Entropy chart */}
          <TabsContent value="entropy">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <SectionTitle icon={<Activity className="h-4 w-4" />}>Entropy over time</SectionTitle>
                  <p className="text-xs text-muted-foreground mt-1">Last 12 ticks · noise level vs world stability</p>
                </div>
                <DeltaPill delta={entropyDelta} />
              </div>
              <EntropyChart values={world.entropyHistory} />
              <div className="grid grid-cols-4 gap-3 mt-5">
                <MiniBox label="Current" value={world.entropyHistory[world.entropyHistory.length - 1].toFixed(2)} />
                <MiniBox label="Min" value={Math.min(...world.entropyHistory).toFixed(2)} accent="text-success" />
                <MiniBox label="Max" value={Math.max(...world.entropyHistory).toFixed(2)} accent="text-warning" />
                <MiniBox label="Avg" value={(world.entropyHistory.reduce((a, b) => a + b, 0) / world.entropyHistory.length).toFixed(2)} />
              </div>
            </Card>
          </TabsContent>

          {/* Recent tasks */}
          <TabsContent value="tasks">

          </TabsContent>
            <Card className="overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-border">
                <SectionTitle icon={<Sparkles className="h-4 w-4" />}>Recent weaves</SectionTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to={`/history?world=${encodeURIComponent(world.name)}`}>
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              {tasks.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No tasks yet for this world.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {tasks.map(t => (
                    <div key={t.id} className="p-4 hover:bg-muted/40 transition-colors flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                          <StatusBadge status={t.status} />
                          {t.revisionCount > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{t.revisionCount} rev</Badge>
                          )}
                        </div>
                        {t.headline ? (
                          <p className="text-sm italic line-clamp-1">"{t.headline}"</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t.currentNode ? `Running ${t.currentNode}…` : "—"}
                          </p>
                        )}
                      </div>
                      <div className="hidden md:block w-40">
                        <Progress value={t.progress * 100} className="h-1.5" />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                          <span>{Math.round(t.progress * 100)}%</span>
                          <span>{t.duration ? `${t.duration.toFixed(1)}s` : t.startedAt}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{t.startedAt}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Chronicle sources */}
          <TabsContent value="sources">
            <Card className="overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-border">
                <div>
                  <SectionTitle icon={<Database className="h-4 w-4" />}>Chronicle sources</SectionTitle>
                  <p className="text-xs text-muted-foreground mt-1">Connected feeds that produce raw events for this world</p>
                </div>
                <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4" /> Add source
                </Button>
              </div>
              {sources.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No chronicle sources connected.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sources.map(s => (
                    <div key={s.id} className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-colors">
                      <div className={cn("h-9 w-9 rounded-md grid place-items-center shrink-0",
                        s.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        {sourceIcon[s.type]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{s.name}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{s.type}</Badge>
                          {!s.enabled && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Paused</Badge>}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">{s.endpoint}</div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-0.5 w-32">
                        <span className="text-xs tabular-nums">{s.events.toLocaleString()} events</span>
                        <span className="text-[10px] text-muted-foreground">last sync {s.lastSync}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Sync now" onClick={() => syncSource(s.id)}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        <Switch checked={s.enabled} onCheckedChange={() => toggleSource(s.id)} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Remove" onClick={() => removeSource(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add source dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add chronicle source</DialogTitle>
            <DialogDescription>Connect a new feed of raw events for {world.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Source name</Label>
              <Input className="mt-1 h-9" placeholder="e.g. Court Chronicles Feed"
                value={newSource.name} onChange={e => setNewSource(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="text-xs">Type</Label>
                <Select value={newSource.type} onValueChange={(v: ChronicleSource["type"]) => setNewSource(s => ({ ...s, type: v }))}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="simulation">Simulation</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Endpoint</Label>
                <Input className="mt-1 h-9 font-mono text-xs" placeholder="https:// or /loom/v1/…"
                  value={newSource.endpoint} onChange={e => setNewSource(s => ({ ...s, endpoint: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addSource} className="gap-1.5"><Plus className="h-4 w-4" /> Add source</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <h3 className="font-display text-sm font-semibold inline-flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {children}
    </h3>
  );
}

function StatCard({ icon, label, value, accent, delta }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; accent?: string; delta?: number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className={cn("font-display text-2xl font-semibold tabular-nums", accent)}>{value}</span>
        {delta !== undefined && <DeltaPill delta={delta} compact />}
      </div>
    </Card>
  );
}

function DeltaPill({ delta, compact }: { delta: number; compact?: boolean }) {
  const up = delta > 0.005;
  const down = delta < -0.005;
  const cls = up ? "text-warning bg-warning/10 border-warning/20"
            : down ? "text-success bg-success/10 border-success/20"
            : "text-muted-foreground bg-muted border-border";
  const Icon = up ? TrendingUp : down ? TrendingDown : Minus;
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-medium tabular-nums", cls, compact && "text-[10px]")}>
      <Icon className="h-3 w-3" />
      {delta >= 0 ? "+" : ""}{delta.toFixed(2)}
    </span>
  );
}

function MiniBox({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-display text-lg font-semibold tabular-nums", accent)}>{value}</div>
    </div>
  );
}

function EntropyChart({ values }: { values: number[] }) {
  const w = 720;
  const h = 180;
  const pad = { l: 32, r: 12, t: 12, b: 22 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const max = 1;
  const min = 0;
  const x = (i: number) => pad.l + (i / (values.length - 1)) * innerW;
  const y = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

  const linePath = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${x(values.length - 1).toFixed(1)} ${pad.t + innerH} L ${pad.l} ${pad.t + innerH} Z`;

  const gridLines = [0.25, 0.5, 0.75];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[180px]">
        <defs>
          <linearGradient id="entropyArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* threshold band: high entropy zone */}
        <rect x={pad.l} y={y(0.7)} width={innerW} height={pad.t + innerH - y(0.7)}
              fill="hsl(var(--destructive))" fillOpacity="0.06" />

        {/* grid */}
        {gridLines.map(g => (
          <g key={g}>
            <line x1={pad.l} x2={pad.l + innerW} y1={y(g)} y2={y(g)} stroke="hsl(var(--border))" strokeDasharray="2 4" />
            <text x={pad.l - 6} y={y(g) + 3} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 10 }}>{g.toFixed(2)}</text>
          </g>
        ))}
        <text x={pad.l - 6} y={y(0) + 3} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 10 }}>0.00</text>
        <text x={pad.l - 6} y={y(1) + 3} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 10 }}>1.00</text>

        {/* x labels */}
        {values.map((_, i) => (i % 2 === 0 ? (
          <text key={i} x={x(i)} y={h - 6} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
            t-{values.length - 1 - i}
          </text>
        ) : null))}

        {/* area + line */}
        <path d={areaPath} fill="url(#entropyArea)" />
        <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />

        {/* dots */}
        {values.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4 : 2.5}
                  fill={i === values.length - 1 ? "hsl(var(--primary))" : "hsl(var(--card))"}
                  stroke="hsl(var(--primary))" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}