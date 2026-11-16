import { useState } from "react";
import { ArrowLeft, CarFront, Clock3, Package, PawPrint, Plane, Route, MapPin, ArrowRight, ShieldCheck, Train, Users } from "lucide-react";
import { useRaah } from "@/lib/raah/store";
import type { ServiceMode } from "@/lib/raah/types";
import { Btn, Card, Header, inputClass, Pill } from "./ui";

const services: {
  id: Exclude<ServiceMode, "ride">;
  title: string;
  subtitle: string;
  Icon: typeof Package;
  availability: "preview";
}[] = [
  { id: "parcel", title: "Parcel delivery", subtitle: "Send documents and everyday items", Icon: Package, availability: "preview" },
  { id: "intercity", title: "Outstation & Intercity", subtitle: "Travel between cities and towns", Icon: Route, availability: "preview" },
  { id: "rental", title: "Hourly rentals", subtitle: "Keep a vehicle for a few hours", Icon: Clock3, availability: "preview" },
  { id: "airport", title: "Airport transfer", subtitle: "Plan a pickup or drop to an airport", Icon: Plane, availability: "preview" },
  { id: "pet", title: "Pet-friendly ride", subtitle: "Travel with your companion", Icon: PawPrint, availability: "preview" },
  { id: "transit", title: "Metro & Transit tickets", subtitle: "Plan metro connections and last-mile travel", Icon: Train, availability: "preview" },
  { id: "shared", title: "Auto Share & Group Ride", subtitle: "Plan a shared trip with friends or co-riders", Icon: Users, availability: "preview" },
];

const labels: Record<Exclude<ServiceMode, "ride">, string> = {
  parcel: "Parcel delivery",
  intercity: "Outstation & Intercity",
  rental: "Hourly rentals",
  airport: "Airport transfer",
  pet: "Pet-friendly ride",
  transit: "Metro & Transit tickets",
  shared: "Auto Share & Group Ride",
};

