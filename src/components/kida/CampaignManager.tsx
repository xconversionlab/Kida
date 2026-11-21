import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getKidaCampaignReport,
  listKidaCampaigns,
  saveKidaCampaign,
  setKidaCampaignStatus,
} from "@/lib/kida/client-requirements-server";

type Campaigns = Awaited<ReturnType<typeof listKidaCampaigns>>;
type Report = Awaited<ReturnType<typeof getKidaCampaignReport>>;

const money = (paise: string | null | undefined) => paise == null
  ? "Not configured"
  : new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(paise)/100);

export function CampaignManager() {
  const [campaigns,setCampaigns] = useState<Campaigns>([]);
  const [report,setReport] = useState<Report | null>(null);
  const [loading,setLoading] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [start,setStart] = useState("");
  const [end,setEnd] = useState("");
  const [minimumFare,setMinimumFare] = useState("");
  const [rewardType,setRewardType] = useState<"fixed_discount"|"percentage_discount"|"free_ride_cap">("fixed_discount");
  const [rewardValue,setRewardValue] = useState("");
  const [cap,setCap] = useState("");
  const [vehicles,setVehicles] = useState<string[]>([]);
  const [frequency,setFrequency] = useState<"every_n"|"probability">("every_n");
  const [everyN,setEveryN] = useState("");
  const [probability,setProbability] = useState("");
  const [dailyBudget,setDailyBudget] = useState("");
  const [weeklyBudget,setWeeklyBudget] = useState("");
  const [maxUses,setMaxUses] = useState("");
  const [firstRide,setFirstRide] = useState(false);
  const [secondRide,setSecondRide] = useState(false);
  const [officeStart,setOfficeStart] = useState("");
  const [officeEnd,setOfficeEnd] = useState("");
  const [officeArea,setOfficeArea] = useState("");
  const [clientApproved,setClientApproved] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [items,summary] = await Promise.all([listKidaCampaigns(),getKidaCampaignReport()]);
      setCampaigns(items); setReport(summary);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Campaign dashboard could not be loaded.");
    } finally { setLoading(false); }
  },[]);

  useEffect(() => { void refresh(); },[refresh]);

  function toggleVehicle(id:string) {
    setVehicles(current => current.includes(id) ? current.filter(x=>x!==id) : [...current,id]);
  }

  async function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      await saveKidaCampaign({data:{
        name,description,
        startsAt: start ? new Date(start).toISOString() : null,
        endsAt: end ? new Date(end).toISOString() : null,
        minimumFarePaise: Math.round(Number(minimumFare || 0)*100),
        rewardType,
        rewardValue: Number(rewardValue),
        maximumDiscountPaise: Math.round(Number(cap)*100),
        eligibleVehicleIds: vehicles,
        frequencyMode: frequency,
        frequencyN: frequency==="every_n" ? Number(everyN) : null,
        probabilityBps: frequency==="probability" ? Math.round(Number(probability)*100) : null,
        dailyBudgetPaise: dailyBudget ? Math.round(Number(dailyBudget)*100) : null,
        weeklyBudgetPaise: weeklyBudget ? Math.round(Number(weeklyBudget)*100) : null,
        maxUsesPerCustomer:Number(maxUses),
        firstRideOnly:firstRide,
        secondRideOnly:secondRide,
        officeStartTime:officeStart || null,
        officeEndTime:officeEnd || null,
        officeAreaLabel:officeArea.trim() || null,
        clientApproved,
      }});
      setNotice("Campaign saved as a draft. Review client-approved terms before activating.");
      setName(""); setDescription(""); setStart(""); setEnd(""); setMinimumFare(""); setRewardValue(""); setCap(""); setEveryN(""); setProbability(""); setMaxUses(""); setDailyBudget(""); setWeeklyBudget(""); setClientApproved(false);
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Campaign could not be saved.");
    } finally { setSaving(false); }
  }

  async function changeStatus(campaignId:string,status:"active"|"paused"|"ended") {
    setError(""); setNotice("");
    try {
      await setKidaCampaignStatus({data:{campaignId,status}});
      setNotice(status==="active" ? "Campaign activated. Budget limits are enforced for dashboard reporting; booking redemption must be connected before launch." : `Campaign ${status}.`);
      await refresh();
    } catch(cause) {
      setError(cause instanceof Error ? cause.message : "Campaign status could not be updated.");
    }
  }

  const field = "h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm";
  return (
    <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Customer acquisition and retention</p>
          <h2 className="mt-1 text-2xl font-black">Campaign & offer management</h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">Create draft campaigns with minimum fares, reward caps, frequency and spend budgets. Example values from the client message are not pre-approved defaults.</p>
        </div>
        <button type="button" onClick={()=>void refresh()} disabled={loading} className="h-10 rounded-xl border border-neutral-200 px-3 text-sm font-bold">{loading?"Refreshing…":"Refresh reports"}</button>
      </div>
      {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Rewards today" value={report?.totals?.redemptions_today ?? 0}/>
        <Metric label="Rewards this week" value={report?.totals?.redemptions_week ?? 0}/>
        <Metric label="Spend today" value={money(report?.totals?.total_spend_today_paise)}/>
        <Metric label="Spend this week" value={money(report?.totals?.total_spend_week_paise)}/>
        <Metric label="Completed today" value={report?.totals?.completed_today ?? 0}/>
        <Metric label="Cancelled today" value={report?.totals?.cancelled_today ?? 0}/>
      </div>

      <form onSubmit={(event)=>void createCampaign(event)} className="grid gap-3 rounded-2xl bg-neutral-50 p-4 md:grid-cols-2">
        <div className="md:col-span-2"><h3 className="font-black">Create campaign draft</h3><p className="text-xs text-neutral-500">Enter only values already approved by the client.</p></div>
        <label className="grid gap-1 text-xs font-bold">Campaign name<input className={field} value={name} onChange={e=>setName(e.target.value)} required minLength={3} maxLength={120}/></label>
        <label className="grid gap-1 text-xs font-bold">Description<input className={field} value={description} onChange={e=>setDescription(e.target.value)} maxLength={1000}/></label>
        <label className="grid gap-1 text-xs font-bold">Starts at<input type="datetime-local" className={field} value={start} onChange={e=>setStart(e.target.value)} required/></label>
        <label className="grid gap-1 text-xs font-bold">Ends at<input type="datetime-local" className={field} value={end} onChange={e=>setEnd(e.target.value)} required/></label>
        <label className="grid gap-1 text-xs font-bold">Minimum trip fare (₹)<input type="number" min="0" step="1" className={field} value={minimumFare} onChange={e=>setMinimumFare(e.target.value)} required/></label>
        <label className="grid gap-1 text-xs font-bold">Maximum discount / free-ride cap (₹)<input type="number" min="1" step="1" className={field} value={cap} onChange={e=>setCap(e.target.value)} required/></label>
        <label className="grid gap-1 text-xs font-bold">Reward type<select className={field} value={rewardType} onChange={e=>setRewardType(e.target.value as typeof rewardType)}><option value="fixed_discount">Fixed discount</option><option value="percentage_discount">Percentage discount</option><option value="free_ride_cap">Free ride with customer paying excess</option></select></label>
        <label className="grid gap-1 text-xs font-bold">Discount amount (₹) or percentage<input type="number" min="1" step="1" className={field} value={rewardValue} onChange={e=>setRewardValue(e.target.value)} required/></label>
        <label className="grid gap-1 text-xs font-bold">Frequency model<select className={field} value={frequency} onChange={e=>setFrequency(e.target.value as typeof frequency)}><option value="every_n">Every N completed rides</option><option value="probability">Probability / percentage</option></select></label>
        {frequency==="every_n" ? <label className="grid gap-1 text-xs font-bold">Every N rides<input type="number" min="2" max="1000" className={field} value={everyN} onChange={e=>setEveryN(e.target.value)} required/></label> : <label className="grid gap-1 text-xs font-bold">Eligibility probability (%)<input type="number" min="0.01" max="100" step="0.01" className={field} value={probability} onChange={e=>setProbability(e.target.value)} required/></label>}
        <label className="grid gap-1 text-xs font-bold">Daily budget (₹)<input type="number" min="1" className={field} value={dailyBudget} onChange={e=>setDailyBudget(e.target.value)} placeholder="Required to activate"/></label>
        <label className="grid gap-1 text-xs font-bold">Weekly budget (₹)<input type="number" min="1" className={field} value={weeklyBudget} onChange={e=>setWeeklyBudget(e.target.value)} placeholder="Optional"/></label>
        <label className="grid gap-1 text-xs font-bold">Max uses per customer<input type="number" min="1" max="100" className={field} value={maxUses} onChange={e=>setMaxUses(e.target.value)} required/></label>
        <div className="grid gap-2 text-xs font-bold"><span>Eligible vehicles</span><div className="flex flex-wrap gap-3">{["bike","auto","mini","sedan","xl"].map(id=><label key={id} className="flex items-center gap-1"><input type="checkbox" checked={vehicles.includes(id)} onChange={()=>toggleVehicle(id)}/>{id.toUpperCase()}</label>)}</div></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={firstRide} onChange={e=>{setFirstRide(e.target.checked);if(e.target.checked)setSecondRide(false)}}/>First completed ride only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={secondRide} onChange={e=>{setSecondRide(e.target.checked);if(e.target.checked)setFirstRide(false)}}/>Second completed ride only</label>
        <label className="md:col-span-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <input type="checkbox" checked={clientApproved} onChange={e=>setClientApproved(e.target.checked)} className="mt-1"/>
          <span><b>Client approval confirmed.</b> I confirm the client has explicitly approved these exact monetary amounts, frequency, eligible audience and campaign period. Example figures from the WhatsApp message are not approval.</span>
        </label>
        <label className="grid gap-1 text-xs font-bold">Office offer start<input type="time" className={field} value={officeStart} onChange={e=>setOfficeStart(e.target.value)}/></label>
        <label className="grid gap-1 text-xs font-bold">Office offer end<input type="time" className={field} value={officeEnd} onChange={e=>setOfficeEnd(e.target.value)}/></label>
        <label className="grid gap-1 text-xs font-bold md:col-span-2">Office pickup/drop area label (geofence integration pending)<input className={field} value={officeArea} onChange={e=>setOfficeArea(e.target.value)} placeholder="Approved office or campus name"/></label>
        <div className="md:col-span-2"><button type="submit" disabled={saving || vehicles.length===0 || !clientApproved || !rewardValue || !maxUses || (frequency==="every_n" ? !everyN : !probability)} className="h-11 rounded-xl bg-neutral-950 px-5 text-sm font-bold text-white disabled:opacity-40">{saving?"Saving…":"Save client-approved campaign draft"}</button></div>
      </form>

      <div className="space-y-2">
        <h3 className="font-black">Configured campaigns</h3>
        {campaigns.length===0 ? <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">No campaigns yet. Create a draft above.</p> : campaigns.map(c=>(
          <article key={c.id} className="grid gap-3 rounded-2xl border border-neutral-200 p-3 sm:grid-cols-[1fr_auto]">
            <div><div className="flex flex-wrap items-center gap-2"><b>{c.name}</b><span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-bold uppercase">{c.status}</span><span className={"rounded-full px-2 py-1 text-xs font-bold " + (c.client_approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900")}>{c.client_approved ? "Client approved" : "Approval pending"}</span></div>
              <p className="mt-1 text-xs text-neutral-500">{c.reward_type} · {c.frequency_mode==="every_n"?"Every "+c.frequency_n+" completed rides":(Number(c.probability_bps??0)/100).toFixed(2)+"% chance"} · min fare {money(c.minimum_fare_paise)} · cap {money(c.maximum_discount_paise)}</p>
              <p className="text-xs text-neutral-500">Today: {c.redemptions_today} redemptions · spend {money(c.spend_today_paise)} / budget {money(c.daily_budget_paise)} · week spend {money(c.spend_week_paise)} / {money(c.weekly_budget_paise)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {c.status==="draft" || c.status==="paused" ? <button type="button" onClick={()=>void changeStatus(c.id,"active")} className="h-9 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white">Activate</button> : null}
              {c.status==="active" ? <button type="button" onClick={()=>void changeStatus(c.id,"paused")} className="h-9 rounded-lg bg-amber-100 px-3 text-xs font-bold text-amber-900">Pause</button> : null}
              {c.status!=="ended" ? <button type="button" onClick={()=>void changeStatus(c.id,"ended")} className="h-9 rounded-lg border border-neutral-200 px-3 text-xs font-bold">End</button> : null}
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div><h3 className="font-black">Areas with most campaign use today</h3>{report?.areas.length ? report.areas.map(a=><p key={a.area_label} className="flex justify-between border-b py-2 text-sm"><span>{a.area_label}</span><b>{a.redemptions} · {money(a.spend_paise)}</b></p>) : <p className="mt-2 text-sm text-neutral-500">Area reporting populates when campaign redemptions are connected to completed bookings.</p>}</div>
        <div><h3 className="font-black">Peak use hours today</h3>{report?.peakHours.length ? report.peakHours.map(h=><p key={h.hour} className="flex justify-between border-b py-2 text-sm"><span>{String(h.hour).padStart(2,"0")}:00–{String(h.hour+1).padStart(2,"0")}:00</span><b>{h.redemptions}</b></p>) : <p className="mt-2 text-sm text-neutral-500">Peak-hour reporting populates when campaign redemptions are connected to completed bookings.</p>}</div>
      </div>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">Release gate: this dashboard stores and audits campaign settings and reports recorded redemptions. The booking redemption engine, automatic campaign budget reservation, office geofencing and offer-to-Captain payout settlement must be integrated and tested before activating offers for customers. Do not describe a configured campaign as a live customer offer yet.</p>
    </section>
  );
}

function Metric({label,value}:{label:string;value:string|number}) {
  return <div className="rounded-xl bg-neutral-50 p-3"><p className="text-[10px] font-bold uppercase text-neutral-500">{label}</p><p className="mt-1 text-lg font-black tabular-nums">{value}</p></div>;
}
