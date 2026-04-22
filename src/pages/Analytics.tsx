import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, Activity, CheckCircle2, DollarSign, Bot, Clock, Zap,
  AlertTriangle, Globe2, Download, RefreshCw,
} from "lucide-react";
import { PIPELINE_NODES } from "@/lib/loom-data";
import { WORLDS } from "@/lib/worlds-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const COLORS = {
  primary: "hsl(var(--primary))",
  info:    "hsl(var(--info))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  creative: "hsl(var(--agent-creative))",
  muted:   "hsl(var(--muted-foreground))",
};

// ===== Mock data =====

function buildTaskTrend() {
  const days = 14;
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (days - 1 - i));
    const base = 35 + Math.round(Math.sin(i / 2) * 8 + Math.random() * 12);
    return {
      day: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      success: base,
      failed: Math.round(base * (0.04 + Math.random() * 0.06)),
    };
  });
}

function buildCostTrend() {
  const days = 14;
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (days - 1 - i));
    return {
      day: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      gpt4o: Math.round((8 + Math.random() * 6) * 100) / 100,
      claude: Math.round((6 + Math.random() * 5) * 100) / 100,
      mini:   Math.round((1 + Math.random() * 1.5) * 100) / 100,
    };
  });
}

function buildLatencyDist() {
  const buckets = ["<10s", "10-30s", "30-60s", "60-90s", "90-120s", ">120s"];
  return buckets.map((b, i) => ({ bucket: b, count: Math.round(20 + 40 * Math.exp(-Math.abs(i - 2) / 1.5)) }));
}

const TOP_FAILING = PIPELINE_NODES.slice(0, 6).map((n, i) => ({
  name: n.name,
  failures: 18 - i * 2 + Math.round(Math.random() * 3),
  category: n.category,
})).sort((a, b) => b.failures - a.failures);

const HOT_WORLDS = WORLDS.map(w => ({
  name: w.name,
  tasks: 40 + Math.round(Math.random() * 80),
  entropy: w.entropy,
})).sort((a, b) => b.tasks - a.tasks).slice(0, 6);

const TOKEN_BY_AGENT = PIPELINE_NODES.slice(0, 8).map((n, i) => ({
  name: n.name,
  input:  20000 + Math.round(Math.random() * 30000),
  output: 8000 + Math.round(Math.random() * 18000),
}));

const CRITIC_REASONS = [
  { reason: "Tone inconsistent",   count: 42, color: COLORS.destructive },
  { reason: "Factual contradiction", count: 31, color: COLORS.warning },
  { reason: "Pacing too fast",     count: 27, color: COLORS.creative },
  { reason: "Weak ending",         count: 19, color: COLORS.info },
  { reason: "Character voice off", count: 14, color: COLORS.primary },
  { reason: "Other",                count: 8,  color: COLORS.muted },
];

const QUALITY_RADAR = [
  { axis: "Tone",      A: 0.82 },
  { axis: "Pacing",    A: 0.71 },
  { axis: "Voice",     A: 0.88 },
  { axis: "Coherence", A: 0.79 },
  { axis: "Imagery",   A: 0.85 },
  { axis: "Drama",     A: 0.74 },
];

// ===== Page =====

