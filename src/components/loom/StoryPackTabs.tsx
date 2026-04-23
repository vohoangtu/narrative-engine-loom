import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  SAMPLE_POV_VARIANTS,
  SAMPLE_CODEX,
  SAMPLE_DIALOGUE,
  SAMPLE_VERSE,
  type CodexEntry,
} from "@/lib/loom-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

function ArtifactToolbar({ label, payload }: { label: string; payload: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5"
          onClick={() => { navigator.clipboard.writeText(payload); toast.success("Copied"); }}>
          <Copy className="h-3 w-3" /> Copy
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Download className="h-3 w-3" /> Download
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5"
          onClick={() => toast.info("Regenerating…")}>
          <RefreshCw className="h-3 w-3" /> Regenerate
        </Button>
      </div>
    </div>
  );
}

function renderCrosslinks(text: string, onJump: (id: string) => void, entries: CodexEntry[]) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[\[([^\]]+)\]\]$/);
    if (!m) return <span key={i}>{p}</span>;
    const target = entries.find((e) => e.title === m[1]);
    return (
      <button
        key={i}
        onClick={() => target && onJump(target.id)}
        className={cn(
          "underline-offset-2 hover:underline font-medium",
          target ? "text-primary" : "text-muted-foreground italic",
        )}
      >
        {m[1]}
      </button>
    );
  });
}

export function StoryPackTabs() {
  const [activeCodex, setActiveCodex] = useState(SAMPLE_CODEX[0].id);
  const codex = SAMPLE_CODEX.find((e) => e.id === activeCodex) ?? SAMPLE_CODEX[0];

  return (
    <>
      {/* POV VARIANTS */}
      <TabsContent value="pov" className="m-0">
        <ArtifactToolbar label="Multi-POV · Wordsmith Fork × 3" payload={SAMPLE_POV_VARIANTS.map(v => `[${v.character}]\n${v.excerpt}`).join("\n\n")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
          {SAMPLE_POV_VARIANTS.map((v) => {
            const tone =
              v.accent === "primary" ? "bg-primary/8 border-primary/30" :
              v.accent === "warning" ? "bg-warning/8 border-warning/30" :
                                       "bg-info/8 border-info/30";
            const dot =
              v.accent === "primary" ? "bg-primary" :
              v.accent === "warning" ? "bg-warning" : "bg-info";
            return (
              <Card key={v.character} className={cn("p-5 border", tone)}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("h-2 w-2 rounded-full", dot)} />
                  <div className="font-display font-semibold text-sm">{v.character}</div>
                </div>
                <Badge variant="outline" className="text-[10px] mb-3">{v.role}</Badge>
                <p className="text-[14px] leading-[1.75] text-foreground/90 italic">"{v.excerpt}"</p>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      {/* CODEX */}
      <TabsContent value="codex" className="m-0">
        <ArtifactToolbar label="Lore Codex · Lorekeeper" payload={SAMPLE_CODEX.map(e => `# ${e.title}\n${e.body}`).join("\n\n")} />
        <div className="grid grid-cols-12 gap-0 border-t">
          <aside className="col-span-4 border-r min-h-[420px] p-3 space-y-1 bg-muted/20">
            {SAMPLE_CODEX.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveCodex(e.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md transition-colors",
                  activeCodex === e.id ? "bg-card border shadow-sm" : "hover:bg-accent/50",
                )}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{e.type}</div>
                <div className="font-medium text-sm">{e.title}</div>
              </button>
            ))}
          </aside>
          <main className="col-span-8 p-6">
            <Badge variant="outline" className="text-[10px] mb-2">{codex.type}</Badge>
            <h3 className="font-display text-2xl font-bold mb-1">{codex.title}</h3>
            <p className="text-sm text-muted-foreground italic mb-5 leading-relaxed">
              {renderCrosslinks(codex.summary, setActiveCodex, SAMPLE_CODEX)}
            </p>
            <div className="prose prose-sm max-w-none text-[14px] leading-[1.85] text-foreground/90">
              {renderCrosslinks(codex.body, setActiveCodex, SAMPLE_CODEX)}
            </div>
          </main>
        </div>
      </TabsContent>

      {/* DIALOGUE */}
      <TabsContent value="dialogue" className="m-0">
        <ArtifactToolbar
          label="Dialogue Script · Playwright"
          payload={SAMPLE_DIALOGUE.map(l => l.type === "speech" ? `${l.speaker}: ${l.text}` : `(${l.text})`).join("\n\n")}
        />
        <div className="px-8 py-6 max-w-3xl mx-auto font-mono text-sm leading-[1.9]">
          {SAMPLE_DIALOGUE.map((line, i) =>
            line.type === "direction" ? (
              <p key={i} className="text-muted-foreground italic my-4 text-[13px]">
                ({line.text})
              </p>
            ) : (
              <div key={i} className="my-3">
                <div className="font-display font-bold tracking-[0.15em] text-xs uppercase text-primary">
                  {line.speaker}
                </div>
                <div className="ml-8 text-foreground/90 font-sans text-[15px]">{line.text}</div>
              </div>
            ),
          )}
        </div>
      </TabsContent>

      {/* VERSE */}
      <TabsContent value="verse" className="m-0">
        <ArtifactToolbar label="Prophecy & Verse · Oracle" payload={SAMPLE_VERSE} />
        <div className="px-6 py-10 bg-gradient-to-b from-muted/30 to-transparent">
          <pre className="font-display text-center text-foreground/90 text-xl leading-[2.1] whitespace-pre-wrap max-w-2xl mx-auto italic">
{SAMPLE_VERSE}
          </pre>
          <div className="text-center mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            — Lời tiên tri của Mùa Đông Veyrith —
          </div>
        </div>
      </TabsContent>
    </>
  );
}