import { History, House, Shield, Tag, UserRound } from "lucide-react";
import type { Screen } from "@/lib/raah/types";
import { useRaah } from "@/lib/raah/store";
import { AssigningScreen, ConfirmScreen, FareScreen, VehiclesScreen } from "./book";
import { LanguageScreen, NameScreen, Onboarding, OtpScreen, PhoneScreen, Splash } from "./flow";
import { HomeScreen } from "./home";
import {
  AccountScreen,
  CallScreen,
  CompanyScreen,
  ConsentScreen,
  LegalScreen,
  NotesScreen,
  OffersScreen,
  PaymentsScreen,
  ProfileScreen,
  SafeScreen,
  SettingsScreen,
  SosScreen,
  SupportScreen,
  TicketScreen,
} from "./more";
import { PlacePicker } from "./PlacePicker";
import { ChatScreen, CompleteScreen, HistoryScreen, RideDetail, ShareScreen, TrackingScreen } from "./ride";
import { useCopy } from "./ui";

export function CustomerScreens() {
  const screen = useRaah((s) => s.screen);
  switch (screen) {
    case "splash":
      return <Splash />;
    case "onboarding":
      return <Onboarding />;
    case "language":
      return <LanguageScreen />;
    case "phone":
      return <PhoneScreen />;
    case "otp":
      return <OtpScreen />;
    case "name":
      return <NameScreen />;
    case "home":
      return <HomeScreen />;
    case "pickup":
    case "destination":
      return <PlacePicker />;
    case "vehicles":
      return <VehiclesScreen />;
    case "fare":
      return <FareScreen />;
    case "confirm":
      return <ConfirmScreen />;
    case "assigning":
      return <AssigningScreen />;
    case "tracking":
      return <TrackingScreen />;
    case "complete":
      return <CompleteScreen />;
    case "history":
      return <HistoryScreen />;
    case "ride":
      return <RideDetail />;
    case "payments":
      return <PaymentsScreen />;
    case "offers":
      return <OffersScreen />;
    case "support":
      return <SupportScreen />;
    case "ticket":
      return <TicketScreen />;
    case "company":
      return <CompanyScreen />;
    case "legal":
      return <LegalScreen />;
    case "settings":
      return <SettingsScreen />;
    case "profile":
      return <ProfileScreen />;
    case "safe":
      return <SafeScreen />;
    case "sos":
      return <SosScreen />;
    case "call":
      return <CallScreen />;
    case "consent":
      return <ConsentScreen />;
    case "chat":
      return <ChatScreen />;
    case "share":
      return <ShareScreen />;
    case "account":
      return <AccountScreen />;
    case "notes":
      return <NotesScreen />;
    default:
      return <HomeScreen />;
  }
}

const TABS: Screen[] = ["home", "history", "offers", "safe", "account"];

export function TabBar() {
  const copy = useCopy();
  const screen = useRaah((s) => s.screen);
  const tab = useRaah((s) => s.tab);
  const items: { id: Screen; label: string; icon: typeof House }[] = [
    { id: "home", label: copy("navHome"), icon: House },
    { id: "history", label: copy("navRides"), icon: History },
    { id: "offers", label: copy("navOffers"), icon: Tag },
    { id: "safe", label: copy("navSafety"), icon: Shield },
    { id: "account", label: copy("navAccount"), icon: UserRound },
  ];
  if (!TABS.includes(screen)) return null;
  return (
    <nav className="kida-tabbar grid grid-cols-5 border-t border-line bg-surface px-1 py-1">
      {items.map((item) => {
        const Icon = item.icon;
        const on = screen === item.id;
        return (
          <button key={item.id} type="button" onClick={() => tab(item.id)} aria-current={on ? "page" : undefined}
            className={`kida-tab-button flex flex-col items-center justify-center gap-0.5 font-semibold ${on ? "text-primary" : "text-muted"}`}>
            <Icon className="size-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function ProtoChrome() {
  const copy = useCopy();
  const consent = useRaah((s) => s.consent);
  const open = useRaah((s) => s.open);
  const toast = useRaah((s) => s.toast);
  const clear = useRaah((s) => s.clearToast);
  return (
    <>
      <p className="kida-proto-banner bg-ink px-3 text-center text-xs font-semibold text-surface">{copy("proto")}</p>
      {consent === "link_sent" ? (
        <button type="button" onClick={() => open("consent")} className="w-full bg-accent px-3 py-2 text-left text-sm font-semibold text-accent-ink">
          {copy("linkWaiting")}
        </button>
      ) : null}
      {toast ? (
        <button type="button" onClick={clear} className="w-full bg-primary-soft px-3 py-2 text-left text-sm text-primary">
          {toast}
        </button>
      ) : null}
    </>
  );
}
