import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, ArrowLeft, CalendarHeart, Camera, Check, ChevronDown, ChevronRight, ListChecks, Phone, Send, ShieldCheck, Store, Users } from "lucide-react";
import {
  activity as initialActivity, decisions as allDecisions, gaps as allGaps, guests as initialGuests, handled as initialHandled,
  images, today, vendors, wedding, type Decision, type Payment,
} from "@/data/wedding";
import { Banner, Chip, GoldCard, SectionTitle } from "@/components/zenin/ui";
import { DecisionCard } from "@/components/zenin/DecisionCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zenin — Priya's Wedding Dashboard" },
      { name: "description", content: "Zenin handles the wedding routine and brings Priya only the decisions that need her." },
      { property: "og:title", content: "Zenin — Priya's Wedding Dashboard" },
      { property: "og:description", content: "Zenin handles the wedding routine and brings Priya only the decisions that need her." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: images.hero },
      { name: "twitter:image", content: images.hero },
    ],
  }),
  component: App,
});

type Tab = "today" | "decisions" | "vendors" | "guests";
type Decided = Decision & { ok: boolean };
type Resolve = (id: string, ok: boolean) => void;

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [pending, setPending] = useState<Decision[]>(allDecisions);
  const [decided, setDecided] = useState<Decided[]>([]);
  const [handled, setHandled] = useState(initialHandled);
  const [activity, setActivity] = useState(initialActivity);
  const [payments, setPayments] = useState<Record<string, Payment>>(() => Object.fromEntries(vendors.map((v) => [v.id, v.payment])));

  const log = (h?: string, a?: string) => {
    if (h) setHandled((x) => [h, ...x]);
    if (a) setActivity((x) => [a, ...x]);
  };
  const resolve: Resolve = (id, ok) => {
    const d = pending.find((x) => x.id === id);
    if (!d) return;
    setPending((p) => p.filter((x) => x.id !== id));
    setDecided((x) => [{ ...d, ok }, ...x]);
    log(`${ok ? "Approved" : "Declined"}: ${d.who}'s request. Zenin told them.`, `Zenin informed ${d.who} of your decision`);
    toast("Decision recorded.");
  };
  const addDecision = (d: Decision) => setPending((p) => [d, ...p]);
  const go = (t: Tab) => { setTab(t); window.scrollTo({ top: 0 }); };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      {tab === "today" && <TodayTab pending={pending} resolve={resolve} handled={handled} activity={activity} log={log} addDecision={addDecision} goDecisions={() => go("decisions")} />}
      {tab === "decisions" && <DecisionsTab pending={pending} decided={decided} resolve={resolve} log={log} />}
      {tab === "vendors" && <VendorsTab payments={payments} setPayment={(id, p) => { setPayments((x) => ({ ...x, [id]: p })); log(undefined, "Zenin verified a delivery photo"); }} />}
      {tab === "guests" && <GuestsTab log={log} />}
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

type Instruction = { id: number; text: string; status: string; result?: string };

function AskZenin({ log, addDecision }: { log: (h?: string, a?: string) => void; addDecision: (d: Decision) => void }) {
  const [text, setText] = useState("");
  const [items, setItems] = useState<Instruction[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    const id = Date.now();
    const needsBride = /red|maroon|price|extra|more|cost|change|move/i.test(t);
    const chairs = /chair|decor|tent|rajbir/i.test(t);
    const result = needsBride
      ? "Vendor proposed a change. Sent to Decisions."
      : chairs ? "Rajbir confirmed 200 chairs at 19:00" : "Vendor confirmed. Added to Zenin handled.";
    const upd = (patch: Partial<Instruction>) => setItems((x) => x.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    setItems((x) => [{ id, text: t, status: "Zenin is handling this" }, ...x]);
    setText("");
    timers.current.push(setTimeout(() => { upd({ status: "Vendor contacted" }); log(undefined, chairs ? "Zenin called Rajbir" : "Zenin called the vendor"); }, 1500));
    timers.current.push(setTimeout(() => {
      if (needsBride) {
        upd({ status: "Decision needed", result });
        addDecision({ id: `n${id}`, who: chairs ? "Rajbir" : "Vendor", role: "From your instruction", ask: t, why: "Needs your authority", suggestion: "Zenin checked this against the wedding rules. Review before approving." });
      } else {
        upd({ status: "Done", result });
        log(result, "Zenin closed your instruction");
      }
    }, 3500));
  };

  return (
    <GoldCard>
      <p className="font-serif text-lg font-semibold text-maroon">Tell Zenin</p>
      <p className="text-xs text-muted-foreground">Type an instruction. Voice coming soon.</p>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask the decorator if they can deliver the chairs by 19:00" />
        <Button type="submit" size="icon" aria-label="Send instruction"><Send className="h-4 w-4" /></Button>
      </form>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li key={i.id} className="rounded-xl bg-secondary p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-secondary-foreground">{i.text}</p>
                <Chip label={i.status} />
              </div>
              {i.result && <p className="mt-1 text-xs text-muted-foreground">{i.result}</p>}
            </li>
          ))}
        </ul>
      )}
    </GoldCard>
  );
}

