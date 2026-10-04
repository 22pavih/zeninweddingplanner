import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, ArrowLeft, CalendarHeart, Check, ChevronDown, ChevronRight, ListChecks, Phone, Send, ShieldCheck, Store, Users } from "lucide-react";
import {
  activity as initialActivity, decisions as allDecisions, gaps as allGaps, guests as initialGuests, handled as initialHandled,
  checkTasks, helpers as initialHelpers, images, previewDistance, today, vendors, wedding, type CheckTask, type Decision, type Helper, type HelperArea, type Payment,
} from "@/data/wedding";
import { Banner, Chip, GoldCard, SectionTitle } from "@/components/zenin/ui";
import { DecisionCard } from "@/components/zenin/DecisionCard";
import { OnGround, type CheckAssignment } from "@/components/zenin/OnGround";

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
type GroundProps = { helpers: Helper[]; assignments: CheckAssignment[]; addHelper: (name: string, relation: string, area: HelperArea) => void; assign: (task: CheckTask) => void; submitReport: (task: CheckTask, observation: string, photoName?: string) => void; goDecisions: () => void };

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [pending, setPending] = useState<Decision[]>(allDecisions);
  const [decided, setDecided] = useState<Decided[]>([]);
  const [handled, setHandled] = useState(initialHandled);
  const [activity, setActivity] = useState(initialActivity);
  const [payments, setPayments] = useState<Record<string, Payment>>(() => Object.fromEntries(vendors.map((v) => [v.id, v.payment])));
  const [helpers, setHelpers] = useState<Helper[]>(initialHelpers);
  const [assignments, setAssignments] = useState<CheckAssignment[]>([]);

  const log = (h?: string, a?: string) => {
    if (h) setHandled((x) => [h, ...x]);
    if (a) setActivity((x) => [a, ...x]);
  };
  const resolve: Resolve = (id, ok) => {
    const d = pending.find((x) => x.id === id);
    if (!d) return;
    setPending((p) => p.filter((x) => x.id !== id));
    setDecided((x) => [{ ...d, ok }, ...x]);
    log(`${ok ? "Approved" : "Declined"}: ${d.who}'s request. Gnani informed them.`, `Gnani informed ${d.who} of your decision`);
    toast("Decision recorded.");
  };
  const addDecision = (d: Decision) => setPending((p) => [d, ...p]);
  const go = (t: Tab) => { setTab(t); window.scrollTo({ top: 0 }); };
  const addHelper: GroundProps["addHelper"] = (name, relation, area) => { setHelpers((items) => [...items, { id: `helper-${Date.now()}`, name, relation, area, available: true }]); toast(`${name} added as a helper`); };
  const assign: GroundProps["assign"] = (task) => {
    const nearest = [...helpers].filter((helper) => helper.available).sort((a, b) => previewDistance(a.area, task.area) - previewDistance(b.area, task.area))[0];
    if (!nearest) return;
    setHelpers((items) => items.map((helper) => helper.id === nearest.id ? { ...helper, available: false } : helper));
    setAssignments((items) => [{ taskId: task.id, helperId: nearest.id, distance: previewDistance(nearest.area, task.area), status: "Assigned" }, ...items]);
    log(undefined, `Delhivery preview matched ${nearest.name} to ${task.title.toLowerCase()} · ~${previewDistance(nearest.area, task.area)} km`);
    toast(`${nearest.name} assigned in preview`);
  };
  const submitReport: GroundProps["submitReport"] = (task, observation, photoName) => {
    const helper = helpers.find((person) => person.id === assignments.find((item) => item.taskId === task.id)?.helperId);
    if (!helper) return;
    const conflicts = task.id === "dress" ? /not ready|missing|wrong size|damaged|red dress/i.test(observation) : /red|maroon|orange/i.test(observation);
    const matches = task.id === "dress" ? /ready|fits|collected|maroon lehenga/i.test(observation) : /ivory|blush|champagne/i.test(observation) && /drape|mandap|flower/i.test(observation);
    const status = conflicts ? "Decision needed" : matches ? "Verified" : "Needs review";
    setAssignments((items) => items.map((item) => item.taskId === task.id ? { ...item, observation, ...(photoName ? { photoName } : {}), status } : item));
    if (status !== "Needs review") setHelpers((items) => items.map((person) => person.id === helper.id ? { ...person, available: true } : person));
    if (conflicts) {
      setPending((items) => items.some((item) => item.id === `ground-${task.id}`) ? items : [{
        id: `ground-${task.id}`, vendorId: task.vendorId, who: helper.name, role: `Delhivery helper check · ${task.title}`,
        ask: `${helper.name} reported: “${observation}”`, why: task.id === "dress" ? "Dress needs attention" : "Changes the theme",
        suggestion: task.id === "dress" ? "Gnani could not confirm the dress is ready. Check with the boutique before approving." : "Gnani found a colour outside the approved decor palette. Ask for ivory, blush pink or champagne gold instead.",
      }, ...items]);
      log(undefined, `Zenin escalated ${helper.name}'s ${task.title.toLowerCase()} update to Decisions`);
      toast("Check conflict sent to Decisions");
    } else if (matches) {
      log(`${helper.name}'s ${task.title.toLowerCase()} update matched the requirements in preview.`, `Zenin verified ${helper.name}'s written update in preview`);
      toast("On-ground update verified");
    } else {
      toast("Update saved for review");
    }
  };
  const ground: GroundProps = { helpers, assignments, addHelper, assign, submitReport, goDecisions: () => go("decisions") };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      {tab === "today" && <TodayTab pending={pending} resolve={resolve} handled={handled} activity={activity} log={log} addDecision={addDecision} goDecisions={() => go("decisions")} ground={ground} />}
      {tab === "decisions" && <DecisionsTab pending={pending} decided={decided} resolve={resolve} ground={ground} />}
      {tab === "vendors" && <VendorsTab payments={payments} pending={pending} decided={decided} ground={ground} goDecisions={() => go("decisions")} setPayment={(id, p) => { setPayments((x) => ({ ...x, [id]: p })); log(undefined, "Pine Labs payment approval recorded in preview"); }} />}
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
       : chairs ? "Preview: Rajbir confirmed 200 chairs at 19:00" : "Preview: vendor confirmed. Added to Gnani handled.";
    const upd = (patch: Partial<Instruction>) => setItems((x) => x.map((i) => (i.id === id ? { ...i, ...patch } : i)));
     setItems((x) => [{ id, text: t, status: "Gnani is handling this" }, ...x]);
    setText("");
     timers.current.push(setTimeout(() => { upd({ status: "Vendor contact simulated" }); log(undefined, chairs ? "Gnani simulated a call to Rajbir" : "Gnani simulated vendor contact"); }, 1500));
    timers.current.push(setTimeout(() => {
      if (needsBride) {
        upd({ status: "Decision needed", result });
         addDecision({ id: `n${id}`, ...(chairs ? { vendorId: "tent" } : {}), who: chairs ? "Rajbir" : "Vendor", role: "From your instruction · preview", ask: t, why: "Needs your authority", suggestion: "Gnani checked this against the wedding rules. Review before approving." });
      } else {
        upd({ status: "Done", result });
         log(result, "Gnani closed your preview instruction");
      }
    }, 3500));
  };

  return (
    <GoldCard>
      <p className="font-serif text-lg font-semibold text-maroon">Tell Zenin</p>
       <p className="text-xs text-muted-foreground">Type an instruction to preview the Gnani workflow. No vendor is contacted.</p>
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

function TodayTab({ pending, resolve, handled, activity, log, addDecision, goDecisions, ground }: {
  pending: Decision[]; resolve: Resolve; handled: string[]; activity: string[]; log: (h?: string, a?: string) => void; addDecision: (d: Decision) => void; goDecisions: () => void; ground: GroundProps;
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
        <SectionTitle>On-ground verification</SectionTitle>
        <OnGround {...ground} />
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

function DecisionsTab({ pending, decided, resolve, ground }: { pending: Decision[]; decided: Decided[]; resolve: Resolve; ground: GroundProps }) {
  return (
    <>
      <Banner src={images.petals} title="Decisions" subtitle={`${pending.length} waiting for you`} />
      <div className="space-y-4 px-5 pt-6">
        <p className="text-sm text-muted-foreground">Zenin only brings you things that change the theme, raise a price or shift a time by more than 30 minutes. Rule: {wedding.themeRule}</p>
        {pending.map((d) => <DecisionCard key={d.id} d={d} onResolve={resolve} />)}
        {pending.length === 0 && <GoldCard><p className="font-serif text-lg text-maroon">All clear.</p><p className="text-sm text-muted-foreground">Zenin will call you if anything new comes up.</p></GoldCard>}
        <SectionTitle>On-ground verification</SectionTitle>
        <GoldCard className="p-0"><ul className="divide-y divide-border">{checkTasks.map((task) => { const report = ground.assignments.find((item) => item.taskId === task.id); const helper = ground.helpers.find((item) => item.id === report?.helperId); return <li key={task.id} className="flex items-center justify-between gap-3 p-4 text-sm"><div><p className="font-medium">{task.title}</p><p className="text-xs text-muted-foreground">{helper?.name ?? "Not assigned"} · {report?.observation ?? "Awaiting on-site update"}</p></div><Chip label={report?.status ?? "Pending"} /></li>; })}</ul></GoldCard>
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

function VendorsTab({ payments, pending, decided, ground, goDecisions, setPayment }: { payments: Record<string, Payment>; pending: Decision[]; decided: Decided[]; ground: GroundProps; goDecisions: () => void; setPayment: (id: string, p: Payment) => void }) {
  const [selId, setSelId] = useState<string | null>(null);
  const sel = vendors.find((v) => v.id === selId);
  if (sel) {
    const payment = payments[sel.id] ?? sel.payment;
    return <VendorDetail v={sel} payment={payment} pending={pending} decided={decided} ground={ground} goDecisions={goDecisions} verify={() => setPayment(sel.id, { ...payment, delivery: "Verified", final: "Approved", reason: "Verification marked complete in this preview. No payment has been sent." })} back={() => setSelId(null)} />;
  }
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

function VendorDetail({ v, payment, pending, decided, ground, goDecisions, verify, back }: { v: (typeof vendors)[number]; payment: Payment; pending: Decision[]; decided: Decided[]; ground: GroundProps; goDecisions: () => void; verify: () => void; back: () => void }) {
  const canVerify = payment.final === "Held";
  const deliveryReady = v.id !== "tent" || ground.assignments.find((item) => item.taskId === "mandap")?.status === "Verified";
  const vendorRequests = pending.filter((d) => d.vendorId === v.id);
  const vendorDecisions = decided.filter((d) => d.vendorId === v.id);
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
       <SectionTitle>Vendor discussion · Gnani</SectionTitle>
       {vendorRequests.length > 0 && <div className="mb-4 space-y-2">{vendorRequests.map((d) => <GoldCard key={d.id}><p className="text-xs font-semibold text-primary">Gnani sent a request for approval</p><p className="mt-1 text-sm">{d.who}: {d.ask}</p><p className="mt-1 text-xs text-muted-foreground">{d.why} · waiting for Priya</p><Button variant="link" className="mt-1 h-auto p-0" onClick={goDecisions}>Review request <ChevronRight className="h-4 w-4" /></Button></GoldCard>)}</div>}
      <div className="space-y-3 border-l-2 border-gold/50 pl-4">
        {v.calls.map((c) => (
          <div key={c.date + c.text}>
             <p className="text-xs font-semibold uppercase tracking-wide text-gold">{c.date} · {c.lang} · Gnani {c.decisionId ? "requested approval" : "handled this"}</p>
            <p className="mt-1 text-sm leading-relaxed">{c.text}</p>
          </div>
        ))}
         {vendorDecisions.map((d) => <p key={d.id} className="text-sm">Gnani informed {d.who}: <strong>{d.ok ? "Approved" : "Declined"}</strong> by Priya.</p>)}
      </div>
       {v.id === "tent" && <><SectionTitle>On-ground verification</SectionTitle><OnGround {...ground} vendorId={v.id} /></>}
       <SectionTitle>Payment verification · Pine Labs</SectionTitle>
      <GoldCard className="p-0">
        <ul className="divide-y divide-border">
          {([["Advance payment", payment.advance], ["Delivery verification", payment.delivery], ["Final payment", payment.final]] as const).map(([l, s]) => (
            <li key={l} className="flex items-center justify-between gap-3 p-4 text-sm"><span>{l}</span><Chip label={s} /></li>
          ))}
        </ul>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted-foreground">{payment.reason}</p>
           <p className="mt-2 text-xs font-medium">{payment.final === "Approved" ? "Approved in Pine Labs preview after verification · no payment sent" : payment.final === "Paid" ? "Shown as paid in Pine Labs preview" : "Held in Pine Labs preview until delivery is verified"}</p>
           {canVerify && (
             <Button size="sm" className="mt-3" disabled={!deliveryReady} onClick={() => { verify(); toast("Pine Labs preview: approval recorded. No payment sent."); }}>
               <ShieldCheck className="h-4 w-4" /> Mark verified & approve in preview
            </Button>
          )}
           {canVerify && !deliveryReady && <p className="mt-2 text-xs text-muted-foreground">Waiting for the mandap check to be verified.</p>}
           <p className="mt-2 text-[11px] text-muted-foreground">Pine Labs is not connected. This only updates the screen.</p>
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
