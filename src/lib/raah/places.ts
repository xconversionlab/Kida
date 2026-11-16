import type { Landmark, LandmarkKind, Place, PlaceKind, Selection } from "./types";

interface Spot {
  name: string;
  kind: LandmarkKind;
  hint: string;
}

const CITY_SPOTS: Spot[] = [
  { name: "Junction", kind: "station", hint: "Main rail or metro point" },
  { name: "Central Bus Stand", kind: "bus", hint: "Intercity bus terminal" },
  { name: "District Hospital", kind: "hospital", hint: "Emergency gate" },
  { name: "Main Market", kind: "market", hint: "Clock-tower side" },
];

const VILLAGE_SPOTS: Spot[] = [
  { name: "Village bus stop", kind: "bus", hint: "Where the bus halts" },
  { name: "Government school", kind: "school", hint: "Primary school gate" },
  { name: "Village temple", kind: "temple", hint: "Largest temple" },
  { name: "Health centre", kind: "hospital", hint: "Primary health centre" },
];

function build(
  id: string,
  name: string,
  kind: PlaceKind,
  state: string,
  district: string,
  lat: number,
  lng: number,
  aliases: string[] = [],
  spots?: Spot[],
): Place {
  const base = spots ?? (kind === "village" ? VILLAGE_SPOTS : CITY_SPOTS);
  const landmarks: Landmark[] = base.map((spot, i) => ({
    id: `${id}-${i}`,
    name: spot.name.includes(name) ? spot.name : kind === "village" ? spot.name : `${name} ${spot.name}`,
    kind: spot.kind,
    hint: spot.hint,
    lat: lat + (i - 1.5) * 0.012,
    lng: lng + ((i % 2) - 0.5) * 0.016,
  }));
  return { id, name, kind, state, district, lat, lng, aliases, landmarks };
}

