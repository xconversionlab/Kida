import { useState } from "react";
import { authEnabled, GROK_PROVIDERS, signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createMySafetyIncident, createMySupportTicket, getMyProfile, saveMyProfile } from "@/lib/kida/server";
import { Award, Bell, BriefcaseBusiness, ChevronRight, Coins, CreditCard, Crown, Gift, History, HelpCircle, Package, Settings, ShieldCheck, ShieldAlert } from "lucide-react";
import { company } from "@/lib/raah/company";
import { LEGAL } from "@/lib/raah/legal";
import { payLabel } from "@/lib/raah/labels";
import { PAY_METHODS } from "@/lib/raah/pricing";
import { useRaah, type PlaceTarget } from "@/lib/raah/store";
import type { PayMethod } from "@/lib/raah/types";
import { MapView } from "./MapView";
import { Avatar, Btn, Card, Header, inputClass, Pill, prettyPhone, useCopy } from "./ui";

export function AccountScreen() {
  const copy = useCopy();
  const name = useRaah((s) => s.name);
  const phone = useRaah((s) => s.phone);
  const photo = useRaah((s) => s.photo);
  const open = useRaah((s) => s.open);
  const logout = useRaah((s) => s.logout);
  const setToast = useRaah((s) => s.setToast);
  const { user } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  const items: { label: string; screen: "profile" | "payments" | "offers" | "support" | "company" | "settings" | "notes" | "operator" | "call" }[] = [
    { label: copy("profile"), screen: "profile" },
    { label: copy("payments"), screen: "payments" },
    { label: copy("offers"), screen: "offers" },
    { label: copy("supportTitle"), screen: "support" },
    { label: copy("about"), screen: "company" },
    { label: copy("settings"), screen: "settings" },
  ];
  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (authEnabled && user && !user.isDevFallback) await signOut();
      logout();
    } catch {
      setToast("Could not sign out of your Kida account. Please retry.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="pb-4">
      <Header title={copy("account")} />
      <div className="px-4">
        <button type="button" onClick={() => open("profile")} className="kida-account-card mb-4 flex w-full items-center gap-3 rounded-3xl bg-paper p-3 text-left">
          <Avatar name={name} photo={photo} className="size-14" />
          <span>
            <span className="block text-lg font-semibold">{name}</span>
            <span className="text-sm text-muted">+91 {prettyPhone(phone)}</span>
            <span className="mt-1 block text-xs font-semibold text-primary">Preview account · not phone-verified</span>
          </span>
        </button>
        <div className="space-y-2">
          {items.map((item) => (
            <button key={item.screen} type="button" onClick={() => open(item.screen)} className="kida-location-card flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium">
              {item.label}
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
        <Btn variant="line" className="mt-4 w-full" disabled={signingOut} onClick={() => void handleLogout()}>
          {signingOut ? "Signing out…" : copy("logout")}
        </Btn>
      </div>
    </div>
  );
}

export function ProfileScreen() {
  const copy = useCopy();
  const name = useRaah((s) => s.name);
  const phone = useRaah((s) => s.phone);
  const photo = useRaah((s) => s.photo);
  const home = useRaah((s) => s.home);
  const work = useRaah((s) => s.work);
  const extras = useRaah((s) => s.extras);
  const emergency = useRaah((s) => s.emergency);
  const setName = useRaah((s) => s.setName);
  const setPhoto = useRaah((s) => s.setPhoto);
  const back = useRaah((s) => s.back);
  const open = useRaah((s) => s.open);
  const setTarget = useRaah((s) => s.setPlaceTarget);
  const saveEmergency = useRaah((s) => s.saveEmergency);
  const removeEmergency = useRaah((s) => s.removeEmergency);
  const removePlace = useRaah((s) => s.removePlace);
  const setToast = useRaah((s) => s.setToast);
  const [draft, setDraft] = useState(name);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [contact, setContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  function pick(target: PlaceTarget) {
    setTarget(target);
    open("destination");
  }

  async function saveCustomerProfile() {
    const cleanName = draft.trim();
    if (cleanName.length < 2 || savingProfile) return;
    setSavingProfile(true);
    setProfileNotice("");
    try {
      const current = await getMyProfile();
      const digits = phone.replace(/\\D/g, "");
      const phoneE164 = digits.length === 10
        ? `+91${digits}`
        : current?.phone_e164 ?? null;
      await saveMyProfile({
        data: {
          displayName: cleanName,
          phoneE164,
          preferredLanguage: useRaah.getState().lang,
        },
      });
      setName(cleanName);
      setProfileNotice(phoneE164
        ? "Profile saved. Your mobile number is not verified by this save."
        : "Profile saved to your Kida account.");
    } catch (error) {
      setProfileNotice(error instanceof Error && error.message === "Unauthorized"
        ? "Sign in to save your profile to your Kida account."
        : "Could not save your profile. Please retry.");
    } finally {
      setSavingProfile(false);
    }
  }

  function onPhoto(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setToast("Choose an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 256 / Math.max(image.width, image.height);
      canvas.width = Math.max(1, Math.round(image.width * Math.min(1, scale)));
      canvas.height = Math.max(1, Math.round(image.height * Math.min(1, scale)));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/jpeg", 0.82));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  const menu = [
    { label: "Help", hint: `Call ${company.supportPhone}`, icon: HelpCircle, action: () => open("support") },
    { label: "Parcel – Send Items", hint: "Send a parcel by bike", icon: Package, action: () => { useRaah.getState().setServiceMode("parcel"); open("serviceBooking"); } },
    { label: "Payment", hint: "Payment methods", icon: CreditCard, action: () => open("payments") },
    { label: "My Rides", hint: "Your booking history", icon: History, action: () => open("history") },
    { label: "Safety", hint: "Safety tools and emergency contacts", icon: ShieldCheck, action: () => open("safe") },
    { label: "Refer and Earn", hint: "Get ₹50", icon: Gift, action: () => open("offers") },
    { label: "My Rewards", hint: "Offers and rewards", icon: Award, action: () => open("offers") },
    { label: "Power Pass", hint: "Ride pass · coming soon", icon: Crown, action: () => open("membership") },
    { label: "Kida Coins", hint: "Rewards balance · coming soon", icon: Coins, action: () => open("rewards") },
    { label: "Notifications", hint: "Booking updates", icon: Bell, action: () => open("notifications") },
    { label: "Claims", hint: "Raise a booking or payment issue", icon: ShieldAlert, action: () => open("ticket") },
    { label: "Settings", hint: "App preferences", icon: Settings, action: () => open("settings") },
  ];

  return (
    <div className="pb-8">
      <Header title={copy("profile")} subtitle={copy("nameSub")} onBack={back} />
      <div className="space-y-4 px-4">
        <div className="kida-account-card flex items-center gap-3 rounded-3xl border border-line bg-surface p-3 shadow-sm">
          <Avatar name={draft || name} photo={photo} className="size-16" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{name}</p>
            <p className="text-sm text-muted tabular">+91 {prettyPhone(phone)}</p>
            <p className="mt-1 text-xs font-semibold text-primary">Preview account · not phone-verified</p>
          </div>
          <label className="text-xs font-semibold text-primary">
            Change photo
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => onPhoto(event.target.files?.[0])} />
          </label>
        </div>

        <div>
          <h2 className="mb-2 px-1 text-sm font-semibold text-muted">Your account</h2>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            {menu.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="flex min-h-[58px] w-full items-center gap-3 border-b border-line px-3 py-2.5 text-left last:border-b-0"
                >
                  <Icon className="size-[18px] shrink-0 text-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-xs text-muted">{item.hint}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted" />
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setToast("Kida driver-partner onboarding details will be available soon.")}
          className="flex w-full items-center gap-3 rounded-3xl bg-primary-soft p-3 text-left"
        >
          <BriefcaseBusiness className="size-8 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">Earn money with Kida</span>
            <span className="block text-xs text-muted">Become a Kida driver-partner</span>
          </span>
          <ChevronRight className="size-4 text-muted" />
        </button>

        <div className="rounded-2xl border border-line p-3">
          <p className="mb-2 text-sm font-semibold">Edit profile</p>
          <input className={inputClass} value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={copy("namePh")} />
          <Btn variant="soft" className="mt-2" disabled={savingProfile || draft.trim().length < 2} onClick={() => void saveCustomerProfile()}>
            {savingProfile ? "Saving…" : copy("save")}
          </Btn>
          {profileNotice ? <p className="mt-2 text-xs text-muted">{profileNotice}</p> : null}
        </div>

        <div>
          <h2 className="mb-2 font-semibold">Saved places</h2>
          <PlaceRow label={copy("home")} value={home?.selection.line} onPick={() => pick("home")} onClear={home ? () => removePlace("home") : undefined} />
          <div className="mt-2">
            <PlaceRow label={copy("work")} value={work?.selection.line} onPick={() => pick("work")} onClear={work ? () => removePlace("work") : undefined} />
          </div>
          {extras.map((item) => (
            <div className="mt-2" key={item.id}>
              <PlaceRow label={item.label} value={item.selection.line} onPick={() => pick("extra")} onClear={() => removePlace("extra", item.id)} />
            </div>
          ))}
          <Btn variant="line" className="mt-2 w-full" onClick={() => pick("extra")}>{copy("addPlace")}</Btn>
        </div>

        <div>
          <h2 className="font-semibold">{copy("emergency")}</h2>
          <div className="mt-2 space-y-2">
            {emergency.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-paper px-3 py-2">
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-sm text-muted tabular">+91 {prettyPhone(item.phone)}</span>
                </span>
                <button type="button" className="text-sm text-danger" onClick={() => removeEmergency(item.id)}>{copy("cancel")}</button>
              </div>
            ))}
            {emergency.length < 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} value={contact} onChange={(event) => setContact(event.target.value)} placeholder={copy("namePh")} aria-label={copy("emergency")} />
                <input className={inputClass} inputMode="numeric" value={contactPhone} onChange={(event) => setContactPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98XXXXXX00" aria-label={copy("phoneTitle")} />
              </div>
            ) : null}
            <Btn variant="soft" disabled={!contact.trim() || !/^[6-9]\d{9}$/.test(contactPhone)} onClick={() => { saveEmergency(contact, contactPhone); setContact(""); setContactPhone(""); }}>
              {copy("save")}
            </Btn>
          </div>
        </div>
        <button type="button" className="text-sm font-semibold text-primary" onClick={() => open("language")}>{copy("language")}</button>
      </div>
    </div>
  );
}

function PlaceRow({ label, value, onPick, onClear }: { label: string; value?: string; onPick: () => void; onClear?: () => void }) {
  const copy = useCopy();
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPick} className="min-h-14 flex-1 rounded-2xl border border-line px-3 py-2 text-left">
        <span className="block text-xs font-semibold text-muted">{label}</span>
        <span className="block text-sm">{value ?? copy("none")}</span>
      </button>
      {onClear ? (
        <button type="button" onClick={onClear} className="h-12 px-2 text-sm text-danger">
          {copy("cancel")}
        </button>
      ) : null}
    </div>
  );
}