export function ServicesScreen() {
  const open = useRaah((s) => s.open);
  const setMode = useRaah((s) => s.setServiceMode);
  const setToast = useRaah((s) => s.setToast);
  return (
    <div className="pb-8">
      <Header title="All services" subtitle="Choose the journey you need" onBack={() => useRaah.getState().back()} />
      <div className="space-y-3 px-4">
        <button type="button" onClick={() => useRaah.getState().replace("home")} className="flex w-full items-center gap-3 rounded-2xl border border-line p-3 text-left">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft"><CarFront className="size-6"/></span>
          <span className="min-w-0 flex-1"><span className="block font-semibold">Everyday rides</span><span className="text-sm text-muted">Bike, Auto, Mini, Sedan and XL</span></span>
          <ArrowRight className="size-4"/>
        </button>
        {services.map(({id,title,subtitle,Icon})=>(
          <button key={id} type="button" onClick={() => { setMode(id); open("serviceBooking"); }} className="kida-location-card flex min-h-20 w-full items-center gap-3 rounded-3xl border border-line p-3 text-left">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper"><Icon className="size-6 text-ink"/></span>
            <span className="min-w-0 flex-1"><span className="block font-semibold">{title}</span><span className="block text-sm text-muted">{subtitle}</span></span>
            <Pill tone="warn">Preview</Pill>
          </button>
        ))}
        <Card>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-primary"/>
            <div><p className="font-semibold">Service availability</p><p className="mt-1 text-sm text-muted">These service journeys are prepared for product review. A live courier or vehicle will not be dispatched until Kida's backend, driver supply and service permissions are connected.</p></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ServiceBookingScreen() {
  const mode = useRaah((s) => s.serviceMode);
  const pickup = useRaah((s) => s.pickup);
  const drop = useRaah((s) => s.drop);
  const setTarget = useRaah((s) => s.setPlaceTarget);
  const open = useRaah((s) => s.open);
  const createRequest = useRaah((s) => s.createServiceRequest);
  const back = useRaah((s) => s.back);
  const setToast = useRaah((s) => s.setToast);
  const [scheduledFor,setScheduledFor]=useState("");
  const [recipient,setRecipient]=useState("");
  const [recipientPhone,setRecipientPhone]=useState("");
  const [parcelType,setParcelType]=useState("Documents");
  const [parcelSize,setParcelSize]=useState("Small");
  const [parcelNote,setParcelNote]=useState("");
  const [passengers,setPassengers]=useState("2");
  const [hours,setHours]=useState("4");
  const [flight,setFlight]=useState("");
  const [pet,setPet]=useState("Dog");
  const [transitTickets,setTransitTickets]=useState("1");
  const [transitType,setTransitType]=useState("Single journey");
  const [sharedPassengers,setSharedPassengers]=useState("2");
  const [splitFare,setSplitFare]=useState(true);
  const title=labels[mode === "ride" ? "intercity" : mode];

  function editLocation(target:"pickup"|"drop") {
    setTarget(target);
    open(target === "pickup" ? "pickup" : "destination");
  }

  const needsDrop = mode !== "rental";
  const validSchedule = !scheduledFor || new Date(scheduledFor).getTime() > Date.now();
  const valid = !!pickup && (!needsDrop || !!drop) && validSchedule &&
    (mode !== "parcel" || (recipient.trim().length > 1 && /^[6-9]\d{9}$/.test(recipientPhone))) &&
    (mode !== "pet" || !!pet);

  function submit() {
    if (!valid || mode === "ride") return;
    const details: Record<string,string> = {};
    if(mode==="parcel") Object.assign(details,{recipient,recipientPhone,parcelType,parcelSize,parcelNote});
    if(mode==="intercity") Object.assign(details,{passengers});
    if(mode==="rental") Object.assign(details,{hours});
    if(mode==="airport") Object.assign(details,{flight});
    if(mode==="pet") Object.assign(details,{pet});
    if(mode==="transit") Object.assign(details,{transitTickets,transitType});
    if(mode==="shared") Object.assign(details,{sharedPassengers,splitFare:String(splitFare)});
    createRequest({service:mode,pickup,drop:needsDrop?drop:null,scheduledFor:scheduledFor||null,details});
    setToast(`${title} request saved. No service has been dispatched in this preview.`);
    useRaah.getState().replace("history");
  }

  return (
    <div className="pb-8">
      <Header title={title} subtitle="Enter journey details" onBack={back}/>
      <div className="space-y-3 px-4">
        <button type="button" onClick={()=>editLocation("pickup")} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left">
          <MapPin className="size-5 text-primary"/>
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-muted">Pickup</span><span className="block truncate font-semibold">{pickup.line}</span></span>
          <span className="text-sm text-primary">Change</span>
        </button>
        {needsDrop ? (
          <button type="button" onClick={()=>editLocation("drop")} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left">
            <MapPin className="size-5 text-accent"/>
            <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-muted">Destination</span><span className="block truncate font-semibold">{drop?.line ?? "Choose destination"}</span></span>
            <span className="text-sm text-primary">Choose</span>
          </button>
        ) : (
          <p className="rounded-xl bg-paper px-3 py-2 text-sm text-muted">Rental pickup city: {pickup.label}. Your trip stays within the selected rental package.</p>
        )}

        {mode==="parcel" ? (
          <Card>
            <p className="font-semibold">Recipient details</p>
            <input className={inputClass+" mt-3"} value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Recipient name" aria-label="Recipient name"/>
            <input className={inputClass+" mt-2"} inputMode="numeric" maxLength={10} value={recipientPhone} onChange={e=>setRecipientPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" aria-label="Recipient mobile number"/>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-sm">Item type<select className={inputClass+" mt-1"} value={parcelType} onChange={e=>setParcelType(e.target.value)}><option>Documents</option><option>Clothing</option><option>Food parcel</option><option>Electronics</option><option>Other</option></select></label>
              <label className="text-sm">Package size<select className={inputClass+" mt-1"} value={parcelSize} onChange={e=>setParcelSize(e.target.value)}><option>Small</option><option>Medium</option><option>Large</option></select></label>
            </div>
            <textarea className={inputClass+" mt-3 min-h-20"} value={parcelNote} onChange={e=>setParcelNote(e.target.value)} placeholder="Pickup instructions or item notes"/>
          </Card>
        ) : null}

        {mode==="intercity" ? (
          <Card><label className="text-sm font-medium">Passengers<select className={inputClass+" mt-1"} value={passengers} onChange={e=>setPassengers(e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select></label><p className="mt-2 text-xs text-muted">Driver and vehicle availability must be confirmed before a real intercity booking.</p></Card>
        ) : null}
        {mode==="rental" ? (
          <Card><label className="text-sm font-medium">Rental duration<select className={inputClass+" mt-1"} value={hours} onChange={e=>setHours(e.target.value)}>{["2","4","6","8","12"].map(n=><option key={n} value={n}>{n} hours</option>)}</select></label><p className="mt-2 text-xs text-muted">A live rental package and included kilometres will be shown after Kida connects its supply and pricing service.</p></Card>
        ) : null}
        {mode==="airport" ? (
          <Card><label className="text-sm font-medium">Flight number (optional)<input className={inputClass+" mt-1"} value={flight} onChange={e=>setFlight(e.target.value.toUpperCase())} placeholder="e.g. AI 542"/></label><p className="mt-2 text-xs text-muted">Add your flight number so an airport pickup flow can be configured for your journey.</p></Card>
        ) : null}
        {mode==="pet" ? (
          <Card><label className="text-sm font-medium">Pet travelling with you<select className={inputClass+" mt-1"} value={pet} onChange={e=>setPet(e.target.value)}><option>Dog</option><option>Cat</option><option>Other small pet</option></select></label><p className="mt-2 text-xs text-muted">Pet-friendly vehicle availability and cleaning policies must be confirmed before launch.</p></Card>
        ) : null}
        {mode==="shared" ? (
          <Card>
            <p className="font-semibold">Shared trip preferences</p>
            <label className="mt-3 block text-sm">Total passengers<select className={inputClass+" mt-1"} value={sharedPassengers} onChange={e=>setSharedPassengers(e.target.value)}>{[2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
            <button type="button" aria-pressed={splitFare} onClick={()=>setSplitFare(!splitFare)} className={`mt-3 flex min-h-12 w-full items-center justify-between rounded-xl border px-3 text-left ${splitFare?"border-primary bg-primary-soft":"border-line"}`}>
              <span><span className="block text-sm font-semibold">Split fare between passengers</span><span className="block text-xs text-muted">Preview preference only</span></span>
              <span className={`h-6 w-11 rounded-full p-1 ${splitFare?"bg-primary":"bg-line"}`}><span className={`block size-4 rounded-full bg-white ${splitFare?"ml-5":""}`}/></span>
            </button>
            <p className="mt-2 text-xs text-muted">Captain matching, shared-seat availability, passenger invitations and payment splitting require the Kida dispatch and payments backend.</p>
          </Card>
        ) : null}

        {mode==="transit" ? (
          <Card>
            <p className="font-semibold">Metro / transit ticket request</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-sm">Tickets<select className={inputClass+" mt-1"} value={transitTickets} onChange={e=>setTransitTickets(e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
              <label className="text-sm">Ticket type<select className={inputClass+" mt-1"} value={transitType} onChange={e=>setTransitType(e.target.value)}><option>Single journey</option><option>Return journey</option></select></label>
            </div>
            <p className="mt-2 text-xs text-muted">This captures the journey and ticket preference only. Metro inventory, live schedules, QR tickets and payment are not connected in this preview.</p>
          </Card>
        ) : null}

        <label className="block text-sm font-medium text-muted">Preferred date and time (optional)<input type="datetime-local" className={inputClass+" mt-1"} value={scheduledFor} onChange={e=>setScheduledFor(e.target.value)} min={new Date(Date.now()+60000).toISOString().slice(0,16)}/></label>
        {!validSchedule ? <p className="text-sm text-danger">Choose a future date and time.</p> : null}
        <Card>
          <p className="font-semibold">Request preview</p>
          <p className="mt-1 text-sm text-muted">This saves your selected details on this device for the prototype. It does not book a courier, driver, flight transfer or rental vehicle.</p>
        </Card>
        <Btn className="w-full" disabled={!valid} onClick={submit}>Save {mode==="parcel"?"parcel":mode==="rental"?"rental":mode==="pet"?"pet ride":mode==="transit"?"transit":mode==="shared"?"shared trip":"travel"} request</Btn>
      </div>
    </div>
  );
}
