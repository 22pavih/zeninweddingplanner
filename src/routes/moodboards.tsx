import { createFileRoute } from "@tanstack/react-router";
import decor from "@/assets/moodboard-decor.jpg";
import weddingOutfits from "@/assets/wedding-outfits.jpg.asset.json";
import weddingDrapes from "@/assets/wedding-drapes.jpg.asset.json";
import weddingPetalBowls from "@/assets/wedding-petal-bowls.jpg.asset.json";
import weddingFlowerStrings from "@/assets/wedding-flower-strings.jpg.asset.json";
import weddingBrassLamps from "@/assets/wedding-brass-lamps.jpg.asset.json";
import weddingFloralArrangements from "@/assets/wedding-floral-arrangements.jpg.asset.json";
import haldiDecorAsset from "@/assets/haldi-decor.jpg.asset.json";
import haldiCoupleAsset from "@/assets/haldi-couple.jpg.asset.json";
import receptionDecorAsset from "@/assets/reception-decor.jpg.asset.json";
import receptionCoupleAsset from "@/assets/reception-couple.jpg.asset.json";
import { Banner, GoldCard } from "@/components/zenin/ui";
import { BottomNav } from "@/components/zenin/BottomNav";

export const Route = createFileRoute("/moodboards")({
  head: () => ({ meta: [{ title: "Zenin · Wedding Moodboards & Outfits" }, { name: "description", content: "Haldi, Wedding and Reception inspiration for Priya and Arjun." }, { property: "og:title", content: "Zenin · Wedding Moodboards & Outfits" }, { property: "og:description", content: "Explore event palettes, decor and bridal and groom outfit ideas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Moodboards,
});

const events = [
  { name: "Haldi", theme: "Ivory courtyard morning", decor: "Ivory jasmine canopy, blush seating and brass bowls; turmeric reserved for the ritual.", bride: "Easy ivory cotton outfit with blush accents and floral accessories.", groom: "Ivory cotton kurta and trousers with a champagne stole.", photo: haldiDecorAsset.url, outfitPhoto: haldiCoupleAsset.url },
  { name: "Wedding", theme: "Ivory & dusty rose · brass and blooms", decor: "Layer ivory and dusty rose canopy drapes above gold-framed chairs and ivory table linen. Hang delicate pink and white flower strings; arrange roses and white rajnigandha in brass bowls beside traditional brass lamps and petal-filled trays.", bride: "Blush pink lehenga with intricate gold-toned floral embroidery, a sheer matching dupatta and pearl jewellery. Designer to be confirmed.", groom: "Ivory sherwani with delicate gold-toned floral embroidery, a dusty rose stole and matching pocket square, finished with brown shoes. Designer to be confirmed.", photo: weddingDrapes.url, outfitPhoto: weddingOutfits.url, palette: [["Ivory", "bg-wedding-ivory"], ["Blush", "bg-wedding-blush"], ["Dusty rose", "bg-wedding-dusty-rose"], ["Floral pink", "bg-wedding-floral-pink"], ["Brass gold", "bg-wedding-brass"]], gallery: [{ src: weddingDrapes.url, alt: "Ivory and dusty rose canopy drapes with gold-framed chairs" }, { src: weddingOutfits.url, alt: "Blush embroidered bridal lehenga and ivory groom sherwani" }, { src: weddingPetalBowls.url, alt: "Pink rose petals and white jasmine in gold-toned bowls" }, { src: weddingFlowerStrings.url, alt: "Hanging pink and white flower strings above ivory chairs" }, { src: weddingBrassLamps.url, alt: "Traditional brass lamps with pink petals and white rajnigandha" }, { src: weddingFloralArrangements.url, alt: "Pink and white floral arrangements in brass vessels" }] },
  { name: "Reception", theme: "Blush evening elegance", decor: "Ivory table linen, blush floral centrepieces and champagne candleholders.", bride: "Champagne embroidered saree or lehenga with blush jewellery accents.", groom: "Ivory tailored jacket with champagne accents and a blush pocket square.", photo: receptionDecorAsset.url, outfitPhoto: receptionCoupleAsset.url },
];
function Moodboards() {
  return <div className="mx-auto min-h-screen max-w-md bg-background pb-24"><MoodboardsContent /><BottomNav active="moodboards" /></div>;
}
export function MoodboardsContent() {
  return <><Banner src={decor} title="Moodboards" subtitle="Priya & Arjun · Decor and outfits" /><div className="space-y-5 px-5 pt-6"><p className="text-xs text-muted-foreground">Sample inspiration · outfit designers and final looks to be confirmed. Photos illustrate the palette, not booked designs.</p>
    {events.map((event) => <GoldCard key={event.name}><h2 className="font-serif text-2xl font-semibold text-maroon">{event.name}</h2><p className="mt-1 text-sm font-medium">{event.theme}</p><div className="mt-3 flex flex-wrap gap-3">{(event.palette ?? [["Ivory", "bg-wedding-ivory"], ["Blush", "bg-wedding-blush"], ["Gold", "bg-gold"]]).map(([label, color]) => <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`h-5 w-5 rounded-full border border-gold/50 ${color}`} />{label}</span>)}</div><p className="mt-3 text-sm text-muted-foreground">{event.decor}</p>
      <div className="mt-4 space-y-3 border-y border-border py-3"><div><h3 className="font-semibold text-maroon">Bridal Outfit</h3><p className="mt-1 text-sm text-muted-foreground">{event.bride}</p></div><div><h3 className="font-semibold text-maroon">Groom Outfit</h3><p className="mt-1 text-sm text-muted-foreground">{event.groom}</p></div></div>
      <div className="mt-4 grid grid-cols-2 gap-2">{(event.gallery ?? [{ src: event.photo, alt: `${event.name} decor inspiration` }, { src: event.outfitPhoto, alt: `${event.name} outfit inspiration` }]).map((image) => <img key={image.src} src={image.src} alt={image.alt} loading="lazy" width={1024} height={1024} className="aspect-square w-full rounded-lg object-cover" />)}</div>
    </GoldCard>)}
  </div></>;
}