export const PLACES: Place[] = [
  build("blr", "Bengaluru", "metro", "Karnataka", "Bengaluru Urban", 12.9716, 77.5946, ["bangalore", "blr"], [
    { name: "Indiranagar Metro", kind: "station", hint: "CMH Road exit" },
    { name: "Majestic Bus Stand", kind: "bus", hint: "KSRTC platform" },
    { name: "Victoria Hospital", kind: "hospital", hint: "Main gate" },
    { name: "KR Market", kind: "market", hint: "Flower market side" },
  ]),
  build("mum", "Mumbai", "metro", "Maharashtra", "Mumbai", 19.076, 72.8777, ["bombay"], [
    { name: "Dadar Station", kind: "station", hint: "East side" },
    { name: "Bandra West", kind: "market", hint: "Linking Road" },
    { name: "CSMT", kind: "station", hint: "Mainline concourse" },
    { name: "Sion Hospital", kind: "hospital", hint: "Casualty" },
  ]),
  build("del", "New Delhi", "metro", "Delhi", "New Delhi", 28.6139, 77.209, ["delhi", "ncr"], [
    { name: "Kashmere Gate", kind: "station", hint: "ISBT exit" },
    { name: "Connaught Place", kind: "market", hint: "Block A" },
    { name: "AIIMS", kind: "hospital", hint: "Main gate" },
    { name: "New Delhi Station", kind: "station", hint: "Ajmeri Gate" },
  ]),
  build("hyd", "Hyderabad", "metro", "Telangana", "Hyderabad", 17.385, 78.4867, [], [
    { name: "Ameerpet Metro", kind: "station", hint: "Metro exit 1" },
    { name: "MGBS", kind: "bus", hint: "Bus terminal" },
    { name: "Osmania Hospital", kind: "hospital", hint: "Afzal Gunj" },
    { name: "Charminar", kind: "market", hint: "Laad Bazaar side" },
  ]),
  build("che", "Chennai", "metro", "Tamil Nadu", "Chennai", 13.0827, 80.2707, ["madras"], [
    { name: "Central Station", kind: "station", hint: "Moore Market" },
    { name: "Koyambedu", kind: "bus", hint: "CMBT" },
    { name: "GH Chennai", kind: "hospital", hint: "Park Town" },
    { name: "T Nagar", kind: "market", hint: "Pondy Bazaar" },
  ]),
  build("kol", "Kolkata", "metro", "West Bengal", "Kolkata", 22.5726, 88.3639, ["calcutta"], [
    { name: "Howrah Station", kind: "station", hint: "New complex" },
    { name: "Esplanade", kind: "bus", hint: "Bus hub" },
    { name: "SSKM Hospital", kind: "hospital", hint: "Bhowanipore" },
    { name: "Gariahat", kind: "market", hint: "Market crossing" },
  ]),
  build("pun", "Pune", "city", "Maharashtra", "Pune", 18.5204, 73.8567),
  build("ahm", "Ahmedabad", "city", "Gujarat", "Ahmedabad", 23.0225, 72.5714),
  build("jai", "Jaipur", "city", "Rajasthan", "Jaipur", 26.9124, 75.7873),
  build("lko", "Lucknow", "city", "Uttar Pradesh", "Lucknow", 26.8467, 80.9462),
  build("cok", "Kochi", "city", "Kerala", "Ernakulam", 9.9312, 76.2673, ["cochin"]),
  build("idr", "Indore", "city", "Madhya Pradesh", "Indore", 22.7196, 75.8577),
  build("cbe", "Coimbatore", "city", "Tamil Nadu", "Coimbatore", 11.0168, 76.9558),
  build("bbi", "Bhubaneswar", "city", "Odisha", "Khordha", 20.2961, 85.8245),
  build("gau", "Guwahati", "city", "Assam", "Kamrup", 26.1445, 91.7362),
  build("ixc", "Chandigarh", "city", "Chandigarh", "Chandigarh", 30.7333, 76.7794),
  build("nag", "Nagpur", "city", "Maharashtra", "Nagpur", 21.1458, 79.0882),
  build("vtz", "Visakhapatnam", "city", "Andhra Pradesh", "Visakhapatnam", 17.6868, 83.2185, ["vizag"]),
  build("pat", "Patna", "city", "Bihar", "Patna", 25.5941, 85.1376),
  build("bho", "Bhopal", "city", "Madhya Pradesh", "Bhopal", 23.2599, 77.4126),
  build("stv", "Surat", "city", "Gujarat", "Surat", 21.1702, 72.8311),
  build("ldh", "Ludhiana", "city", "Punjab", "Ludhiana", 30.901, 75.8573),
  build("mys", "Mysuru", "city", "Karnataka", "Mysuru", 12.2958, 76.6394, ["mysore"]),
  build("ixm", "Madurai", "city", "Tamil Nadu", "Madurai", 9.9252, 78.1198),
  build("vns", "Varanasi", "city", "Uttar Pradesh", "Varanasi", 25.3176, 82.9739, ["banaras", "kashi"], [
    { name: "Varanasi Junction", kind: "station", hint: "Station road" },
    { name: "Cantt Bus Stand", kind: "bus", hint: "Platform 1" },
    { name: "BHU Hospital", kind: "hospital", hint: "Lanka side" },
    { name: "Dashashwamedh Ghat", kind: "other", hint: "Ghat steps" },
  ]),
  build("ixr", "Ranchi", "city", "Jharkhand", "Ranchi", 23.3441, 85.3096),
  build("hbx", "Hubballi", "town", "Karnataka", "Dharwad", 15.3647, 75.124, ["hubli"]),
  build("wgl", "Warangal", "town", "Telangana", "Hanamkonda", 17.9689, 79.5941),
  build("ixb", "Siliguri", "town", "West Bengal", "Darjeeling", 26.7271, 88.3953),
  build("udr", "Udaipur", "town", "Rajasthan", "Udaipur", 24.5854, 73.7125),
  build("tcr", "Thrissur", "town", "Kerala", "Thrissur", 10.5276, 76.2144),
  build("dhm", "Dharamshala", "town", "Himachal Pradesh", "Kangra", 32.219, 76.3234),
  build("shl", "Shillong", "town", "Meghalaya", "East Khasi Hills", 25.5788, 91.8933),
  build("ajl", "Aizawl", "town", "Mizoram", "Aizawl", 23.7271, 92.7176),
  build("goi", "Panaji", "town", "Goa", "North Goa", 15.4909, 73.8278, ["panjim"]),
  build("leh", "Leh", "town", "Ladakh", "Leh", 34.1526, 77.5771),
  build("ixz", "Port Blair", "town", "Andaman and Nicobar", "South Andaman", 11.6234, 92.7265),
  build("mjl", "Kamalabari", "town", "Assam", "Majuli", 26.95, 94.17, ["majuli"]),
  build("hwb", "Hiware Bazar", "village", "Maharashtra", "Ahmednagar", 19.083, 74.583, ["hiware"]),
  build("punsi", "Punsari", "village", "Gujarat", "Sabarkantha", 23.45, 73.05),
  build("dhr", "Dharnai", "village", "Bihar", "Jehanabad", 25.005, 84.99),
  build("kho", "Khonoma", "village", "Nagaland", "Kohima", 25.644, 94.02),
  build("maw", "Mawlynnong", "village", "Meghalaya", "East Khasi Hills", 25.201, 91.916),
  build("ank", "Ankapur", "village", "Telangana", "Nizamabad", 18.79, 78.29),
  build("kod", "Kodihalli", "village", "Karnataka", "Ramanagara", 12.64, 77.28, ["kanakapura"], [
    { name: "Kodihalli bus stop", kind: "bus", hint: "On the Kanakapura road" },
    { name: "Government school", kind: "school", hint: "School compound gate" },
    { name: "Hanuman temple", kind: "temple", hint: "Temple arch" },
    { name: "Primary health centre", kind: "hospital", hint: "PHC veranda" },
  ]),
];

