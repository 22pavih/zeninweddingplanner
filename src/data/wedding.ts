export const wedding = {
  bride: "Priya Sharma",
  groom: "Arjun Menon",
  date: "2026-11-28T00:00:00+05:30",
  preEvents: "Mehendi and Sangeet on 27 November 2026",
  venue: "Green Meadows Farm, Sohna Road",
  deputy: "Rohit Sharma",
  theme: [
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Blush pink", hex: "#F4C2C2" },
    { name: "Champagne gold", hex: "#D8C08A" },
  ],
  themeRule: "Never red or maroon in decor. The lehenga may be maroon, but it is not part of the decor theme.",
};

export type HelperArea = "Sohna" | "Sector 29" | "Golf Course Road" | "Cyber City";
export type Helper = { id: string; name: string; relation: string; area: HelperArea; available: boolean };
export const helperAreas: HelperArea[] = ["Sohna", "Sector 29", "Golf Course Road", "Cyber City"];
export const helpers: Helper[] = [
  { id: "rohit", name: "Rohit Sharma", relation: "Cousin", area: "Sohna", available: true },
  { id: "lakshmi", name: "Lakshmi", relation: "Aunt", area: "Sector 29", available: true },
  { id: "radha", name: "Radha", relation: "Cousin", area: "Golf Course Road", available: true },
  { id: "gopal", name: "Gopal", relation: "Uncle", area: "Cyber City", available: true },
  { id: "monu", name: "Monu Sharma", relation: "Cousin", area: "Sector 29", available: true },
];
export type CheckTask = { id: string; title: string; place: string; area: HelperArea; vendorId: string; brief: string };
export const checkTasks: CheckTask[] = [
  { id: "mandap", title: "Check mandap drapes", place: "Green Meadows Farm", area: "Sohna", vendorId: "tent", brief: "Ivory, blush pink or champagne gold only. No red or maroon decor." },
  { id: "flowers", title: "Check mandap flowers", place: "Flower stall near venue", area: "Sohna", vendorId: "tent", brief: "Check flowers against the ivory, blush and champagne palette; flag orange, red or maroon." },
  { id: "dress", title: "Check bridal dress", place: "Bridal boutique", area: "Sector 29", vendorId: "dress", brief: "Confirm Priya's maroon lehenga is ready; maroon is allowed for the dress, not decor." },
];
// Approximate, illustrative distances for this preview, not live location or routing.
const previewDistances: Record<HelperArea, Record<HelperArea, number>> = {
  Sohna: { Sohna: 3, "Sector 29": 28, "Golf Course Road": 23, "Cyber City": 34 },
  "Sector 29": { Sohna: 28, "Sector 29": 2, "Golf Course Road": 9, "Cyber City": 8 },
  "Golf Course Road": { Sohna: 23, "Sector 29": 9, "Golf Course Road": 2, "Cyber City": 11 },
  "Cyber City": { Sohna: 34, "Sector 29": 8, "Golf Course Road": 11, "Cyber City": 2 },
};
export const previewDistance = (from: HelperArea, to: HelperArea) => previewDistances[from][to];

export const images = {
  hero: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=70",
  marigold: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=70",
  jewellery: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=70",
  diya: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=70",
  petals: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=70",
};

export type Decision = {
  id: string;
  vendorId?: string;
  who: string;
  role: string;
  ask: string;
  why: string;
  suggestion: string;
  photo?: boolean;
  owner?: "Priya" | "Rakesh ji";
};

export const decisions: Decision[] = [
  {
    id: "d1",
    vendorId: "tent",
    who: "Rajbir",
    role: "Chaudhary Tent and Decor",
    ask: "Wants to swap the ivory table runners for red satin because ivory stock is short.",
    why: "Changes the theme",
    suggestion: "Decline. Ask for champagne gold runners instead. Rajbir has 60 in stock.",
  },
  {
    id: "d2",
    vendorId: "cater",
    owner: "Rakesh ji",
    who: "Mukesh",
    role: "Shri Balaji Caterers",
    ask: "Requests an additional 50 meal portions.",
    why: "Price goes up",
    suggestion: "Review the updated quantity and price before approving.",
  },
];

export const photoChecks = [
  { name: "Ivory", ok: true },
  { name: "Blush pink", ok: true },
  { name: "Champagne gold", ok: true },
  { name: "Bright orange", ok: false },
];

