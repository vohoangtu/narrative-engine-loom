import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function ComingSoon({ title, subtitle, hint }: { title: string; subtitle: string; hint: string }) {
  return (
    <>
      <TopBar title={title} subtitle={subtitle} />
      <div className="flex-1 grid place-items-center p-6">
        <Card className="p-10 text-center max-w-md">
          <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground grid place-items-center mx-auto mb-4">
            <Construction className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-1">Coming soon</h2>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </Card>
      </div>
    </>
  );
}
