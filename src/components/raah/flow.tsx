import { useEffect, useState } from "react";
import { Phone, ShieldCheck, Spline } from "lucide-react";
import { DEMO_OTP } from "@/lib/raah/company";
import { LANGUAGES } from "@/lib/raah/i18n";
import { useRaah } from "@/lib/raah/store";
import { Wordmark } from "./art";
import { Btn, Header, inputClass, useCopy } from "./ui";

export function Splash() {
  const replace = useRaah((s) => s.replace);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const state = useRaah.getState();
      if (!state.seenOnboarding) state.replace("onboarding");
      else if (!state.languageChosen) state.replace("language");
      else if (!state.authed) state.replace("phone");
      else if (!state.name) state.replace("name");
      else if (state.screen === "splash") state.replace("home");
    }, 700);
    return () => window.clearTimeout(id);
  }, [replace]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold tracking-widest text-primary">INDIA</p>
        <Wordmark className="mt-2 block text-6xl" />
        <p className="mt-3 text-muted">Every road. Every village.</p>
      </div>
    </div>
  );
}

const slides = [
  { key: "on1", icon: Spline },
  { key: "on2", icon: Phone },
  { key: "on3", icon: ShieldCheck },
] as const;

export function Onboarding() {
  const copy = useCopy();
  const step = useRaah((s) => s.onboardStep);
  const setStep = useRaah((s) => s.setOnboardStep);
  const finish = useRaah((s) => s.finishIntro);
  const slide = slides[step];
  const Icon = slide.icon;
  const titles = { on1: "on1t", on2: "on2t", on3: "on3t" } as const;
  const bodies = { on1: "on1b", on2: "on2b", on3: "on3b" } as const;
  const title = copy(titles[slide.key]);
  const body = copy(bodies[slide.key]);
  return (
    <div className="flex min-h-[70vh] flex-col px-5 py-6">
      <div className="flex justify-end">
        <button type="button" onClick={finish} className="h-11 px-2 text-sm font-semibold text-muted">
          {copy("skip")}
        </button>
      </div>
      <div className="grid flex-1 place-items-center">
        <div className="rise w-full max-w-sm text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon className="size-10" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink">{title}</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">{body}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((item, index) => (
          <span key={item.key} className={`h-1.5 rounded-full ${index === step ? "w-8 bg-primary" : "w-2 bg-line"}`} />
        ))}
      </div>
      <Btn
        className="mt-5 w-full"
        onClick={() => {
          if (step < 2) setStep(step + 1);
          else finish();
        }}
      >
        {step < 2 ? copy("next") : copy("start")}
      </Btn>
    </div>
  );
}

export function LanguageScreen() {
  const copy = useCopy();
  const lang = useRaah((s) => s.lang);
  const setLang = useRaah((s) => s.setLang);
  const replace = useRaah((s) => s.replace);
  const authed = useRaah((s) => s.authed);
  const back = useRaah((s) => s.back);
  const stack = useRaah((s) => s.stack);
  return (
    <div className="pb-6">
      <Header title={copy("langTitle")} subtitle={copy("langSub")} onBack={stack.length ? back : undefined} />
      <div className="grid grid-cols-2 gap-2 px-4">
        {LANGUAGES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            className={`min-h-16 rounded-2xl border px-3 py-3 text-left ${lang === item.id ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
          >
            <span className="block text-lg font-semibold">{item.native}</span>
            <span className="text-sm text-muted">{item.english}</span>
          </button>
        ))}
      </div>
      <div className="px-4 pt-4">
        <Btn className="w-full" onClick={() => replace(authed ? "home" : "phone")}>
          {copy("continue")}
        </Btn>
      </div>
    </div>
  );
}

export function PhoneScreen() {
  const copy = useCopy();
  const phone = useRaah((s) => s.phone);
  const setPhone = useRaah((s) => s.setPhone);
  const open = useRaah((s) => s.open);
  const [error, setError] = useState("");
  return (
    <div className="px-4 py-6">
      <p className="font-display text-4xl text-ink">Kida</p>
      <h1 className="mt-6 font-display text-3xl">{copy("phoneTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{copy("phoneSub")}</p>
      <label className="mt-6 flex h-14 items-center gap-3 rounded-2xl border border-line bg-paper px-3">
        <span className="font-semibold">+91</span>
        <input
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
          className="h-full w-full bg-transparent text-lg outline-none tabular"
          placeholder="98XXXXXX00"
          aria-label={copy("phoneTitle")}
        />
      </label>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Btn
        className="mt-6 w-full"
        onClick={() => {
          if (!/^[6-9]\d{9}$/.test(phone)) {
            setError(copy("phoneBad"));
            return;
          }
          setError("");
          open("otp");
        }}
      >
        {copy("sendCode")}
      </Btn>
    </div>
  );
}

export function OtpScreen() {
  const copy = useCopy();
  const back = useRaah((s) => s.back);
  const verify = useRaah((s) => s.verifyOtp);
  const setToast = useRaah((s) => s.setToast);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  return (
    <div>
      <Header title={copy("otpTitle")} subtitle={copy("otpSub")} onBack={back} />
      <div className="px-4">
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className={`${inputClass} text-center text-2xl tracking-widest tabular`}
          aria-label={copy("otpTitle")}
        />
        <p className="mt-3 text-sm text-muted">
          Demo code <span className="font-semibold text-ink tabular">{DEMO_OTP}</span>
        </p>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <Btn
          className="mt-5 w-full"
          onClick={() => {
            if (!verify(code)) setError(copy("phoneBad"));
          }}
        >
          {copy("verify")}
        </Btn>
        <button
          type="button"
          className="mt-3 h-11 w-full text-sm font-semibold text-primary"
          onClick={() => setToast(copy("resend"))}
        >
          {copy("resend")}
        </button>
        <button type="button" className="h-11 w-full text-sm text-muted" onClick={back}>
          {copy("changeNumber")}
        </button>
      </div>
    </div>
  );
}

export function NameScreen() {
  const copy = useCopy();
  const name = useRaah((s) => s.name);
  const setName = useRaah((s) => s.setName);
  const [value, setValue] = useState(name);
  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-3xl">{copy("nameTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{copy("nameSub")}</p>
      <input
        className={`${inputClass} mt-6`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={copy("namePh")}
        aria-label={copy("namePh")}
        maxLength={40}
      />
      <Btn className="mt-5 w-full" disabled={value.trim().length < 2} onClick={() => setName(value)}>
        {copy("continue")}
      </Btn>
    </div>
  );
}