export function NotificationsScreen() {
  const back = useRaah((s) => s.back);
  const prefs = useRaah((s) => s.notificationPrefs);
  const setPref = useRaah((s) => s.setNotificationPreference);
  const rows = [
    ["rides","Ride updates","Booking status, pickup and trip changes"],
    ["safety","Safety alerts","Important safety and account notices"],
    ["offers","Offers and rewards","Coupons and referral announcements"],
    ["product","Product updates","New services and Kida announcements"],
  ] as const;
  return (
    <div className="pb-8">
      <Header title="Notifications" subtitle="Choose which updates you want to receive" onBack={back}/>
      <div className="space-y-2 px-4">
        {rows.map(([key,title,hint])=>(
          <button key={key} type="button" aria-pressed={prefs[key]} onClick={()=>setPref(key,!prefs[key])} className="flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-left">
            <span><span className="block font-semibold">{title}</span><span className="text-sm text-muted">{hint}</span></span>
            <span className={`h-7 w-12 rounded-full p-1 ${prefs[key]?"bg-primary":"bg-line"}`}><span className={`block size-5 rounded-full bg-white ${prefs[key]?"ml-5":""}`}/></span>
          </button>
        ))}
        <Card><p className="font-semibold">Delivery status</p><p className="mt-1 text-sm text-muted">These preferences are saved on this device. Push notifications, SMS and WhatsApp delivery require a notification service and verified account backend.</p></Card>
      </div>
    </div>
  );
}

