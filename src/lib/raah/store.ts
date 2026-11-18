import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { speak, t } from "./i18n";
import { getPlace, RTO, toSelection } from "./places";
import { kmBetween, quoteRide, type PromoResult } from "./pricing";
import type {
  Consent,
  DeskCall,
  EmergencyContact,
  Lang,
  LegalDoc,
  PayMethod,
  Ride,
  RouteCoordinate,
  SavedPlace,
  Screen,
  Selection,
  ServiceMode,
  ServiceRequest,
  Ticket,
  VehicleId,
} from "./types";

export const DESK_CALLS: DeskCall[] = [
  {
    id: "c1",
    name: "Kamala",
    phone: "9000000001",
    language: "ta",
    note: "Does not use the app. She is near the government school.",
    placeId: "kod",
    landmarkId: "kod-1",
  },
  {
    id: "c2",
    name: "Harpreet",
    phone: "9000000002",
    language: "pa",
    note: "Booking for his father. Pickup is the bus stand.",
    placeId: "ldh",
    landmarkId: "ldh-1",
  },
  {
    id: "c3",
    name: "Ramesh",
    phone: "9000000003",
    language: "hi",
    note: "Village call. He will wait at the temple.",
    placeId: "dhr",
    landmarkId: "dhr-2",
  },
];

