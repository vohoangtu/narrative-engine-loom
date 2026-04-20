import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Workflow, BookOpenText, Sparkles, Settings2, History, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Workspace",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Workshop" },
      { to: "/pipeline", icon: Workflow, label: "Pipeline" },
      { to: "/studio", icon: BookOpenText, label: "Narrative Studio" },
    ],
  },
  {
    label: "Library",
    items: [
      { to: "/history", icon: History, label: "Task History" },
      { to: "/worlds", icon: Boxes, label: "Worlds" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/agents", icon: Sparkles, label: "AI Settings" },
      { to: "/settings", icon: Settings2, label: "Settings" },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="relative h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <div className="h-3 w-3 rounded-sm bg-primary-foreground/90 rotate-45" />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-sidebar-accent-foreground">Narrative Loom</div>
          <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Agentic Studio</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {sections.map((s) => (
          <div key={s.label}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{s.label}</div>
            <div className="space-y-0.5">
              {s.items.map((it) => {
                const active = pathname === it.to;
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <it.icon className="h-4 w-4 opacity-80" />
                    {it.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="font-medium text-sidebar-accent-foreground">All systems nominal</span>
          </div>
          <div className="text-[11px] text-sidebar-foreground/60 mt-1">Celery · Redis · Centrifugo</div>
        </div>
      </div>
    </aside>
  );
}
