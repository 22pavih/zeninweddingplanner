import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip, GoldCard } from "@/components/zenin/ui";

const steps = [
  { time: "10:05", who: "Gnani", text: "Priya's voice note is turned into text: \"Stage ke phool kam pad gaye hain. Kisi ko bhej do.\"" },
  { time: "10:05", who: "Zenin", text: "A people need. Both flowers are in her theme, so Priya is asked nothing and told it is being handled." },
  { time: "10:06", who: "Delhivery", text: "The florist's address is found, accurate to 60 metres." },
  { time: "10:07", who: "Gnani", text: "Zenin phones Amit Flowers Decoration. They have both flowers, about ₹4,500." },
  { time: "10:09", who: "Delhivery", text: "Monu is 95 seconds away and Rohit is 720. Zenin sends Monu with the brief." },
  { time: "10:12", who: "Zenin", text: "Monu's first photo shows red roses. Rejected, because the theme bans red." },
  { time: "10:14", who: "Delhivery", text: "The second photo passes the theme, and Monu's location is 0.04 km from the shop." },
  { time: "10:17", who: "Pine Labs", text: "₹4,500 paid to the florist. Scheduled first, then success. Monu and Priya are told." },
];

export function FlowerErrand() {
  const [shown, setShown] = useState(0);
  const all = shown >= steps.length;
  return (
    <GoldCard>
      <p className="font-serif text-lg font-semibold text-maroon">Stage flowers top-up</p>
      <p className="text-sm text-muted-foreground">How Zenin handled it without asking Priya</p>
      <p className="mt-2 text-xs text-muted-foreground">Preview. No call was placed and no payment was sent.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setShown(all ? 0 : shown + 1)}>{all ? "Start again" : "Play step by step"}</Button>
        <Button size="sm" variant="outline" onClick={() => setShown(steps.length)} disabled={all}>Show all</Button>
      </div>
      {shown > 0 && (
        <ul className="mt-3 space-y-2">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="w-11 shrink-0 tabular-nums text-muted-foreground">{s.time}</span>
              <Chip label={s.who} />
              <span className="min-w-0">{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </GoldCard>
  );
}
