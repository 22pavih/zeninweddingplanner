import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { images, photoChecks, wedding, type Decision } from "@/data/wedding";
import { GoldCard } from "./ui";

export function DecisionCard({ d, onResolve, compact }: { d: Decision; onResolve: (id: string, ok: boolean) => void; compact?: boolean }) {
  return (
    <GoldCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{d.who}</p>
          <p className="truncate text-xs text-muted-foreground">{d.role}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">{d.why}</span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed">{d.ask}</p>
      {d.photo && (
        <div className="mt-3 flex gap-3">
          <img src={images.marigold} alt="Flowers from the stall" className="h-28 w-24 shrink-0 rounded-xl border border-gold/50 object-cover" />
          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Theme check</p>
            {photoChecks.map((t) => {
              const hex = wedding.theme.find((x) => x.name === t.name)?.hex ?? "#F28C28";
              return (
                <div key={t.name} className="flex items-center gap-2 text-sm">
                  <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: hex }} />
                  {t.name}
                  {t.ok ? <Check className="h-3.5 w-3.5 text-success" /> : <X className="h-3.5 w-3.5 text-primary" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!compact && (
        <div className="mt-3 rounded-xl bg-secondary p-3 text-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">Zenin suggests</p>
          <p className="text-secondary-foreground">{d.suggestion}</p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" className="border-gold/60" onClick={() => onResolve(d.id, false)}>Decline</Button>
        <Button onClick={() => onResolve(d.id, true)}>Approve</Button>
      </div>
    </GoldCard>
  );
}