export const RTO: Record<string, string> = {
  Karnataka: "KA",
  Maharashtra: "MH",
  Delhi: "DL",
  Telangana: "TS",
  "Tamil Nadu": "TN",
  "West Bengal": "WB",
  Gujarat: "GJ",
  Rajasthan: "RJ",
  "Uttar Pradesh": "UP",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Odisha: "OD",
  Assam: "AS",
  Chandigarh: "CH",
  "Andhra Pradesh": "AP",
  Bihar: "BR",
  Punjab: "PB",
  Jharkhand: "JH",
  "Himachal Pradesh": "HP",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Goa: "GA",
  Ladakh: "LA",
  "Andaman and Nicobar": "AN",
  Nagaland: "NL",
};

export function getPlace(id: string) {
  return PLACES.find((p) => p.id === id) ?? null;
}

export function getLandmark(placeId: string, landmarkId: string) {
  const place = getPlace(placeId);
  const landmark = place?.landmarks.find((l) => l.id === landmarkId) ?? null;
  return place && landmark ? { place, landmark } : null;
}

export function formatLine(place: Place, landmark: { name: string }) {
  if (place.kind === "village" || place.kind === "town") {
    return `${landmark.name}, ${place.name}, ${place.district}, ${place.state}`;
  }
  return `${landmark.name}, ${place.name}, ${place.state}`;
}

export function toSelection(
  place: Place,
  landmark: Landmark,
  source: Selection["source"],
): Selection {
  return {
    placeId: place.id,
    landmarkId: landmark.id,
    label: landmark.name,
    line: formatLine(place, landmark),
    lat: landmark.lat,
    lng: landmark.lng,
    source,
  };
}

export function searchPlaces(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return PLACES;
  return PLACES.filter((place) => {
    const blob = [place.name, place.state, place.district, place.kind, ...place.aliases, ...place.landmarks.map((l) => l.name)]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((part) => blob.includes(part));
  });
}

export function nearestPlace(lat: number, lng: number) {
  let best = PLACES[0];
  let bestD = Infinity;
  for (const place of PLACES) {
    const d = (place.lat - lat) ** 2 + (place.lng - lng) ** 2;
    if (d < bestD) {
      best = place;
      bestD = d;
    }
  }
  return best;
}

export const STATES = [...new Set(PLACES.map((p) => p.state))].sort();