export const handled = [
  "Stage flowers ran short. Monu bought pale pink roses and white rajnigandha from Amit Flowers Decoration for ₹4,500. Zenin rejected a first photo of red roses.",
  "Rajbir confirmed 200 chairs with gold covers.",
  "Mukesh confirmed 350 meal portions after Zenin asked him to repeat the quantity.",
  "Yadav Travels confirmed the B2 pickup.",
  "Frame Story Studio confirmed setup timing.",
  "Zenin followed up with the decorator about loading access.",
  "Anjali confirmed the Mehendi trial for 14:00 on 27 Nov.",
  "Frame Story Studio asked for the shot list again. Zenin sent it by SMS.",
  "Radha asked about parking. Zenin shared the venue gate map.",
  "Pandit Ramesh Shastri confirmed the muhurat time. No change.",
  "Gopal's arrival moved to slot B1. Pickup updated.",
  "Yadav Travels shared driver names for all 6 cars.",
  "Rajbir moved chair delivery from 10:00 to 10:20. No clash, accepted.",
];

export const activity = [
  "Zenin called Rajbir",
  "Zenin confirmed quantity with Mukesh",
  "Zenin followed up with Yadav Travels",
  "Zenin detected a theme conflict",
  "Zenin escalated a price change",
  "Zenin verified a delivery photo",
];

export type TaskStatus = "On track" | "At risk" | "Blocked" | "Done";
export const today: { title: string; status: TaskStatus; note: string }[] = [
  { title: "Chair delivery to venue", status: "On track", note: "Arriving 19:00" },
  { title: "Catering headcount", status: "At risk", note: "Waiting on the extra 50 portions" },
  { title: "Mandap flowers", status: "Blocked", note: "Needs your call on the flower photo" },
  { title: "Photographer shot list", status: "Done", note: "Sent to Frame Story" },
];

export type VendorStatus = "Booked" | "Contacted" | "Confirmed" | "Delivering" | "Verified" | "Payment Pending" | "Paid" | "At Risk";
export type ItemStatus = "Promised" | "Confirmed" | "Verified" | "Issue";
export type PayState = "Pending" | "Verification ongoing" | "Approved" | "Paid" | "Held" | "Verified";
export type Payment = { advance: PayState; delivery: PayState; final: PayState; reason: string };
export type Vendor = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  status: VendorStatus;
  items: { label: string; status: ItemStatus }[];
  calls: { date: string; lang: string; text: string; decisionId?: string }[];
  payment: Payment;
};

const held: Payment = { advance: "Paid", delivery: "Verification ongoing", final: "Held", reason: "Awaiting day-of verification" };

