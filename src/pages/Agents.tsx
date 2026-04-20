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
import { PIPELINE_NODES } from "@/lib/loom-data";
import { CategoryDot, categoryLabel } from "@/components/loom/Tokens";
import { Cpu, KeyRound, RotateCcw, Save, Search } from "lucide-react";
import { toast } from "sonner";

const MODELS = [
  { id: "gpt-4o",            label: "GPT-4o",            provider: "OpenAI",    tier: "premium" },
  { id: "gpt-4o-mini",       label: "GPT-4o mini",       provider: "OpenAI",    tier: "fast" },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", tier: "premium" },
  { id: "claude-3.5-haiku",  label: "Claude 3.5 Haiku",  provider: "Anthropic", tier: "fast" },
  { id: "gemini-2.0-flash",  label: "Gemini 2.0 Flash",  provider: "Google",    tier: "fast" },
];

export default function Agents() {
  const [selectedId, setSelectedId] = useState(PIPELINE_NODES[8].id); // chief_editor
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
    <>
      <TopBar
        title="AI Settings"
        subtitle="Per-agent LLM routing · prompt templates · retry policies"
        action={
          <Button className="gap-1.5" onClick={() => toast.success("Configuration saved", { description: `${node.name} · ${model}` })}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <div className="flex-1 flex min-h-0">
        {/* Agent list */}
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
                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors flex items-center gap-2.5 ${
                      active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-accent border border-transparent"
                    }`}
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

        {/* Detail */}
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
                defaultValue={`You are the ${node.name} (${node.vi}) for the Narrative Loom pipeline.\n\nYour role: ${node.description}\n\nReceive NarrativeState as input. Output structured JSON matching the schema for ${node.id}.\n\nConstraints:\n- Stay in tone defined by chief_editor.\n- Respect noise_level when claiming historical fact.\n- Never invent contradictions to event_scores.`}
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
            </Card>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
