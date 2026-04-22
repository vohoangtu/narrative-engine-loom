import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Crown, Shield, Scale, Flame, Users, MapPin, Castle, Tent, Mountain, Building2,
  Swords, Handshake, FileSignature, ScrollText, Sparkles, Compass, Skull,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Faction, type FactionDetail, type FactionCharacter, type FactionEvent, type FactionTerritory,
  getFactionDetail,
} from "@/lib/worlds-data";

const FACTION_COLOR: Record<Faction["color"], string> = {
  primary:          "bg-primary/15 text-primary border-primary/25",
  info:             "bg-info/15 text-info border-info/25",
  success:          "bg-success/15 text-success border-success/25",
  warning:          "bg-warning/15 text-warning border-warning/25",
  destructive:      "bg-destructive/15 text-destructive border-destructive/25",
  "agent-creative": "bg-agent-creative/15 text-agent-creative border-agent-creative/25",
};

const ALIGN_META = {
  lawful:  { label: "Lawful",  cls: "bg-info/10 text-info border-info/20", icon: <Shield className="h-3 w-3" /> },
  neutral: { label: "Neutral", cls: "bg-muted text-muted-foreground border-border", icon: <Scale className="h-3 w-3" /> },
  chaotic: { label: "Chaotic", cls: "bg-destructive/10 text-destructive border-destructive/20", icon: <Flame className="h-3 w-3" /> },
} as const;

const TERRITORY_ICON: Record<FactionTerritory["type"], React.ReactNode> = {
  capital:   <Building2 className="h-3.5 w-3.5" />,
  fortress:  <Castle className="h-3.5 w-3.5" />,
  outpost:   <Tent className="h-3.5 w-3.5" />,
  sanctuary: <Sparkles className="h-3.5 w-3.5" />,
  ruin:      <Mountain className="h-3.5 w-3.5" />,
};

const EVENT_ICON: Record<FactionEvent["type"], React.ReactNode> = {
  battle:    <Swords className="h-3.5 w-3.5" />,
  treaty:    <Handshake className="h-3.5 w-3.5" />,
  betrayal:  <Skull className="h-3.5 w-3.5" />,
  decree:    <FileSignature className="h-3.5 w-3.5" />,
  ritual:    <Sparkles className="h-3.5 w-3.5" />,
  discovery: <Compass className="h-3.5 w-3.5" />,
};

const EVENT_COLOR: Record<FactionEvent["type"], string> = {
  battle:    "bg-destructive/10 text-destructive border-destructive/20",
  treaty:    "bg-success/10 text-success border-success/20",
  betrayal:  "bg-destructive/10 text-destructive border-destructive/20",
  decree:    "bg-info/10 text-info border-info/20",
  ritual:    "bg-agent-creative/10 text-agent-creative border-agent-creative/20",
  discovery: "bg-warning/10 text-warning border-warning/20",
};

