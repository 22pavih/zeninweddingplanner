import type { ReactNode } from "react";

const chipStyles: Record<string, string> = {
  "On track": "bg-success/10 text-success border-success/30",
  Done: "bg-success/10 text-success border-success/30",
  Verified: "bg-success/10 text-success border-success/30",
  Paid: "bg-success/10 text-success border-success/30",
  Assigned: "bg-success/10 text-success border-success/30",
  "At risk": "bg-warning/10 text-warning border-warning/40",
  Delivering: "bg-warning/10 text-warning border-warning/40",
  Pending: "bg-warning/10 text-warning border-warning/40",
  Blocked: "bg-primary/10 text-primary border-primary/30",
  Booked: "bg-gold/15 text-maroon border-gold/50",
  "Confirmed on call": "bg-gold/15 text-maroon border-gold/50",
  Promised: "bg-muted text-muted-foreground border-border",
  "Not needed": "bg-muted text-muted-foreground border-border",
  Confirmed: "bg-gold/15 text-maroon border-gold/50",
  Contacted: "bg-gold/15 text-maroon border-gold/50",
  "Vendor contacted": "bg-gold/15 text-maroon border-gold/50",
  "Zenin is handling this": "bg-gold/15 text-maroon border-gold/50",
  "Photo received": "bg-gold/15 text-maroon border-gold/50",
  Approved: "bg-success/10 text-success border-success/30",
  "At Risk": "bg-warning/10 text-warning border-warning/40",
  "Payment Pending": "bg-warning/10 text-warning border-warning/40",
  "Verification ongoing": "bg-warning/10 text-warning border-warning/40",
  "Waiting for photo": "bg-warning/10 text-warning border-warning/40",
  Held: "bg-primary/10 text-primary border-primary/30",
  Issue: "bg-primary/10 text-primary border-primary/30",
  Declined: "bg-primary/10 text-primary border-primary/30",
  "Decision needed": "bg-primary/10 text-primary border-primary/30",
};

export function Chip({ label }: { label: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${chipStyles[label] ?? chipStyles["Promised"]}`}>
      {label}
    </span>
  );
}

export function GoldCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gold/50 bg-card p-4 shadow-sm ${className}`}>{children}</div>;
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-baseline justify-between gap-3">
      <h2 className="font-serif text-xl font-semibold text-maroon">{children}</h2>
      {aside}
    </div>
  );
}

export function Banner({ src, title, subtitle }: { src: string; title: string; subtitle: string }) {
  return (
    <div className="relative h-36 overflow-hidden bg-maroon">
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/70 to-primary/30" />
      <div className="relative flex h-full flex-col justify-end px-5 pb-4 text-primary-foreground">
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        <p className="text-sm opacity-85">{subtitle}</p>
      </div>
    </div>
  );
}
