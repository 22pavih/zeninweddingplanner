import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarHeart, Check, ChevronDown, ChevronRight, ListChecks, Phone, Store, Users } from "lucide-react";
import { decisions as allDecisions, gaps as allGaps, guests, handled, images, today, vendors, wedding, type Vendor } from "@/data/wedding";
import { Banner, Chip, GoldCard, SectionTitle } from "@/components/zenin/ui";
import { DecisionCard } from "@/components/zenin/DecisionCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zenin — Priya's Wedding Dashboard" },
      { name: "description", content: "What needs Priya today, what Zenin handled, and what vendors said." },
      { property: "og:title", content: "Zenin — Priya's Wedding Dashboard" },
      { property: "og:description", content: "What needs Priya today, what Zenin handled, and what vendors said." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: images.hero },
      { name: "twitter:image", content: images.hero },
    ],
  }),
  component: App,
});

type Tab = "today" | "decisions" | "vendors" | "guests";

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [pending, setPending] = useState(allDecisions);
  const resolve = (id: string, ok: boolean) => {
    const d = pending.find((x) => x.id === id);
    setPending((p) => p.filter((x) => x.id !== id));
    toast(ok ? `Approved. Zenin will tell ${d?.who}.` : `Declined. Zenin will let ${d?.who} know.`);
  };
  const go = (t: Tab) => { setTab(t); window.scrollTo({ top: 0 }); };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      {tab === "today" && <TodayTab pending={pending} resolve={resolve} goDecisions={() => go("decisions")} />}
      {tab === "decisions" && <DecisionsTab pending={pending} resolve={resolve} />}
      {tab === "vendors" && <VendorsTab />}
      {tab === "guests" && <GuestsTab />}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gold/40 bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {([
            ["today", "Today", CalendarHeart],
            ["decisions", "Decisions", ListChecks],
            ["vendors", "Vendors", Store],
            ["guests", "Guests", Users],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => go(id)} className={`relative flex flex-col items-center gap-1 py-3 text-xs ${tab === id ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              {label}
              {id === "decisions" && pending.length > 0 && (
                <span className="absolute right-5 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{pending.length}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
      <Toaster position="top-center" />
    </div>
  );
}

function useDaysLeft() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => setDays(Math.max(0, Math.ceil((new Date(wedding.date).getTime() - Date.now()) / 86400000)));
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, []);
  return days;
}

function TodayTab({ pending, resolve, goDecisions }: { pending: typeof allDecisions; resolve: (id: string, ok: boolean) => void; goDecisions: () => void }) {
  const days = useDaysLeft();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative h-80 overflow-hidden bg-maroon">
        <img src={images.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-primary/75 to-maroon/30" />
        <div className="relative flex h-full flex-col justify-between p-5 text-primary-foreground">
          <p className="font-serif text-lg tracking-wide text-gold">Zenin</p>
          <div>
            <p className="text-sm opacity-85">Good evening, Priya</p>
            <p className="mt-1 font-serif text-6xl font-semibold leading-none">{days ?? "—"}</p>
            <p className="mt-1 font-serif text-xl">days until you marry Arjun</p>
            <p className="mt-2 text-sm opacity-85">28 November 2026 · {wedding.venue}</p>
          </div>
        </div>
      </div>
      <div className="px-5">
        <p className="mt-6 text-lg leading-snug">
          <span className="font-semibold text-primary">{Math.min(3, pending.length)} things need you today.</span> Zenin handled 12 others.
        </p>
        <SectionTitle aside={<button onClick={goDecisions} className="text-sm text-primary">See all</button>}>Needs you</SectionTitle>
        <div className="space-y-3">
          {pending.slice(0, 3).map((d) => <DecisionCard key={d.id} d={d} onResolve={resolve} compact />)}
          {pending.length === 0 && <GoldCard><p className="text-muted-foreground">Nothing needs you right now.</p></GoldCard>}
        </div>
        <SectionTitle>Zenin handled</SectionTitle>
        <GoldCard className="p-0">
          <ul className="divide-y divide-border">
            {(open ? handled : handled.slice(0, 2)).map((h) => (
              <li key={h} className="flex gap-3 p-4 text-sm leading-relaxed">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{h}
              </li>
            ))}
          </ul>
          <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-center gap-1 border-t border-border p-3 text-sm text-primary">
            {open ? "Show less" : `Show ${handled.length - 2} more`}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </GoldCard>
        <SectionTitle>Happening today</SectionTitle>
        <div className="space-y-2">
          {today.map((t) => (
            <GoldCard key={t.title} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.note}</p>
              </div>
              <Chip label={t.status} />
            </GoldCard>
          ))}
        </div>
      </div>
    </>
  );
}

function DecisionsTab({ pending, resolve }: { pending: typeof allDecisions; resolve: (id: string, ok: boolean) => void }) {
  return (
    <>
      <Banner src={images.petals} title="Decisions" subtitle={`${pending.length} waiting for you`} />
      <div className="space-y-4 px-5 pt-6">
        <p className="text-sm text-muted-foreground">Zenin only brings you things that change the theme, raise a price or shift a time by more than 30 minutes.</p>
        {pending.map((d) => <DecisionCard key={d.id} d={d} onResolve={resolve} />)}
        {pending.length === 0 && <GoldCard><p className="font-serif text-lg text-maroon">All clear.</p><p className="text-sm text-muted-foreground">Zenin will call you if anything new comes up.</p></GoldCard>}
      </div>
    </>
  );
}

function VendorsTab() {
  const [sel, setSel] = useState<Vendor | null>(null);
  if (sel) return <VendorDetail v={sel} back={() => setSel(null)} />;
  return (
    <>
      <Banner src={images.jewellery} title="Vendors" subtitle={`${vendors.length} vendors, all calls logged`} />
      <div className="space-y-3 px-5 pt-6">
        {vendors.map((v) => (
          <button key={v.id} onClick={() => { setSel(v); window.scrollTo({ top: 0 }); }} className="block w-full text-left">
            <GoldCard className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{v.name}</p>
                <p className="truncate text-sm text-muted-foreground">{v.contact} · {v.category} · ••{v.phone}</p>
              </div>
              <Chip label={v.status} />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </GoldCard>
          </button>
        ))}
      </div>
    </>
  );
}

function VendorDetail({ v, back }: { v: Vendor; back: () => void }) {
  return (
    <div className="px-5 pt-5">
      <button onClick={back} className="flex items-center gap-1 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Vendors</button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-semibold text-maroon">{v.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {v.contact} · ending {v.phone}</p>
        </div>
        <Chip label={v.status} />
      </div>
      <SectionTitle>What they promised</SectionTitle>
      <GoldCard className="p-0">
        <ul className="divide-y divide-border">
          {v.items.map((i) => (
            <li key={i.label} className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${i.status === "Verified" ? "border-success bg-success text-primary-foreground" : "border-gold"}`}>
                  {i.status === "Verified" && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="text-sm">{i.label}</span>
              </div>
              <Chip label={i.status} />
            </li>
          ))}
        </ul>
      </GoldCard>
      <SectionTitle>What they said</SectionTitle>
      <div className="space-y-3 border-l-2 border-gold/50 pl-4">
        {v.calls.map((c) => (
          <div key={c.date + c.text}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{c.date} · {c.lang}</p>
            <p className="mt-1 text-sm leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
      <SectionTitle>Payment</SectionTitle>
      <GoldCard className="bg-secondary"><p className="text-sm text-secondary-foreground">{v.payment}</p></GoldCard>
    </div>
  );
}

function GuestsTab() {
  const [gaps, setGaps] = useState(allGaps);
  const [fixed, setFixed] = useState(false);
  const list = guests.map((g) => (fixed && g.name === "Madhavan K" ? { ...g, hotel: "Lemon Tree Sohna", pickup: "Assigned" as const } : g));
  const counts = [
    ["Invited", list.length],
    ["Rooms", list.filter((g) => g.hotel).length],
    ["Pickups", list.filter((g) => g.pickup === "Assigned").length],
  ] as const;
  const fix = (id: string) => {
    if (id === "g1") setFixed(true);
    setGaps((g) => g.filter((x) => x.id !== id));
    toast("Fix approved. Zenin is on it.");
  };
  return (
    <>
      <Banner src={images.diya} title="Guests" subtitle="Rooms, arrivals and pickups" />
      <div className="px-5 pt-6">
        {gaps.length > 0 && (
          <div className="mb-6 rounded-2xl border-2 border-primary/40 bg-primary/5 p-4">
            <p className="font-serif text-lg font-semibold text-primary">Gaps</p>
            <div className="mt-2 space-y-4">
              {gaps.map((g) => (
                <div key={g.id}>
                  <p className="font-medium">{g.text}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{g.fix}</p>
                  <Button size="sm" className="mt-2" onClick={() => fix(g.id)}>Approve fix</Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          {counts.map(([l, n]) => (
            <GoldCard key={l} className="p-3 text-center">
              <p className="font-serif text-3xl font-semibold text-maroon">{n}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </GoldCard>
          ))}
        </div>
        <SectionTitle>Guest list</SectionTitle>
        <GoldCard className="p-0">
          <ul className="divide-y divide-border">
            {list.map((g) => (
              <li key={g.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{g.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{g.hotel ?? "No room yet"} · Slot {g.slot}</p>
                </div>
                <Chip label={g.pickup} />
              </li>
            ))}
          </ul>
        </GoldCard>
      </div>
    </>
  );
}
