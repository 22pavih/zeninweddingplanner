import { Link } from "@tanstack/react-router";
import { CalendarHeart, Images, ListChecks, MessageCircle, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export type WeddingTab = "today" | "give" | "decisions" | "vendors" | "guests";
export function BottomNav({ active, count = 0, onSelect }: { active: WeddingTab | "moodboards"; count?: number; onSelect?: (tab: WeddingTab) => void }) {
  return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-20 border-t border-gold/40 bg-card/95 backdrop-blur"><div className="mx-auto grid max-w-md grid-cols-6">
    {([["today", "Dashboard", CalendarHeart], ["give", "Ask", MessageCircle], ["decisions", "Decisions", ListChecks], ["vendors", "Vendors", Store], ["guests", "Guests", Users], ["moodboards", "Moodboards", Images]] as const).map(([id, label, Icon]) => {
      const content = <><Icon className="h-5 w-5" />{label}{id === "decisions" && count > 0 && <span className="absolute right-2 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>}</>;
      const className = `relative h-16 min-w-0 flex-col gap-1 rounded-none px-0 py-2 text-[10px] ${active === id ? "text-primary" : "text-muted-foreground"}`;
      return id === "moodboards" ? <Button key={id} asChild variant="ghost" className={className}><Link to="/moodboards" aria-current={active === id ? "page" : undefined}>{content}</Link></Button> : onSelect ? <Button key={id} variant="ghost" className={className} aria-current={active === id ? "page" : undefined} onClick={() => onSelect(id)}>{content}</Button> : <Button key={id} asChild variant="ghost" className={className}><Link to="/" search={{ tab: id }}>{content}</Link></Button>;
    })}
  </div></nav>;
}