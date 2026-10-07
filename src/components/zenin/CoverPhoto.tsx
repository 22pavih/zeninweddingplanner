import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CoverPhoto({ onChange }: { onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const objectUrl = useRef<string | undefined>(undefined);
  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  const apply = (src: string) => {
    const image = new Image();
    image.onload = () => { onChange(src); setOpen(false); setError(""); };
    image.onerror = () => setError("This photo could not be opened. Try another image.");
    image.src = src;
  };
  return <><Button variant="ghost" size="icon" aria-label="Change cover photo" title="Change cover photo" onClick={() => setOpen(true)} className="absolute right-4 top-4 z-10 text-primary-foreground"><Camera /></Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-sm rounded-2xl border-gold/50"><DialogHeader><DialogTitle className="font-serif text-maroon">Cover photo</DialogTitle><DialogDescription>Choose a photo for Priya and Arjun. Changes last for this visit.</DialogDescription></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); try { const parsed = new URL(url); if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error(); apply(url); } catch { setError("Enter a valid image URL beginning with https://."); } }}><Input aria-label="Cover image URL" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} /><Button type="submit" className="w-full">Use image URL</Button></form>
      <Button asChild variant="outline"><label className="cursor-pointer"><Upload />Upload photo<input aria-label="Upload cover photo" type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) { setError("Choose an image file."); return; } if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = URL.createObjectURL(file); apply(objectUrl.current); }} /></label></Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </DialogContent></Dialog></>;
}