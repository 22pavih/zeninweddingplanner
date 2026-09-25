export const wedding = {
  bride: "Priya Sharma",
  groom: "Arjun Menon",
  date: "2026-11-28T00:00:00+05:30",
  preEvents: "Mehendi and Sangeet on 27 Nov",
  venue: "Green Meadows Farm, Sohna Road",
  deputy: "Rohit Sharma",
  theme: [
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Blush pink", hex: "#F4C2C2" },
    { name: "Champagne gold", hex: "#D8C08A" },
  ],
  themeRule: "Never red or maroon in decor. The lehenga is maroon.",
};

export const images = {
  hero: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=70",
  marigold: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=70",
  jewellery: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=70",
  diya: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=70",
  petals: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=70",
};

export type Decision = {
  id: string;
  who: string;
  role: string;
  ask: string;
  why: string;
  suggestion: string;
  photo?: boolean;
};

export const decisions: Decision[] = [
  {
    id: "d1",
    who: "Rajbir",
    role: "Chaudhary Tent and Decor",
    ask: "Wants to swap the ivory table runners for red satin, says ivory stock is short.",
    why: "Changes the theme",
    suggestion: "Decline. Ask for champagne gold runners instead, he has 60 in stock.",
  },
  {
    id: "d2",
    who: "Mukesh",
    role: "Shri Balaji Caterers",
    ask: "Paneer prices went up. Asking for Rs 18 more per plate on 350 plates.",
    why: "Price goes up",
    suggestion: "Approve at Rs 12 more per plate. He agreed to this on the call if you say yes today.",
  },
  {
    id: "d3",
    who: "Yadav Travels",
    role: "Guest transport",
    ask: "Wants to move the Sangeet pickup from 17:00 to 18:00 because of a driver shift.",
    why: "Shifts more than 30 minutes",
    suggestion: "Decline. Keep 17:00 and use the second driver, no extra cost.",
  },
  {
    id: "d4",
    who: "Rajbir",
    role: "Flower stall runner",
    ask: "Sent a photo of marigolds for the mandap entrance.",
    why: "Changes the theme",
    suggestion: "These marigolds are orange, which isn't in the theme. Suggest the ivory roses from the next stall, same price.",
    photo: true,
  },
];

export const handled = [
  "Rajbir moved chair delivery from 10:00 to 10:20. No clash, accepted.",
  "Anjali confirmed the Mehendi trial for 14:00 on 27 Nov.",
  "Frame Story Studio asked for the shot list again. Zenin sent it by SMS.",
  "Radha asked about parking. Zenin shared the venue gate map.",
  "Pandit Ramesh Shastri confirmed the muhurat time. No change.",
  "Gopal's arrival moved to slot B1. Pickup updated.",
];

export type TaskStatus = "On track" | "At risk" | "Blocked" | "Done";
export const today: { title: string; status: TaskStatus; note: string }[] = [
  { title: "Chair delivery to venue", status: "On track", note: "Arriving 10:20" },
  { title: "Tasting menu sign-off", status: "At risk", note: "Waiting on the paneer price" },
  { title: "Mandap flowers", status: "Blocked", note: "Needs your call on the marigolds" },
  { title: "Photographer shot list", status: "Done", note: "Sent to Frame Story" },
];

export type VendorStatus = "Booked" | "Delivering" | "Verified" | "Paid";
export type ItemStatus = "Promised" | "Confirmed on call" | "Verified";
export type Vendor = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  status: VendorStatus;
  items: { label: string; status: ItemStatus }[];
  calls: { date: string; lang: string; text: string }[];
  payment: string;
};