function TodayTab({ pending, resolve, handled, activity, log, addDecision, goDecisions }: {
  pending: Decision[]; resolve: Resolve; handled: string[]; activity: string[]; log: (h?: string, a?: string) => void; addDecision: (d: Decision) => void; goDecisions: () => void;
}) {
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
            <p className="text-xs opacity-75">{wedding.preEvents} · Deputy: {wedding.deputy}</p>
          </div>
        </div>
      </div>
      <div className="px-5">
        <p className="mt-6 text-lg leading-snug">
          <span className="font-semibold text-primary">{pending.length} {pending.length === 1 ? "thing needs" : "things need"} you today.</span> Zenin handled {handled.length} others.
        </p>
        <div className="mt-4"><AskZenin log={log} addDecision={addDecision} /></div>
        <SectionTitle aside={<button onClick={goDecisions} className="text-sm text-primary">See all</button>}>Needs you</SectionTitle>
        <div className="space-y-3">
          {pending.slice(0, 3).map((d) => <DecisionCard key={d.id} d={d} onResolve={resolve} compact />)}
          {pending.length === 0 && <GoldCard><p className="text-muted-foreground">Nothing needs you right now.</p></GoldCard>}
        </div>
        <SectionTitle>Zenin handled</SectionTitle>
        <GoldCard className="p-0">
          <ul className="divide-y divide-border">
            {(open ? handled : handled.slice(0, 2)).map((h, i) => (
              <li key={h + i} className="flex gap-3 p-4 text-sm leading-relaxed">
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
        <SectionTitle>Zenin activity</SectionTitle>
        <div className="space-y-2 border-l-2 border-gold/50 pl-4">
          {activity.slice(0, 6).map((a, i) => (
            <p key={a + i} className="flex items-center gap-2 text-sm"><Activity className="h-3.5 w-3.5 shrink-0 text-gold" />{a}</p>
          ))}
        </div>
      </div>
    </>
  );
}

function RunnerCheck({ log }: { log: (h?: string, a?: string) => void }) {
  const [stage, setStage] = useState<"Waiting for photo" | "Photo received" | "Verified">("Waiting for photo");
  const receive = () => {
    setStage("Photo received");
    setTimeout(() => {
      setStage("Verified");
      log("Rohit's photo of the mandap drapes matches the theme. Marked verified.", "Zenin verified a delivery photo");
      toast("Drapes match the theme. Verified.");
    }, 1500);
  };
  return (
    <GoldCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">On-ground check</p>
          <p className="mt-1 font-semibold">Verify mandap drapes</p>
          <p className="text-xs text-muted-foreground">Assigned to {wedding.deputy}</p>
        </div>
        <Chip label={stage} />
      </div>
      {stage === "Waiting for photo" ? (
        <Button variant="outline" size="sm" className="mt-3 border-gold/60" onClick={receive}><Camera className="h-4 w-4" /> Simulate Rohit's photo</Button>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <img src={images.petals} alt="Mandap drapes photo from Rohit" className="h-16 w-16 rounded-xl border border-gold/50 object-cover" />
          <p className="text-sm text-muted-foreground">{stage === "Verified" ? "Ivory and blush only. Clearly within the theme, so Zenin marked it verified without asking you." : "Zenin is comparing it with the theme…"}</p>
        </div>
      )}
    </GoldCard>
  );
}

function DecisionsTab({ pending, decided, resolve, log }: { pending: Decision[]; decided: Decided[]; resolve: Resolve; log: (h?: string, a?: string) => void }) {
  return (
    <>
      <Banner src={images.petals} title="Decisions" subtitle={`${pending.length} waiting for you`} />
      <div className="space-y-4 px-5 pt-6">
        <p className="text-sm text-muted-foreground">Zenin only brings you things that change the theme, raise a price or shift a time by more than 30 minutes. Rule: {wedding.themeRule}</p>
        {pending.map((d) => <DecisionCard key={d.id} d={d} onResolve={resolve} />)}
        {pending.length === 0 && <GoldCard><p className="font-serif text-lg text-maroon">All clear.</p><p className="text-sm text-muted-foreground">Zenin will call you if anything new comes up.</p></GoldCard>}
        <SectionTitle>Runner checks</SectionTitle>
        <RunnerCheck log={log} />
        {decided.length > 0 && (
          <>
            <SectionTitle>Decided</SectionTitle>
            <GoldCard className="p-0">
              <ul className="divide-y divide-border">
                {decided.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0"><p className="font-medium">{d.who}</p><p className="truncate text-sm text-muted-foreground">{d.ask}</p></div>
                    <Chip label={d.ok ? "Approved" : "Declined"} />
                  </li>
                ))}
              </ul>
            </GoldCard>
          </>
        )}
      </div>
    </>
  );
}

