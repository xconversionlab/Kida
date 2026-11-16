export type Lang =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "bn"
  | "mr"
  | "gu"
  | "pa";

export type VehicleId = "bike" | "auto" | "mini" | "sedan" | "xl";

export type PlaceKind = "metro" | "city" | "town" | "village";

export type LandmarkKind =
  | "station"
  | "bus"
  | "hospital"
  | "temple"
  | "market"
  | "school"
  | "park"
  | "office"
  | "other";

export type PayMethod = "upi" | "qr" | "credit" | "debit" | "netbanking" | "cash";

export type Availability = "ready" | "limited" | "unavailable";

export type Screen =
  | "splash"
  | "onboarding"
  | "language"
  | "phone"
  | "otp"
  | "name"
  | "home"
  | "pickup"
  | "destination"
  | "vehicles"
  | "fare"
  | "confirm"
  | "assigning"
  | "tracking"
  | "complete"
  | "history"
  | "ride"
  | "payments"
  | "offers"
  | "support"
  | "company"
  | "legal"
  | "settings"
  | "profile"
  | "safe"
  | "sos"
  | "call"
  | "consent"
  | "chat"
  | "share"
  | "account"
  | "operator"
  | "notes"
  | "ticket";

export interface Landmark {
  id: string;
  name: string;
  kind: LandmarkKind;
  hint: string;
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  kind: PlaceKind;
  state: string;
  district: string;
  lat: number;
  lng: number;
  aliases: string[];
  landmarks: Landmark[];
}

export interface Selection {
  placeId: string;
  landmarkId: string;
  label: string;
  line: string;
  lat: number;
  lng: number;
  source: "saved" | "recent" | "search" | "map" | "gps" | "operator" | "sample";
}

export interface Quote {
  km: number;
  minutes: number;
  arrivalMin: number;
  base: number;
  distanceCharge: number;
  waiting: number;
  tax: number;
  discount: number;
  total: number;
  promoCode: string | null;
  availability: Availability;
}

export interface Driver {
  name: string;
  rating: number;
  plate: string;
  vehicle: VehicleId;
  trips: number;
  colour: string;
}

export interface ChatMessage {
  from: "you" | "driver";
  text: string;
  at: string;
}

export type RideStatus =
  | "scheduled"
  | "searching"
  | "arriving"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Ride {
  id: string;
  status: RideStatus;
  pickup: Selection;
  drop: Selection;
  vehicle: VehicleId;
  payment: PayMethod;
  fare: Quote;
  driver: Driver | null;
  createdAt: string;
  scheduledFor?: string;
  progress: number;
  rating?: number;
  feedback?: string;
  cancelReason?: string;
  source: "app" | "call";
  messages: ChatMessage[];
  issue?: string;
  lostItem?: string;
}

export interface SavedPlace {
  id: string;
  slot: "home" | "work" | "extra";
  label: string;
  selection: Selection;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface Ticket {
  id: string;
  topic: string;
  text: string;
  status: "Open" | "In review";
  at: string;
}

export type Consent = "none" | "link_sent" | "allowed" | "denied";

export interface DeskCall {
  id: string;
  name: string;
  phone: string;
  language: Lang;
  note: string;
  placeId: string;
  landmarkId: string;
}

export type LegalDoc =
  | "terms"
  | "privacy"
  | "refund"
  | "driver"
  | "duties"
  | "grievance"
  | "safety"
  | "security";