export const vendors: Vendor[] = [
  {
    id: "tent", name: "Chaudhary Tent and Decor", contact: "Rajbir", phone: "4521", category: "Tent and decor", status: "Delivering",
    items: [
      { label: "200 chairs", status: "Confirmed" },
      { label: "Gold covers", status: "Confirmed" },
      { label: "Delivery: 19:00", status: "Promised" },
      { label: "Venue: Green Meadows Farm", status: "Verified" },
      { label: "Ivory table runners", status: "Issue" },
    ],
    calls: [
       { date: "22 Sept", lang: "Hindi", text: "Rajbir confirmed 200 chairs with gold covers. Zenin repeated the quantity back and received confirmation." },
      { date: "24 Sept", lang: "Hindi", text: "Rajbir asked to move setup from 19:00 to 20:00. Zenin recorded the request; the timing is not confirmed." },
      { date: "25 Sept", lang: "Hindi", text: "Rajbir asked to swap runners to red satin. Zenin checked the decor rule and sent an approval request to Priya.", decisionId: "d1" },
    ],
    payment: { ...held },
  },
  {
    id: "cater", name: "Shri Balaji Caterers", contact: "Mukesh", phone: "3307", category: "Catering", status: "At Risk",
    items: [
      { label: "350 meal portions", status: "Confirmed" },
      { label: "Live chaat counter", status: "Promised" },
      { label: "Jain menu, 20 plates", status: "Confirmed" },
    ],
    calls: [
       { date: "18 Sept", lang: "Hindi", text: "Mukesh initially said a quantity that sounded like 350 or 315. Zenin asked him to repeat it. Mukesh confirmed 350." },
      { date: "25 Sept", lang: "Hindi", text: "Mukesh requested 50 extra portions. Zenin flagged the price increase and sent an approval request to Priya.", decisionId: "d2" },
    ],
    payment: { ...held },
  },
  {
    id: "mua", name: "Glam by Anjali", contact: "Anjali", phone: "8814", category: "Makeup", status: "Paid",
    items: [
      { label: "Bridal makeup, wedding day", status: "Verified" },
      { label: "Mehendi trial, 27 Nov 14:00", status: "Confirmed" },
    ],
    calls: [
       { date: "20 Sept", lang: "English", text: "Confirmed trial time. Zenin recorded the calendar details." },
       { date: "23 Sept", lang: "Hindi", text: "Asked for lehenga colour. Zenin shared maroon and the jewellery photo." },
    ],
    payment: { advance: "Paid", delivery: "Verified", final: "Paid", reason: "Paid in full" },
  },
  {
    id: "photo", name: "Frame Story Studio", contact: "Studio desk", phone: "6690", category: "Photography", status: "Confirmed",
    items: [
      { label: "2 photographers, 1 videographer", status: "Confirmed" },
      { label: "Same-day teaser reel", status: "Promised" },
    ],
    calls: [
      { date: "19 Sept", lang: "English", text: "Confirmed crew of three. No faces on social without approval." },
       { date: "25 Sept", lang: "English", text: "Confirmed setup timing. Asked for shot list again; Zenin sent it by SMS." },
    ],
    payment: { ...held },
  },
  {
    id: "travel", name: "Yadav Travels", contact: "Dispatch", phone: "2245", category: "Guest transport", status: "Contacted",
    items: [
      { label: "6 Innovas, airport pickups", status: "Confirmed" },
      { label: "B2 pickup slot", status: "Confirmed" },
      { label: "Sangeet shuttle, 17:00", status: "Promised" },
    ],
    calls: [
       { date: "21 Sept", lang: "Hindi", text: "Confirmed 6 cars. Zenin read out every slot and sent the list." },
       { date: "26 Sept", lang: "Hindi", text: "Zenin followed up on the B2 pickup. Confirmed." },
    ],
    payment: { advance: "Paid", delivery: "Pending", final: "Held", reason: "Awaiting day-of verification" },
  },
  {
    id: "pandit", name: "Pandit Ramesh Shastri", contact: "Panditji", phone: "1108", category: "Ceremony", status: "Verified",
    items: [
      { label: "Pheras at the muhurat", status: "Verified" },
      { label: "Samagri list shared", status: "Confirmed" },
    ],
    calls: [
       { date: "17 Sept", lang: "Hindi", text: "Confirmed muhurat. Zenin repeated the time twice." },
      { date: "24 Sept", lang: "Hindi", text: "Shared samagri list. Rohit will buy it on 26 Nov." },
    ],
    payment: { advance: "Pending", delivery: "Pending", final: "Pending", reason: "Dakshina to be given on the day" },
  },
];

export type Guest = { name: string; hotel: string | null; slot: string; pickup: "Assigned" | "Pending" | "Not needed"; note?: string };
const hotels: string[] = ["Taj City Centre", "Lemon Tree Sohna", "Radisson Gurugram"];
export const guests: Guest[] = [
  { name: "Lakshmi", hotel: hotels[0]!, slot: "A1", pickup: "Assigned" },
  { name: "Latha", hotel: hotels[0]!, slot: "A1", pickup: "Assigned" },
  { name: "Suresh uncle", hotel: hotels[0]!, slot: "A2", pickup: "Assigned" },
  { name: "Radha", hotel: hotels[1]!, slot: "A2", pickup: "Assigned" },
  { name: "Gopal", hotel: hotels[1]!, slot: "B1", pickup: "Assigned" },
  { name: "Madhavan K", hotel: null, slot: "B2", pickup: "Pending" },
  ...Array.from({ length: 10 }, (_, i): Guest => ({
    name: `Guest ${i + 1}`,
    hotel: hotels[i % 3]!,
    slot: ["A1", "A2", "B1", "B2"][i % 4]!,
    pickup: i % 4 === 3 ? "Not needed" : "Assigned",
  })),
];

export const gaps = [
  { id: "g1", text: "Madhavan K has no room and no pickup.", fix: "Book a room at Lemon Tree Sohna and add him to the B2 pickup." },
  { id: "g2", text: "Suresh uncle's phone was off twice. Zenin messaged Lakshmi instead.", fix: "Make Lakshmi his contact for pickup updates." },
];