export function MembershipScreen() {
  const back = useRaah((s) => s.back);
  return (
    <div className="pb-8">
      <Header title="Kida Power Pass" subtitle="Membership and ride savings" onBack={back}/>
      <div className="space-y-3 px-4">
        <Card>
          <Pill tone="ok">Current access · Free</Pill>
          <h2 className="mt-3 font-display text-3xl">Kida Power Pass</h2>
          <p className="mt-2 text-sm text-muted">A future membership for frequent riders, planned to include ride benefits and member offers.</p>
        </Card>
        {[
          ["Daily Commuter","Benefits for frequent local rides","Coming soon"],
          ["Monthly Pass","Predictable savings for regular travel","Coming soon"],
          ["Family Travel","Shared family benefits and trip management","Coming soon"],
        ].map(([title,hint,status])=>(
          <div key={title} className="rounded-2xl border border-line p-3"><div className="flex items-center justify-between gap-2"><p className="font-semibold">{title}</p><Pill>{status}</Pill></div><p className="mt-1 text-sm text-muted">{hint}</p></div>
        ))}
        <p className="text-xs text-muted">No membership is being sold and no subscription payment can be made in this build. Prices and benefits will be published only after launch terms are approved.</p>
      </div>
    </div>
  );
}

export function RewardsScreen() {
  const back = useRaah((s) => s.back);
  const [message,setMessage] = useState("");
  async function invite() {
    const inviteText = `Join me on Kida, the ride booking app. Referral rewards will be announced when the programme launches.`;
    try {
      if(navigator.share) await navigator.share({title:"Kida invitation",text:inviteText});
      else if(navigator.clipboard?.writeText) { await navigator.clipboard.writeText(inviteText); setMessage("Invitation text copied."); }
      else setMessage("Sharing is not supported on this device.");
    } catch { setMessage("Sharing cancelled or unavailable."); }
  }
  return (
    <div className="pb-8">
      <Header title="Rewards & referrals" subtitle="Your Kida rewards" onBack={back}/>
      <div className="space-y-3 px-4">
        <Card><p className="text-xs font-semibold text-muted">AVAILABLE KIDA COINS</p><p className="mt-2 font-display text-5xl">0</p><p className="mt-1 text-sm text-muted">Your rewards wallet will appear here after the rewards service is launched.</p></Card>
        <Card><p className="font-semibold">Refer a friend</p><p className="mt-1 text-sm text-muted">Invite friends to Kida. Referral codes and cash/ride credits will activate after account and rewards services are connected.</p><Btn className="mt-3 w-full" onClick={()=>void invite()}>Invite a friend</Btn>{message?<p className="mt-2 text-sm text-muted">{message}</p>:null}</Card>
        <Card><p className="font-semibold">Reward eligibility</p><p className="mt-1 text-sm text-muted">No referral reward is being credited in this preview. We will display official rules, expiry and qualifying ride conditions before the programme is enabled.</p></Card>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const toggle = useRaah((s) => s.toggle);
  const simple = useRaah((s) => s.simpleMode);
  const large = useRaah((s) => s.largeText);
  const contrast = useRaah((s) => s.highContrast);
  const voice = useRaah((s) => s.voiceOn);
  const marketing = useRaah((s) => s.marketing);
  const wipe = useRaah((s) => s.wipe);
  const open = useRaah((s) => s.open);
  const rows = [
    [copy("simple"), copy("simpleHint"), simple, "simpleMode"],
    [copy("large"), "Easier reading on a small phone.", large, "largeText"],
    [copy("contrast"), "Stronger text and borders.", contrast, "highContrast"],
    [copy("voice"), copy("voiceHint"), voice, "voiceOn"],
    ["Offers by message", "Prototype preference only. No messages are sent.", marketing, "marketing"],
  ] as const;
  return (
    <div className="pb-8">
      <Header title={copy("settings")} onBack={back} />
      <div className="space-y-2 px-4">
        {rows.map(([label, hint, on, key]) => (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(key)}
            className="kida-location-card flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-left"
          >
            <span>
              <span className="block font-semibold">{label}</span>
              <span className="text-sm text-muted">{hint}</span>
            </span>
            <span className={`h-7 w-12 rounded-full p-1 ${on ? "bg-primary" : "bg-line"}`}>
              <span className={`block size-5 rounded-full bg-surface ${on ? "ml-5" : ""}`} />
            </span>
          </button>
        ))}
        <Btn variant="line" className="w-full" onClick={() => open("language")}>
          {copy("language")}
        </Btn>
        <Card>
          <p className="font-semibold">{copy("deleteAccount")}</p>
          <p className="mt-1 text-sm text-muted">{copy("deleteHint")}</p>
          <Btn variant="danger" className="mt-3 w-full" onClick={wipe}>
            {copy("deleteAccount")}
          </Btn>
        </Card>
        <p className="text-sm text-muted">{copy("logoutHint")}</p>
      </div>
    </div>
  );
}