export default function Analytics() {
  const [range, setRange] = useState("14d");
  const taskTrend = useMemo(buildTaskTrend, []);
  const costTrend = useMemo(buildCostTrend, []);
  const latencyDist = useMemo(buildLatencyDist, []);

  const totalTasks  = taskTrend.reduce((s, d) => s + d.success + d.failed, 0);
  const totalSuccess = taskTrend.reduce((s, d) => s + d.success, 0);
  const successRate  = (totalSuccess / totalTasks) * 100;
  const totalCost    = costTrend.reduce((s, d) => s + d.gpt4o + d.claude + d.mini, 0);
  const avgLatency   = 47.3;

  return (
    <>
      <TopBar
        title="Analytics"
        subtitle="Pipeline observability · cost · quality · usage trends"
        action={
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Refreshed")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => toast.success("Report exported", { description: "analytics.csv copied to clipboard" })}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI icon={<Activity />} label="Tasks completed" value={totalTasks.toLocaleString()} delta={+12.4} accent="text-primary" />
          <KPI icon={<CheckCircle2 />} label="Success rate" value={`${successRate.toFixed(1)}%`} delta={+1.8} accent="text-success" />
          <KPI icon={<DollarSign />} label="Total cost" value={`$${totalCost.toFixed(2)}`} delta={-7.2} accent="text-warning" />
          <KPI icon={<Clock />} label="Avg latency" value={`${avgLatency}s`} delta={-3.1} accent="text-info" />
        </div>

        {/* Row 1: Tasks trend + Cost trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="Tasks per day" subtitle="Success vs failed runs" icon={<Activity className="h-4 w-4" />} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={taskTrend} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={COLORS.success} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={COLORS.success} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="failFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={COLORS.destructive} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={COLORS.destructive} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="success" stroke={COLORS.success} strokeWidth={2} fill="url(#successFill)" name="Success" />
                <Area type="monotone" dataKey="failed"  stroke={COLORS.destructive} strokeWidth={2} fill="url(#failFill)" name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Critic reject reasons" subtitle="Top quality flags (last 30d)" icon={<AlertTriangle className="h-4 w-4" />}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={CRITIC_REASONS}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {CRITIC_REASONS.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 px-2">
              {CRITIC_REASONS.map(r => (
                <div key={r.reason} className="flex items-center gap-1.5 text-[10px]">
                  <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} />
                  <span className="text-muted-foreground truncate flex-1">{r.reason}</span>
                  <span className="font-mono tabular-nums">{r.count}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Row 2: Cost stacked + Latency dist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="Cost by model" subtitle="Daily LLM spend ($)" icon={<DollarSign className="h-4 w-4" />} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={costTrend} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip suffix="$" />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="gpt4o"  stackId="a" fill={COLORS.primary}  name="GPT-4o"     radius={[0, 0, 0, 0]} />
                <Bar dataKey="claude" stackId="a" fill={COLORS.creative} name="Claude 3.5" radius={[0, 0, 0, 0]} />
                <Bar dataKey="mini"   stackId="a" fill={COLORS.info}     name="Mini/Haiku" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Latency distribution" subtitle="Run time histogram" icon={<Clock className="h-4 w-4" />}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={latencyDist} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                <Bar dataKey="count" fill={COLORS.info} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Row 3: Top failing + Hot worlds + Quality radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="Top failing agents" subtitle="Most retries this week" icon={<Bot className="h-4 w-4" />}>
            <div className="space-y-2.5 mt-2">
              {TOP_FAILING.map((a, i) => {
                const max = TOP_FAILING[0].failures;
                return (
                  <div key={a.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] tabular-nums text-muted-foreground w-4">{i + 1}.</span>
                        <span className="font-medium truncate">{a.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-destructive">{a.failures}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-destructive/80" style={{ width: `${(a.failures / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Hot worlds" subtitle="Most active universes" icon={<Globe2 className="h-4 w-4" />}>
            <div className="space-y-2.5 mt-2">
              {HOT_WORLDS.map((w, i) => {
                const max = HOT_WORLDS[0].tasks;
                return (
                  <div key={w.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] tabular-nums text-muted-foreground w-4">{i + 1}.</span>
                        <span className="font-medium truncate">{w.name}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">e{w.entropy.toFixed(2)}</Badge>
                      </div>
                      <span className="font-mono tabular-nums text-primary">{w.tasks}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/80" style={{ width: `${(w.tasks / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Output quality" subtitle="Avg Critic scores by axis" icon={<Zap className="h-4 w-4" />}>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={QUALITY_RADAR}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
                <Radar dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} strokeWidth={2} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Row 4: Token usage */}
        <Panel title="Token usage by agent" subtitle="Input vs output tokens (cumulative this week)" icon={<Zap className="h-4 w-4" />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOKEN_BY_AGENT} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Bar dataKey="input"  fill={COLORS.info}     name="Input tokens"  radius={[3, 3, 0, 0]} />
              <Bar dataKey="output" fill={COLORS.creative} name="Output tokens" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}

function KPI({ icon, label, value, delta, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; delta: number; accent?: string }) {
  const up = delta > 0;
  // For cost & latency, going down is good — use destructive only if up & label is cost/latency
  const isInverse = label.toLowerCase().includes("cost") || label.toLowerCase().includes("latency");
  const positive = isInverse ? !up : up;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className={cn("font-display text-3xl font-semibold mt-2 tabular-nums", accent)}>{value}</p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground grid place-items-center">{icon}</div>
      </div>
      <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium", positive ? "text-success" : "text-destructive")}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {up ? "+" : ""}{delta}% vs prev period
      </div>
    </Card>
  );
}

function Panel({ title, subtitle, icon, children, className }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-4">
        <h3 className="font-display text-sm font-semibold inline-flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function ChartTooltip({ active, payload, label, suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card shadow-md px-3 py-2 text-xs">
      {label && <div className="font-medium mb-1">{label}</div>}
      <div className="space-y-0.5">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm" style={{ background: p.color || p.fill }} />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="font-mono tabular-nums ml-auto">{suffix === "$" ? "$" : ""}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