const IMPACT_CLS: Record<FactionEvent["impact"], string> = {
  low:          "bg-muted text-muted-foreground border-border",
  medium:       "bg-info/10 text-info border-info/20",
  high:         "bg-warning/10 text-warning border-warning/20",
  catastrophic: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_CLS: Record<FactionCharacter["status"], string> = {
  alive:    "bg-success/10 text-success border-success/20",
  exiled:   "bg-warning/10 text-warning border-warning/20",
  deceased: "bg-destructive/10 text-destructive border-destructive/20",
  missing:  "bg-muted text-muted-foreground border-border",
};

interface Props {
  worldId: string;
  faction: Faction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FactionDrawer({ worldId, faction, open, onOpenChange }: Props) {
  const detail: FactionDetail | undefined = faction ? getFactionDetail(worldId, faction.id) : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-hidden">
        {faction && detail && (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border space-y-3">
              <div className="flex items-start gap-3">
                <div className={cn("h-12 w-12 rounded-md grid place-items-center border shrink-0", FACTION_COLOR[faction.color])}>
                  <Crown className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="font-display text-2xl leading-tight">{faction.name}</SheetTitle>
                  <SheetDescription className="italic">"{faction.motto}"</SheetDescription>
                </div>
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border", ALIGN_META[faction.alignment].cls)}>
                  {ALIGN_META[faction.alignment].icon}{ALIGN_META[faction.alignment].label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Crown className="h-3 w-3" /> {faction.leader} · {faction.leaderTitle}</span>
                <Separator orientation="vertical" className="h-3" />
                <span>Founded {detail.founded}</span>
                <Separator orientation="vertical" className="h-3" />
                <span>Capital: {detail.capital}</span>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-5">
                {/* Bio */}
                <Section icon={<ScrollText className="h-4 w-4" />} title="Lịch sử">
                  <p className="text-sm leading-relaxed text-muted-foreground">{detail.bio}</p>
                </Section>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <StatBlock label="Members" value={faction.members.toLocaleString()} />
                  <StatBlock label="Influence" value={`${(faction.influence * 100).toFixed(0)}%`} bar={faction.influence} />
                  <StatBlock label="Territories" value={detail.territories.length} />
                </div>

                {/* Characters */}
                <Section icon={<Users className="h-4 w-4" />} title="Nhân vật chính" count={detail.characters.length}>
                  <div className="space-y-1.5">
                    {detail.characters.map((c, i) => (
                      <motion.div
                        key={`${c.name}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-[11px] font-semibold text-primary-foreground shrink-0">
                          {c.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-tight truncate">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.role}</div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 capitalize", STATUS_CLS[c.status])}>
                          {c.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </Section>

                {/* Territories */}
                <Section icon={<MapPin className="h-4 w-4" />} title="Lãnh thổ" count={detail.territories.length}>
                  <div className="grid grid-cols-1 gap-2">
                    {detail.territories.map((t, i) => (
                      <Card key={`${t.name}-${i}`} className="p-3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-accent text-accent-foreground grid place-items-center shrink-0">
                          {TERRITORY_ICON[t.type]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{t.name}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{t.type}</Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">
                            Pop {t.population.toLocaleString()} · Control {(t.control * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div className="w-20">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                t.control > 0.7 ? "bg-success" : t.control > 0.4 ? "bg-warning" : "bg-destructive",
                              )}
                              style={{ width: `${t.control * 100}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Section>

                {/* Events */}
                <Section icon={<ScrollText className="h-4 w-4" />} title="Sự kiện gần đây" count={detail.events.length}>
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                    <div className="space-y-3">
                      {detail.events.map((e, i) => (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="relative"
                        >
                          <span className={cn(
                            "absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2 bg-card",
                            e.impact === "catastrophic" ? "border-destructive" :
                            e.impact === "high"         ? "border-warning" :
                            e.impact === "medium"       ? "border-info" : "border-border",
                          )} />
                          <Card className="p-3">
                            <div className="flex items-start gap-2">
                              <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-medium capitalize", EVENT_COLOR[e.type])}>
                                {EVENT_ICON[e.type]}{e.type}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">{e.date}</span>
                              <Badge variant="outline" className={cn("ml-auto text-[10px] px-1.5 py-0 capitalize", IMPACT_CLS[e.impact])}>
                                {e.impact}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium mt-1.5">{e.title}</div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{e.summary}</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Section>
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ icon, title, count, children }: { icon: React.ReactNode; title: string; count?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="font-display text-sm font-semibold">{title}</h3>
        {count !== undefined && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{count}</Badge>}
      </div>
      {children}
    </div>
  );
}

function StatBlock({ label, value, bar }: { label: string; value: React.ReactNode; bar?: number }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold tabular-nums">{value}</div>
      {bar !== undefined && (
        <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${bar * 100}%` }} />
        </div>
      )}
    </div>
  );
}
