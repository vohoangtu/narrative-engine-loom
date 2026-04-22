import { useCallback, useMemo, useState, useRef, type DragEvent } from "react";
import ReactFlow, {
  Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState,
  ReactFlowProvider, MarkerType, Handle, Position,
  type Node, type Edge, type Connection, type NodeProps, type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PIPELINE_NODES, type PipelineNode as PNode } from "@/lib/loom-data";
import { CategoryDot, categoryLabel } from "@/components/loom/Tokens";
import { Save, Play, Trash2, Plus, GripVertical, FileDown, FileUp, Layers, Zap, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_BORDER: Record<PNode["category"], string> = {
  engine:   "border-info/40 bg-info/5",
  creative: "border-agent-creative/40 bg-agent-creative/5",
  quality:  "border-success/40 bg-success/5",
  output:   "border-warning/40 bg-warning/5",
};
const CATEGORY_ACCENT: Record<PNode["category"], string> = {
  engine:   "text-info",
  creative: "text-agent-creative",
  quality:  "text-success",
  output:   "text-warning",
};

// Custom node renderer
function LoomNode({ data, selected }: NodeProps<{ node: PNode }>) {
  const n = data.node;
  return (
    <div className={cn(
      "min-w-[200px] rounded-lg border-2 bg-card backdrop-blur-sm shadow-sm transition-all",
      CATEGORY_BORDER[n.category],
      selected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-glow",
    )}>
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !bg-primary !border-2 !border-card" />
      <div className="p-2.5">
        <div className="flex items-center gap-2 mb-1">
          <CategoryDot category={n.category} />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">P{n.phase} · {categoryLabel[n.category]}</span>
        </div>
        <div className="font-display text-sm font-semibold leading-tight">{n.name}</div>
        <div className="text-[11px] text-muted-foreground italic">{n.vi}</div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-mono truncate">{n.model ?? "default"}</span>
          <span className={cn("tabular-nums", CATEGORY_ACCENT[n.category])}>{n.avgDuration}s</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !bg-primary !border-2 !border-card" />
    </div>
  );
}

const nodeTypes = { loom: LoomNode };

const TEMPLATES = [
  { id: "full",     name: "Full epic narrative", desc: "All 18 nodes, max quality" },
  { id: "fast",     name: "Fast headline only",  desc: "Engines + News Anchor (4 nodes)" },
  { id: "research", name: "Research outline",    desc: "Engines + Historian + Critic" },
  { id: "custom",   name: "Custom (blank)",      desc: "Build from scratch" },
];

let idCounter = 100;
const nextId = () => `n_${++idCounter}`;

function buildInitial(): { nodes: Node[]; edges: Edge[] } {
  // Default: Phase 1 row → Phase 2 row, simple linear demo
  const phase1 = PIPELINE_NODES.filter(n => n.phase === 1).slice(0, 4);
  const phase2 = ["chief_editor", "historian", "wordsmith", "critic", "archivist"]
    .map(id => PIPELINE_NODES.find(n => n.id === id)!).filter(Boolean);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  phase1.forEach((n, i) => {
    const id = nextId();
    nodes.push({ id, type: "loom", position: { x: 60 + i * 240, y: 80 }, data: { node: n } });
  });
  phase2.forEach((n, i) => {
    const id = nextId();
    nodes.push({ id, type: "loom", position: { x: 60 + i * 240, y: 280 }, data: { node: n } });
  });

  // Connect phase1 chain
  for (let i = 0; i < phase1.length - 1; i++) {
    edges.push({ id: `e_${i}`, source: nodes[i].id, target: nodes[i + 1].id, animated: true, markerEnd: { type: MarkerType.ArrowClosed } });
  }
  // Bridge phase1 last → phase2 first
  edges.push({ id: "e_bridge", source: nodes[phase1.length - 1].id, target: nodes[phase1.length].id, animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: "4 4" } });
  // Phase 2 chain
  for (let i = 0; i < phase2.length - 1; i++) {
    edges.push({ id: `e_p2_${i}`, source: nodes[phase1.length + i].id, target: nodes[phase1.length + i + 1].id, animated: true, markerEnd: { type: MarkerType.ArrowClosed } });
  }
  return { nodes, edges };
}

