import { useState } from "react";
import { Camera, ChevronRight, MapPin, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkTasks, helperAreas, previewDistance, type CheckTask, type Helper, type HelperArea } from "@/data/wedding";
import { Chip, GoldCard } from "./ui";

export type CheckAssignment = {
  taskId: string;
  helperId: string;
  distance: number;
  observation?: string;
  photoName?: string;
  status: "Assigned" | "Verified" | "Decision needed" | "Needs review";
};

export function OnGround({ helpers, assignments, addHelper, assign, submitReport, goDecisions, vendorId, mode = "checks" }: {
  helpers: Helper[];
  assignments: CheckAssignment[];
  addHelper: (name: string, relation: string, area: HelperArea) => void;
  assign: (task: CheckTask) => void;
  submitReport: (task: CheckTask, observation: string, photoName?: string) => void;
  goDecisions: () => void;
  vendorId?: string;
  mode?: "helpers" | "checks";
}) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [area, setArea] = useState<HelperArea>("Sohna");
  const [taskId, setTaskId] = useState("mandap");
  const [observation, setObservation] = useState("");
  const [photoName, setPhotoName] = useState<string>();
  const tasks = vendorId ? checkTasks.filter((task) => task.vendorId === vendorId) : checkTasks;
  const selected = tasks.find((task) => task.id === taskId) ?? tasks[0];
  const assignment = selected ? assignments.find((item) => item.taskId === selected.id) : undefined;
  const helper = helpers.find((item) => item.id === assignment?.helperId);
  const nearest = selected ? [...helpers].filter((item) => item.available).sort((a, b) => previewDistance(a.area, selected.area) - previewDistance(b.area, selected.area))[0] : undefined;

  return (
    <div className="space-y-3">
      {mode === "helpers" && <GoldCard>
        <p className="font-semibold text-maroon">Priya's helpers</p>
        <p className="mt-1 text-xs text-muted-foreground">Sample relatives on Priya's helper list · areas entered manually for this preview</p>
        <ul className="mt-3 divide-y divide-border">
          {helpers.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="flex min-w-0 items-center gap-2"><UserRound className="h-4 w-4 shrink-0 text-gold" /><span className="min-w-0"><strong>{item.name}</strong> · {item.relation}<span className="block text-xs text-muted-foreground">{item.area}</span></span></span>
            <Chip label={item.available ? "Available" : "Assigned"} />
          </li>)}
        </ul>
        <form className="mt-3 space-y-2 border-t border-border pt-3" onSubmit={(event) => { event.preventDefault(); if (!name.trim() || !relation.trim()) return; addHelper(name.trim(), relation.trim(), area); setName(""); setRelation(""); }}>
          <p className="text-sm font-semibold">Add a helper</p>
          <div className="grid grid-cols-2 gap-2"><Input aria-label="Helper name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required /><Input aria-label="Relationship" placeholder="Relationship" value={relation} onChange={(event) => setRelation(event.target.value)} required /></div>
          <div className="flex gap-2"><select aria-label="Helper area" className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm" value={area} onChange={(event) => setArea(event.target.value as HelperArea)}>{helperAreas.map((option) => <option key={option}>{option}</option>)}</select><Button size="sm" type="submit"><Plus className="h-4 w-4" /> Add</Button></div>
        </form>
      </GoldCard>}
      {mode === "checks" && selected && <GoldCard>
        <p className="text-xs font-semibold text-gold">DELHIVERY · ON-GROUND CHECK PREVIEW</p>
        {tasks.length > 1 && <select aria-label="Check to assign" className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-sm font-semibold" value={selected.id} onChange={(event) => { setTaskId(event.target.value); setObservation(""); setPhotoName(undefined); }}>{tasks.map((task) => <option value={task.id} key={task.id}>{task.title}</option>)}</select>}
        {tasks.length === 1 && <p className="mt-2 font-semibold">{selected.title}</p>}
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{selected.place} · {selected.area}</p>
        <p className="mt-2 text-sm">{selected.brief}</p>
        {!assignment ? <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm">{nearest ? <>Nearest available: <strong>{nearest.name}</strong> · {nearest.area} · about {previewDistance(nearest.area, selected.area)} km</> : "No available helpers. Add another relative to assign this check."}</p>
          <Button className="mt-2" size="sm" disabled={!nearest} onClick={() => assign(selected)}>Assign nearest helper</Button>
        </div> : <div className="mt-3 border-t border-border pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{helper?.name ?? "Helper"} · {helper?.area} · ~{assignment.distance} km</p><Chip label={assignment.status} /></div>
          <p className="mt-1 text-xs text-muted-foreground">Delhivery matched the nearest available helper in this preview. No dispatch or live location tracking.</p>
          {assignment.observation && <div className="mt-3 border-l-2 border-gold pl-3 text-sm"><p><strong>{helper?.name}'s update:</strong> {assignment.observation}</p>{assignment.photoName && <p className="mt-1 text-xs text-muted-foreground"><Camera className="mr-1 inline h-3 w-3" />{assignment.photoName} attached · not analysed</p>}<p className="mt-1 text-muted-foreground">{assignment.status === "Verified" ? "Zenin matched the written update to the requirements. Verified in preview." : assignment.status === "Decision needed" ? "Zenin found a conflict and sent it to Priya for approval." : "Zenin needs more detail before verifying this check."}</p>{assignment.status === "Decision needed" && <Button variant="link" className="h-auto p-0" onClick={goDecisions}>View decision <ChevronRight className="h-4 w-4" /></Button>}</div>}
          <form className="mt-3 space-y-2" onSubmit={(event) => { event.preventDefault(); if (!observation.trim()) return; submitReport(selected, observation.trim(), photoName); setObservation(""); setPhotoName(undefined); }}>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor={`report-${selected.id}`}>{helper?.name}'s on-site update (preview)</label>
            <Input id={`report-${selected.id}`} value={observation} onChange={(event) => setObservation(event.target.value)} placeholder={selected.id === "dress" ? "e.g. Maroon lehenga ready for pickup" : "e.g. Ivory flowers ready"} required />
            <div className="flex flex-wrap items-center justify-between gap-2"><label className="flex cursor-pointer items-center gap-1 text-xs text-primary"><Camera className="h-4 w-4" />{photoName ?? "Attach photo (optional)"}<input type="file" accept="image/*" className="sr-only" onChange={(event) => setPhotoName(event.target.files?.[0]?.name)} /></label><Button type="submit" size="sm">Submit update</Button></div>
            <p className="text-xs text-muted-foreground">This preview checks written updates only. Photos are not analysed or sent.</p>
          </form>
        </div>}
      </GoldCard>}
      {mode === "checks" && assignments.filter((item) => !vendorId || checkTasks.some((task) => task.id === item.taskId && task.vendorId === vendorId)).length > 0 && <GoldCard><p className="font-semibold text-maroon">Check results</p><ul className="mt-2 divide-y divide-border">{assignments.filter((item) => !vendorId || checkTasks.some((task) => task.id === item.taskId && task.vendorId === vendorId)).map((item) => { const task = checkTasks.find((t) => t.id === item.taskId); const person = helpers.find((h) => h.id === item.helperId); return <li key={item.taskId} className="flex items-center justify-between gap-2 py-2 text-sm"><span className="min-w-0"><strong>{task?.title}</strong><span className="block text-xs text-muted-foreground">{person?.name} · {item.observation ?? "Awaiting update"}</span></span><Chip label={item.status} /></li>; })}</ul></GoldCard>}
    </div>
  );
}