import { useCallback,useEffect,useState } from "react";
import { listOperationsGrievances,updateOperationsGrievance } from "@/lib/kida/client-requirements-server";
type Cases=Awaited<ReturnType<typeof listOperationsGrievances>>;
const dateLabel=(value:string)=>new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));
export function SupportDesk() {
 const [cases,setCases]=useState<Cases>([]);
 const [status,setStatus]=useState<Record<string,"open"|"in_review"|"resolved"|"closed">>({});
 const [priority,setPriority]=useState<Record<string,"low"|"normal"|"high"|"urgent">>({});
 const [notes,setNotes]=useState<Record<string,string>>({});
 const [error,setError]=useState("");const [notice,setNotice]=useState("");const [busy,setBusy]=useState("");
 const refresh=useCallback(async()=>{try{const result=await listOperationsGrievances();setCases(result);setStatus(current=>Object.fromEntries(result.map(c=>[c.id,current[c.id]??c.status])));setPriority(current=>Object.fromEntries(result.map(c=>[c.id,current[c.id]??c.priority])));}catch(cause){setError(cause instanceof Error?cause.message:"Grievance queue unavailable.");}},[]);
 useEffect(()=>{void refresh();const timer=window.setInterval(()=>void refresh(),15000);return()=>window.clearInterval(timer);},[refresh]);
 async function save(id:string){setBusy(id);setError("");setNotice("");try{await updateOperationsGrievance({data:{ticketId:id,status:status[id]??"open",priority:priority[id]??"normal",note:notes[id]??""}});setNotice("Grievance case updated and audit event recorded.");await refresh();}catch(cause){setError(cause instanceof Error?cause.message:"Case update failed.");}finally{setBusy("");}}
 const openCount=cases.filter(c=>c.status==="open"||c.status==="in_review").length;
 return <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
  <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Customer care</p><h2 className="mt-1 text-2xl font-black">Grievance & support queue</h2><p className="mt-1 text-sm text-neutral-600">Account-backed reports with case ownership, priority and resolution notes.</p></div><div className="rounded-xl bg-neutral-100 px-3 py-2 text-sm font-black">{openCount} open / in review</div></div>
  {error?<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>:null}{notice?<p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>:null}
  {cases.length===0?<p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">No customer grievance tickets have been submitted.</p>:cases.map(c=><article key={c.id} className="space-y-3 rounded-2xl border border-neutral-200 p-3">
   <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-black">{c.customer_name} · {c.topic.replaceAll("_"," ")}</p><p className="text-xs text-neutral-500">{c.customer_email} · {dateLabel(c.created_at)} · Case {c.id.slice(0,8)}</p>{c.booking_id?<p className="text-xs text-neutral-500">Booking {c.booking_id.slice(0,8)}</p>:null}</div><span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-bold uppercase">{c.status}</span></div>
   <p className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-3 text-sm">{c.message}</p>
   <div className="grid gap-2 sm:grid-cols-3">
    <label className="grid gap-1 text-xs font-bold">Status<select className="h-10 rounded-lg border border-neutral-200 bg-white px-2" value={status[c.id]??c.status} onChange={e=>setStatus(x=>({...x,[c.id]:e.target.value as "open"|"in_review"|"resolved"|"closed"}))}><option value="open">Open</option><option value="in_review">In review</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></label>
    <label className="grid gap-1 text-xs font-bold">Priority<select className="h-10 rounded-lg border border-neutral-200 bg-white px-2" value={priority[c.id]??c.priority} onChange={e=>setPriority(x=>({...x,[c.id]:e.target.value as "low"|"normal"|"high"|"urgent"}))}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
    <div className="flex items-end"><button type="button" onClick={()=>void save(c.id)} disabled={busy===c.id} className="h-10 w-full rounded-lg bg-neutral-950 px-3 text-xs font-bold text-white disabled:opacity-50">{busy===c.id?"Saving…":"Save case update"}</button></div>
   </div>
   <label className="grid gap-1 text-xs font-bold">Operations note / resolution details<textarea className="min-h-16 rounded-lg border border-neutral-200 bg-white p-2 text-sm font-normal" value={notes[c.id]??""} onChange={e=>setNotes(x=>({...x,[c.id]:e.target.value}))} placeholder="Record what was checked or how the issue was resolved."/></label>
   {c.assigned_to_name?<p className="text-xs text-neutral-500">Assigned to {c.assigned_to_name}</p>:null}
  </article>)}
  <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">This is a digital case queue, not proof of 24×7 staffed coverage. The 24×7 commitment still requires an on-call rota, contact channels, response targets and escalation ownership.</p>
 </section>;
}