function VendorsTab({ payments, setPayment }: { payments: Record<string, Payment>; setPayment: (id: string, p: Payment) => void }) {
  const [selId, setSelId] = useState<string | null>(null);
  const sel = vendors.find((v) => v.id === selId);
  if (sel) return <VendorDetail v={sel} payment={payments[sel.id]!} verify={() => setPayment(sel.id, { ...payments[sel.id]!, delivery: "Verified", final: "Approved", reason: "Day-of check passed. Ready to release." })} back={() => setSelId(null)} />;
  return (
    <>
      <Banner src={images.jewellery} title="Vendors" subtitle={`${vendors.length} vendors · Zenin talks to them so you don't have to`} />
      <div className="space-y-3 px-5 pt-6">
        {vendors.map((v) => (
          <button key={v.id} onClick={() => { setSelId(v.id); window.scrollTo({ top: 0 }); }} className="block w-full text-left">
            <GoldCard className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{v.name}</p>
                <p className="truncate text-sm text-muted-foreground">{v.contact} · {v.category} · ••{v.phone}</p>
                <p className="truncate text-xs text-gold">Last call {v.calls[v.calls.length - 1]?.date}</p>
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

function VendorDetail({ v, payment, verify, back }: { v: (typeof vendors)[number]; payment: Payment; verify: () => void; back: () => void }) {
  const canVerify = payment.final === "Held";
  return (
    <div className="px-5 pt-5">
      <button onClick={back} className="flex items-center gap-1 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Vendors</button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-semibold text-maroon">{v.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {v.contact} · {v.category} · ending {v.phone}</p>
        </div>
        <Chip label={v.status} />
      </div>
      <SectionTitle>Agreed deliverables</SectionTitle>
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
      <SectionTitle>What Zenin heard</SectionTitle>
      <div className="space-y-3 border-l-2 border-gold/50 pl-4">
        {v.calls.map((c) => (
          <div key={c.date + c.text}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{c.date} · {c.lang}</p>
            <p className="mt-1 text-sm leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
      <SectionTitle>Payment</SectionTitle>
      <GoldCard className="p-0">
        <ul className="divide-y divide-border">
          {([["Advance payment", payment.advance], ["Delivery verification", payment.delivery], ["Final payment", payment.final]] as const).map(([l, s]) => (
            <li key={l} className="flex items-center justify-between gap-3 p-4 text-sm"><span>{l}</span><Chip label={s} /></li>
          ))}
        </ul>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted-foreground">{payment.reason}</p>
          {canVerify && (
            <Button size="sm" className="mt-3" onClick={() => { verify(); toast("Verified. Final payment approved."); }}>
              <ShieldCheck className="h-4 w-4" /> Run day-of verification
            </Button>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">Payment status via Pine Labs (preview)</p>
        </div>
      </GoldCard>
    </div>
  );
}

function GuestsTab({ log }: { log: (h?: string, a?: string) => void }) {
  const [gaps, setGaps] = useState(allGaps);
  const [list, setList] = useState(initialGuests);
  const counts = [
    ["Invited", list.length],
    ["Rooms", list.filter((g) => g.hotel).length],
    ["Pickups", list.filter((g) => g.pickup === "Assigned").length],
  ] as const;
  const fix = (id: string) => {
    if (id === "g1") setList((l) => l.map((g) => (g.name === "Madhavan K" ? { ...g, hotel: "Lemon Tree Sohna", pickup: "Assigned" } : g)));
    if (id === "g2") setList((l) => l.map((g) => (g.name === "Suresh uncle" ? { ...g, note: "Updates via Lakshmi" } : g)));
    const gap = gaps.find((x) => x.id === id);
    setGaps((g) => g.filter((x) => x.id !== id));
    log(gap?.fix, "Zenin updated guest logistics");
    toast("Fix approved");
  };
  const hotels = Array.from(new Set(list.map((g) => g.hotel ?? "No room yet")));
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
        {hotels.map((h) => (
          <div key={h}>
            <SectionTitle>{h}</SectionTitle>
            <GoldCard className="p-0">
              <ul className="divide-y divide-border">
                {list.filter((g) => (g.hotel ?? "No room yet") === h).map((g) => (
                  <li key={g.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{g.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{g.hotel ?? "No room yet"} · Slot {g.slot}{g.note ? ` · ${g.note}` : ""}</p>
                    </div>
                    <Chip label={g.pickup} />
                  </li>
                ))}
              </ul>
            </GoldCard>
          </div>
        ))}
      </div>
    </>
  );
}