const NAMES = ["Asha K.", "Imran S.", "Meenakshi R.", "Harpreet Singh", "Lakshmi N.", "Arjun P.", "Fatima B.", "Suresh M."];
const COLOURS = ["Sea-glass", "Marigold", "Ivory", "Ink", "Sage"];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}${Date.now().toString(36).slice(-3)}`;
}

function containsGoogleContent(selection: Selection | null | undefined) {
  return selection?.source === "google" || selection?.landmarkId.startsWith("google:") === true;
}

function sampleSelection(placeId: string, index: number, source: Selection["source"]) {
  const place = getPlace(placeId);
  if (!place) throw new Error(placeId);
  return toSelection(place, place.landmarks[index] ?? place.landmarks[0], source);
}

function makeDriver(vehicle: VehicleId, state: string, seed: number) {
  const rto = RTO[state] ?? "IN";
  const a = String.fromCharCode(65 + (seed % 26));
  const b = String.fromCharCode(65 + ((seed >> 3) % 26));
  const num = String(1000 + (seed % 8000)).padStart(4, "0");
  const district = String(1 + (seed % 39)).padStart(2, "0");
  return {
    name: NAMES[seed % NAMES.length],
    rating: Math.round((4.6 + (seed % 4) * 0.1) * 10) / 10,
    plate: `${rto}${district}${a}${b}${num}`,
    vehicle,
    trips: 180 + (seed % 900),
    colour: COLOURS[seed % COLOURS.length],
  };
}

function seedRide(partial: Omit<Ride, "messages" | "progress"> & { progress?: number }): Ride {
  return { messages: [], progress: partial.progress ?? 1, ...partial };
}

const seedPickup = sampleSelection("blr", 0, "sample");
const seedDrop = sampleSelection("blr", 3, "search");
const seedKm = kmBetween(seedPickup, seedDrop);

const initialRides: Ride[] = [
  seedRide({
    id: "seed-1",
    status: "completed",
    pickup: seedPickup,
    drop: seedDrop,
    vehicle: "auto",
    payment: "upi",
    fare: quoteRide("auto", seedKm, "metro", null),
    driver: makeDriver("auto", "Karnataka", 4),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rating: 5,
    source: "app",
  }),
  seedRide({
    id: "seed-2",
    status: "completed",
    pickup: sampleSelection("mum", 0, "search"),
    drop: sampleSelection("mum", 1, "search"),
    vehicle: "mini",
    payment: "cash",
    fare: quoteRide("mini", kmBetween(sampleSelection("mum", 0, "search"), sampleSelection("mum", 1, "search")), "metro", null),
    driver: makeDriver("mini", "Maharashtra", 9),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    rating: 4,
    source: "app",
  }),
  seedRide({
    id: "seed-3",
    status: "cancelled",
    pickup: sampleSelection("kod", 0, "operator"),
    drop: sampleSelection("blr", 1, "search"),
    vehicle: "bike",
    payment: "cash",
    fare: quoteRide(
      "bike",
      kmBetween(sampleSelection("kod", 0, "operator"), sampleSelection("blr", 1, "search")),
      "village",
      null,
    ),
    driver: null,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    cancelReason: "Plans changed",
    source: "call",
    progress: 0,
  }),
];

export type PlaceTarget = "pickup" | "drop" | "stop" | "home" | "work" | "extra";

interface DeskState {
  callId: string | null;
  name: string;
  phone: string;
  language: Lang;
  note: string;
  pickup: Selection | null;
  drop: Selection | null;
  vehicle: VehicleId;
}

interface RaahState {
  seenOnboarding: boolean;
  languageChosen: boolean;
  lang: Lang;
  authed: boolean;
  phone: string;
  name: string;
  photo: string;
  screen: Screen;
  stack: Screen[];
  home?: SavedPlace;
  work?: SavedPlace;
  extras: SavedPlace[];
  emergency: EmergencyContact[];
  pickup: Selection;
  drop: Selection | null;
  stops: Selection[];
  serviceMode: ServiceMode;
  serviceRequests: ServiceRequest[];
  womenDriverPreference: boolean;
  notificationPrefs: { rides: boolean; safety: boolean; offers: boolean; product: boolean };
  vehicle: VehicleId;
  payment: PayMethod;
  promoInput: string;
  promo: PromoResult | null;
  usedPromos: string[];
  when: string;
  rides: Ride[];
  activeRideId: string | null;
  selectedRideId: string | null;
  recents: Selection[];
  simpleMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  voiceOn: boolean;
  marketing: boolean;
  consent: Consent;
  desk: DeskState;
  tickets: Ticket[];
  legalDoc: LegalDoc;
  placeTarget: PlaceTarget;
  toast: string;
  payFailed: boolean;
  sosArmed: boolean;
  onboardStep: number;
  replace: (screen: Screen) => void;
  open: (screen: Screen) => void;
  back: () => void;
  tab: (screen: Screen) => void;
  setLang: (lang: Lang) => void;
  setPhone: (phone: string) => void;
  verifyOtp: (code: string) => boolean;
  setName: (name: string) => void;
  setPhoto: (photo: string) => void;
  setPlaceTarget: (target: PlaceTarget) => void;
  setPickupLocation: (selection: Selection) => void;
  setServiceMode: (mode: ServiceMode) => void;
  choose: (selection: Selection) => void;
  removeStop: (index: number) => void;
  setWomenDriverPreference: (value: boolean) => void;
  setNotificationPreference: (key: "rides" | "safety" | "offers" | "product", value: boolean) => void;
  createServiceRequest: (request: Omit<ServiceRequest, "id" | "createdAt" | "status">) => string;
  setVehicle: (vehicle: VehicleId) => void;
  setPayment: (payment: PayMethod) => void;
  setPromoInput: (value: string) => void;
  setPromo: (promo: PromoResult | null) => void;
  setWhen: (when: string) => void;
  confirmBooking: (routeDistanceKm?: number, roadDurationMinutes?: number, routePath?: RouteCoordinate[], backendBooking?: { id: string; status: "requested"; isFreeRide?: boolean; tripPin?: string }) => void;
  assignDriver: () => void;
  tickRide: () => void;
  completeRide: () => void;
  cancelRide: (reason: string) => void;
  rateRide: (rating: number, feedback: string, tipAmount?: number) => void;
  addMessage: (text: string, from?: "you" | "driver") => void;
  selectRide: (id: string) => void;
  saveEmergency: (name: string, phone: string) => void;
  removeEmergency: (id: string) => void;
  removePlace: (slot: "home" | "work" | "extra", id?: string) => void;
  toggle: (key: "simpleMode" | "largeText" | "highContrast" | "voiceOn" | "marketing") => void;
  logout: () => void;
  wipe: () => void;
  setLegal: (doc: LegalDoc) => void;
  setToast: (toast: string) => void;
  clearToast: () => void;
  setPayFailed: (value: boolean) => void;
  setSosArmed: (value: boolean) => void;
  setOnboardStep: (step: number) => void;
  finishIntro: () => void;
  loadCall: (call: DeskCall) => void;
  setDesk: (patch: Partial<DeskState>) => void;
  sendLocationLink: () => void;
  setConsent: (consent: Consent) => void;
  createDeskBooking: () => void;
  addTicket: (topic: string, text: string) => void;
  reportOnRide: (kind: "issue" | "lost", text: string) => void;
  startScheduled: (id: string) => void;
}

const emptyDesk: DeskState = {
  callId: null,
  name: "",
  phone: "",
  language: "hi",
  note: "",
  pickup: null,
  drop: null,
  vehicle: "auto",
};

function patchRide(rides: Ride[], id: string, patch: Partial<Ride>) {
  return rides.map((ride) => (ride.id === id ? { ...ride, ...patch } : ride));
}

export const useRaah = create<RaahState>()(
  persist(
    (set, get) => ({
      seenOnboarding: false,
      languageChosen: false,
      lang: "en",
      authed: false,
      phone: "",
      name: "",
      photo: "",
      screen: "splash",
      stack: [],
      extras: [],
      emergency: [],
      pickup: seedPickup,
      drop: null,
      stops: [],
      serviceMode: "ride",
      serviceRequests: [],
      womenDriverPreference: false,
      notificationPrefs: { rides: true, safety: true, offers: false, product: false },
      vehicle: "auto",
      payment: "upi",
      promoInput: "",
      promo: null,
      usedPromos: [],
      when: "now",
      rides: initialRides,
      activeRideId: null,
      selectedRideId: "seed-1",
      recents: [seedDrop],
      simpleMode: false,
      largeText: false,
      highContrast: false,
      voiceOn: false,
      marketing: false,
      consent: "none",
      desk: emptyDesk,
      tickets: [],
      legalDoc: "terms",
      placeTarget: "drop",
      toast: "",
      payFailed: false,
      sosArmed: false,
      onboardStep: 0,
      replace: (screen) => set(screen === "home" ? { screen, stack: [], serviceMode: "ride", stops: [] } : { screen, stack: [] }),
      open: (screen) => set((s) => ({ stack: [...s.stack, s.screen], screen })),
      back: () =>
        set((s) => {
          const stack = [...s.stack];
          const prev = stack.pop() ?? "home";
          return { stack, screen: prev };
        }),
      tab: (screen) => set(screen === "home" ? { screen, stack: [], serviceMode: "ride", stops: [] } : { screen, stack: [] }),
      setLang: (lang) => set({ lang, languageChosen: true }),
      setPhone: (phone) => set({ phone }),
      verifyOtp: (code) => {
        if (code !== "482913") return false;
        const s = get();
        set({ authed: true, screen: s.name ? "home" : "name", stack: [] });
        return true;
      },
      setName: (name) => {
        const clean = name.trim();
        if (get().screen === "name") {
          set({ name: clean, screen: "home", stack: [], seenOnboarding: true });
          return;
        }
        set({ name: clean });
      },
      setPhoto: (photo) => set({ photo }),
      setPlaceTarget: (placeTarget) => set({ placeTarget }),
      setPickupLocation: (pickup) => set({ pickup }),
      setServiceMode: (serviceMode) => set({ serviceMode, drop: serviceMode === "ride" ? get().drop : null, stops: serviceMode === "ride" ? get().stops : [] }),
      choose: (selection) => {
        const s = get();
        if (s.placeTarget === "stop") {
          if (s.stops.length >= 3) {
            set({ toast: "A ride can have up to three additional stops." });
            return;
          }
          set({ stops: [...s.stops, selection] });
          get().back();
          return;
        }
        if (s.serviceMode !== "ride" && (s.placeTarget === "pickup" || s.placeTarget === "drop")) {
          set(s.placeTarget === "pickup" ? { pickup: selection } : { drop: selection });
          get().replace("serviceBooking");
          return;
        }
        if (s.placeTarget === "pickup") {
          set({ pickup: selection });
          get().back();
          return;
        }
        if (s.placeTarget === "drop") {
          if (selection.placeId === s.pickup.placeId && selection.landmarkId === s.pickup.landmarkId) {
            set({ toast: t(s.lang, "samePlace") });
            return;
          }
          set({
            drop: selection,
            recents: [selection, ...s.recents.filter((item) => item.landmarkId !== selection.landmarkId)].slice(0, 6),
          });
          get().replace("vehicles");
          return;
        }
        const saved: SavedPlace = {
          id: uid("place"),
          slot: s.placeTarget,
          label: selection.label,
          selection,
        };
        if (s.placeTarget === "home") set({ home: saved });
        if (s.placeTarget === "work") set({ work: saved });
        if (s.placeTarget === "extra") set({ extras: [...get().extras, saved].slice(0, 5) });
        get().back();
      },
      removeStop: (index) => set((s) => ({ stops: s.stops.filter((_, i) => i !== index) })),
      setWomenDriverPreference: (womenDriverPreference) => set({ womenDriverPreference }),
      setNotificationPreference: (key, value) => set((s) => ({ notificationPrefs: { ...s.notificationPrefs, [key]: value } })),
      createServiceRequest: (request) => {
        const item: ServiceRequest = {
          ...request,
          id: uid("service"),
          createdAt: new Date().toISOString(),
          status: "request_saved_demo",
        };
        set((s) => ({ serviceRequests: [item, ...s.serviceRequests], serviceMode: "ride", drop: null, stops: [], toast: "Your request has been saved in this demo. No driver or courier has been dispatched." }));
        return item.id;
      },
      setVehicle: (vehicle) => set({ vehicle }),
      setPayment: (payment) => set({ payment, payFailed: false }),
      setPromoInput: (promoInput) => set({ promoInput }),
      setPromo: (promo) => set({ promo, usedPromos: get().usedPromos }),
      setWhen: (when) => set({ when }),
      confirmBooking: (routeDistanceKm, roadDurationMinutes, routePath, backendBooking) => {
        const s = get();
        if (!s.drop) return;
        const place = getPlace(s.pickup.placeId);
        if (!place) return;
        const routePoints = [s.pickup, ...s.stops, s.drop];
        const previewDistanceKm = routePoints.slice(1).reduce((total, point, index) => total + kmBetween(routePoints[index], point), 0);
        const km = typeof routeDistanceKm === "number" && Number.isFinite(routeDistanceKm) && routeDistanceKm > 0
          ? routeDistanceKm
          : Math.round(previewDistanceKm * 10) / 10;
        const fare = quoteRide(s.vehicle, km, place.kind, s.promo);
        if (backendBooking?.isFreeRide) {
          fare.discount = fare.total;
          fare.total = 0;
          fare.promoCode = "KIDA_6TH_RIDE_FREE";
        }
        if (typeof roadDurationMinutes === "number" && Number.isFinite(roadDurationMinutes) && roadDurationMinutes > 0) {
          fare.minutes = Math.ceil(roadDurationMinutes);
        }
        if (fare.availability === "unavailable") return;
        const scheduled = s.when !== "now";
        const ride: Ride = {
          id: backendBooking?.id ?? uid("ride"),
          backendBookingId: backendBooking?.id,
          backendStatus: backendBooking?.status,
          isCustomerRewardRide: backendBooking?.isFreeRide ?? false,
          status: scheduled ? "scheduled" : "searching",
          pickup: s.pickup,
          drop: s.drop,
          vehicle: s.vehicle,
          payment: s.payment,
          fare,
          driver: null,
          createdAt: new Date().toISOString(),
          scheduledFor: scheduled ? s.when : undefined,
          progress: 0,
          source: "app",
          messages: [],
          stops: [...s.stops],
          tripPin: backendBooking?.tripPin ?? String(1000 + Math.floor(Math.random() * 9000)),
          routePath: routePath?.length ? routePath : undefined,
          womenDriverRequested: s.womenDriverPreference,
        };
        set({
          rides: [ride, ...s.rides],
          activeRideId: scheduled ? null : ride.id,
          selectedRideId: ride.id,
          usedPromos: s.promo?.ok && s.promo.code ? [...s.usedPromos, s.promo.code] : s.usedPromos,
          promo: null,
          promoInput: "",
          when: "now",
          stops: [],
          screen: scheduled ? "history" : "assigning",
          stack: [],
          toast: backendBooking?.isFreeRide
            ? "Your sixth-ride reward is reserved. Kida will fund the Captain payout."
            : backendBooking
              ? "Your Kida ride request is live. We will update this screen when a Captain accepts it."
              : t(s.lang, "booked"),
        });
        if (s.voiceOn) speak(s.lang, t(s.lang, "booked"));
      },
      assignDriver: () => {
        const s = get();
        const ride = s.rides.find((r) => r.id === s.activeRideId);
        if (!ride || ride.driver || ride.backendBookingId) return;
        const place = getPlace(ride.pickup.placeId);
        const driver = makeDriver(ride.vehicle, place?.state ?? "Karnataka", ride.id.length * 17);
        set({
          rides: patchRide(s.rides, ride.id, { driver, status: "arriving", progress: 0 }),
          screen: "tracking",
          stack: [],
        });
        if (s.voiceOn) speak(s.lang, `${t(s.lang, "driverFound")}. ${driver.name}. ${driver.plate}`);
      },
      tickRide: () => {
        const s = get();
        const ride = s.rides.find((r) => r.id === s.activeRideId);
        if (!ride || (ride.status !== "arriving" && ride.status !== "ongoing")) return;
        const next = Math.min(1, Math.round((ride.progress + 0.07) * 100) / 100);
        if (ride.status === "arriving" && next >= 1) {
          set({ rides: patchRide(s.rides, ride.id, { status: "ongoing", progress: 0 }) });
          return;
        }
        set({ rides: patchRide(s.rides, ride.id, { progress: next }) });
      },
      completeRide: () => {
        const s = get();
        if (!s.activeRideId) return;
        set({
          rides: patchRide(s.rides, s.activeRideId, { status: "completed", progress: 1 }),
          screen: "complete",
          stack: [],
        });
      },
      cancelRide: (reason) => {
        const s = get();
        const id = s.activeRideId ?? s.selectedRideId;
        if (!id) return;
        set({
          rides: patchRide(s.rides, id, { status: "cancelled", cancelReason: reason, driver: null }),
          activeRideId: s.activeRideId === id ? null : s.activeRideId,
          screen: "history",
          stack: [],
          toast: t(s.lang, "cancelled"),
        });
      },
      rateRide: (rating, feedback, tipAmount = 0) => {
        const s = get();
        const id = s.selectedRideId;
        if (!id) return;
        set({
          rides: patchRide(s.rides, id, { rating, feedback, tipAmount }),
          toast: t(s.lang, "ratingThanks"),
          screen: "history",
          stack: [],
          activeRideId: null,
        });
      },
      addMessage: (text, from = "you") => {
        const s = get();
        const id = s.activeRideId;
        if (!id) return;
        const ride = s.rides.find((r) => r.id === id);
        if (!ride) return;
        const messages = [...ride.messages, { from, text, at: new Date().toISOString() }];
        set({ rides: patchRide(s.rides, id, { messages }) });
      },
      selectRide: (id) => set({ selectedRideId: id, screen: "ride", stack: [...get().stack, get().screen] }),
      saveEmergency: (name, phone) =>
        set((s) => ({
          emergency: [...s.emergency, { id: uid("sos"), name: name.trim(), phone }].slice(0, 3),
        })),
      removeEmergency: (id) => set((s) => ({ emergency: s.emergency.filter((c) => c.id !== id) })),
      removePlace: (slot, id) =>
        set((s) => {
          if (slot === "home") return { home: undefined };
          if (slot === "work") return { work: undefined };
          return { extras: s.extras.filter((p) => p.id !== id) };
        }),
      toggle: (key) => set((s) => ({ [key]: !s[key] })),
      logout: () => set({ authed: false, screen: "phone", stack: [], activeRideId: null }),
      wipe: () =>
        set({
          seenOnboarding: false,
          languageChosen: false,
          lang: "en",
          authed: false,
          phone: "",
          name: "",
          photo: "",
          screen: "splash",
          stack: [],
          home: undefined,
          work: undefined,
          extras: [],
          emergency: [],
          pickup: seedPickup,
          drop: null,
          stops: [],
          serviceMode: "ride",
          serviceRequests: [],
          womenDriverPreference: false,
          notificationPrefs: { rides: true, safety: true, offers: false, product: false },
          vehicle: "auto",
          payment: "upi",
          promoInput: "",
          promo: null,
          usedPromos: [],
          when: "now",
          rides: initialRides,
          activeRideId: null,
          selectedRideId: "seed-1",
          recents: [seedDrop],
          simpleMode: false,
          largeText: false,
          highContrast: false,
          voiceOn: false,
          marketing: false,
          consent: "none",
          desk: emptyDesk,
          tickets: [],
          toast: "",
          payFailed: false,
          sosArmed: false,
          onboardStep: 0,
        }),
      setLegal: (legalDoc) => set({ legalDoc, screen: "legal", stack: [...get().stack, get().screen] }),
      setToast: (toast) => set({ toast }),
      clearToast: () => set({ toast: "" }),
      setPayFailed: (payFailed) => set({ payFailed }),
      setSosArmed: (sosArmed) => set({ sosArmed }),
      setOnboardStep: (onboardStep) => set({ onboardStep }),
      finishIntro: () =>
        set({
          seenOnboarding: true,
          screen: get().languageChosen ? "phone" : "language",
          stack: [],
        }),
      loadCall: (call) => {
        const found = getPlace(call.placeId);
        const landmark = found?.landmarks.find((l) => l.id === call.landmarkId) ?? found?.landmarks[0];
        set({
          desk: {
            callId: call.id,
            name: call.name,
            phone: call.phone,
            language: call.language,
            note: call.note,
            pickup: found && landmark ? toSelection(found, landmark, "operator") : null,
            drop: null,
            vehicle: "auto",
          },
        });
      },
      setDesk: (patch) => set((s) => ({ desk: { ...s.desk, ...patch } })),
      sendLocationLink: () => {
        const s = get();
        set({
          consent: "link_sent",
          toast: t(s.lang, "linkWaiting"),
        });
      },
      setConsent: (consent) => {
        const s = get();
        set({
          consent,
          toast: t(s.lang, consent === "allowed" ? "sharingOn" : "sharingOff"),
        });
      },
      createDeskBooking: () => {
        const s = get();
        if (!s.desk.pickup || !s.desk.drop) return;
        const place = getPlace(s.desk.pickup.placeId);
        if (!place) return;
        const km = kmBetween(s.desk.pickup, s.desk.drop);
        const fare = quoteRide(s.desk.vehicle, km, place.kind, null);
        if (fare.availability === "unavailable") return;
        const driver = makeDriver(s.desk.vehicle, place.state, Date.now() % 1000);
        const ride: Ride = {
          id: uid("call"),
          status: "arriving",
          pickup: s.desk.pickup,
          drop: s.desk.drop,
          vehicle: s.desk.vehicle,
          payment: "cash",
          fare,
          driver,
          createdAt: new Date().toISOString(),
          progress: 0.08,
          source: "call",
          messages: [],
        };
        set({
          rides: [ride, ...s.rides],
          activeRideId: ride.id,
          selectedRideId: ride.id,
          pickup: s.desk.pickup,
          drop: s.desk.drop,
          vehicle: s.desk.vehicle,
          payment: "cash",
          screen: s.authed ? "tracking" : s.screen,
          stack: [],
          toast: t(s.lang, "booked"),
        });
        if (s.voiceOn && s.authed) speak(s.lang, t(s.lang, "booked"));
      },
      addTicket: (topic, text) =>
        set((s) => ({
          tickets: [{ id: uid("t"), topic, text, status: "Open", at: new Date().toISOString() }, ...s.tickets],
          toast: t(s.lang, "ticketSent"),
        })),
      reportOnRide: (kind, text) => {
        const s = get();
        if (!s.selectedRideId) return;
        set({
          rides: patchRide(s.rides, s.selectedRideId, kind === "issue" ? { issue: text } : { lostItem: text }),
          tickets: [
            {
              id: uid("t"),
              topic: kind === "issue" ? "Safety" : "Lost item",
              text,
              status: "Open",
              at: new Date().toISOString(),
            },
            ...s.tickets,
          ],
          toast: t(s.lang, "ticketSent"),
        });
      },
      startScheduled: (id) => {
        const s = get();
        set({
          rides: patchRide(s.rides, id, { status: "searching" }),
          activeRideId: id,
          selectedRideId: id,
          screen: "assigning",
          stack: [],
        });
      },
    }),
    {
      name: "raah-prototype-v1",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        // Google Places content is intentionally kept in memory only. Persisting
        // it locally would cache Google place names, addresses and coordinates.
        const persistedRides = s.rides.filter((ride) => !ride.backendBookingId && !containsGoogleContent(ride.pickup) && !containsGoogleContent(ride.drop) && !(ride.stops ?? []).some(containsGoogleContent)).map((ride) => {
          const persistedRide = { ...ride };
          delete persistedRide.routePath;
          return persistedRide;
        });
        const persistedServiceRequests = s.serviceRequests.filter((request) => !containsGoogleContent(request.pickup) && (!request.drop || !containsGoogleContent(request.drop)));
        const persistedRideIds = new Set(persistedRides.map((ride) => ride.id));
        return ({
        seenOnboarding: s.seenOnboarding,
        languageChosen: s.languageChosen,
        lang: s.lang,
        authed: s.authed,
        phone: s.phone,
        name: s.name,
        photo: s.photo,
        screen: s.screen === "splash" ? "home" : s.screen,
        home: s.home && !containsGoogleContent(s.home.selection) ? s.home : undefined,
        work: s.work && !containsGoogleContent(s.work.selection) ? s.work : undefined,
        extras: s.extras.filter((item) => !containsGoogleContent(item.selection)),
        emergency: s.emergency,
        pickup: containsGoogleContent(s.pickup) ? seedPickup : s.pickup,
        drop: containsGoogleContent(s.drop) ? null : s.drop,
        stops: s.stops.filter((item) => !containsGoogleContent(item)),
        serviceMode: s.serviceMode,
        serviceRequests: persistedServiceRequests,
        womenDriverPreference: s.womenDriverPreference,
        notificationPrefs: s.notificationPrefs,
        vehicle: s.vehicle,
        payment: s.payment,
        usedPromos: s.usedPromos,
        rides: persistedRides,
        activeRideId: s.activeRideId && persistedRideIds.has(s.activeRideId) ? s.activeRideId : null,
        selectedRideId: s.selectedRideId && persistedRideIds.has(s.selectedRideId) ? s.selectedRideId : (persistedRides[0]?.id ?? null),
        recents: s.recents.filter((item) => !containsGoogleContent(item)),
        simpleMode: s.simpleMode,
        largeText: s.largeText,
        highContrast: s.highContrast,
        voiceOn: s.voiceOn,
        marketing: s.marketing,
        consent: s.consent,
        desk: {
          ...s.desk,
          pickup: containsGoogleContent(s.desk.pickup) ? null : s.desk.pickup,
          drop: containsGoogleContent(s.desk.drop) ? null : s.desk.drop,
        },
        tickets: s.tickets.filter((ticket) => !ticket.backend),
      });
      },
    },
  ),
);

export function findRide(id: string | null) {
  if (!id) return null;
  return useRaah.getState().rides.find((ride) => ride.id === id) ?? null;
}
