import type { Lang, PayMethod, VehicleId } from "./types";

const vehicles: Record<Lang, Record<VehicleId, string>> = {
  en: { bike: "Bike", auto: "Auto", mini: "Mini cab", sedan: "Sedan", xl: "7 seater" },
  hi: { bike: "बाइक", auto: "ऑटो", mini: "मिनी कैब", sedan: "सेडान", xl: "7 सीटर" },
  ta: { bike: "பைக்", auto: "ஆட்டோ", mini: "மினி கேப்", sedan: "செடான்", xl: "7 இருக்கை" },
  te: { bike: "బైక్", auto: "ఆటో", mini: "మినీ క్యాబ్", sedan: "సెడాన్", xl: "7 సీటర్" },
  kn: { bike: "ಬೈಕ್", auto: "ಆಟೋ", mini: "ಮಿನಿ ಕ್ಯಾಬ್", sedan: "ಸೆಡಾನ್", xl: "7 ಸೀಟರ್" },
  ml: { bike: "ബൈക്ക്", auto: "ഓട്ടോ", mini: "മിനി ക്യാബ്", sedan: "സെഡാൻ", xl: "7 സീറ്റർ" },
  bn: { bike: "বাইক", auto: "অটো", mini: "মিনি ক্যাব", sedan: "সেডান", xl: "৭ সিটার" },
  mr: { bike: "बाईक", auto: "ऑटो", mini: "मिनी कॅब", sedan: "सेडान", xl: "7 सीटर" },
  gu: { bike: "બાઇક", auto: "ઑટો", mini: "મિની કેબ", sedan: "સેડાન", xl: "7 સીટર" },
  pa: { bike: "ਬਾਈਕ", auto: "ਆਟੋ", mini: "ਮਿਨੀ ਕੈਬ", sedan: "ਸੇਡਾਨ", xl: "7 ਸੀਟਰ" },
};

const cash: Record<Lang, string> = {
  en: "Cash",
  hi: "नकद",
  ta: "பணம்",
  te: "నగదు",
  kn: "ನಗದು",
  ml: "പണം",
  bn: "নগদ",
  mr: "रोख",
  gu: "રોકડ",
  pa: "ਨਕਦ",
};

const payRest: Record<Exclude<PayMethod, "cash">, string> = {
  upi: "UPI",
  qr: "UPI QR",
  credit: "Credit card",
  debit: "Debit card",
  netbanking: "Net banking",
};

export function vehicleLabel(lang: Lang, id: VehicleId) {
  return vehicles[lang][id];
}

export function payLabel(lang: Lang, id: PayMethod) {
  if (id === "cash") return cash[lang];
  return payRest[id];
}

export function promoReason(reason: string) {
  switch (reason) {
    case "used":
      return "That code is already used in this prototype.";
    case "unknown":
      return "Code not recognised. Try RAAH50, FEST25, VILLAGE20, CITY15 or REFER75.";
    case "village-only":
      return "VILLAGE20 is for bike or auto in a town or village.";
    case "city-only":
      return "CITY15 is for city and metro rides.";
    case "empty":
      return "Enter a code.";
    default:
      return "Offer applied to this estimate.";
  }
}
