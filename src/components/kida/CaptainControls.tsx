import { useEffect, useState } from "react";
import {
  getCaptainWorkSummary,
  recordCaptainSosAlert,
  saveCaptainPayoutPreference,
} from "@/lib/kida/client-requirements-server";

type Props = { bookingId?: string | null; position?: {lat:number;lng:number}|null };

export function CaptainControls({bookingId,position}:Props) {
  const [work,setWork] = useState<{used_minutes:number;remaining_minutes:number;session_started_at:string|null}|null>(null);
  const [schedule,setSchedule] = useState<"weekly"|"every_3_days">("weekly");
  const [saving,setSaving] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");

  async function refresh() {
    try { setWork(await getCaptainWorkSummary({data:{}})); }
    catch (cause) { setError(cause instanceof Error?cause.message:"Work-time summary unavailable."); }
  }
  useEffect(()=>{void refresh();const timer=window.setInterval(()=>void refresh(),30000);return()=>window.clearInterval(timer);},[]);

  async function submitSos(category:"captain_safety"|"passenger_safety"|"vehicle_safety") {
    setSaving(true);setError("");setNotice("");
    try {
      const result=await recordCaptainSosAlert({data:{
        category,bookingId:bookingId??null,
        latitude:position?.lat??null,longitude:position?.lng??null,
        note:"Captain initiated an SOS record from the Captain application.",
      }});
      setNotice("SOS event recorded ("+result.id.slice(0,8)+"). This app has not notified a response desk. Call 112 now for emergency help.");
    } catch(cause) {
      setError(cause instanceof Error?cause.message:"SOS could not be recorded. Call 112 directly for emergency help.");
    } finally {setSaving(false);}
  }

  async function saveSchedule(value:"weekly"|"every_3_days") {
    setSchedule(value);setSaving(true);setError("");setNotice("");
    try {
      await saveCaptainPayoutPreference({data:{schedule:value}});
      setNotice("Payout schedule preference saved. Actual payouts are not connected yet.");
    } catch(cause) {
      setError(cause instanceof Error?cause.message:"Payout preference could not be saved.");
    } finally {setSaving(false);}
  }

  const used=Math.max(0,Math.min(480,work?.used_minutes??0));
  const remaining=Math.max(0,work?.remaining_minutes??480);
  return (
    <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Daily work limit</p><h2 className="mt-1 text-lg font-black">8-hour online-time counter</h2><p className="text-xs text-neutral-500">Counts Captain online sessions in India Standard Time. The client must confirm whether the policy means online time or active driving time.</p></div>
        <span className="rounded-xl bg-neutral-100 px-3 py-2 text-sm font-black tabular-nums">{Math.floor(used/60)}h {used%60}m / 8h</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full bg-neutral-900" style={{width:(used/480*100)+"%"}}/></div>
      <p className="text-xs text-neutral-600">{remaining} minutes remaining today · server checks prevent new availability or trip acceptance after the limit.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <a href="tel:112" className="flex min-h-12 items-center justify-center rounded-xl bg-red-700 px-3 text-sm font-black text-white">Call emergency 112</a>
        <button type="button" disabled={saving} onClick={()=>void submitSos("captain_safety")} className="min-h-12 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-black text-red-800 disabled:opacity-50">Record Captain SOS</button>
        {bookingId ? <button type="button" disabled={saving} onClick={()=>void submitSos("passenger_safety")} className="min-h-11 rounded-xl border border-neutral-200 px-3 text-sm font-bold">Record passenger safety SOS</button> : null}
        {bookingId ? <button type="button" disabled={saving} onClick={()=>void submitSos("vehicle_safety")} className="min-h-11 rounded-xl border border-neutral-200 px-3 text-sm font-bold">Record vehicle safety SOS</button> : null}
      </div>
      <div className="rounded-xl bg-neutral-50 p-3">
        <p className="text-sm font-black">Payout schedule preference</p>
        <p className="mt-1 text-xs text-neutral-500">Client wording suggests weekly or every-three-days. This saves your preference only; bank/UPI verification and payout processing are not connected.</p>
        <select aria-label="Payout schedule preference" disabled={saving} value={schedule} onChange={e=>void saveSchedule(e.target.value as "weekly"|"every_3_days")} className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm">
          <option value="weekly">Weekly</option><option value="every_3_days">Every 3 days</option>
        </select>
      </div>
      {error?<p role="alert" className="text-sm text-red-700">{error}</p>:null}
      {notice?<p role="status" className="text-sm text-neutral-700">{notice}</p>:null}
    </section>
  );
}
