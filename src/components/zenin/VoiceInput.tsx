import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type VoiceResult = { isFinal: boolean; 0: { transcript: string } };
type Recognition = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((event: { results: ArrayLike<VoiceResult> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void };
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function VoiceInput({ text, onText, active = true }: { text: string; onText: (text: string) => void; active?: boolean }) {
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | undefined>(undefined);
  useEffect(() => () => { const current = recognition.current; if (current) { current.onresult = null; current.onend = null; current.onerror = null; current.abort(); } }, []);
  useEffect(() => { if (!active) recognition.current?.stop(); }, [active]);
  const toggle = () => {
    if (listening) { recognition.current?.stop(); return; }
    const browser = window as VoiceWindow;
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) { toast("Voice input is not available in this browser. Try Chrome or type your instruction."); return; }
    const current = new Constructor();
    const prefix = text.trim();
    current.continuous = true;
    current.interimResults = true;
    current.lang = "en-IN";
    current.onresult = (event) => { const transcript = Array.from(event.results).map((result) => result[0].transcript).join(" "); onText([prefix, transcript].filter(Boolean).join(" ")); };
    current.onend = () => setListening(false);
    current.onerror = (event) => { setListening(false); toast(event.error === "not-allowed" ? "Microphone access was denied. Allow access or type your instruction." : "Voice input stopped. Please try again."); };
    recognition.current = current;
    try { current.start(); setListening(true); } catch { setListening(false); toast("Could not start the microphone. Please try again."); }
  };
  return <Button type="button" variant={listening ? "default" : "outline"} size="icon" className="shrink-0" aria-label={listening ? "Stop voice input" : "Start voice input"} title={listening ? "Stop voice input" : "Start voice input"} aria-pressed={listening} onClick={toggle}>{listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>;
}