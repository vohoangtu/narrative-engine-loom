import { Search, Bell, Plus, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-6 gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-lg font-semibold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>

      <div className="hidden lg:flex relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tasks, worlds, agents…" className="pl-9 pr-12 h-9 bg-background" />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground inline-flex items-center gap-0.5">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </div>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
      </Button>

      {action ?? (
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" /> New Weave
        </Button>
      )}
    </header>
  );
}