export function SafeScreen() {
  const copy = useCopy();
  const open = useRaah((s) => s.open);
  const emergency = useRaah((s) => s.emergency);
  const cards = [
    [copy("safeSos"), copy("sosBody"), "sos"],
    [copy("safeShare"), copy("shareBody"), "share"],
    [copy("safeId"), "Check the name and the number plate on the car or auto before the trip starts.", "tracking"],
    [copy("supportTitle"), copy("ruralBody"), "support"],
  ] as const;
  return (
    <div className="pb-4">
      <Header title={copy("safeTitle")} subtitle={copy("on3b")} />
      <div className="space-y-3 px-4">
        <button type="button" onClick={() => open("sos")} className="w-full rounded-3xl bg-danger px-4 py-4 text-left text-primary-ink">
          <span className="block text-2xl font-semibold">{copy("sos")}</span>
          <span className="text-sm">Call 112 for emergency assistance. Kida does not yet have a staffed SOS desk.</span>
        </button>
        {cards.map(([title, body, screen]) => (
          <button key={title} type="button" onClick={() => open(screen)} className="w-full rounded-3xl border border-line p-4 text-left">
            <span className="block font-semibold">{title}</span>
            <span className="mt-1 block text-sm text-muted">{body}</span>
          </button>
        ))}
        <Card>
          <p className="font-semibold">{copy("safeContacts")}</p>
          {emergency.length === 0 ? <p className="mt-1 text-sm text-muted">{copy("sosNeed")}</p> : null}
          {emergency.map((item) => (
            <p key={item.id} className="mt-2 text-sm">
              {item.name} · +91 {prettyPhone(item.phone)}
            </p>
          ))}
          <Btn variant="soft" className="mt-3" onClick={() => open("profile")}>
            {copy("emergency")}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

export function SosScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const armed = useRaah((s) => s.sosArmed);
  const setArmed = useRaah((s) => s.setSosArmed);
  const emergency = useRaah((s) => s.emergency);
  const [step, setStep] = useState(0);
  return (
    <div>
      <Header title={copy("sosTitle")} subtitle={copy("sosBody")} onBack={back} />
      <div className="space-y-3 px-4">
        <Pill tone="warn">Emergency calling is initiated by you</Pill>
        <a href="tel:112" className="flex min-h-14 items-center justify-center rounded-2xl bg-danger px-4 text-center font-semibold text-white">Call India emergency number · 112</a>
        <a href={`tel:${company.supportTel}`} className="flex min-h-12 items-center justify-center rounded-2xl border border-line px-4 font-semibold">Call Kida support · {company.supportPhone}</a>
        {step === 0 ? (
          <Btn variant="danger" className="w-full" onClick={() => setStep(1)}>
            {copy("sosConfirm")}
          </Btn>
        ) : null}
        {step === 1 && !armed ? (
          <Card>
            <p className="font-semibold">Confirm this is intentional.</p>
            <p className="mt-1 text-sm text-muted">Confirming here does not dispatch an emergency team. Use the 112 call button above to contact emergency services.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Btn variant="line" onClick={() => setStep(0)}>
                {copy("cancel")}
              </Btn>
              <Btn variant="danger" onClick={() => setArmed(true)}>
                {copy("sos")}
              </Btn>
            </div>
          </Card>
        ) : null}
        {armed ? (
          <Card>
            <p className="font-semibold">{copy("sosDone")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
              <li>Saved contacts: {emergency.length ? emergency.map((item) => `${item.name} (+91 ${item.phone})`).join(", ") : "No emergency contacts added yet"}.</li>
              <li>Use Share Trip to send your trip details to someone you trust.</li>
              <li>Call 112 directly if you need emergency services.</li>
            </ul>
            <Btn variant="line" className="mt-3" onClick={() => setArmed(false)}>
              {copy("close")}
            </Btn>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

export function CallScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const open = useRaah((s) => s.open);
  const steps = [copy("how1"), copy("how2"), copy("how3"), copy("how4"), copy("how5")];
  return (
    <div className="pb-8">
      <Header title={copy("callTitle")} subtitle={copy("callLead")} onBack={back} />
      <div className="space-y-4 px-4">
        <div className="rounded-3xl bg-accent px-4 py-5 text-accent-ink">
          <p className="text-sm font-semibold">{copy("official")}</p>
          <p className="mt-1 font-display text-4xl tabular">{company.supportPhone}</p>
          <p className="mt-2 text-sm">{copy("numberNote")}</p>
          <a href={`tel:${company.supportTel}`} className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-surface font-semibold text-ink">{copy("callNow")} · {company.supportPhone}</a>
        </div>
        <div>
          <h2 className="font-semibold">{copy("how")}</h2>
          <ol className="mt-2 space-y-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl bg-paper px-3 py-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-ink">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted">{copy("callLang")}</p>
        <Card>
          <p className="font-semibold">{copy("openLink")}</p>
          <p className="mt-1 text-sm text-muted">{copy("openLinkNote")}</p>
          <Btn className="mt-3 w-full" onClick={() => open("consent")}>
            {copy("openLink")}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

export function ConsentScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const consent = useRaah((s) => s.consent);
  const setConsent = useRaah((s) => s.setConsent);
  const pickup = useRaah((s) => s.desk.pickup) ?? useRaah((s) => s.pickup);
  return (
    <div>
      <Header title={copy("consentTitle")} subtitle={copy("consentBody")} onBack={back} />
      <div className="space-y-3 px-4">
        <MapView pickup={pickup} caption={consent === "allowed" ? copy("sharingOn") : copy("sharingOff")} />
        <Pill tone={consent === "allowed" ? "ok" : consent === "denied" ? "danger" : "warn"}>
          {consent === "allowed" ? copy("sharingOn") : consent === "denied" ? copy("sharingOff") : copy("linkWaiting")}
        </Pill>
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="line" onClick={() => setConsent("denied")}>
            {copy("dontShare")}
          </Btn>
          <Btn onClick={() => setConsent("allowed")}>{copy("allowOnce")}</Btn>
        </div>
      </div>
    </div>
  );
}

const OFFERS = [
  { code: "KIDA50", title: "First ride", detail: "₹50 off once on a prototype booking." },
  { code: "FEST25", title: "Festival week", detail: "Sample festive offer. 10% off, capped at ₹40." },
  { code: "VILLAGE20", title: "Town and village", detail: "₹20 off bike or auto outside the big cities." },
  { code: "CITY15", title: "City roads", detail: "₹15 off in metros and cities." },
  { code: "REFER75", title: "Referral sample", detail: "₹75 off once. A live referral would credit both people after the trip." },
];

export function OffersScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const stack = useRaah((s) => s.stack);
  const setPromoInput = useRaah((s) => s.setPromoInput);
  const setToast = useRaah((s) => s.setToast);
  const [sponsor, setSponsor] = useState(true);
  return (
    <div className="pb-6">
      <Header title={copy("offersTitle")} subtitle={copy("offersSub")} onBack={stack.length ? back : undefined} />
      <div className="space-y-3 px-4">
        {sponsor ? (
          <div className="rounded-3xl bg-paper-deep p-4">
            <p className="text-xs font-semibold text-muted">Sample sponsor · not a live advertisement</p>
            <p className="mt-1 font-semibold">Monsoon check on two-wheelers</p>
            <p className="text-sm text-muted">A configured banner can sit here. It does not cover the booking buttons.</p>
            <button type="button" className="mt-2 text-sm font-semibold" onClick={() => setSponsor(false)}>
              {copy("close")}
            </button>
          </div>
        ) : null}
        {OFFERS.map((offer) => (
          <Card key={offer.code}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{offer.title}</p>
                <p className="text-sm text-muted">{offer.detail}</p>
              </div>
              <Pill>{offer.code}</Pill>
            </div>
            <Btn
              variant="soft"
              className="mt-3"
              onClick={() => {
                setPromoInput(offer.code);
                setToast(`${offer.code} ${copy("applied")}. Add it on the fare screen.`);
              }}
            >
              {copy("apply")}
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

const FAQS = [
  ["How do I book without the app?", "Call the number on Book a ride by call. Say your mobile number and a landmark."],
  ["Does the call share my GPS?", "No. A phone call does not share GPS. Location is shared only when you open a location prompt and grant permission."],
  ["Is the fare final?", "The fare shown in this preview is an estimate based on sample per-kilometre rules. Production fares require road routing, city rates, tolls and approved taxes."],
  ["What does SOS do?", "You can call India emergency services on 112 from the safety screen. Kida does not yet operate an automated SOS dispatch desk."],
  ["Can I pay cash?", "Cash can be selected in the preview. Online checkout and cash reconciliation are not connected yet."],
];

export function SupportScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const open = useRaah((s) => s.open);
  const tickets = useRaah((s) => s.tickets);
  return (
    <div className="pb-8">
      <Header title={copy("supportTitle")} onBack={back} />
      <div className="space-y-3 px-4">
        <a href={`tel:${company.supportTel}`} className="block rounded-3xl bg-primary px-4 py-4 text-primary-ink">
          <span className="block text-sm">{copy("callNow")}</span>
          <span className="font-display text-3xl tabular">{company.supportPhone}</span>
          <span className="mt-1 block text-sm">{company.hours}</span>
        </a>
        <Card>
          <p className="font-semibold">{copy("ruralTitle")}</p>
          <p className="mt-1 text-sm text-muted">{copy("ruralBody")}</p>
          <Btn className="mt-3" variant="soft" onClick={() => open("call")}>
            {copy("callCta")}
          </Btn>
        </Card>
        <h2 className="font-semibold">{copy("faq")}</h2>
        {FAQS.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-line px-3 py-3">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-sm text-muted">{a}</p>
          </details>
        ))}
        <Btn className="w-full" onClick={() => open("ticket")}>
          {copy("ticket")}
        </Btn>
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{ticket.topic}</p>
              <Pill tone="warn">{ticket.status}</Pill>
            </div>
            <p className="mt-1 text-sm text-muted">{ticket.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TicketScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const add = useRaah((s) => s.addTicket);
  const selectedRideId = useRaah((s) => s.selectedRideId);
  const selectedBooking = useRaah((s) => s.rides.find((ride) => ride.id === selectedRideId));
  const { user, isPending } = useCurrentUserState();
  const [topic, setTopic] = useState("Booking");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const topics = ["Booking", "Payment", "Lost item", "Driver", "Safety", "Other"];

  async function submitTicket() {
    const message = text.trim();
    if (message.length < 4 || saving) return;
    setSaving(true);
    setNotice("");
    const topicMap: Record<string, "booking" | "payment" | "lost_item" | "safety" | "other"> = {
      Booking: "booking",
      Payment: "payment",
      "Lost item": "lost_item",
      Driver: "other",
      Safety: "safety",
      Other: "other",
    };
    try {
      const result = await createMySupportTicket({
        data: {
          topic: topicMap[topic] ?? "other",
          message,
          bookingId: selectedBooking?.backendBookingId ?? null,
        },
      });
      useRaah.setState((state) => ({
        tickets: [{
          id: result.id,
          topic: result.topic,
          text: result.message,
          status: "Open",
          at: result.created_at,
          backend: true,
        }, ...state.tickets.filter((ticket) => ticket.id !== result.id)],
        toast: "Your support request has been saved to your Kida account.",
      }));
      setText("");
      back();
    } catch (error) {
      setNotice(error instanceof Error && error.message === "Unauthorized"
        ? "Sign in to send a support request to your Kida account."
        : "Your support request could not be saved. Please retry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Header title={copy("ticket")} subtitle={copy("ticketSent")} onBack={back} />
      <div className="space-y-3 px-4">
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <button key={item} type="button" onClick={() => setTopic(item)} className={`h-10 rounded-full px-3 text-sm font-semibold ${topic === item ? "bg-ink text-surface" : "bg-paper"}`}>
              {item}
            </button>
          ))}
        </div>
        <textarea className="min-h-28 w-full rounded-2xl border border-line bg-paper p-3" value={text} onChange={(e) => setText(e.target.value)} aria-label={copy("ticket")} />
        <Btn className="w-full" disabled={saving || isPending || !user || text.trim().length < 4} onClick={() => void submitTicket()}>
          {saving ? "Saving request…" : "Send support request"}
        </Btn>
        {notice ? <p role="alert" className="text-sm text-muted">{notice}</p> : null}
        {authEnabled && !user && !isPending ? (
          <div className="space-y-2 rounded-2xl bg-paper p-3">
            <p className="text-sm font-semibold">Sign in to submit a support request</p>
            {GROK_PROVIDERS.map((provider) => (
              <button key={provider.providerId} type="button" onClick={() => void signIn(provider.providerId, { callbackURL: "/" })} className="min-h-10 w-full rounded-xl border border-line bg-surface text-sm font-semibold">
                Continue with {provider.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PaymentsScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const payment = useRaah((s) => s.payment);
  const setPayment = useRaah((s) => s.setPayment);
  const failed = useRaah((s) => s.payFailed);
  const setFailed = useRaah((s) => s.setPayFailed);
  const back = useRaah((s) => s.back);
  return (
    <div className="pb-6">
      <Header title={copy("payments")} subtitle={copy("paySecure")} onBack={back} />
      <div className="space-y-2 px-4">
        {PAY_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPayment(method as PayMethod)}
            className={`flex h-14 w-full items-center justify-between rounded-2xl border px-3 text-left ${payment === method ? "border-primary bg-primary-soft" : "border-line"}`}
          >
            <span className="font-semibold">{payLabel(lang, method)}</span>
            {payment === method ? <span className="text-sm text-primary">{copy("applied")}</span> : null}
          </button>
        ))}
        {payment === "qr" ? (
          <Card>
            <p className="text-sm font-semibold">Sample QR · not payable</p>
            <QrMark />
          </Card>
        ) : null}
        {payment === "cash" ? <p className="text-sm text-muted">{copy("cashNote")}</p> : null}
        {(payment === "credit" || payment === "debit") && (
          <p className="text-sm text-muted">A live checkout would collect the card inside the gateway. This screen never asks for a card number or CVV.</p>
        )}
        <Btn variant="line" className="w-full" onClick={() => setFailed(true)}>
          {copy("payFail")}
        </Btn>
        {failed ? (
          <Card>
            <p className="font-semibold text-danger">{copy("payFail")}</p>
            <p className="mt-1 text-sm text-muted">{copy("payFailBody")}</p>
            <Btn variant="soft" className="mt-3" onClick={() => setFailed(false)}>
              {copy("close")}
            </Btn>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function QrMark() {
  const cells = Array.from({ length: 49 }, (_, i) => (i * 17) % 7 > 2);
  return (
    <div className="mt-3 grid w-40 grid-cols-7 gap-1" aria-hidden>
      {cells.map((on, i) => (
        <span key={i} className={`aspect-square ${on ? "bg-ink" : "bg-paper"}`} />
      ))}
    </div>
  );
}

export function CompanyScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const setLegal = useRaah((s) => s.setLegal);
  const rows = [
    ["terms", copy("terms")],
    ["privacy", copy("privacy")],
    ["refund", copy("refund")],
    ["driver", copy("driverTerms")],
    ["duties", copy("duties")],
    ["grievance", copy("grievance")],
    ["safety", copy("safetyPolicy")],
    ["security", copy("securityTitle")],
  ] as const;
  return (
    <div className="pb-8">
      <Header title={copy("about")} subtitle={company.tagline} onBack={back} />
      <div className="space-y-3 px-4">
        <Card>
          <p className="font-display text-3xl">{company.brand}</p>
          <p className="mt-1 font-medium">{company.legalName}</p>
          <p className="mt-3 text-sm text-muted">{copy("office")}</p>
          <p className="mt-1 text-sm">{company.office}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-danger">{copy("placeholder")}</p>
          <p className="mt-2 text-sm">
            {copy("cin")}: <span className="tabular">{company.cin}</span>
          </p>
          <p className="text-sm">
            {copy("gstin")}: <span className="tabular">{company.gstin}</span>
          </p>
          <a className="mt-2 block text-sm font-semibold text-primary tabular" href={`tel:${company.supportTel}`}>Call +91 {company.supportPhone}</a>
          <p className="text-sm">{company.email}</p>
          <p className="text-sm">{company.website}</p>
          <p className="mt-2 text-sm text-muted">{company.grievance}</p>
        </Card>
        {rows.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setLegal(id)} className="kida-location-card flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium">
            {label}
            <span className="text-muted">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function LegalScreen() {
  const back = useRaah((s) => s.back);
  const doc = useRaah((s) => s.legalDoc);
  const page = LEGAL[doc];
  return (
    <div className="pb-8">
      <Header title={page.title} subtitle="English master · draft for review, not a filed policy." onBack={back} />
      <div className="space-y-3 px-4">
        {page.body.map((para) => (
          <p key={para} className="text-sm leading-relaxed text-ink">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

export function NotesScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  return (
    <div className="pb-8">
      <Header title={copy("review")} subtitle={copy("notesLead")} onBack={back} />
      <div className="space-y-3 px-4 text-sm leading-relaxed">
        <Card>
          <p className="font-semibold">You can click through</p>
          <p className="mt-1 text-muted">Language, login, a booking from a city or a village, a simulated ride, SOS, offers, support, and the company placeholders. On a wide screen the call desk sits beside the phone.</p>
        </Card>
        <Card>
          <p className="font-semibold">Simulated, not live</p>
          <p className="mt-1 text-muted">OTP, fares, drivers, movement on the map, chat, payments, tickets and SOS. The map uses real map tiles. Google Places search and live address lookup still require a restricted Google API key. Live driver tracking needs the Captain app and dispatch backend.</p>
        </Card>
        <Card>
          <p className="font-semibold">Still to integrate</p>
          <p className="mt-1 text-muted">Maps provider, SMS and voice, a real call centre, driver app, payments gateway, emergency partners, and admin-managed company registration. Android and iOS builds can wrap this product later. This review build is the customer and desk experience, not an installed APK.</p>
        </Card>
      </div>
    </div>
  );
}
