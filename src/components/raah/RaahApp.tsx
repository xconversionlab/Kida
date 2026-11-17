import { useEffect, useState } from "react";
import { useRaah } from "@/lib/raah/store";
import { useKidaCustomerSync } from "@/lib/kida/customer-sync";
import { CustomerScreens, ProtoChrome, TabBar } from "./screens";
import { Wordmark } from "./art";

export function RaahApp() {
  const [ready, setReady] = useState(false);
  useKidaCustomerSync(ready);
  useEffect(() => {
    let live = true;
    void Promise.resolve(useRaah.persist.rehydrate()).then(() => {
      if (!live) return;
      const state = useRaah.getState();
      const publicScreens = ["splash", "onboarding", "language", "phone", "otp"];
      if (!state.authed && !publicScreens.includes(state.screen)) {
        state.replace(state.seenOnboarding ? (state.languageChosen ? "phone" : "language") : "splash");
      } else if (state.authed && !state.name) {
        state.replace("name");
      }
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper text-ink">
        <div className="text-center">
          <Wordmark className="text-6xl" />
          <p className="mt-2 text-muted">Every road. Every village.</p>
        </div>
      </main>
    );
  }

  return <Stage />;
}

function Stage() {
  const contrast = useRaah((s) => s.highContrast);
  const large = useRaah((s) => s.largeText);
  useEffect(() => {
    document.documentElement.dataset.contrast = contrast ? "high" : "normal";
    document.documentElement.dataset.type = large ? "large" : "base";
  }, [contrast, large]);
  return (
    <main className="kida-stage min-h-dvh bg-paper text-ink lg:flex lg:justify-center lg:p-6">
      <div
        data-contrast={contrast ? "high" : "normal"}
        data-type={large ? "large" : "base"}
        className="kida-app-shell mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface shadow-sm lg:h-[calc(100dvh-3rem)] lg:min-h-0 lg:overflow-hidden lg:rounded-3xl lg:border lg:border-line"
      >
        <ProtoChrome />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <CustomerScreens />
        </div>
        <TabBar />
      </div>
    </main>
  );
}
