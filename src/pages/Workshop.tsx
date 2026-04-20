import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PIPELINE_NODES, TASKS, SAMPLE_LOGS, STATS } from "@/lib/loom-data";
import { CategoryDot, StatusBadge, categoryLabel } from "@/components/loom/Tokens";
import { TrendingUp, TrendingDown, Activity, CheckCircle2, Clock, Bot, Play, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, trend, suffix }: any) {
  const up = trend > 0;
  return (
    <Card className="p-5 hover:shadow-elev transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="font-display text-3xl font-semibold mt-2">
            {value}
            {suffix && <span className="text-base text-muted-foreground font-normal ml-1">{suffix}</span>}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium",
          up ? "text-success" : "text-destructive")}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? "+" : ""}{trend}% vs yesterday
        </div>
      )}
    </Card>
  );
}

export default function Workshop() {
  const running = TASKS.filter(t => t.status === "running" || t.status === "queued");
  const recent = TASKS.filter(t => t.status === "done" || t.status === "error").slice(0, 4);

  return (
    <>
      <TopBar
        title="Loom Workshop"
        subtitle="Orchestrate your narrative pipeline · 18 agents online"
      />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-[1600px]">
          {/* Hero / quick action */}
          <Card className="p-6 border-0 bg-gradient-primary text-primary-foreground shadow-elev-lg overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, white, transparent 50%)" }} />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 hover:bg-primary-foreground/20 mb-3">
                  <Zap className="h-3 w-3 mr-1" /> Pipeline ready
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                  Weave raw chronicles into epic prose.
                </h2>
                <p className="text-primary-foreground/80 mt-2 max-w-xl">
                  16 agents stand by — from Event Normalizer to Wordsmith — to turn your simulation events into narrative gold.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/studio">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Play className="h-4 w-4" /> New Weave
                  </Button>
                </Link>
                <Link to="/pipeline">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    View Pipeline
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Activity}     label="Tasks today"   value={STATS.tasksToday}   trend={STATS.tasksTrend} />
            <StatCard icon={Clock}        label="Avg duration"  value={STATS.avgDuration}  suffix="s" trend={STATS.durationTrend} />
            <StatCard icon={CheckCircle2} label="Success rate"  value={STATS.successRate}  suffix="%" trend={STATS.successTrend} />
            <StatCard icon={Bot}          label="Agents online" value={`${STATS.activeAgents}/${STATS.totalAgents}`} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Active tasks */}
            <Card className="xl:col-span-2 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div>
                  <h3 className="font-display font-semibold">Active weaves</h3>
                  <p className="text-xs text-muted-foreground">Live pipeline executions</p>
                </div>
                <Link to="/history" className="text-xs text-primary hover:underline inline-flex items-center gap-0.5">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y">
                {running.map((t) => {
                  const node = PIPELINE_NODES.find(n => n.id === t.currentNode);
                  return (
                    <div key={t.id} className="p-5 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                            <StatusBadge status={t.status} />
                            <Badge variant="outline" className="text-[10px]">{t.epistemicTier}</Badge>
                          </div>
                          <div className="font-medium truncate">{t.worldName} <span className="text-muted-foreground font-normal">· {t.era}</span></div>
                          {node && (
                            <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                              <CategoryDot category={node.category} />
                              Currently: <span className="text-foreground font-medium">{node.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground">{t.startedAt}</div>
                          <div className="font-display font-semibold text-lg">{Math.round(t.progress * 100)}%</div>
                        </div>
                      </div>
                      <Progress value={t.progress * 100} className="mt-3 h-1.5" />
                    </div>
                  );
                })}
                {running.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">No active weaves.</div>
                )}
              </div>
            </Card>

            {/* Live logs stream */}
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div>
                  <h3 className="font-display font-semibold">Live stream</h3>
                  <p className="text-xs text-muted-foreground">Centrifugo · narrative:*</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Connected
                </div>
              </div>
              <div className="p-3 font-mono text-[11px] space-y-1 max-h-[420px] overflow-y-auto scrollbar-thin">
                {SAMPLE_LOGS.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-2 px-2 py-1 rounded hover:bg-accent/40"
                  >
                    <span className="text-muted-foreground shrink-0">{log.t}</span>
                    <span className={cn("shrink-0 font-semibold uppercase",
                      log.level === "warn" ? "text-warning" :
                      log.level === "error" ? "text-destructive" : "text-info")}>
                      {log.level}
                    </span>
                    <span className="text-primary shrink-0">{log.agent}</span>
                    <span className="text-foreground/80 break-words min-w-0">{log.msg}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Agents grid */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold">Agent fleet</h3>
                <p className="text-xs text-muted-foreground">{PIPELINE_NODES.length} nodes · {Object.keys(categoryLabel).length} categories</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {(Object.keys(categoryLabel) as Array<keyof typeof categoryLabel>).map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <CategoryDot category={c} /> {categoryLabel[c]}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {PIPELINE_NODES.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ y: -2 }}
                  className="rounded-lg border bg-card p-3 hover:shadow-elev hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <CategoryDot category={n.category} />
                    <span className="text-[10px] font-mono text-muted-foreground">{n.avgDuration}s</span>
                  </div>
                  <div className="font-medium text-sm leading-tight">{n.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">{n.vi}</div>
                  <div className="text-[10px] text-muted-foreground/80 font-mono mt-2 truncate">{n.model}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent runs */}
          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-display font-semibold">Recent narratives</h3>
              <Link to="/history" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="divide-y">
              {recent.map((t) => (
                <div key={t.id} className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30">
                  <StatusBadge status={t.status} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      {t.headline ?? <span className="italic text-muted-foreground">No headline (failed)</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.worldName} · {t.era} · <span className="font-mono">{t.id}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground shrink-0">
                    <div>{t.startedAt}</div>
                    {t.duration && <div className="font-mono mt-0.5">{t.duration.toFixed(1)}s</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
