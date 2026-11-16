import { useState } from "react";
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
  const items: { label: string; screen: "profile" | "payments" | "offers" | "support" | "company" | "settings" | "notes" | "operator" | "call" }[] = [
    { label: copy("profile"), screen: "profile" },
    { label: copy("payments"), screen: "payments" },
    { label: copy("offers"), screen: "offers" },
    { label: copy("supportTitle"), screen: "support" },
    { label: copy("about"), screen: "company" },
    { label: copy("settings"), screen: "settings" },
  ];
  return (
    <div className="pb-4">
      <Header title={copy("account")} />
      <div className="px-4">
        <button type="button" onClick={() => open("profile")} className="mb-4 flex w-full items-center gap-3 rounded-3xl bg-paper p-3 text-left">
          <Avatar name={name} photo={photo} className="size-14" />
          <span>
            <span className="block text-lg font-semibold">{name}</span>
            <span className="text-sm text-muted">+91 {prettyPhone(phone)}</span>
            <span className="mt-1 block text-xs font-semibold text-primary">{copy("verified")}</span>
          </span>
        </button>
        <div className="space-y-2">
          {items.map((item) => (
            <button key={item.screen} type="button" onClick={() => open(item.screen)} className="flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium">
              {item.label}
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
        <Btn variant="line" className="mt-4 w-full" onClick={logout}>
          {copy("logout")}
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
  const [contact, setContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  function pick(target: PlaceTarget) {
    setTarget(target);
    open("destination");
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

  return (
    <div className="pb-8">
      <Header title={copy("profile")} subtitle={copy("nameSub")} onBack={back} />
      <div className="space-y-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar name={draft || name} photo={photo} className="size-16" />
          <label className="text-sm font-semibold text-primary">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onPhoto(event.target.files?.[0])}
            />
          </label>
        </div>
        <input className={inputClass} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label={copy("namePh")} />
        <Btn variant="soft" onClick={() => draft.trim().length > 1 && setName(draft)}>
          {copy("save")}
        </Btn>
        <Card>
          <p className="text-sm text-muted">{copy("verified")}</p>
          <p className="font-semibold tabular">+91 {prettyPhone(phone)}</p>
        </Card>
        <PlaceRow label={copy("home")} value={home?.selection.line} onPick={() => pick("home")} onClear={home ? () => removePlace("home") : undefined} />
        <PlaceRow label={copy("work")} value={work?.selection.line} onPick={() => pick("work")} onClear={work ? () => removePlace("work") : undefined} />
        {extras.map((item) => (
          <PlaceRow key={item.id} label={item.label} value={item.selection.line} onPick={() => pick("extra")} onClear={() => removePlace("extra", item.id)} />
        ))}
        <Btn variant="line" className="w-full" onClick={() => pick("extra")}>
          {copy("addPlace")}
        </Btn>
        <div>
          <h2 className="font-semibold">{copy("emergency")}</h2>
          <div className="mt-2 space-y-2">
            {emergency.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-paper px-3 py-2">
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-sm text-muted tabular">+91 {prettyPhone(item.phone)}</span>
                </span>
                <button type="button" className="text-sm text-danger" onClick={() => removeEmergency(item.id)}>
                  {copy("cancel")}
                </button>
              </div>
            ))}
            {emergency.length < 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} value={contact} onChange={(e) => setContact(e.target.value)} placeholder={copy("namePh")} aria-label={copy("emergency")} />
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98XXXXXX00"
                  aria-label={copy("phoneTitle")}
                />
              </div>
            ) : null}
            <Btn
              variant="soft"
              disabled={!contact.trim() || !/^[6-9]\d{9}$/.test(contactPhone)}
              onClick={() => {
                saveEmergency(contact, contactPhone);
                setContact("");
                setContactPhone("");
              }}
            >
              {copy("save")}
            </Btn>
          </div>
        </div>
        <button type="button" className="text-sm font-semibold text-primary" onClick={() => open("language")}>
          {copy("language")}
        </button>
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
            className="flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-left"
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
          <span className="text-sm">Two taps. This demo contacts nobody.</span>
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
        <Pill tone="danger">Not connected to emergency services</Pill>
        {step === 0 ? (
          <Btn variant="danger" className="w-full" onClick={() => setStep(1)}>
            {copy("sosConfirm")}
          </Btn>
        ) : null}
        {step === 1 && !armed ? (
          <Card>
            <p className="font-semibold">Confirm this is intentional.</p>
            <p className="mt-1 text-sm text-muted">A second tap stops an accidental SOS. Still nothing is dialled.</p>
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
              <li>Would notify {emergency.length ? emergency.map((item) => item.name).join(", ") : "no saved contacts"}.</li>
              <li>Would open the trip share for those contacts.</li>
              <li>Would alert a safety desk after that desk exists.</li>
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
          <p className="mt-1 font-display text-4xl tabular">{copy("numberNote")}</p>
          <p className="mt-2 text-sm">{copy("numberNote")}</p>
          <div className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-surface font-semibold text-ink opacity-70 cursor-not-allowed" aria-disabled="true" title="Official Kida support number will be added before launch">
            {copy("callNow")}
          </div>
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
  ["Does the call share my GPS?", "No. GPS is shared only if you open the location link and tap Allow."],
  ["Is the fare final?", "The number in this prototype is a sample. A live fare can change with route, waiting and tolls."],
  ["What does SOS do?", "Here it only shows the intended flow. It does not call the police."],
  ["Can I pay cash?", "Yes. Cash is a first-class option, especially where digital payments are unfamiliar."],
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
        <div className="block rounded-3xl bg-primary px-4 py-4 text-primary-ink opacity-70 cursor-not-allowed" aria-disabled="true" title="Official Kida support number will be added before launch">
          <span className="block text-sm">{copy("callNow")}</span>
          <span className="font-display text-3xl tabular">{copy("numberNote")}</span>
          <span className="mt-1 block text-sm">{company.hours}</span>
        </div>
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
  const [topic, setTopic] = useState("Booking");
  const [text, setText] = useState("");
  const topics = ["Booking", "Payment", "Lost item", "Driver", "Safety", "Other"];
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
        <Btn
          className="w-full"
          disabled={text.trim().length < 4}
          onClick={() => {
            add(topic, text.trim());
            setText("");
            back();
          }}
        >
          {copy("save")}
        </Btn>
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
          <p className="mt-2 text-sm">{company.supportPhone}</p>
          <p className="text-sm">{company.email}</p>
          <p className="text-sm">{company.website}</p>
          <p className="mt-2 text-sm text-muted">{company.grievance}</p>
        </Card>
        {rows.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setLegal(id)} className="flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium">
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
          <p className="mt-1 text-muted">OTP, fares, drivers, movement on the map, chat, payments, tickets and SOS. The map is a schematic of sample places, not a navigation feed. Device location, if you allow it, only snaps to the nearest sample area.</p>
        </Card>
        <Card>
          <p className="font-semibold">Still to integrate</p>
          <p className="mt-1 text-muted">Maps provider, SMS and voice, a real call centre, driver app, payments gateway, emergency partners, and admin-managed company registration. Android and iOS builds can wrap this product later. This review build is the customer and desk experience, not an installed APK.</p>
        </Card>
      </div>
    </div>
  );
}
