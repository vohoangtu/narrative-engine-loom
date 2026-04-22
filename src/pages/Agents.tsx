import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PIPELINE_NODES } from "@/lib/loom-data";
import { CategoryDot, categoryLabel } from "@/components/loom/Tokens";
import {
  Cpu, KeyRound, RotateCcw, Save, Search, Plus, Trash2, GitBranch, Coins,
  Bot, AlertTriangle, TrendingDown, ArrowRight, Wand2, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODELS = [
  { id: "gpt-4o",            label: "GPT-4o",            provider: "OpenAI",    tier: "premium",  costPer1k: 5.0 },
  { id: "gpt-4o-mini",       label: "GPT-4o mini",       provider: "OpenAI",    tier: "fast",     costPer1k: 0.15 },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", tier: "premium",  costPer1k: 3.0 },
  { id: "claude-3.5-haiku",  label: "Claude 3.5 Haiku",  provider: "Anthropic", tier: "fast",     costPer1k: 0.25 },
  { id: "claude-opus",       label: "Claude Opus",       provider: "Anthropic", tier: "premium+", costPer1k: 15.0 },
  { id: "gemini-2.0-flash",  label: "Gemini 2.0 Flash",  provider: "Google",    tier: "fast",     costPer1k: 0.10 },
];

export default function Agents() {
  return (
    <>
      <TopBar
        title="AI Settings"
        subtitle="Per-agent LLM routing · prompt templates · governance"
      />
      <Tabs defaultValue="agents" className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 border-b border-border bg-card/40">
          <TabsList>
            <TabsTrigger value="agents" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> Agents</TabsTrigger>
            <TabsTrigger value="routing" className="gap-1.5"><GitBranch className="h-3.5 w-3.5" /> Routing rules</TabsTrigger>
            <TabsTrigger value="budgets" className="gap-1.5"><Coins className="h-3.5 w-3.5" /> Budgets</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="agents" className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden">
          <AgentsTab />
        </TabsContent>
        <TabsContent value="routing" className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden overflow-auto">
          <RoutingTab />
        </TabsContent>
        <TabsContent value="budgets" className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden overflow-auto">
          <BudgetsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ====================== AGENTS TAB (original) ======================

function AgentsTab() {
  const [selectedId, setSelectedId] = useState(PIPELINE_NODES[8].id);
  const [query, setQuery] = useState("");
  const node = PIPELINE_NODES.find(n => n.id === selectedId)!;
  const [model, setModel] = useState(node.model || "gpt-4o");
  const [temp, setTemp] = useState([0.7]);
  const [topP, setTopP] = useState([0.9]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [retries, setRetries] = useState([3]);
  const [enabled, setEnabled] = useState(true);

  const filtered = PIPELINE_NODES.filter(n =>
    n.name.toLowerCase().includes(query.toLowerCase()) ||
    n.vi.toLowerCase().includes(query.toLowerCase())
  );

  const select = (id: string) => {
    setSelectedId(id);
    const n = PIPELINE_NODES.find(x => x.id === id)!;
    setModel(n.model || "gpt-4o");
  };

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-72 shrink-0 border-r border-border bg-card/40 flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter agents…" className="pl-8 h-9" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {filtered.map((n) => {
              const active = n.id === selectedId;
              return (
                <button
                  key={n.id}
                  onClick={() => select(n.id)}
                  className={cn(
                    "w-full text-left rounded-md px-3 py-2 text-sm transition-colors flex items-center gap-2.5",
                    active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-accent border border-transparent",
                  )}
                >
                  <CategoryDot category={n.category} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{n.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{n.vi}</div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[9px] px-1 py-0">P{n.phase}</Badge>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-3xl space-y-6">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <CategoryDot category={node.category} />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{categoryLabel[node.category]} agent · Phase {node.phase}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold">{node.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Enabled</Label>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-5">
            <h3 className="font-display font-semibold flex items-center gap-2"><Cpu className="h-4 w-4" /> Model routing</h3>
            <div className="space-y-2">
              <Label>LLM model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODELS.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <span>{m.label}</span>
                        <span className="text-[10px] text-muted-foreground">· {m.provider}</span>
                        <Badge variant="outline" className="ml-1 text-[9px]">{m.tier}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <span className="text-xs font-mono text-muted-foreground">{temp[0].toFixed(2)}</span>
              </div>
              <Slider value={temp} onValueChange={setTemp} max={2} step={0.05} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Top-p</Label>
                  <span className="text-xs font-mono text-muted-foreground">{topP[0].toFixed(2)}</span>
                </div>
                <Slider value={topP} onValueChange={setTopP} max={1} step={0.05} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Max tokens</Label>
                  <span className="text-xs font-mono text-muted-foreground">{maxTokens[0]}</span>
                </div>
                <Slider value={maxTokens} onValueChange={setMaxTokens} min={256} max={8192} step={128} />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-display font-semibold">System prompt</h3>
            <Textarea
              rows={8}
              className="font-mono text-xs"
              defaultValue={`You are the ${node.name} (${node.vi}) for the Narrative Loom pipeline.\n\nYour role: ${node.description}\n\nReceive NarrativeState as input. Output structured JSON matching the schema for ${node.id}.`}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Variables: <code className="font-mono">{`{world_id} {era} {tone} {pov}`}</code></span>
              <Button variant="ghost" size="sm" className="gap-1.5"><RotateCcw className="h-3 w-3" /> Reset to default</Button>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-display font-semibold">Retry & resilience</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Max retries</Label>
                  <span className="text-xs font-mono text-muted-foreground">{retries[0]}</span>
                </div>
                <Slider value={retries} onValueChange={setRetries} max={5} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Backoff strategy</Label>
                <Select defaultValue="exp">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exp">Exponential</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Use Loom Agents override</div>
                  <div className="text-xs text-muted-foreground">Pull config from backend per world / tick</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-end">
              <Button className="gap-1.5" onClick={() => toast.success("Configuration saved", { description: `${node.name} · ${model}` })}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

// ====================== ROUTING TAB ======================

type RuleField = "world.tier" | "world.entropy" | "world.status" | "task.revisionCount" | "agent.category";
type RuleOp = "==" | "!=" | ">" | "<" | ">=";

interface RoutingCondition { field: RuleField; op: RuleOp; value: string }
interface RoutingRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  agent: string; // pipeline node id, or "*"
  conditions: RoutingCondition[];
  routeTo: string; // model id
  fallback?: string;
}

const FIELD_LABEL: Record<RuleField, string> = {
  "world.tier":          "World tier",
  "world.entropy":       "World entropy",
  "world.status":        "World status",
  "task.revisionCount":  "Revision count",
  "agent.category":      "Agent category",
};

const INITIAL_RULES: RoutingRule[] = [
  { id: "r1", name: "Huyền Sử worlds → premium",  enabled: true,  priority: 1, agent: "wordsmith",
    conditions: [{ field: "world.tier", op: "==", value: "Huyền Sử" }],
    routeTo: "claude-opus", fallback: "claude-3.5-sonnet" },
  { id: "r2", name: "High entropy → fast model",  enabled: true,  priority: 2, agent: "*",
    conditions: [{ field: "world.entropy", op: ">", value: "0.6" }],
    routeTo: "gpt-4o-mini" },
  { id: "r3", name: "Critic always premium",      enabled: true,  priority: 3, agent: "critic",
    conditions: [{ field: "agent.category", op: "==", value: "quality" }],
    routeTo: "gpt-4o" },
  { id: "r4", name: "After 2 revisions → escalate", enabled: false, priority: 4, agent: "*",
    conditions: [{ field: "task.revisionCount", op: ">=", value: "2" }],
    routeTo: "claude-3.5-sonnet" },
];

function RoutingTab() {
  const [rules, setRules] = useState<RoutingRule[]>(INITIAL_RULES);

  const toggle = (id: string) => setRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const remove = (id: string) => { setRules(rs => rs.filter(r => r.id !== id)); toast.success("Rule deleted"); };
  const addRule = () => {
    const id = `r${Date.now().toString(36)}`;
    setRules(rs => [...rs, {
      id, name: "New routing rule", enabled: true, priority: rs.length + 1, agent: "*",
      conditions: [{ field: "world.tier", op: "==", value: "Chân Thực" }],
      routeTo: "gpt-4o-mini",
    }]);
    toast.success("Rule added");
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">Model routing rules</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Định tuyến động: chọn model phù hợp cho từng agent dựa trên ngữ cảnh world / task.
              Rules được chạy theo <strong>priority</strong> tăng dần — rule đầu tiên match sẽ được áp dụng.
            </p>
          </div>
          <Button className="gap-1.5" onClick={addRule}><Plus className="h-4 w-4" /> Add rule</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {rules.sort((a, b) => a.priority - b.priority).map(rule => (
          <Card key={rule.id} className={cn("p-4 transition-opacity", !rule.enabled && "opacity-60")}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Pri</span>
                <span className="font-display text-lg font-semibold tabular-nums leading-none">{rule.priority}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    className="h-8 max-w-xs font-medium border-transparent hover:border-border focus:border-input"
                    value={rule.name}
                    onChange={e => setRules(rs => rs.map(r => r.id === rule.id ? { ...r, name: e.target.value } : r))}
                  />
                  <Badge variant="outline" className="text-[10px]">Agent: {rule.agent === "*" ? "Any" : PIPELINE_NODES.find(n => n.id === rule.agent)?.name ?? rule.agent}</Badge>
                </div>

                {/* IF clauses */}
                <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">IF</div>
                  {rule.conditions.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <Select value={c.field} onValueChange={(v: RuleField) => updateCond(setRules, rule.id, i, { field: v })}>
                        <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(FIELD_LABEL) as RuleField[]).map(k => (
                            <SelectItem key={k} value={k}>{FIELD_LABEL[k]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={c.op} onValueChange={(v: RuleOp) => updateCond(setRules, rule.id, i, { op: v })}>
                        <SelectTrigger className="h-8 w-[70px] text-xs font-mono"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(["==", "!=", ">", "<", ">="] as RuleOp[]).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        className="h-8 w-[140px] text-xs font-mono"
                        value={c.value}
                        onChange={e => updateCond(setRules, rule.id, i, { value: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                {/* THEN */}
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-primary font-semibold inline-flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" /> THEN route to
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Primary model</Label>
                      <Select value={rule.routeTo} onValueChange={v => setRules(rs => rs.map(r => r.id === rule.id ? { ...r, routeTo: v } : r))}>
                        <SelectTrigger className="h-8 mt-1 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {MODELS.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Fallback (optional)</Label>
                      <Select value={rule.fallback ?? "none"} onValueChange={v => setRules(rs => rs.map(r => r.id === rule.id ? { ...r, fallback: v === "none" ? undefined : v } : r))}>
                        <SelectTrigger className="h-8 mt-1 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {MODELS.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <Switch checked={rule.enabled} onCheckedChange={() => toggle(rule.id)} />
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(rule.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="gap-1.5" onClick={() => toast.success("Routing rules saved")}>
          <Save className="h-4 w-4" /> Save all rules
        </Button>
      </div>
    </div>
  );
}

function updateCond(setRules: React.Dispatch<React.SetStateAction<RoutingRule[]>>, ruleId: string, idx: number, patch: Partial<RoutingCondition>) {
  setRules(rs => rs.map(r => {
    if (r.id !== ruleId) return r;
    const conds = r.conditions.map((c, i) => i === idx ? { ...c, ...patch } : c);
    return { ...r, conditions: conds };
  }));
}

// ====================== BUDGETS TAB ======================

interface AgentBudget {
  agentId: string;
  dailyLimit: number;
  spent: number;
  fallbackModel: string;
  alertThreshold: number; // 0..1
}

const INITIAL_BUDGETS: AgentBudget[] = PIPELINE_NODES.map((n, i) => ({
  agentId: n.id,
  dailyLimit: n.category === "creative" ? 50 : n.category === "engine" ? 8 : 15,
  spent: Math.round(Math.random() * (n.category === "creative" ? 45 : 12) * 100) / 100,
  fallbackModel: "gpt-4o-mini",
  alertThreshold: 0.8,
})).slice(0, 12);

function BudgetsTab() {
  const [budgets, setBudgets] = useState<AgentBudget[]>(INITIAL_BUDGETS);
  const [globalLimit, setGlobalLimit] = useState([500]);
  const [autoFallback, setAutoFallback] = useState(true);

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.dailyLimit, 0);
  const overBudget = budgets.filter(b => b.spent / b.dailyLimit >= b.alertThreshold).length;

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      {/* Global summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={<Coins className="h-4 w-4" />} label="Total spent today" value={`$${totalSpent.toFixed(2)}`} accent="text-primary" />
        <SummaryCard icon={<TrendingDown className="h-4 w-4" />} label="Total budget" value={`$${totalLimit.toFixed(0)}`} sub={`${((totalSpent / totalLimit) * 100).toFixed(0)}% used`} />
        <SummaryCard icon={<AlertTriangle className="h-4 w-4" />} label="Agents at risk" value={overBudget} accent={overBudget > 0 ? "text-warning" : undefined} />
        <SummaryCard icon={<Zap className="h-4 w-4" />} label="Fallbacks today" value="14" sub="auto-switched to mini" />
      </div>

      {/* Global controls */}
      <Card className="p-5 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2"><Wand2 className="h-4 w-4" /> Global guards</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Workspace daily cap</Label>
              <span className="text-xs font-mono text-muted-foreground">${globalLimit[0]}</span>
            </div>
            <Slider value={globalLimit} onValueChange={setGlobalLimit} min={50} max={2000} step={50} />
            <p className="text-[11px] text-muted-foreground">Khi đạt cap, mọi pipeline mới sẽ bị queue cho đến nửa đêm UTC.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
              <div>
                <div className="text-sm font-medium">Auto-fallback on budget hit</div>
                <div className="text-[11px] text-muted-foreground">Tự động hạ model xuống tier rẻ hơn khi 80% budget agent bị dùng</div>
              </div>
              <Switch checked={autoFallback} onCheckedChange={setAutoFallback} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
              <div>
                <div className="text-sm font-medium">Email alert ≥ 90%</div>
                <div className="text-[11px] text-muted-foreground">Gửi cảnh báo khi tổng workspace đạt 90% cap</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      {/* Per-agent budgets */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold">Per-agent budgets</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Daily spending limit & auto-fallback config cho từng agent</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Budgets reset")}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset all
          </Button>
        </div>
        <div className="divide-y divide-border">
          {budgets.map(b => {
            const node = PIPELINE_NODES.find(n => n.id === b.agentId);
            if (!node) return null;
            const pct = (b.spent / b.dailyLimit) * 100;
            const danger = pct >= b.alertThreshold * 100;
            const over = pct >= 100;
            return (
              <div key={b.agentId} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <CategoryDot category={node.category} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{node.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{node.vi}</div>
                  </div>
                </div>
                <div className="col-span-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={cn("font-mono tabular-nums", over ? "text-destructive font-semibold" : danger ? "text-warning" : "text-muted-foreground")}>
                      ${b.spent.toFixed(2)} / ${b.dailyLimit}
                    </span>
                    <span className={cn("text-[10px] tabular-nums", over ? "text-destructive" : danger ? "text-warning" : "text-muted-foreground")}>{pct.toFixed(0)}%</span>
                  </div>
                  <Progress
                    value={Math.min(100, pct)}
                    className={cn("h-1.5", over && "[&>div]:bg-destructive", !over && danger && "[&>div]:bg-warning")}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-[10px] text-muted-foreground">Daily limit ($)</Label>
                  <Input
                    type="number"
                    className="h-8 mt-0.5 text-xs font-mono"
                    value={b.dailyLimit}
                    onChange={e => setBudgets(bs => bs.map(x => x.agentId === b.agentId ? { ...x, dailyLimit: Number(e.target.value) || 0 } : x))}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-[10px] text-muted-foreground">Fallback model</Label>
                  <Select value={b.fallbackModel} onValueChange={v => setBudgets(bs => bs.map(x => x.agentId === b.agentId ? { ...x, fallbackModel: v } : x))}>
                    <SelectTrigger className="h-8 mt-0.5 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MODELS.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex justify-end">
                  {over ? (
                    <Badge className="bg-destructive/15 text-destructive border-destructive/20" variant="outline">Over</Badge>
                  ) : danger ? (
                    <Badge className="bg-warning/15 text-warning border-warning/20" variant="outline">Alert</Badge>
                  ) : (
                    <Badge className="bg-success/15 text-success border-success/20" variant="outline">OK</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-1.5" onClick={() => toast.success("Budgets saved")}>
          <Save className="h-4 w-4" /> Save budgets
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <div className={cn("font-display text-2xl font-semibold mt-1 tabular-nums", accent)}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </Card>
  );
}
