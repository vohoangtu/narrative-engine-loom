import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SAMPLE_PROSE, SAMPLE_OUTLINE } from "@/lib/loom-data";
import { Play, Sparkles, Quote, FileText, Wand2, Eye, Download, Copy, Megaphone, Palette, BookMarked, Users, BookOpen, MessageSquare, Feather, Clapperboard, Share2, AudioLines, Image as ImageIcon, Layers } from "lucide-react";
import { toast } from "sonner";
import { StoryPackTabs } from "@/components/loom/StoryPackTabs";
import { MediaKitTabs } from "@/components/loom/MediaKitTabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Studio() {
  const [running, setRunning] = useState(false);
  const [hasResult, setHasResult] = useState(true); // show prose by default for demo
  const [pov, setPov] = useState("omniscient");
  const [tone, setTone] = useState("epic");
  const [noise, setNoise] = useState([18]);

  const ARTIFACTS = [
    { group: "Core",       items: ["Prose", "Outline", "Headline & VFX", "State", "Critic"] },
    { group: "Story Pack", items: ["POV Variants", "Lore Codex", "Dialogue Script", "Prophecy & Verse"] },
    { group: "Media Kit",  items: ["Storyboard", "Social Pack", "Voiceover Script", "Cover Brief"] },
  ];
  const totalArtifacts = ARTIFACTS.reduce((s, g) => s + g.items.length, 0);

  const submit = () => {
    setRunning(true);
    setHasResult(false);
    toast.success("Pipeline submitted", { description: "tsk_8f3a92 queued · Centrifugo channel opened" });
    setTimeout(() => { setRunning(false); setHasResult(true); }, 2200);
  };

  return (
    <>
      <TopBar title="Narrative Studio" subtitle="Compose prompts · weave chronicles · review prose" />
      <ScrollArea className="flex-1">
        <div className="p-6 grid grid-cols-1 xl:grid-cols-5 gap-6 max-w-[1600px]">

          {/* LEFT — composer */}
          <Card className="xl:col-span-2 p-5 space-y-5 h-fit">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wand2 className="h-4 w-4 text-primary" />
                <h3 className="font-display font-semibold">Compose a weave</h3>
              </div>
              <p className="text-xs text-muted-foreground">Configure inputs for the LangGraph pipeline.</p>
            </div>

            <div className="space-y-2">
              <Label>World</Label>
              <Select defaultValue="aetheria">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aetheria">Aetheria · Age of Iron Crowns</SelectItem>
                  <SelectItem value="nyxos">Nyxos · Twilight Epoch</SelectItem>
                  <SelectItem value="helios">Helios · Solar Concordat</SelectItem>
                  <SelectItem value="drakmoor">Drakmoor · Wyrmfire Wars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Raw chronicles (events)</Label>
              <Textarea
                rows={6}
                placeholder="Paste raw events JSON or fetch from /loom/v1/narrative/chronicles…"
                defaultValue={`[
  { "tick": 1247, "type": "death",    "actor": "Lord Veyrith Sr.", "location": "Silver Tower" },
  { "tick": 1248, "type": "ascend",   "actor": "Aelric Veyrith",   "title": "Lord" },
  { "tick": 1252, "type": "envoy",    "from": "Six Kingdoms",      "to": "House Veyrith" }
]`}
                className="font-mono text-xs"
              />
              <div className="text-[11px] text-muted-foreground">3 events parsed · 0 warnings</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>POV</Label>
                <Select value={pov} onValueChange={setPov}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omniscient">Omniscient</SelectItem>
                    <SelectItem value="first">First person</SelectItem>
                    <SelectItem value="third-limited">Third — limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">Epic / mythic</SelectItem>
                    <SelectItem value="grim">Grimdark</SelectItem>
                    <SelectItem value="lyrical">Lyrical</SelectItem>
                    <SelectItem value="terse">Terse / journalistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Noise level (epistemic)</Label>
                <span className="text-xs font-mono text-muted-foreground">{(noise[0]/100).toFixed(2)}</span>
              </div>
              <Slider value={noise} onValueChange={setNoise} max={100} step={1} />
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Chân Thực</span><span>Mơ Hồ</span><span>Huyền Sử</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. duration</div>
                <div className="font-display font-semibold mt-0.5">~64s</div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. tokens</div>
                <div className="font-display font-semibold mt-0.5">~38k</div>
              </div>
            </div>

            <Button onClick={submit} disabled={running} className="w-full gap-2" size="lg">
              {running ? (<><Sparkles className="h-4 w-4 animate-spin" /> Weaving…</>) : (<><Play className="h-4 w-4" /> Submit weave</>)}
            </Button>
          </Card>

          {/* RIGHT — output */}
          <Card className="xl:col-span-3 p-0 overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="font-mono text-[10px]">tsk_7c2b41</Badge>
                  <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20">Done · 64.3s</Badge>
                  <Badge variant="outline" className="text-[10px]">Mơ Hồ · noise 0.42</Badge>
                  <Badge variant="outline" className="text-[10px]">1 revision</Badge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/25 cursor-pointer text-[10px] gap-1">
                        <Layers className="h-3 w-3" /> {totalArtifacts} artifacts
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="end">
                      <div className="text-xs font-semibold mb-2">Generated artifacts</div>
                      <div className="space-y-3">
                        {ARTIFACTS.map((g) => (
                          <div key={g.group}>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{g.group}</div>
                            <div className="flex flex-wrap gap-1">
                              {g.items.map((it) => (
                                <Badge key={it} variant="outline" className="text-[10px] font-normal">{it}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight truncate">
                  {running ? "Streaming prose…" : "Khi Mặt Trăng Vỡ, Các Vị Thần Cũng Cúi Đầu"}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(SAMPLE_PROSE); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
              </div>
            </div>

            <Tabs defaultValue="prose" className="w-full">
              <div className="px-5 pt-3 pb-1 border-b space-y-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold w-20 shrink-0">Core</span>
                    <TabsList className="h-9">
                      <TabsTrigger value="prose" className="text-xs"><Quote className="h-3 w-3 mr-1" /> Prose</TabsTrigger>
                      <TabsTrigger value="outline" className="text-xs"><BookMarked className="h-3 w-3 mr-1" /> Outline</TabsTrigger>
                      <TabsTrigger value="state" className="text-xs"><FileText className="h-3 w-3 mr-1" /> State</TabsTrigger>
                      <TabsTrigger value="critic" className="text-xs"><Eye className="h-3 w-3 mr-1" /> Critic</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold w-20 shrink-0">Story Pack</span>
                  <TabsList className="h-9">
                    <TabsTrigger value="pov" className="text-xs"><Users className="h-3 w-3 mr-1" /> POV ×3</TabsTrigger>
                    <TabsTrigger value="codex" className="text-xs"><BookOpen className="h-3 w-3 mr-1" /> Codex</TabsTrigger>
                    <TabsTrigger value="dialogue" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" /> Dialogue</TabsTrigger>
                    <TabsTrigger value="verse" className="text-xs"><Feather className="h-3 w-3 mr-1" /> Verse</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-info font-semibold w-20 shrink-0">Media Kit</span>
                  <TabsList className="h-9">
                    <TabsTrigger value="headline" className="text-xs"><Megaphone className="h-3 w-3 mr-1" /> Headline</TabsTrigger>
                    <TabsTrigger value="storyboard" className="text-xs"><Clapperboard className="h-3 w-3 mr-1" /> Storyboard</TabsTrigger>
                    <TabsTrigger value="social" className="text-xs"><Share2 className="h-3 w-3 mr-1" /> Social</TabsTrigger>
                    <TabsTrigger value="voiceover" className="text-xs"><AudioLines className="h-3 w-3 mr-1" /> Voiceover</TabsTrigger>
                    <TabsTrigger value="cover" className="text-xs"><ImageIcon className="h-3 w-3 mr-1" /> Cover</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="prose" className="m-0">
                <div className="px-8 py-8 max-w-3xl mx-auto">
                  {!hasResult ? (
                    <div className="space-y-3">
                      {[...Array(8)].map((_, i) => <div key={i} className="h-4 rounded shimmer" style={{ width: `${70 + (i*5) % 30}%` }} />)}
                    </div>
                  ) : (
                    <article className="prose prose-neutral max-w-none">
                      {SAMPLE_PROSE.split("\n\n").map((p, i) => (
                        <p key={i} className="text-foreground/90 leading-[1.85] text-[15px] mb-4 first:first-letter:font-display first:first-letter:text-5xl first:first-letter:font-bold first:first-letter:float-left first:first-letter:mr-2 first:first-letter:leading-none first:first-letter:text-primary">
                          {p}
                        </p>
                      ))}
                    </article>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="outline" className="m-0 p-6 space-y-4">
                {SAMPLE_OUTLINE.map((act) => (
                  <div key={act.act} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-display font-bold text-2xl text-primary">{act.act}</span>
                      <h4 className="font-display font-semibold">{act.title}</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {act.beats.map((b, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-muted-foreground font-mono text-xs mt-0.5">{i+1}.</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="headline" className="m-0 p-6 space-y-4">
                <Card className="p-5 bg-accent/40 border-dashed">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-2">
                    <Megaphone className="h-3 w-3" /> News Anchor headline
                  </div>
                  <div className="font-display text-2xl font-bold">Khi Mặt Trăng Vỡ, Các Vị Thần Cũng Cúi Đầu</div>
                  <div className="text-sm text-muted-foreground mt-2 italic">"Một đêm duy nhất đã viết lại lịch sử Nyxos, và không ai trong thành Twilight kịp đọc tới dòng cuối cùng."</div>
                </Card>
                <Card className="p-5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-3">
                    <Palette className="h-3 w-3" /> VFX config
                  </div>
                  <pre className="font-mono text-xs bg-muted/50 rounded-md p-3 overflow-x-auto">{`{
  "palette":  ["#0b0f23", "#3b1f5a", "#c9a14b"],
  "particles": "ash",
  "intensity": 0.78,
  "ambient":  "low_strings",
  "camera":   { "shake": 0.3, "tilt": 6 }
}`}</pre>
                </Card>
              </TabsContent>

              <TabsContent value="state" className="m-0 p-6">
                <pre className="font-mono text-xs bg-muted/50 rounded-md p-4 overflow-x-auto leading-relaxed">{`NarrativeState {
  task_id: "tsk_7c2b41",
  world_id: "world_nyxos",
  world_era: "Twilight Epoch",
  raw_chronicles: [...12 events],

  // Engine outputs
  event_scores:        { mean: 0.61, max: 0.94 },
  narrative_phase:     "climax",
  singularity:         { name: "Mặt Trăng Vỡ", confidence: 0.71 },
  attractor_clusters:  3,
  dramatic_arc:        "rising → climax",
  noise_level:         0.42,
  resonance_scars:     ["broken_pact", "moonfall"],
  epistemic_tier:      "Mơ Hồ",

  // Agent outputs
  historical_outline:    { acts: 3, beats: 9 },
  psychological_profiles: 4,
  storyboard:            { scenes: 12, shots: 38 },
  final_prose:           "Mùa đông năm ấy…",

  completed_agents: [16],
  revision_count:   1,
  feedback:         "pacing improved on second pass"
}`}</pre>
              </TabsContent>

              <TabsContent value="critic" className="m-0 p-6 space-y-3">
                {[
                  { label: "Voice consistency", score: 92, ok: true },
                  { label: "Pacing",            score: 78, ok: true },
                  { label: "Mythic resonance",  score: 88, ok: true },
                  { label: "Factual fidelity",  score: 71, ok: true },
                  { label: "Cliché detection",  score: 64, ok: false },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="h-1.5 mt-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${c.ok ? "bg-success" : "bg-warning"}`} style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                    <div className="font-mono text-sm w-12 text-right">{c.score}</div>
                    <Badge variant={c.ok ? "secondary" : "outline"} className={c.ok ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning border-warning/30"}>
                      {c.ok ? "Pass" : "Warn"}
                    </Badge>
                  </div>
                ))}
                <div className="rounded-lg border-dashed border bg-accent/40 p-4 text-sm">
                  <div className="font-medium mb-1">Revision note (round 1 → 2)</div>
                  <p className="text-muted-foreground italic">"Tighten the second act. The envoys' silence should feel heavier — let snow do more of the talking before the dialogue."</p>
                </div>
              </TabsContent>

              <StoryPackTabs />
              <MediaKitTabs />
            </Tabs>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
