import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, GoldCard, SectionTitle } from "@/components/zenin/ui";

export type LedgerRow = {
  id: string;
  date: string;
  item: string;
  paidTo: string;
  amount: number;
  method: "Pine Labs" | "Cash";
  reference: string;
  approvedBy: string;
  status: string;
};

export const initialLedger: LedgerRow[] = [
  { id: "l1", date: "4 Oct", item: "Extra flowers for the stage", paidTo: "Amit Flowers Decoration", amount: 4500, method: "Pine Labs", reference: "zenin-payout-001", approvedBy: "Within limit, no approval needed", status: "Success" },
  { id: "l2", date: "22 Sept", item: "Advance, tent and decor", paidTo: "Chaudhary Tent and Decor", amount: 40000, method: "Pine Labs", reference: "zenin-payout-014", approvedBy: "Rakesh ji", status: "Success" },
  { id: "l3", date: "18 Sept", item: "Advance, catering", paidTo: "Shri Balaji Caterers", amount: 75000, method: "Pine Labs", reference: "zenin-payout-009", approvedBy: "Rakesh ji", status: "Success" },
  { id: "l4", date: "20 Sept", item: "Bridal makeup, paid in full", paidTo: "Glam by Anjali", amount: 35000, method: "Pine Labs", reference: "zenin-payout-011", approvedBy: "Rakesh ji", status: "Success" },
  { id: "l5", date: "2 Oct", item: "Mehendi cones and supplies", paidTo: "Local shop", amount: 1200, method: "Cash", reference: "Entered by Rohit", approvedBy: "Rohit", status: "Not verified" },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const months: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Sept: 9, Oct: 10, Nov: 11, Dec: 12 };
const dateKey = (d: string) => {
  const [day, mon] = d.split(" ");
  return (months[mon ?? ""] ?? 0) * 100 + Number(day);
};

export function ledgerTotals(rows: LedgerRow[]) {
  const pine = rows.filter((r) => r.method === "Pine Labs").reduce((s, r) => s + r.amount, 0);
  const cash = rows.filter((r) => r.method === "Cash").reduce((s, r) => s + r.amount, 0);
  return { pine, cash, total: pine + cash };
}

const people = ["Priya", "Rakesh ji", "Rohit", "Monu"];

export function Ledger({ rows, addRow, back }: { rows: LedgerRow[]; addRow: (r: LedgerRow) => void; back: () => void }) {
  const { pine, cash, total } = ledgerTotals(rows);
  const [item, setItem] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState("");
  const [by, setBy] = useState(people[0]!);
  const sorted = rows.map((r, i) => ({ r, i })).sort((a, b) => dateKey(b.r.date) - dateKey(a.r.date) || a.i - b.i).map((x) => x.r);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!item.trim() || !paidTo.trim() || !(n > 0)) return;
    const now = new Date();
    const date = `${now.getDate()} ${now.toLocaleString("en-GB", { month: "short" }).replace("Sep", "Sept")}`;
    addRow({ id: `l${Date.now()}`, date, item: item.trim(), paidTo: paidTo.trim(), amount: n, method: "Cash", reference: `Entered by ${by}`, approvedBy: by, status: "Not verified" });
    setItem(""); setPaidTo(""); setAmount(""); setBy(people[0]!);
    toast("Cash payment added to the ledger");
  };

  return (
    <div className="px-5 pt-5">
      <button onClick={back} className="flex items-center gap-1 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Today</button>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-maroon">Wedding ledger</h1>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[["Through Pine Labs", pine], ["In cash", cash], ["Total of 10,00,000 cap", total]].map(([label, val]) => (
          <GoldCard key={label as string} className="p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{inr(val as number)}</p>
          </GoldCard>
        ))}
      </div>
      <SectionTitle>Payments</SectionTitle>
      <div className="space-y-2">
        {sorted.map((r) => (
          <GoldCard key={r.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{r.item}</p>
                <p className="text-sm text-muted-foreground">{r.paidTo} · {r.date}</p>
              </div>
              <p className="shrink-0 font-semibold">{inr(r.amount)}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2"><Chip label={r.method} /><Chip label={r.status} /></div>
            <p className="mt-2 text-xs text-muted-foreground">
              {r.method === "Pine Labs" ? r.reference : `Entered by ${r.approvedBy} · Zenin cannot verify cash`}
            </p>
          </GoldCard>
        ))}
      </div>
      <SectionTitle>Add a cash payment</SectionTitle>
      <GoldCard>
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
          <Input placeholder="Paid to" value={paidTo} onChange={(e) => setPaidTo(e.target.value)} />
          <Input placeholder="Amount in rupees" inputMode="numeric" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select value={by} onChange={(e) => setBy(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" aria-label="Entered by">
            {people.map((p) => <option key={p} value={p}>Entered by {p}</option>)}
          </select>
          <Button type="submit" className="w-full">Add cash payment</Button>
        </form>
      </GoldCard>
      <p className="mt-6 pb-6 text-xs text-muted-foreground">Preview. Pine Labs is not connected. Pine Labs rows are sample data, and cash rows are typed in by the family.</p>
    </div>
  );
}
