import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Play, Twitter, Instagram, Music2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  SAMPLE_STORYBOARD,
  SAMPLE_SOCIAL,
  SAMPLE_VOICEOVER,
  SAMPLE_COVER_BRIEF,
  type StoryboardPanel,
  type SocialPack,
  type CoverBrief,
} from "@/lib/loom-data";
import { useState } from "react";
import { loomApi, ARTIFACT_ENDPOINTS, type ArtifactKind } from "@/lib/loom-api";
import { cn } from "@/lib/utils";

function ArtifactToolbar({
  label,
  payload,
  kind,
  onRegenerate,
}: {
  label: string;
  payload: string;
  kind: ArtifactKind;
  onRegenerate: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const ep = ARTIFACT_ENDPOINTS[kind];
  const handle = async () => {
    if (busy) return;
    setBusy(true);
    const t = toast.loading(`POST ${ep.path}`, { description: `Agent: ${ep.agent}` });
    try {
      await onRegenerate();
      toast.success(`${ep.agent} · regenerated`, { id: t, description: ep.path });
    } catch (e) {
      toast.error("Regeneration failed", { id: t, description: String(e) });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <Badge variant="outline" className="text-[10px] font-mono">{ep.method} {ep.path.split("/").pop()}</Badge>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5"
          onClick={() => { navigator.clipboard.writeText(payload); toast.success("Copied"); }}>
          <Copy className="h-3 w-3" /> Copy
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Download className="h-3 w-3" /> Download
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1.5"
          disabled={busy}
          onClick={handle}
        >
          <RefreshCw className={cn("h-3 w-3", busy && "animate-spin")} /> {busy ? "Generating…" : "Regenerate"}
        </Button>
      </div>
    </div>
  );
}

// Highlight SSML tokens
function highlightSSML(s: string) {
  const parts = s.split(/(<[^>]+>)/g);
  return parts.map((p, i) =>
    p.startsWith("<") ? (
      <span key={i} className="text-primary">{p}</span>
    ) : (
      <span key={i} className="text-foreground/85">{p}</span>
    ),
  );
}

export function MediaKitTabs() {
  const [igIndex, setIgIndex] = useState(0);
  const [socialTab, setSocialTab] = useState<"twitter" | "instagram" | "tiktok">("twitter");
  const [playing, setPlaying] = useState(false);
  const [storyboard, setStoryboard] = useState<StoryboardPanel[]>(SAMPLE_STORYBOARD);
  const [social, setSocial] = useState<SocialPack>(SAMPLE_SOCIAL);
  const [voiceover, setVoiceover] = useState(SAMPLE_VOICEOVER);
  const [cover, setCover] = useState<CoverBrief>(SAMPLE_COVER_BRIEF);

  return (
    <>
      {/* STORYBOARD */}
      <TabsContent value="storyboard" className="m-0">
        <ArtifactToolbar
          label={`Storyboard · Director · ${storyboard.length} panels`}
          kind="storyboard"
          payload={storyboard.map((p, i) => `Panel ${i + 1} [${p.shot}/${p.angle}] ${p.description}`).join("\n")}
          onRegenerate={async () => { const r = await loomApi.generateStoryboard(); setStoryboard(r.payload); }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6">
          {storyboard.map((p, i) => (
            <Card key={i} className="overflow-hidden border">
              <div
                className="aspect-video relative flex items-end p-3"
                style={{ background: `linear-gradient(135deg, hsl(${p.mood}), hsl(${p.mood} / 0.4))` }}
              >
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className="bg-background/80 text-foreground border-0 text-[10px] backdrop-blur">{p.shot}</Badge>
                  <Badge variant="outline" className="bg-background/60 text-[10px] backdrop-blur">{p.angle}</Badge>
                </div>
                <div className="absolute top-2 right-2 font-mono text-[10px] text-background/90 bg-foreground/40 px-1.5 py-0.5 rounded backdrop-blur">
                  #{String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="p-3 text-xs text-foreground/85 leading-relaxed">{p.description}</div>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* SOCIAL PACK */}
      <TabsContent value="social" className="m-0">
        <ArtifactToolbar
          label="Social Pack · Social Strategist"
          kind="social"
          payload={[...social.twitter, ...social.tiktok].join("\n\n")}
          onRegenerate={async () => { const r = await loomApi.generateSocial(); setSocial(r.payload); }}
        />
        <div className="px-6 pb-6">
          <div className="flex gap-1 mb-4 border-b">
            {(["twitter", "instagram", "tiktok"] as const).map((t) => {
              const Icon = t === "twitter" ? Twitter : t === "instagram" ? Instagram : Music2;
              return (
                <button
                  key={t}
                  onClick={() => setSocialTab(t)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 border-b-2 transition-colors capitalize",
                    socialTab === t
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {t}
                </button>
              );
            })}
          </div>

          {socialTab === "twitter" && (
            <div className="max-w-xl mx-auto space-y-2">
              {social.twitter.map((tweet, i) => (
                <div key={i} className="rounded-2xl border p-4 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold">Aetheria Chronicle</span>
                        <span className="text-muted-foreground">@aetheria_loom</span>
                        <span className="text-muted-foreground">· {i + 1}/{social.twitter.length}</span>
                      </div>
                      <p className="text-sm mt-1 leading-relaxed text-foreground/90">{tweet}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {socialTab === "instagram" && (
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div
                  className="aspect-square rounded-2xl flex items-end p-6 text-background"
                  style={{ background: social.instagram[igIndex].visual }}
                >
                  <div className="font-display text-2xl font-bold drop-shadow-lg">
                    {social.instagram[igIndex].caption}
                  </div>
                </div>
                <div className="flex justify-center gap-1.5 mt-3">
                  {social.instagram.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIgIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        igIndex === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <div className="text-center text-xs text-muted-foreground mt-2 font-mono">
                  Slide {igIndex + 1} / {social.instagram.length}
                </div>
              </div>
            </div>
          )}

          {socialTab === "tiktok" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {social.tiktok.map((hook, i) => (
                <Card key={i} className="aspect-[9/16] p-5 flex flex-col justify-end bg-gradient-to-b from-foreground/5 via-transparent to-foreground/40">
                  <Badge variant="outline" className="self-start mb-2 text-[10px]">Hook v{i + 1}</Badge>
                  <p className="font-display font-bold text-lg leading-snug">{hook}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      {/* VOICEOVER */}
      <TabsContent value="voiceover" className="m-0">
        <ArtifactToolbar
          label="Voiceover Script · SSML"
          kind="voiceover"
          payload={voiceover}
          onRegenerate={async () => { const r = await loomApi.generateVoiceover(); setVoiceover(r.payload); }}
        />
        <div className="px-6 pb-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={playing ? "secondary" : "default"}
                  className="h-8 gap-1.5"
                  onClick={() => { setPlaying(!playing); toast.info(playing ? "Paused" : "Playing preview…"); }}
                >
                  <Play className="h-3.5 w-3.5" /> {playing ? "Pause" : "Play"}
                </Button>
                <span className="text-xs text-muted-foreground font-mono">~32s · vi-VN-NamMinhNeural</span>
              </div>
              <Badge variant="outline" className="text-[10px]">SSML 1.1</Badge>
            </div>
            <pre className="font-mono text-xs leading-[1.9] p-4 whitespace-pre-wrap bg-card overflow-x-auto">
              {highlightSSML(voiceover)}
            </pre>
            <div className="px-4 py-3 border-t bg-muted/20">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full bg-primary transition-all", playing ? "w-1/3" : "w-0")} />
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      {/* COVER BRIEF */}
      <TabsContent value="cover" className="m-0">
        <ArtifactToolbar
          label="Cover Art Brief · Image-gen ready"
          kind="cover"
          payload={cover.prompt}
          onRegenerate={async () => { const r = await loomApi.generateCover(); setCover(r.payload); }}
        />
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Prompt</div>
              <Card className="p-4 bg-muted/30">
                <p className="text-sm leading-relaxed text-foreground/90 italic">{cover.prompt}</p>
              </Card>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Reference moodboard</div>
              <div className="flex flex-wrap gap-2">
                {cover.references.map((r) => (
                  <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                ))}
              </div>
            </div>
            <Button className="gap-2" onClick={() => toast.success("Sent to image generator", { description: "Queued in DALL-E pipeline" })}>
              <Sparkles className="h-4 w-4" /> Send to image gen
            </Button>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Palette · {cover.aspectRatio}
              </div>
              <Card className="p-4 space-y-3">
                {cover.palette.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md border shrink-0"
                      style={{ background: `hsl(${c.hsl})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">hsl({c.hsl})</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
            <Card
              className="aspect-[2/3] p-4 flex items-end overflow-hidden border"
              style={{
                background: `linear-gradient(160deg, hsl(${cover.palette[0].hsl}), hsl(${cover.palette[2].hsl}))`,
              }}
            >
              <div className="text-background drop-shadow-lg">
                <div className="text-[10px] uppercase tracking-[0.3em] mb-1 opacity-80">Aetheria Chronicle</div>
                <div className="font-display font-bold text-xl leading-tight">Khi Mặt Trăng Vỡ</div>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>
    </>
  );
}