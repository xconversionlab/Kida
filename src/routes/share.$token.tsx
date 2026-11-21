import { createFileRoute } from "@tanstack/react-router";
import { useEffect,useState } from "react";
import { getSharedKidaTrip } from "@/lib/kida/client-requirements-server";

export const Route = createFileRoute("/share/$token")({component:SharedTripPage});
type Shared=Awaited<ReturnType<typeof getSharedKidaTrip>>;

function SharedTripPage() {
  const {token}=Route.useParams();
  const [trip,setTrip]=useState<Shared|null>(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      try {const result=await getSharedKidaTrip({data:{token}});if(active){setTrip(result);setError("");}}
      catch(cause){if(active){setError(cause instanceof Error?cause.message:"This trip link is unavailable.");setTrip(null);}}
      finally{if(active)setLoading(false);}
    };
    void refresh();
    const timer=window.setInterval(()=>void refresh(),10000);
    return()=>{active=false;window.clearInterval(timer);};
  },[token]);
  const pickup=trip?.pickup??{};
  const drop=trip?.dropoff??{};
  const location=trip?.captain_latitude&&trip?.captain_longitude
    ? "https://www.openstreetmap.org/?mlat="+encodeURIComponent(trip.captain_latitude)+"&mlon="+encodeURIComponent(trip.captain_longitude)+"#map=16/"+encodeURIComponent(trip.captain_latitude)+"/"+encodeURIComponent(trip.captain_longitude)
    : null;
  return <main className="min-h-dvh bg-[#f5f4ef] p-4 text-neutral-950"><div className="mx-auto max-w-xl space-y-4">
    <header className="rounded-3xl bg-neutral-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Kida · shared trip</p><h1 className="mt-2 text-2xl font-black">Live trip status</h1><p className="mt-1 text-sm text-neutral-300">This private link expires automatically. Do not forward it publicly.</p></header>
    {loading?<section className="rounded-2xl bg-white p-4">Loading trip…</section>:error?<section role="alert" className="rounded-2xl bg-white p-4 text-sm text-red-700">{error}</section>:trip?<>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4"><p className="text-xs font-bold uppercase text-neutral-500">Trip status</p><h2 className="mt-1 text-2xl font-black">{trip.status.replaceAll("_"," ")}</h2><p className="mt-2 text-sm text-neutral-600">Captain: {trip.captain_name??"Not assigned"}{trip.captain_registration_number?" · "+trip.captain_registration_number:""}</p></section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4"><p className="text-xs font-bold uppercase text-neutral-500">Pickup</p><p className="font-semibold">{String(pickup.label??pickup.line??"Pickup location")}</p><p className="mt-3 text-xs font-bold uppercase text-neutral-500">Destination</p><p className="font-semibold">{String(drop.label??drop.line??"Destination")}</p></section>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4"><p className="text-xs font-bold uppercase text-neutral-500">Captain location</p>{location?<><p className="mt-1 text-sm">Latest GPS fix received {trip.captain_location_updated_at?new Date(trip.captain_location_updated_at).toLocaleString():"recently"}</p><a className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-neutral-950 px-4 text-sm font-bold text-white" target="_blank" rel="noreferrer" href={location}>View Captain on map</a></>:<p className="mt-1 text-sm text-neutral-600">No fresh Captain location is available. The shared page checks for updates every 10 seconds.</p>}</section>
      <p className="text-xs text-neutral-500">Last refreshed {new Date().toLocaleTimeString()}. The link stops working at {new Date(trip.expires_at).toLocaleString()} or when the Customer revokes it.</p>
    </>:null}
  </div></main>;
}