function PipelineBuilderInner() {
  const initial = useMemo(buildInitial, []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pipelineName, setPipelineName] = useState("My custom pipeline");
  const [pipelineDesc, setPipelineDesc] = useState("Engines → Chief Editor → Historian → Wordsmith → Critic → Archivist");
  const [maxRevisions, setMaxRevisions] = useState([2]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback((c: Connection) => {
    setEdges(eds => addEdge({ ...c, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, [setEdges]);

  const filtered = useMemo(
    () => PIPELINE_NODES.filter(n =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.vi.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  );

  const onDragStart = (e: DragEvent, nodeId: string) => {
    e.dataTransfer.setData("application/loom-node", nodeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData("application/loom-node");
    if (!nodeId || !rfInstance || !reactFlowWrapper.current) return;
    const def = PIPELINE_NODES.find(n => n.id === nodeId);
    if (!def) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    const newId = nextId();
    setNodes(ns => ns.concat({ id: newId, type: "loom", position, data: { node: def } }));
    toast.success("Node added", { description: def.name });
  }, [rfInstance, setNodes]);

  const selectedNode = nodes.find(n => n.id === selectedId);
  const selectedDef: PNode | undefined = selectedNode?.data?.node;

  const removeSelected = () => {
    if (!selectedId) return;
    setNodes(ns => ns.filter(n => n.id !== selectedId));
    setEdges(es => es.filter(e => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
    toast.success("Node removed");
  };

  const totalCost = nodes.reduce((sum, n: any) => sum + (n.data.node.avgDuration ?? 0), 0);
  const dispatch = () => toast.success("Pipeline dispatched", { description: `${nodes.length} nodes · ~${totalCost.toFixed(1)}s ETA` });
  const save     = () => toast.success("Template saved", { description: pipelineName });
  const exportJson = () => {
    const payload = { name: pipelineName, description: pipelineDesc, maxRevisions: maxRevisions[0],
      nodes: nodes.map(n => ({ id: n.id, def: (n.data as any).node.id, position: n.position })),
      edges: edges.map(e => ({ source: e.source, target: e.target })) };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("Exported to clipboard", { description: "Pipeline JSON copied" });
  };

  const loadTemplate = (t: string) => {
    if (t === "custom") {
      setNodes([]); setEdges([]); setPipelineName("Untitled pipeline");
      toast.success("Blank canvas ready");
      return;
    }
    if (t === "fast") {
      const ids = ["event_normalizer", "entropy_engine", "chief_editor", "news_anchor"];
      const ns = ids.map((id, i) => ({
        id: nextId(), type: "loom",
        position: { x: 80 + i * 240, y: 160 },
        data: { node: PIPELINE_NODES.find(n => n.id === id)! },
      }));
      const es = ns.slice(0, -1).map((n, i) => ({
        id: `e_${i}`, source: n.id, target: ns[i + 1].id,
        animated: true, markerEnd: { type: MarkerType.ArrowClosed },
      }));
      setNodes(ns); setEdges(es); setPipelineName("Fast headline pipeline");
      toast.success("Template loaded", { description: "Fast headline (4 nodes)" });
      return;
    }
    const fresh = buildInitial();
    setNodes(fresh.nodes); setEdges(fresh.edges);
    setPipelineName(TEMPLATES.find(x => x.id === t)?.name ?? "Pipeline");
    toast.success("Template loaded");
  };

  return (
    <>
      <TopBar
        title="Pipeline Builder"
        subtitle={`${nodes.length} nodes · ${edges.length} edges · ~${totalCost.toFixed(1)}s avg run`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={exportJson}>
              <FileDown className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={save}>
              <Save className="h-4 w-4" /> Save template
            </Button>
            <Button size="sm" className="gap-1.5" onClick={dispatch}>
              <Play className="h-4 w-4" /> Dispatch
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex min-h-0">
        {/* Left palette */}
        <aside className="w-72 shrink-0 border-r border-border bg-card/40 flex flex-col">
          <Tabs defaultValue="nodes" className="flex flex-col h-full">
            <div className="px-3 pt-3">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="nodes" className="text-xs">Nodes</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="nodes" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
              <div className="p-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nodes…" className="pl-8 h-9" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 px-1">Drag a node onto the canvas</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filtered.map(n => (
                    <div
                      key={n.id}
                      draggable
                      onDragStart={e => onDragStart(e, n.id)}
                      className={cn(
                        "rounded-md border-2 p-2 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all flex items-center gap-2",
                        CATEGORY_BORDER[n.category],
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium leading-tight truncate">{n.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{n.vi}</div>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1 py-0">P{n.phase}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="flex-1 mt-0 data-[state=inactive]:hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {TEMPLATES.map(t => (
                    <Card key={t.id} className="p-3 cursor-pointer hover:border-primary/40 transition-colors" onClick={() => loadTemplate(t.id)}>
                      <div className="flex items-start gap-2">
                        <Layers className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            onNodeClick={(_, n) => setSelectedId(n.id)}
            onPaneClick={() => setSelectedId(null)}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            defaultEdgeOptions={{ animated: true, style: { stroke: "hsl(var(--primary))", strokeWidth: 1.6 } }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="hsl(var(--border))" gap={18} size={1} />
            <Controls className="!bg-card !border-border !shadow-sm" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(n: any) => {
                const c = n.data?.node?.category;
                return c === "engine" ? "hsl(var(--info))" :
                       c === "creative" ? "hsl(var(--agent-creative))" :
                       c === "quality" ? "hsl(var(--success))" : "hsl(var(--warning))";
              }}
              maskColor="hsl(var(--background) / 0.6)"
            />
          </ReactFlow>
        </div>

        {/* Right inspector */}
        <aside className="w-80 shrink-0 border-l border-border bg-card/40 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-display text-sm font-semibold flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Pipeline
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input value={pipelineName} onChange={e => setPipelineName(e.target.value)} className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea rows={2} value={pipelineDesc} onChange={e => setPipelineDesc(e.target.value)} className="mt-1 text-xs" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Max critic revisions</Label>
                      <span className="text-xs font-mono text-muted-foreground">{maxRevisions[0]}</span>
                    </div>
                    <Slider value={maxRevisions} onValueChange={setMaxRevisions} max={5} step={1} className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 grid grid-cols-3 gap-2 text-center">
                <Stat label="Nodes" value={nodes.length} />
                <Stat label="Edges" value={edges.length} />
                <Stat label="ETA" value={`${totalCost.toFixed(1)}s`} accent />
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-display text-sm font-semibold flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" /> Selected node
                </h3>
                {selectedDef ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border-2 p-2.5 bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryDot category={selectedDef.category} />
                        <Badge variant="outline" className="text-[9px] px-1 py-0">P{selectedDef.phase}</Badge>
                      </div>
                      <div className="font-display text-base font-semibold">{selectedDef.name}</div>
                      <div className="text-[11px] text-muted-foreground italic">{selectedDef.vi}</div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{selectedDef.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Override model</Label>
                        <Select defaultValue={selectedDef.model ?? "gpt-4o"}>
                          <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
                            <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                            <SelectItem value="claude-3.5-haiku">Claude 3.5 Haiku</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded border border-border p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg duration</div>
                          <div className="font-semibold tabular-nums">{selectedDef.avgDuration}s</div>
                        </div>
                        <div className="rounded border border-border p-2">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Phase</div>
                          <div className="font-semibold">Phase {selectedDef.phase}</div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-destructive hover:text-destructive" onClick={removeSelected}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove from pipeline
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    <Plus className="h-6 w-6 mx-auto mb-2 opacity-40" />
                    Click a node on the canvas to inspect it.
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-display text-lg font-semibold tabular-nums", accent && "text-primary")}>{value}</div>
    </div>
  );
}

export default function PipelineBuilder() {
  return (
    <ReactFlowProvider>
      <PipelineBuilderInner />
    </ReactFlowProvider>
  );
}
