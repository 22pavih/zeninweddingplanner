import { createFileRoute } from "@tanstack/react-router";
import decor from "@/assets/moodboard-decor.jpg";
import outfits from "@/assets/moodboard-outfits.jpg";
import mehendi from "@/assets/moodboard-mehendi.jpg";
import { Banner, GoldCard } from "@/components/zenin/ui";
import { BottomNav } from "@/components/zenin/BottomNav";

export const Route = createFileRoute("/moodboards")({
  head: () => ({ meta: [{ title: "Zenin · Wedding Moodboards & Outfits" }, { name: "description", content: "Mehendi, Sangeet, Haldi, Wedding and Reception inspiration for Priya and Arjun." }, { property: "og:title", content: "Zenin · Wedding Moodboards & Outfits" }, { property: "og:description", content: "Explore event palettes, decor and bridal and groom outfit ideas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Moodboards,
});

const events = [
  { name: "Mehendi", theme: "Blush garden gathering", decor: "Low seating, jasmine strings and blush cushions; champagne brass trays.", bride: "Light blush lehenga with delicate floral embroidery; ivory accents and floral jewellery.", groom: "Ivory kurta with a champagne embroidered waistcoat; blush pocket square.", photo: mehendi },
  { name: "Sangeet", theme: "Champagne under the stars", decor: "Gold lanterns, ivory stage drapes and blush roses; warm lighting around the dance floor.", bride: "Champagne lehenga with light-catching gold detailing and a blush dupatta.", groom: "Ivory bandhgala with champagne buttons and a tonal embroidered stole.", photo: decor },
  { name: "Haldi", theme: "Ivory courtyard morning", decor: "Ivory jasmine canopy, blush seating and brass bowls; turmeric reserved for the ritual.", bride: "Easy ivory cotton outfit with blush accents and floral accessories.", groom: "Ivory cotton kurta and trousers with a champagne stole.", photo: mehendi },
  { name: "Wedding", theme: "Ivory, blush & champagne", decor: "Ivory mandap drapes, blush roses and gold chair covers. No red or maroon decor.", bride: "Priya's maroon lehenga with gold embroidery; maroon is for the outfit only. Designer to be confirmed.", groom: "Ivory sherwani with champagne embroidery and a blush safa.", photo: decor },
  { name: "Reception", theme: "Blush evening elegance", decor: "Ivory table linen, blush floral centrepieces and champagne candleholders.", bride: "Champagne embroidered saree or lehenga with blush jewellery accents.", groom: "Ivory tailored jacket with champagne accents and a blush pocket square.", photo: decor },
];
function Moodboards() {
  return <div className="mx-auto min-h-screen max-w-md bg-background pb-24"><Banner src={decor} title="Moodboards" subtitle="Priya & Arjun · Decor and outfits" /><div className="space-y-5 px-5 pt-6"><p className="text-xs text-muted-foreground">Sample inspiration · outfit designers and final looks to be confirmed. Photos illustrate the palette, not booked designs.</p>
    {events.map((event) => <GoldCard key={event.name}><h2 className="font-serif text-2xl font-semibold text-maroon">{event.name}</h2><p className="mt-1 text-sm font-medium">{event.theme}</p><div className="mt-3 flex flex-wrap gap-3">{[["Ivory", "bg-background"], ["Blush", "bg-secondary"], ["Gold", "bg-gold"]].map(([label, color]) => <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`h-5 w-5 rounded-full border border-gold/50 ${color}`} />{label}</span>)}</div><p className="mt-3 text-sm text-muted-foreground">{event.decor}</p>
      <div className="mt-4 space-y-3 border-y border-border py-3"><div><h3 className="font-semibold text-maroon">Bridal Outfit</h3><p className="mt-1 text-sm text-muted-foreground">{event.bride}</p></div><div><h3 className="font-semibold text-maroon">Groom Outfit</h3><p className="mt-1 text-sm text-muted-foreground">{event.groom}</p></div></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><img src={event.photo} alt={`${event.name} floral decor inspiration`} loading="lazy" width={1024} height={1024} className="aspect-square w-full rounded-lg object-cover" /><img src={outfits} alt={`${event.name} ivory and champagne Indian outfit inspiration`} loading="lazy" width={1024} height={1024} className="aspect-square w-full rounded-lg object-cover" /></div>
    </GoldCard>)}
  </div><BottomNav active="moodboards" /></div>;
}