export const vendors: Vendor[] = [
  {
    id: "tent", name: "Chaudhary Tent and Decor", contact: "Rajbir", phone: "4521", category: "Tent and decor", status: "Delivering",
    items: [
      { label: "200 chairs, gold covers", status: "Confirmed on call" },
      { label: "Mandap frame, ivory drapes", status: "Promised" },
      { label: "40 round tables, champagne runners", status: "Verified" },
    ],
    calls: [
      { date: "22 Sept", lang: "Hindi", text: "Rajbir confirmed 200 chairs with gold covers. Zenin read the number back and sent an SMS." },
      { date: "24 Sept", lang: "Hindi", text: "Asked to swap runners to red satin. Zenin said it needs the bride and held the request." },
      { date: "25 Sept", lang: "Hindi", text: "Moved chair delivery to 10:20. No clash with catering, accepted." },
    ],
    payment: "Advance paid. Final payment held until the day-of photo check.",
  },
  {
    id: "cater", name: "Shri Balaji Caterers", contact: "Mukesh", phone: "3307", category: "Catering", status: "Booked",
    items: [
      { label: "350 plates, dinner", status: "Confirmed on call" },
      { label: "Live chaat counter", status: "Promised" },
      { label: "Jain menu, 20 plates", status: "Confirmed on call" },
    ],
    calls: [
      { date: "18 Sept", lang: "Hindi", text: "Said a number that sounded like 350 or 315. Zenin asked again. Confirmed 350." },
      { date: "25 Sept", lang: "Hindi", text: "Asked for Rs 18 more per plate. Agreed to Rs 12 if confirmed today. Sent to the bride." },
    ],
    payment: "Advance paid. Final payment held until the day-of photo check.",
  },
  {
    id: "mua", name: "Glam by Anjali", contact: "Anjali", phone: "8814", category: "Makeup", status: "Paid",
    items: [
      { label: "Bridal makeup, wedding day", status: "Verified" },
      { label: "Mehendi trial, 27 Nov 14:00", status: "Confirmed on call" },
    ],
    calls: [
      { date: "20 Sept", lang: "English", text: "Confirmed trial time. Zenin sent a calendar invite." },
      { date: "23 Sept", lang: "Hindi", text: "Asked for lehenga colour. Zenin shared maroon and the jewellery photo." },
    ],
    payment: "Paid in full.",
  },
  {
    id: "photo", name: "Frame Story Studio", contact: "Studio desk", phone: "6690", category: "Photography", status: "Verified",
    items: [
      { label: "2 photographers, 1 videographer", status: "Verified" },
      { label: "Same-day teaser reel", status: "Promised" },
    ],
    calls: [
      { date: "19 Sept", lang: "English", text: "Confirmed crew of three. No faces on social without approval." },
      { date: "25 Sept", lang: "English", text: "Asked for shot list again. Zenin sent it by SMS." },
    ],
    payment: "Advance paid. Final payment held until the day-of photo check.",
  },
  {
    id: "travel", name: "Yadav Travels", contact: "Dispatch", phone: "2245", category: "Guest transport", status: "Booked",
    items: [
      { label: "6 Innovas, airport pickups", status: "Confirmed on call" },
      { label: "Sangeet shuttle, 17:00", status: "Promised" },
    ],
    calls: [
      { date: "21 Sept", lang: "Hindi", text: "Confirmed 6 cars. Zenin read out every slot and sent the list." },
      { date: "25 Sept", lang: "Hindi", text: "Wants to move the Sangeet pickup by an hour. Sent to the bride." },
    ],
    payment: "Advance paid. Final payment held until the day-of photo check.",
  },
  {
    id: "pandit", name: "Pandit Ramesh Shastri", contact: "Panditji", phone: "1108", category: "Ceremony", status: "Verified",
    items: [
      { label: "Pheras, muhurat 20:45", status: "Verified" },
      { label: "Samagri list shared", status: "Confirmed on call" },
    ],
    calls: [
      { date: "17 Sept", lang: "Hindi", text: "Confirmed muhurat. Zenin repeated the time twice." },
      { date: "24 Sept", lang: "Hindi", text: "Shared samagri list. Rohit will buy it on 26 Nov." },
    ],
    payment: "Dakshina to be given on the day.",
  },
];

export type Guest = { name: string; hotel: string | null; slot: string; pickup: "Assigned" | "Pending" | "Not needed" };
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
