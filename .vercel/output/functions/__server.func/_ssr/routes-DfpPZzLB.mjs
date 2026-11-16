import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, c as Share2, d as MapPin, f as LocateFixed, g as ChevronLeft, h as Headphones, i as Spline, l as Phone, m as History, o as ShieldCheck, p as House, r as Tag, s as ShieldAlert, t as UserRound, u as MessageCircle } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DfpPZzLB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANGUAGES = [
	{
		id: "en",
		native: "English",
		english: "English"
	},
	{
		id: "hi",
		native: "हिन्दी",
		english: "Hindi"
	},
	{
		id: "ta",
		native: "தமிழ்",
		english: "Tamil"
	},
	{
		id: "te",
		native: "తెలుగు",
		english: "Telugu"
	},
	{
		id: "kn",
		native: "ಕನ್ನಡ",
		english: "Kannada"
	},
	{
		id: "ml",
		native: "മലയാളം",
		english: "Malayalam"
	},
	{
		id: "bn",
		native: "বাংলা",
		english: "Bengali"
	},
	{
		id: "mr",
		native: "मराठी",
		english: "Marathi"
	},
	{
		id: "gu",
		native: "ગુજરાતી",
		english: "Gujarati"
	},
	{
		id: "pa",
		native: "ਪੰਜਾਬੀ",
		english: "Punjabi"
	}
];
var en = {
	tagline: "Every road. Every village.",
	proto: "Prototype · sample fares · not a live service",
	continue: "Continue",
	back: "Back",
	skip: "Skip",
	next: "Next",
	save: "Save",
	cancel: "Cancel",
	close: "Close",
	search: "Search",
	apply: "Apply",
	done: "Done",
	from: "From",
	to: "To",
	now: "Now",
	seats: "seats",
	min: "min",
	away: "away",
	start: "Get started",
	on1t: "One app for every road in India",
	on1b: "Bike, auto and cab for cities, towns and villages — wherever a road can be described.",
	on2t: "Book here, or book by phone",
	on2b: "If a smartphone is difficult, call the Raah desk. A person books the ride with you.",
	on3t: "Safety you can see",
	on3b: "Driver name, vehicle number, trip sharing and SOS are part of the ride — not an afterthought.",
	langTitle: "Choose your language",
	langSub: "Booking, safety and call-to-book follow this language. Policies stay in English until certified translation.",
	phoneTitle: "Your mobile number",
	phoneSub: "India numbers only. This demo does not send an SMS.",
	phoneBad: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
	sendCode: "Send demo code",
	otpTitle: "Enter the 6-digit code",
	otpSub: "Demo code 482913. Any 6 digits will continue. A live service would rate-limit this.",
	verify: "Verify",
	changeNumber: "Change number",
	resend: "Code noted — nothing was sent",
	nameTitle: "What should we call you?",
	nameSub: "Only your driver and Raah support see this. It is not public.",
	namePh: "Your name",
	hello: "Hello",
	whereTo: "Where to?",
	pickup: "Pickup",
	drop: "Destination",
	sampleFix: "Sample location — not your real GPS",
	callCta: "Book a ride by call",
	callSub: "For elders, first-time users and anyone who would rather speak",
	bookPhone: "Book on this phone",
	support: "Support",
	offers: "Offers",
	pickupTitle: "Confirm pickup",
	dropTitle: "Choose destination",
	saved: "Saved",
	recent: "Recent",
	landmarks: "Landmarks",
	around: "Places across India",
	tryGps: "Use device location",
	gpsNote: "We ask first. A call never shares GPS by itself. If you allow it, we snap to the nearest sample area — this is not live navigation.",
	gpsDenied: "Location was not allowed. Choose a landmark instead.",
	gpsSnapped: "Snapped to the nearest sample area. This is not a verified street address.",
	samePlace: "Pickup and destination need to be different.",
	searchPh: "City, village, temple, bus stop…",
	unmapped: "Some village roads are not fully mapped. You can still book with a landmark.",
	villageNote: "Navigation coverage may be incomplete. The driver will use your landmark.",
	vehicleTitle: "Choose a vehicle",
	bookNow: "Book now",
	schedule: "Schedule",
	ready: "Available",
	limited: "Limited here",
	unavailable: "Not for this trip",
	fareDetails: "Fare breakdown",
	base: "Base fare",
	distance: "Distance",
	waiting: "Waiting",
	tax: "Indicative tax (5%)",
	discount: "Discount",
	total: "Estimated total",
	promo: "Promo code",
	promoPh: "Try RAAH50",
	payWith: "Pay with",
	fareNote: "Sample fare for this prototype. A live fare can change with route, waiting and tolls.",
	waitingNote: "Waiting is shown as ₹0. A live trip may add a waiting charge after 3 minutes.",
	confirmRide: "Confirm booking",
	searching: "Finding a nearby driver",
	driverFound: "Driver assigned",
	simDriver: "Simulated driver — not a live assignment",
	trackSim: "Simulated movement — not live GPS",
	arriving: "Arriving for pickup",
	onTrip: "On the way",
	callDriver: "Call",
	message: "Message",
	shareTrip: "Share trip",
	sos: "SOS",
	cancelRide: "Cancel ride",
	endDemo: "End demo ride",
	plate: "Vehicle number",
	chatTitle: "Messages",
	chatSim: "Simulated chat. Nothing is delivered to a driver.",
	quick1: "I am at the landmark",
	quick2: "Please call when you are near",
	quick3: "I will be two minutes",
	driverReply: "Understood. I am using the landmark you shared.",
	shareTitle: "Trip share preview",
	shareBody: "A live link would let a trusted person see this ride until it ends. This preview is not public and is not tracking you.",
	sosTitle: "Emergency SOS",
	sosBody: "This demo will not call the police, an ambulance or any emergency partner. Nothing leaves this device.",
	sosConfirm: "Show SOS demo",
	sosDone: "Demo only. Emergency contacts would be notified after a real integration is verified.",
	sosNeed: "Add an emergency contact so a live SOS has someone to reach.",
	safeTitle: "Safe mode",
	safeSos: "SOS with confirmation",
	safeContacts: "Emergency contacts",
	safeShare: "Share this trip",
	safeId: "Match the driver and the vehicle number before you sit",
	safeCentre: "Safety centre",
	callTitle: "Book a ride by call",
	callLead: "No app steps. A person at the Raah desk books it with you.",
	official: "Official booking number",
	numberNote: "Prototype number. It does not connect to a call centre.",
	callNow: "Call this number",
	how: "How a phone booking works",
	how1: "You call the Raah number.",
	how2: "You give your mobile number.",
	how3: "You describe pickup with a village, bus stop, school or temple.",
	how4: "The desk confirms the destination, vehicle and fare.",
	how5: "You get an SMS or a voice call when the ride is booked.",
	callLang: "You can speak your language. The desk is meant for every major Indian language.",
	openLink: "Open the sample location link",
	openLinkNote: "A phone call does not share GPS. Location is shared only if you open a link and allow it.",
	openDesk: "See the call-centre desk",
	consentTitle: "Share location with the Raah desk?",
	consentBody: "The operator sees this pin only after you allow it. You can stop sharing. Raah never tracks a phone silently.",
	allowOnce: "Allow once",
	dontShare: "Don't share",
	sharingOn: "Location sharing is on",
	sharingOff: "Not sharing location",
	linkWaiting: "The desk sent a location link",
	upcoming: "Upcoming",
	active: "Active",
	completed: "Completed",
	cancelled: "Cancelled",
	emptyRides: "No rides in this list yet.",
	receipt: "Receipt",
	lost: "Lost item",
	issue: "Report an issue",
	rate: "Rate this ride",
	feedbackPh: "Optional note for this prototype",
	offersTitle: "Offers",
	offersSub: "Promotions sit beside booking. They never block it.",
	applied: "Applied",
	supportTitle: "Support",
	ruralTitle: "Help for rural bookings",
	ruralBody: "If the app is hard to use, call the desk. Keep a landmark ready: bus stop, school, temple or shop.",
	faq: "Questions",
	ticket: "New request",
	ticketSent: "Request saved on this device. A live desk would reply by SMS or call.",
	about: "About Raah",
	office: "Registered office",
	cin: "CIN",
	gstin: "GSTIN",
	placeholder: "Placeholder — not a real registration",
	terms: "Terms and conditions",
	privacy: "Privacy policy",
	refund: "Refund and cancellation",
	driverTerms: "Driver terms",
	duties: "Customer responsibilities",
	grievance: "Grievance redressal",
	safetyPolicy: "Safety policy",
	legal: "Legal disclosures",
	securityTitle: "How data is protected",
	settings: "Settings",
	language: "Language",
	simple: "Simple home",
	simpleHint: "Bigger actions. Call booking first.",
	large: "Larger text",
	contrast: "Higher contrast",
	voice: "Spoken confirmations",
	voiceHint: "Uses this device's voice. Not a Raah call centre.",
	logout: "Log out",
	logoutHint: "You will enter the demo code again. Rides stay on this device.",
	deleteAccount: "Delete prototype data",
	deleteHint: "Clears profile, rides and tickets stored in this browser.",
	deskDemo: "Call-centre desk",
	review: "What this prototype covers",
	account: "Account",
	profile: "Profile",
	payments: "Payments",
	verified: "Verified mobile",
	home: "Home",
	work: "Work",
	addPlace: "Add a place",
	emergency: "Emergency contact",
	none: "None yet",
	paySecure: "Card numbers, CVV and UPI PIN are never stored. A licensed gateway would tokenize them in production.",
	payFail: "Preview a failed payment",
	payFailBody: "Sample failure. No money moved. A live refund would return to the original method after the gateway confirms it.",
	navHome: "Home",
	navRides: "Rides",
	navOffers: "Offers",
	navSafety: "Safety",
	navAccount: "Account",
	cashNote: "Pay the driver in cash at the end. Keep the receipt in the app.",
	scheduleTitle: "Schedule this ride",
	pickTime: "Pickup time",
	booked: "Booking saved",
	cancelWhy: "Why are you cancelling?",
	ratingThanks: "Thank you. Stored only in this prototype.",
	operator: "Operator",
	filterAll: "All",
	filterVillage: "Villages",
	filterTown: "Towns",
	filterCity: "Cities",
	notesLead: "For the client review. Sample data is labelled. Nothing here is a live ride service."
};
var packs = {
	en,
	hi: {
		tagline: "हर सड़क। हर गाँव।",
		proto: "प्रोटोटाइप · नमूना किराया · यह लाइव सेवा नहीं है",
		continue: "आगे बढ़ें",
		back: "वापस",
		skip: "छोड़ें",
		next: "आगे",
		save: "सहेजें",
		cancel: "रद्द करें",
		close: "बंद करें",
		search: "खोजें",
		done: "हो गया",
		from: "कहाँ से",
		to: "कहाँ तक",
		now: "अभी",
		seats: "सीटें",
		min: "मिनट",
		away: "दूर",
		start: "शुरू करें",
		on1t: "भारत की हर सड़क के लिए एक ऐप",
		on1b: "शहर, कस्बा और गाँव — जहाँ सड़क बताई जा सके, वहाँ बाइक, ऑटो और कैब।",
		on2t: "यहाँ बुक करें, या फ़ोन से",
		on2b: "अगर स्मार्टफ़ोन मुश्किल है, राह डेस्क को कॉल करें। एक व्यक्ति आपके साथ राइड बुक करेगा।",
		on3t: "सुरक्षा जो दिखे",
		on3b: "ड्राइवर का नाम, गाड़ी नंबर, यात्रा साझा करना और SOS राइड का हिस्सा हैं।",
		langTitle: "भाषा चुनें",
		langSub: "बुकिंग, सुरक्षा और कॉल-बुकिंग इस भाषा में हैं। नीतियाँ प्रमाणित अनुवाद तक अंग्रेज़ी में रहेंगी।",
		phoneTitle: "आपका मोबाइल नंबर",
		phoneSub: "केवल भारत नंबर। यह डेमो SMS नहीं भेजता।",
		phoneBad: "6, 7, 8 या 9 से शुरू होने वाला 10 अंकों का नंबर डालें।",
		sendCode: "डेमो कोड देखें",
		otpTitle: "6 अंकों का कोड डालें",
		otpSub: "डेमो कोड 482913। कोई भी 6 अंक चलेंगे। लाइव सेवा कोशिशें सीमित करेगी।",
		verify: "जांचें",
		changeNumber: "नंबर बदलें",
		resend: "कोड यहीं है — कुछ नहीं भेजा गया",
		nameTitle: "हम आपको क्या कहें?",
		nameSub: "यह केवल ड्राइवर और राह सपोर्ट देखेंगे। यह सार्वजनिक नहीं है।",
		namePh: "आपका नाम",
		hello: "नमस्ते",
		whereTo: "कहाँ जाना है?",
		pickup: "पिकअप",
		drop: "गंतव्य",
		sampleFix: "नमूना स्थान — आपका असली GPS नहीं",
		callCta: "कॉल से राइड बुक करें",
		callSub: "बुज़ुर्गों और जिनके लिए बोलना आसान हो, उनके लिए",
		bookPhone: "इस फ़ोन पर बुक करें",
		pickupTitle: "पिकअप पक्का करें",
		dropTitle: "गंतव्य चुनें",
		saved: "सहेजे स्थान",
		recent: "हाल के",
		landmarks: "निशान",
		tryGps: "डिवाइस की लोकेशन लें",
		gpsNote: "हम पहले पूछते हैं। कॉल अपने आप GPS नहीं भेजती। अनुमति पर हम निकटतम नमूना इलाके तक ले जाते हैं।",
		gpsDenied: "लोकेशन की अनुमति नहीं मिली। कोई निशान चुनें।",
		gpsSnapped: "निकटतम नमूना इलाके पर ले गए। यह पक्का पता नहीं है।",
		samePlace: "पिकअप और गंतव्य अलग होने चाहिए।",
		searchPh: "शहर, गाँव, मंदिर, बस स्टॉप…",
		unmapped: "कुछ गाँव की सड़कें पूरी मैप नहीं हैं। निशान से फिर भी बुक कर सकते हैं।",
		villageNote: "नेविगेशन अधूरा हो सकता है। ड्राइवर आपके निशान का उपयोग करेगा।",
		vehicleTitle: "गाड़ी चुनें",
		bookNow: "अभी बुक करें",
		schedule: "बाद के लिए",
		ready: "उपलब्ध",
		limited: "यहाँ कम हैं",
		unavailable: "इस यात्रा के लिए नहीं",
		fareDetails: "किराए का विवरण",
		base: "बेस किराया",
		distance: "दूरी",
		waiting: "इंतज़ार",
		tax: "संकेतक कर (5%)",
		discount: "छूट",
		total: "अनुमानित कुल",
		promo: "प्रोमो कोड",
		payWith: "भुगतान",
		fareNote: "यह प्रोटोटाइप का नमूना किराया है। असली किराया रास्ते और इंतज़ार से बदल सकता है।",
		confirmRide: "बुकिंग पक्की करें",
		searching: "पास का ड्राइवर ढूँढ रहे हैं",
		driverFound: "ड्राइवर मिला",
		simDriver: "नमूना ड्राइवर — असली असाइनमेंट नहीं",
		trackSim: "नमूना चाल — लाइव GPS नहीं",
		arriving: "पिकअप के लिए आ रहे हैं",
		onTrip: "रास्ते में",
		callDriver: "कॉल",
		message: "संदेश",
		shareTrip: "यात्रा साझा करें",
		sos: "SOS",
		cancelRide: "राइड रद्द करें",
		endDemo: "डेमो राइड समाप्त करें",
		chatTitle: "संदेश",
		chatSim: "नमूना चैट। किसी ड्राइवर तक नहीं पहुँचती।",
		quick1: "मैं निशान पर हूँ",
		quick2: "पास आकर कॉल करें",
		quick3: "मुझे दो मिनट लगेंगे",
		driverReply: "ठीक है। मैं आपके बताए निशान पर आ रहा हूँ।",
		shareTitle: "यात्रा साझा करने का पूर्वावलोकन",
		shareBody: "लाइव लिंक किसी भरोसेमंद व्यक्ति को यात्रा खत्म होने तक दिखाएगा। यह पूर्वावलोकन सार्वजनिक नहीं है।",
		sosTitle: "आपातकाल SOS",
		sosBody: "यह डेमो पुलिस, एम्बुलेंस या किसी आपातकाल साथी को कॉल नहीं करेगा। कुछ भी इस डिवाइस से बाहर नहीं जाता।",
		sosConfirm: "SOS डेमो दिखाएँ",
		sosDone: "केवल डेमो। असली जुड़ाव के बाद आपातकाल संपर्क सूचित होंगे।",
		sosNeed: "आपातकाल संपर्क जोड़ें, ताकि लाइव SOS के पास कोई हो।",
		safeTitle: "सुरक्षित मोड",
		callTitle: "कॉल से राइड बुक करें",
		callLead: "ऐप के चरण नहीं। राह डेस्क का व्यक्ति आपके साथ बुक करता है।",
		official: "आधिकारिक बुकिंग नंबर",
		numberNote: "प्रोटोटाइप नंबर। यह कॉल सेंटर से नहीं जुड़ता।",
		callNow: "इस नंबर पर कॉल करें",
		how: "फ़ोन बुकिंग कैसे होती है",
		how1: "आप राह नंबर पर कॉल करते हैं।",
		how2: "अपना मोबाइल नंबर बताते हैं।",
		how3: "पिकअप गाँव, बस स्टॉप, स्कूल या मंदिर से बताते हैं।",
		how4: "डेस्क गंतव्य, गाड़ी और किराया पक्का करता है।",
		how5: "राइड बनने पर SMS या वॉइस कॉल आती है।",
		callLang: "आप अपनी भाषा बोल सकते हैं। डेस्क भारतीय भाषाओं के लिए है।",
		openLink: "नमूना लोकेशन लिंक खोलें",
		openLinkNote: "कॉल GPS नहीं भेजती। लोकेशन तभी साझा होती है जब आप लिंक खोलकर अनुमति दें।",
		openDesk: "कॉल-सेंटर डेस्क देखें",
		consentTitle: "राह डेस्क के साथ लोकेशन साझा करें?",
		consentBody: "ऑपरेटर यह पिन आपकी अनुमति के बाद ही देखता है। आप साझा करना रोक सकते हैं। चुपके से ट्रैकिंग नहीं होती।",
		allowOnce: "एक बार अनुमति दें",
		dontShare: "साझा न करें",
		sharingOn: "लोकेशन साझा हो रही है",
		sharingOff: "लोकेशन साझा नहीं हो रही",
		linkWaiting: "डेस्क ने लोकेशन लिंक भेजा है",
		upcoming: "आने वाली",
		active: "चालू",
		completed: "पूरी",
		cancelled: "रद्द",
		emptyRides: "इस सूची में अभी कोई राइड नहीं।",
		receipt: "रसीद",
		lost: "खोई वस्तु",
		issue: "समस्या बताएँ",
		rate: "इस राइड को आँकें",
		offersTitle: "ऑफ़र",
		supportTitle: "सहायता",
		ruralTitle: "गाँव की बुकिंग में मदद",
		ruralBody: "ऐप कठिन लगे तो डेस्क को कॉल करें। बस स्टॉप, स्कूल, मंदिर या दुकान का निशान तैयार रखें।",
		settings: "सेटिंग्स",
		language: "भाषा",
		simple: "सरल होम",
		simpleHint: "बड़े बटन। पहले कॉल बुकिंग।",
		large: "बड़ा अक्षर",
		contrast: "अधिक कॉन्ट्रास्ट",
		voice: "बोलकर पुष्टि",
		logout: "लॉग आउट",
		account: "खाता",
		profile: "प्रोफ़ाइल",
		payments: "भुगतान",
		verified: "जाँचा हुआ मोबाइल",
		home: "घर",
		work: "काम",
		addPlace: "स्थान जोड़ें",
		emergency: "आपातकाल संपर्क",
		none: "अभी नहीं",
		navHome: "होम",
		navRides: "राइड",
		navOffers: "ऑफ़र",
		navSafety: "सुरक्षा",
		navAccount: "खाता",
		booked: "बुकिंग सहेज ली गई",
		cancelWhy: "रद्द क्यों कर रहे हैं?",
		operator: "ऑपरेटर",
		filterAll: "सभी",
		filterVillage: "गाँव",
		filterTown: "कस्बे",
		filterCity: "शहर"
	},
	ta: {
		tagline: "ஒவ்வொரு சாலை. ஒவ்வொரு கிராமம்.",
		proto: "முன்மாதிரி · மாதிரி கட்டணம் · நேரடி சேவை அல்ல",
		continue: "தொடரவும்",
		back: "பின்",
		skip: "தவிர்",
		next: "அடுத்து",
		save: "சேமி",
		cancel: "ரத்து",
		search: "தேடு",
		done: "முடிந்தது",
		from: "எங்கிருந்து",
		to: "எங்கே",
		now: "இப்போது",
		seats: "இருக்கைகள்",
		min: "நிமிடம்",
		start: "தொடங்கு",
		on1t: "இந்தியாவின் ஒவ்வொரு சாலைக்கும் ஒரு செயலி",
		on1b: "நகரம், சிறுநகரம், கிராமம் — சாலையைச் சொல்ல முடிந்த இடத்தில் பைக், ஆட்டோ, கார்.",
		on2t: "இங்கே முன்பதிவு, அல்லது அழைப்பில்",
		on2b: "ஸ்மார்ட்போன் கடினம் என்றால் ராா மேசைக்கு அழைக்கவும். ஒருவர் உங்களுடன் பதிவு செய்வார்.",
		on3t: "காணக்கூடிய பாதுகாப்பு",
		on3b: "ஓட்டுநர் பெயர், வண்டி எண், பயணப் பகிர்வு மற்றும் SOS பயணத்தின் பகுதி.",
		langTitle: "மொழியைத் தேர்ந்தெடுக்கவும்",
		langSub: "முன்பதிவு, பாதுகாப்பு, அழைப்பு-பதிவு இந்த மொழியில். கொள்கைகள் சான்றளிக்கும் வரை ஆங்கிலத்தில்.",
		phoneTitle: "உங்கள் கைபேசி எண்",
		phoneSub: "இந்திய எண்கள் மட்டும். இந்த டெமோ குறுஞ்செய்தி அனுப்பாது.",
		phoneBad: "6, 7, 8 அல்லது 9 இல் தொடங்கும் 10 இலக்க எண்ணை உள்ளிடவும்.",
		sendCode: "டெமோ குறியீடு",
		otpTitle: "6 இலக்க குறியீடு",
		otpSub: "டெமோ குறியீடு 482913. எந்த 6 இலக்கமும் தொடரும்.",
		verify: "சரிபார்",
		changeNumber: "எண்ணை மாற்று",
		nameTitle: "உங்களை எப்படி அழைப்பது?",
		nameSub: "ஓட்டுநரும் ராா ஆதரவும் மட்டுமே இதைக் காண்பர். இது பொதுவில் இல்லை.",
		namePh: "உங்கள் பெயர்",
		hello: "வணக்கம்",
		whereTo: "எங்கே போகலாம்?",
		pickup: "ஏறும் இடம்",
		drop: "சேரும் இடம்",
		sampleFix: "மாதிரி இடம் — உங்கள் உண்மை GPS அல்ல",
		callCta: "அழைப்பில் பயணம் பதிவு செய்",
		callSub: "பெரியவர்களுக்கும் பேசுவது எளிதானவர்களுக்கும்",
		bookPhone: "இந்த தொலைபேசியில் பதிவு",
		pickupTitle: "ஏறும் இடத்தை உறுதி செய்",
		dropTitle: "சேரும் இடத்தைத் தேர்வு செய்",
		saved: "சேமித்தவை",
		recent: "சமீபத்திய",
		landmarks: "அடையாளங்கள்",
		tryGps: "சாதன இருப்பிடம்",
		gpsNote: "முதலில் கேட்போம். அழைப்பு தானாக GPS அனுப்பாது. அனுமதித்தால் அருகிலுள்ள மாதிரி பகுதிக்குச் செல்வோம்.",
		samePlace: "ஏறும் இடமும் சேரும் இடமும் வேறுபட வேண்டும்.",
		searchPh: "நகரம், கிராமம், கோயில், பேருந்து நிறுத்தம்…",
		unmapped: "சில கிராமச் சாலைகள் முழுதும் வரைபடத்தில் இல்லை. அடையாளத்துடன் பதிவு செய்யலாம்.",
		villageNote: "வழிசெலுத்தல் முழுமையாக இல்லாமல் இருக்கலாம். ஓட்டுநர் உங்கள் அடையாளத்தைப் பயன்படுத்துவார்.",
		vehicleTitle: "வாகனத்தைத் தேர்வு செய்",
		bookNow: "இப்போது பதிவு",
		schedule: "நேரம் குறி",
		ready: "உள்ளது",
		limited: "இங்கு குறைவு",
		unavailable: "இந்த பயணத்திற்கு இல்லை",
		base: "அடிப்படை கட்டணம்",
		distance: "தூரம்",
		tax: "குறியீட்டு வரி (5%)",
		discount: "தள்ளுபடி",
		total: "மதிப்பிடப்பட்ட மொத்தம்",
		payWith: "பணம் செலுத்த",
		fareNote: "இது முன்மாதிரி மாதிரி கட்டணம். நேரடி கட்டணம் மாறலாம்.",
		confirmRide: "பதிவை உறுதி செய்",
		searching: "அருகிலுள்ள ஓட்டுநரைத் தேடுகிறோம்",
		driverFound: "ஓட்டுநர் ஒதுக்கப்பட்டார்",
		simDriver: "மாதிரி ஓட்டுநர் — நேரடி ஒதுக்கீடு அல்ல",
		trackSim: "மாதிரி நகர்வு — நேரடி GPS அல்ல",
		arriving: "ஏற்ற வருகிறார்",
		onTrip: "வழியில்",
		callDriver: "அழை",
		message: "செய்தி",
		shareTrip: "பயணத்தைப் பகிர்",
		sos: "SOS",
		cancelRide: "பயணத்தை ரத்து செய்",
		endDemo: "டெமோ பயணத்தை முடி",
		sosTitle: "அவசர SOS",
		sosBody: "இந்த டெமோ காவல்துறை அல்லது ஆம்புலன்ஸை அழைக்காது. எதுவும் இந்த சாதனத்தை விட்டு வெளியேறாது.",
		sosConfirm: "SOS டெமோவைக் காட்டு",
		sosDone: "டெமோ மட்டும். உண்மையான இணைப்புக்குப் பின் அவசர தொடர்புகளுக்குத் தெரிவிக்கப்படும்.",
		safeTitle: "பாதுகாப்பு முறை",
		callTitle: "அழைப்பில் பயணம் பதிவு செய்",
		callLead: "செயலி படிகள் இல்லை. ராா மேசையில் ஒருவர் உங்களுடன் பதிவு செய்கிறார்.",
		official: "அதிகாரப்பூர்வ பதிவு எண்",
		numberNote: "முன்மாதிரி எண். அழைப்பு மையத்துடன் இணையாது.",
		callNow: "இந்த எண்ணுக்கு அழை",
		how: "தொலைபேசி பதிவு எப்படி",
		how1: "ராா எண்ணுக்கு அழைக்கிறீர்கள்.",
		how2: "உங்கள் கைபேசி எண்ணைச் சொல்கிறீர்கள்.",
		how3: "கிராமம், பேருந்து நிறுத்தம், பள்ளி அல்லது கோயிலால் ஏறும் இடத்தைச் சொல்கிறீர்கள்.",
		how4: "மேசை சேருமிடம், வாகனம், கட்டணத்தை உறுதி செய்கிறது.",
		how5: "பயணம் உருவானதும் SMS அல்லது குரல் அழைப்பு வரும்.",
		callLang: "உங்கள் மொழியில் பேசலாம். மேசை இந்திய மொழிகளுக்கானது.",
		openLink: "மாதிரி இருப்பிட இணைப்பைத் திற",
		openLinkNote: "அழைப்பு GPS பகிராது. இணைப்பைத் திறந்து அனுமதித்தால் மட்டுமே பகிரும்.",
		openDesk: "அழைப்பு மேசையைப் பார்",
		consentTitle: "ராா மேசையுடன் இருப்பிடத்தைப் பகிரவா?",
		consentBody: "நீங்கள் அனுமதித்த பிறகே ஆப்பரேட்டர் இந்த முளையைக் காண்பார். மௌன கண்காணிப்பு இல்லை.",
		allowOnce: "ஒருமுறை அனுமதி",
		dontShare: "பகிர வேண்டாம்",
		sharingOn: "இருப்பிடப் பகிர்வு இயக்கத்தில்",
		sharingOff: "இருப்பிடம் பகிரப்படவில்லை",
		linkWaiting: "மேசை இருப்பிட இணைப்பை அனுப்பியது",
		upcoming: "வரவிருப்பவை",
		active: "நடப்பவை",
		completed: "முடிந்தவை",
		cancelled: "ரத்து",
		navHome: "முகப்பு",
		navRides: "பயணங்கள்",
		navOffers: "சலுகைகள்",
		navSafety: "பாதுகாப்பு",
		navAccount: "கணக்கு",
		settings: "அமைப்புகள்",
		language: "மொழி",
		simple: "எளிய முகப்பு",
		large: "பெரிய எழுத்து",
		contrast: "அதிக வேறுபாடு",
		voice: "குரல் உறுதி",
		logout: "வெளியேறு",
		account: "கணக்கு",
		profile: "சுயவிவரம்",
		payments: "கட்டணங்கள்",
		home: "வீடு",
		work: "வேலை",
		emergency: "அவசர தொடர்பு",
		supportTitle: "ஆதரவு",
		ruralTitle: "கிராம பதிவு உதவி",
		ruralBody: "செயலி கடினம் என்றால் மேசைக்கு அழைக்கவும். பேருந்து நிறுத்தம், பள்ளி, கோயில் அல்லது கடை அடையாளம் தயாராக இருக்கட்டும்.",
		booked: "பதிவு சேமிக்கப்பட்டது",
		filterAll: "அனைத்தும்",
		filterVillage: "கிராமங்கள்",
		filterTown: "சிறுநகரங்கள்",
		filterCity: "நகரங்கள்"
	},
	te: {
		tagline: "ప్రతి రోడ్డు. ప్రతి గ్రామం.",
		proto: "నమూనా · నమూనా ఛార్జీ · ఇది లైవ్ సేవ కాదు",
		continue: "కొనసాగించు",
		back: "వెనక్కి",
		skip: "దాటవేయి",
		next: "తర్వాత",
		save: "సేవ్",
		cancel: "రద్దు",
		search: "వెతుకు",
		done: "పూర్తి",
		start: "ప్రారంభించు",
		on1t: "భారతదేశపు ప్రతి రోడ్డుకు ఒక యాప్",
		on1b: "నగరం, పట్టణం, గ్రామం — రోడ్డు చెప్పగలిగిన చోట బైక్, ఆటో, క్యాబ్.",
		on2t: "ఇక్కడ బుక్ చేయండి, లేదా కాల్‌లో",
		on2b: "స్మార్ట్‌ఫోన్ కష్టమైతే రా డెస్క్‌కు కాల్ చేయండి. ఒక వ్యక్తి మీతో బుక్ చేస్తారు.",
		on3t: "కనిపించే భద్రత",
		on3b: "డ్రైవర్ పేరు, వాహన నంబర్, ట్రిప్ పంచుకోవడం మరియు SOS ప్రయాణంలో భాగం.",
		langTitle: "భాషను ఎంచుకోండి",
		langSub: "బుకింగ్, భద్రత, కాల్ బుకింగ్ ఈ భాషలో. విధానాలు ధృవీకరణ వరకు ఇంగ్లీషులో ఉంటాయి.",
		phoneTitle: "మీ మొబైల్ నంబర్",
		phoneSub: "భారత నంబర్లు మాత్రమే. ఈ డెమో SMS పంపదు.",
		phoneBad: "6, 7, 8 లేదా 9 తో మొదలయ్యే 10 అంకెల నంబర్ ఇవ్వండి.",
		sendCode: "డెమో కోడ్",
		otpTitle: "6 అంకెల కోడ్",
		otpSub: "డెమో కోడ్ 482913. ఏ 6 అంకెలైనా కొనసాగుతాయి.",
		verify: "ధృవీకరించు",
		changeNumber: "నంబర్ మార్చు",
		nameTitle: "మిమ్మల్ని ఏమని పిలవాలి?",
		nameSub: "డ్రైవర్ మరియు రా సపోర్ట్ మాత్రమే చూస్తారు. ఇది బహిరంగం కాదు.",
		namePh: "మీ పేరు",
		hello: "నమస్కారం",
		whereTo: "ఎక్కడికి?",
		pickup: "ఎక్కే చోటు",
		drop: "గమ్యం",
		sampleFix: "నమూనా స్థలం — మీ నిజమైన GPS కాదు",
		callCta: "కాల్ ద్వారా రైడ్ బుక్ చేయండి",
		callSub: "పెద్దవారికి మరియు మాట్లాడటం సులభమైనవారికి",
		bookPhone: "ఈ ఫోన్‌లో బుక్ చేయండి",
		vehicleTitle: "వాహనం ఎంచుకోండి",
		bookNow: "ఇప్పుడే బుక్",
		schedule: "తర్వాతకు",
		ready: "అందుబాటులో",
		limited: "ఇక్కడ తక్కువ",
		unavailable: "ఈ ప్రయాణానికి కాదు",
		confirmRide: "బుకింగ్ నిర్ధారించు",
		searching: "దగ్గరలో డ్రైవర్ వెతుకుతున్నాం",
		driverFound: "డ్రైవర్ కేటాయించబడ్డారు",
		simDriver: "నమూనా డ్రైవర్ — లైవ్ కేటాయింపు కాదు",
		trackSim: "నమూనా కదలిక — లైవ్ GPS కాదు",
		arriving: "తీసుకోవడానికి వస్తున్నారు",
		onTrip: "దారిలో",
		callDriver: "కాల్",
		message: "సందేశం",
		shareTrip: "ట్రిప్ పంచు",
		sos: "SOS",
		cancelRide: "రైడ్ రద్దు",
		sosTitle: "అత్యవసర SOS",
		sosBody: "ఈ డెమో పోలీసులను లేదా అంబులెన్స్‌ను పిలవదు. ఏదీ ఈ పరికరం దాటి వెళ్లదు.",
		sosConfirm: "SOS డెమో చూపు",
		sosDone: "డెమో మాత్రమే. నిజమైన అనుసంధానం తర్వాత అత్యవసర పరిచయాలకు తెలుస్తుంది.",
		safeTitle: "సేఫ్ మోడ్",
		callTitle: "కాల్ ద్వారా రైడ్ బుక్ చేయండి",
		callLead: "యాప్ అడుగులు లేవు. రా డెస్క్ వ్యక్తి మీతో బుక్ చేస్తారు.",
		official: "అధికారిక బుకింగ్ నంబర్",
		numberNote: "నమూనా నంబర్. కాల్ సెంటర్‌కు కలవదు.",
		callNow: "ఈ నంబర్‌కు కాల్ చేయండి",
		how: "ఫోన్ బుకింగ్ ఎలా",
		how1: "మీరు రా నంబర్‌కు కాల్ చేస్తారు.",
		how2: "మీ మొబైల్ నంబర్ చెబుతారు.",
		how3: "గ్రామం, బస్ స్టాప్, పాఠశాల లేదా గుడితో ఎక్కే చోటు చెబుతారు.",
		how4: "డెస్క్ గమ్యం, వాహనం, ఛార్జీని నిర్ధారిస్తుంది.",
		how5: "రైడ్ అయిన తర్వాత SMS లేదా వాయిస్ కాల్ వస్తుంది.",
		callLang: "మీ భాషలో మాట్లాడవచ్చు. డెస్క్ భారతీయ భాషల కోసం.",
		openLink: "నమూనా లొకేషన్ లింక్ తెరవండి",
		openLinkNote: "కాల్ GPS పంపదు. లింక్ తెరిచి అనుమతిస్తేనే పంచుతారు.",
		openDesk: "కాల్ డెస్క్ చూడండి",
		consentTitle: "రా డెస్క్‌తో లొకేషన్ పంచాలా?",
		consentBody: "మీరు అనుమతించిన తర్వాతే ఆపరేటర్ ఈ పిన్ చూస్తారు. నిశ్శబ్ద ట్రాకింగ్ లేదు.",
		allowOnce: "ఒకసారి అనుమతించు",
		dontShare: "పంచవద్దు",
		sharingOn: "లొకేషన్ పంచుతున్నాం",
		sharingOff: "లొకేషన్ పంచడం లేదు",
		linkWaiting: "డెస్క్ లొకేషన్ లింక్ పంపింది",
		navHome: "హోమ్",
		navRides: "రైడ్లు",
		navOffers: "ఆఫర్లు",
		navSafety: "భద్రత",
		navAccount: "ఖాతా",
		settings: "సెట్టింగ్స్",
		language: "భాష",
		simple: "సరళ హోమ్",
		large: "పెద్ద అక్షరం",
		contrast: "ఎక్కువ కాంట్రాస్ట్",
		voice: "మాటలో నిర్ధారణ",
		logout: "లాగ్ అవుట్",
		account: "ఖాతా",
		profile: "ప్రొఫైల్",
		payments: "చెల్లింపులు",
		home: "ఇల్లు",
		work: "పని",
		emergency: "అత్యవసర పరిచయం",
		supportTitle: "సహాయం",
		ruralTitle: "గ్రామ బుకింగ్ సహాయం",
		ruralBody: "యాప్ కష్టమైతే డెస్క్‌కు కాల్ చేయండి. బస్ స్టాప్, పాఠశాల, గుడి లేదా దుకాణం గుర్తు సిద్ధంగా ఉంచండి.",
		pickupTitle: "ఎక్కే చోటు నిర్ధారించు",
		dropTitle: "గమ్యం ఎంచుకోండి",
		searchPh: "నగరం, గ్రామం, గుడి, బస్ స్టాప్…",
		landmarks: "గుర్తులు",
		saved: "సేవ్ చేసినవి",
		recent: "ఇటీవలి",
		filterAll: "అన్నీ",
		filterVillage: "గ్రామాలు",
		filterTown: "పట్టణాలు",
		filterCity: "నగరాలు",
		booked: "బుకింగ్ సేవ్ అయింది"
	},
	kn: {
		tagline: "ಪ್ರತಿ ರಸ್ತೆ. ಪ್ರತಿ ಹಳ್ಳಿ.",
		proto: "ಮಾದರಿ · ಮಾದರಿ ದರ · ಇದು ಲೈವ್ ಸೇವೆ ಅಲ್ಲ",
		continue: "ಮುಂದುವರಿಸಿ",
		back: "ಹಿಂದೆ",
		skip: "ಬಿಡಿ",
		next: "ಮುಂದೆ",
		save: "ಉಳಿಸಿ",
		cancel: "ರದ್ದು",
		search: "ಹುಡುಕಿ",
		done: "ಆಯಿತು",
		start: "ಪ್ರಾರಂಭ",
		on1t: "ಭಾರತದ ಪ್ರತಿ ರಸ್ತೆಗೆ ಒಂದು ಅಪ್ಲಿಕೇಶನ್",
		on1b: "ನಗರ, ಪಟ್ಟಣ, ಹಳ್ಳಿ — ರಸ್ತೆಯನ್ನು ಹೇಳಬಹುದಾದಲ್ಲಿ ಬೈಕ್, ಆಟೋ, ಕ್ಯಾಬ್.",
		on2t: "ಇಲ್ಲಿ ಬುಕ್ ಮಾಡಿ, ಅಥವಾ ಕರೆಯಲ್ಲಿ",
		on2b: "ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಕಷ್ಟವಾದರೆ ರಾ ಡೆಸ್ಕ್‌ಗೆ ಕರೆ ಮಾಡಿ. ಒಬ್ಬರು ನಿಮ್ಮೊಂದಿಗೆ ಬುಕ್ ಮಾಡುತ್ತಾರೆ.",
		on3t: "ಕಾಣುವ ಸುರಕ್ಷತೆ",
		on3b: "ಚಾಲಕ ಹೆಸರು, ವಾಹನ ಸಂಖ್ಯೆ, ಪ್ರಯಾಣ ಹಂಚಿಕೆ ಮತ್ತು SOS ಪ್ರಯಾಣದ ಭಾಗ.",
		langTitle: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
		langSub: "ಬುಕಿಂಗ್, ಸುರಕ್ಷತೆ ಮತ್ತು ಕರೆ-ಬುಕಿಂಗ್ ಈ ಭಾಷೆಯಲ್ಲಿ. ನೀತಿಗಳು ಪ್ರಮಾಣಿತ ಅನುವಾದದವರೆಗೆ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿರುತ್ತವೆ.",
		phoneTitle: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
		phoneSub: "ಭಾರತೀಯ ಸಂಖ್ಯೆಗಳು ಮಾತ್ರ. ಈ ಡೆಮೊ SMS ಕಳುಹಿಸುವುದಿಲ್ಲ.",
		phoneBad: "6, 7, 8 ಅಥವಾ 9 ರಿಂದ ಆರಂಭವಾಗುವ 10 ಅಂಕಿಯ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
		sendCode: "ಡೆಮೊ ಕೋಡ್",
		otpTitle: "6 ಅಂಕಿಯ ಕೋಡ್",
		otpSub: "ಡೆಮೊ ಕೋಡ್ 482913. ಯಾವುದೇ 6 ಅಂಕಿಗಳು ಮುಂದುವರಿಯುತ್ತವೆ.",
		verify: "ಪರಿಶೀಲಿಸಿ",
		changeNumber: "ಸಂಖ್ಯೆ ಬದಲಿಸಿ",
		nameTitle: "ನಿಮ್ಮನ್ನು ಏನೆಂದು ಕರೆಯೋಣ?",
		nameSub: "ಚಾಲಕ ಮತ್ತು ರಾ ಬೆಂಬಲ ಮಾತ್ರ ಇದನ್ನು ನೋಡುತ್ತಾರೆ. ಇದು ಸಾರ್ವಜನಿಕವಲ್ಲ.",
		namePh: "ನಿಮ್ಮ ಹೆಸರು",
		hello: "ನಮಸ್ಕಾರ",
		whereTo: "ಎಲ್ಲಿಗೆ?",
		pickup: "ಏರುವ ಸ್ಥಳ",
		drop: "ತಲುಪುವ ಸ್ಥಳ",
		sampleFix: "ಮಾದರಿ ಸ್ಥಳ — ನಿಮ್ಮ ನಿಜವಾದ GPS ಅಲ್ಲ",
		callCta: "ಕರೆಯಿಂದ ಸವಾರಿ ಬುಕ್ ಮಾಡಿ",
		callSub: "ಹಿರಿಯರಿಗೆ ಮತ್ತು ಮಾತನಾಡುವುದು ಸುಲಭವಾದವರಿಗೆ",
		bookPhone: "ಈ ಫೋನ್‌ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ",
		vehicleTitle: "ವಾಹನ ಆಯ್ಕೆಮಾಡಿ",
		bookNow: "ಈಗ ಬುಕ್ ಮಾಡಿ",
		schedule: "ನಂತರಕ್ಕೆ",
		ready: "ಲಭ್ಯ",
		limited: "ಇಲ್ಲಿ ಕಡಿಮೆ",
		unavailable: "ಈ ಪ್ರಯಾಣಕ್ಕೆ ಇಲ್ಲ",
		confirmRide: "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ",
		searching: "ಹತ್ತಿರದ ಚಾಲಕನನ್ನು ಹುಡುಕುತ್ತಿದ್ದೇವೆ",
		driverFound: "ಚಾಲಕ ನಿಯೋಜಿತ",
		simDriver: "ಮಾದರಿ ಚಾಲಕ — ಲೈವ್ ನಿಯೋಜನೆ ಅಲ್ಲ",
		trackSim: "ಮಾದರಿ ಚಲನೆ — ಲೈವ್ GPS ಅಲ್ಲ",
		arriving: "ಕರೆದುಕೊಳ್ಳಲು ಬರುತ್ತಿದ್ದಾರೆ",
		onTrip: "ದಾರಿಯಲ್ಲಿ",
		callDriver: "ಕರೆ",
		message: "ಸಂದೇಶ",
		shareTrip: "ಪ್ರಯಾಣ ಹಂಚಿ",
		sos: "SOS",
		cancelRide: "ಸವಾರಿ ರದ್ದು",
		sosTitle: "ತುರ್ತು SOS",
		sosBody: "ಈ ಡೆಮೊ ಪೊಲೀಸ್ ಅಥವಾ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡುವುದಿಲ್ಲ. ಏನೂ ಈ ಸಾಧನವನ್ನು ಬಿಟ್ಟು ಹೋಗುವುದಿಲ್ಲ.",
		sosConfirm: "SOS ಡೆಮೊ ತೋರಿಸಿ",
		sosDone: "ಡೆಮೊ ಮಾತ್ರ. ನಿಜವಾದ ಜೋಡಣೆಯ ನಂತರ ತುರ್ತು ಸಂಪರ್ಕಗಳಿಗೆ ತಿಳಿಸಲಾಗುತ್ತದೆ.",
		safeTitle: "ಸುರಕ್ಷಿತ ಮೋಡ್",
		callTitle: "ಕರೆಯಿಂದ ಸವಾರಿ ಬುಕ್ ಮಾಡಿ",
		callLead: "ಅಪ್ಲಿಕೇಶನ್ ಹಂತಗಳಿಲ್ಲ. ರಾ ಡೆಸ್ಕ್ ವ್ಯಕ್ತಿ ನಿಮ್ಮೊಂದಿಗೆ ಬುಕ್ ಮಾಡುತ್ತಾರೆ.",
		official: "ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಸಂಖ್ಯೆ",
		numberNote: "ಮಾದರಿ ಸಂಖ್ಯೆ. ಕರೆ ಕೇಂದ್ರಕ್ಕೆ ಸಂಪರ್ಕಿಸುವುದಿಲ್ಲ.",
		callNow: "ಈ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ",
		how: "ಫೋನ್ ಬುಕಿಂಗ್ ಹೇಗೆ",
		how1: "ನೀವು ರಾ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡುತ್ತೀರಿ.",
		how2: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹೇಳುತ್ತೀರಿ.",
		how3: "ಹಳ್ಳಿ, ಬಸ್ ನಿಲ್ದಾಣ, ಶಾಲೆ ಅಥವಾ ದೇವಸ್ಥಾನದಿಂದ ಏರುವ ಸ್ಥಳ ಹೇಳುತ್ತೀರಿ.",
		how4: "ಡೆಸ್ಕ್ ತಲುಪುವ ಸ್ಥಳ, ವಾಹನ ಮತ್ತು ದರವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
		how5: "ಸವಾರಿ ಆದ ನಂತರ SMS ಅಥವಾ ಧ್ವನಿ ಕರೆ ಬರುತ್ತದೆ.",
		callLang: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಬಹುದು. ಡೆಸ್ಕ್ ಭಾರತೀಯ ಭಾಷೆಗಳಿಗಾಗಿ.",
		openLink: "ಮಾದರಿ ಸ್ಥಳ ಲಿಂಕ್ ತೆರೆಯಿರಿ",
		openLinkNote: "ಕರೆ GPS ಹಂಚುವುದಿಲ್ಲ. ಲಿಂಕ್ ತೆರೆದು ಅನುಮತಿಸಿದರೆ ಮಾತ್ರ ಹಂಚಿಕೆ.",
		openDesk: "ಕರೆ ಡೆಸ್ಕ್ ನೋಡಿ",
		consentTitle: "ರಾ ಡೆಸ್ಕ್ ಜೊತೆ ಸ್ಥಳ ಹಂಚುವಿರಾ?",
		consentBody: "ನೀವು ಅನುಮತಿಸಿದ ನಂತರವೇ ಆಪರೇಟರ್ ಈ ಪಿನ್ ನೋಡುತ್ತಾರೆ. ಮೌನ ಟ್ರ್ಯಾಕಿಂಗ್ ಇಲ್ಲ.",
		allowOnce: "ಒಮ್ಮೆ ಅನುಮತಿಸಿ",
		dontShare: "ಹಂಚಬೇಡಿ",
		sharingOn: "ಸ್ಥಳ ಹಂಚಿಕೆ ಆನ್ ಆಗಿದೆ",
		sharingOff: "ಸ್ಥಳ ಹಂಚುತ್ತಿಲ್ಲ",
		linkWaiting: "ಡೆಸ್ಕ್ ಸ್ಥಳ ಲಿಂಕ್ ಕಳುಹಿಸಿದೆ",
		navHome: "ಮುಖಪುಟ",
		navRides: "ಸವಾರಿಗಳು",
		navOffers: "ಆಫರ್‌ಗಳು",
		navSafety: "ಸುರಕ್ಷತೆ",
		navAccount: "ಖಾತೆ",
		settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
		language: "ಭಾಷೆ",
		simple: "ಸರಳ ಮುಖಪುಟ",
		large: "ದೊಡ್ಡ ಅಕ್ಷರ",
		contrast: "ಹೆಚ್ಚು ಕಾಂಟ್ರಾಸ್ಟ್",
		voice: "ಧ್ವನಿ ದೃಢೀಕರಣ",
		logout: "ಲಾಗ್ ಔಟ್",
		account: "ಖಾತೆ",
		profile: "ಪ್ರೊಫೈಲ್",
		payments: "ಪಾವತಿಗಳು",
		home: "ಮನೆ",
		work: "ಕೆಲಸ",
		emergency: "ತುರ್ತು ಸಂಪರ್ಕ",
		supportTitle: "ಬೆಂಬಲ",
		ruralTitle: "ಹಳ್ಳಿ ಬುಕಿಂಗ್ ಸಹಾಯ",
		ruralBody: "ಅಪ್ಲಿಕೇಶನ್ ಕಷ್ಟವಾದರೆ ಡೆಸ್ಕ್‌ಗೆ ಕರೆ ಮಾಡಿ. ಬಸ್ ನಿಲ್ದಾಣ, ಶಾಲೆ, ದೇವಸ್ಥಾನ ಅಥವಾ ಅಂಗಡಿ ಗುರುತು ಸಿದ್ಧವಿಡಿ.",
		pickupTitle: "ಏರುವ ಸ್ಥಳ ಖಚಿತಪಡಿಸಿ",
		dropTitle: "ತಲುಪುವ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ",
		searchPh: "ನಗರ, ಹಳ್ಳಿ, ದೇವಸ್ಥಾನ, ಬಸ್ ನಿಲ್ದಾಣ…",
		landmarks: "ಗುರುತುಗಳು",
		saved: "ಉಳಿಸಿದವು",
		recent: "ಇತ್ತೀಚಿನ",
		filterAll: "ಎಲ್ಲಾ",
		filterVillage: "ಹಳ್ಳಿಗಳು",
		filterTown: "ಪಟ್ಟಣಗಳು",
		filterCity: "ನಗರಗಳು",
		booked: "ಬುಕಿಂಗ್ ಉಳಿಸಲಾಗಿದೆ"
	},
	ml: {
		tagline: "ഓരോ റോഡും. ഓരോ ഗ്രാമവും.",
		proto: "മാതൃക · മാതൃക നിരക്ക് · ഇത് തത്സമയ സേവനമല്ല",
		continue: "തുടരുക",
		back: "പിന്നോട്ട്",
		skip: "ഒഴിവാക്കുക",
		next: "അടുത്തത്",
		save: "സംരക്ഷിക്കുക",
		cancel: "റദ്ദാക്കുക",
		search: "തിരയുക",
		done: "കഴിഞ്ഞു",
		start: "തുടങ്ങുക",
		on1t: "ഇന്ത്യയിലെ ഓരോ റോഡിനും ഒരു ആപ്പ്",
		on1b: "നഗരം, പട്ടണം, ഗ്രാമം — റോഡ് പറയാൻ കഴിയുന്നിടത്ത് ബൈക്ക്, ഓട്ടോ, ക്യാബ്.",
		on2t: "ഇവിടെ ബുക്ക് ചെയ്യുക, അല്ലെങ്കിൽ കോളിൽ",
		on2b: "സ്മാർട്ട്‌ഫോൺ ബുദ്ധിമുട്ടാണെങ്കിൽ റാ ഡെസ്കിലേക്ക് വിളിക്കുക. ഒരാൾ നിങ്ങളോടൊപ്പം ബുക്ക് ചെയ്യും.",
		on3t: "കാണാവുന്ന സുരക്ഷ",
		on3b: "ഡ്രൈവർ പേര്, വാഹന നമ്പർ, യാത്ര പങ്കിടൽ, SOS എന്നിവ യാത്രയുടെ ഭാഗമാണ്.",
		langTitle: "ഭാഷ തിരഞ്ഞെടുക്കുക",
		langSub: "ബുക്കിംഗ്, സുരക്ഷ, കോൾ ബുക്കിംഗ് ഈ ഭാഷയിൽ. നയങ്ങൾ സാക്ഷ്യപ്പെടുത്തിയ വിവർത്തനം വരെ ഇംഗ്ലീഷിൽ.",
		phoneTitle: "നിങ്ങളുടെ മൊബൈൽ നമ്പർ",
		phoneSub: "ഇന്ത്യൻ നമ്പറുകൾ മാത്രം. ഈ ഡെമോ SMS അയയ്ക്കില്ല.",
		phoneBad: "6, 7, 8 അല്ലെങ്കിൽ 9 കൊണ്ട് തുടങ്ങുന്ന 10 അക്ക നമ്പർ നൽകുക.",
		sendCode: "ഡെമോ കോഡ്",
		otpTitle: "6 അക്ക കോഡ്",
		otpSub: "ഡെമോ കോഡ് 482913. ഏത് 6 അക്കവും മതി.",
		verify: "സ്ഥിരീകരിക്കുക",
		changeNumber: "നമ്പർ മാറ്റുക",
		nameTitle: "നിങ്ങളെ എന്ത് വിളിക്കണം?",
		nameSub: "ഡ്രൈവറും റാ പിന്തുണയും മാത്രമേ ഇത് കാണൂ. ഇത് പൊതുവായതല്ല.",
		namePh: "നിങ്ങളുടെ പേര്",
		hello: "നമസ്കാരം",
		whereTo: "എവിടേക്ക്?",
		pickup: "കയറുന്ന സ്ഥലം",
		drop: "ലക്ഷ്യം",
		sampleFix: "മാതൃക സ്ഥലം — നിങ്ങളുടെ യഥാർത്ഥ GPS അല്ല",
		callCta: "കോൾ വഴി യാത്ര ബുക്ക് ചെയ്യുക",
		callSub: "മുതിർന്നവർക്കും സംസാരിക്കാൻ എളുപ്പമുള്ളവർക്കും",
		bookPhone: "ഈ ഫോണിൽ ബുക്ക് ചെയ്യുക",
		vehicleTitle: "വാഹനം തിരഞ്ഞെടുക്കുക",
		bookNow: "ഇപ്പോൾ ബുക്ക് ചെയ്യുക",
		schedule: "പിന്നീട്",
		ready: "ലഭ്യം",
		limited: "ഇവിടെ കുറവ്",
		unavailable: "ഈ യാത്രയ്ക്ക് ഇല്ല",
		confirmRide: "ബുക്കിംഗ് ഉറപ്പാക്കുക",
		searching: "അടുത്ത ഡ്രൈവറെ തിരയുന്നു",
		driverFound: "ഡ്രൈവറെ നിശ്ചയിച്ചു",
		simDriver: "മാതൃക ഡ്രൈവർ — തത്സമയ നിയമനമല്ല",
		trackSim: "മാതൃക നീക്കം — തത്സമയ GPS അല്ല",
		arriving: "കയറ്റാൻ എത്തുന്നു",
		onTrip: "വഴിയിൽ",
		callDriver: "വിളിക്കുക",
		message: "സന്ദേശം",
		shareTrip: "യാത്ര പങ്കിടുക",
		sos: "SOS",
		cancelRide: "യാത്ര റദ്ദാക്കുക",
		sosTitle: "അടിയന്തര SOS",
		sosBody: "ഈ ഡെമോ പോലീസിനെയോ ആംബുലൻസിനെയോ വിളിക്കില്ല. ഒന്നും ഈ ഉപകരണം വിട്ട് പോകില്ല.",
		sosConfirm: "SOS ഡെമോ കാണിക്കുക",
		sosDone: "ഡെമോ മാത്രം. യഥാർത്ഥ ബന്ധത്തിന് ശേഷം അടിയന്തര കോൺടാക്റ്റുകളെ അറിയിക്കും.",
		safeTitle: "സുരക്ഷാ മോഡ്",
		callTitle: "കോൾ വഴി യാത്ര ബുക്ക് ചെയ്യുക",
		callLead: "ആപ്പ് ഘട്ടങ്ങളില്ല. റാ ഡെസ്കിലെ ഒരാൾ നിങ്ങളോടൊപ്പം ബുക്ക് ചെയ്യും.",
		official: "ഔദ്യോഗിക ബുക്കിംഗ് നമ്പർ",
		numberNote: "മാതൃക നമ്പർ. കോൾ സെന്ററിലേക്ക് ബന്ധിപ്പിക്കില്ല.",
		callNow: "ഈ നമ്പറിലേക്ക് വിളിക്കുക",
		how: "ഫോൺ ബുക്കിംഗ് എങ്ങനെ",
		how1: "നിങ്ങൾ റാ നമ്പറിലേക്ക് വിളിക്കുന്നു.",
		how2: "മൊബൈൽ നമ്പർ പറയുന്നു.",
		how3: "ഗ്രാമം, ബസ് സ്റ്റോപ്പ്, സ്കൂൾ അല്ലെങ്കിൽ ക്ഷേത്രം കൊണ്ട് കയറുന്ന സ്ഥലം പറയുന്നു.",
		how4: "ഡെസ്ക് ലക്ഷ്യം, വാഹനം, നിരക്ക് ഉറപ്പാക്കുന്നു.",
		how5: "യാത്ര ഉണ്ടായാൽ SMS അല്ലെങ്കിൽ വോയ്‌സ് കോൾ വരും.",
		callLang: "നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കാം. ഡെസ്ക് ഇന്ത്യൻ ഭാഷകൾക്കായി.",
		openLink: "മാതൃക ലൊക്കേഷൻ ലിങ്ക് തുറക്കുക",
		openLinkNote: "കോൾ GPS പങ്കിടില്ല. ലിങ്ക് തുറന്ന് അനുവദിച്ചാൽ മാത്രം.",
		openDesk: "കോൾ ഡെസ്ക് കാണുക",
		consentTitle: "റാ ഡെസ്കുമായി സ്ഥലം പങ്കിടണോ?",
		consentBody: "നിങ്ങൾ അനുവദിച്ച ശേഷം മാത്രമേ ഓപ്പറേറ്റർ ഈ പിൻ കാണൂ. നിശബ്ദ ട്രാക്കിംഗ് ഇല്ല.",
		allowOnce: "ഒരിക്കൽ അനുവദിക്കുക",
		dontShare: "പങ്കിടരുത്",
		sharingOn: "സ്ഥലം പങ്കിടുന്നു",
		sharingOff: "സ്ഥലം പങ്കിടുന്നില്ല",
		linkWaiting: "ഡെസ്ക് ലൊക്കേഷൻ ലിങ്ക് അയച്ചു",
		navHome: "ഹോം",
		navRides: "യാത്രകൾ",
		navOffers: "ഓഫറുകൾ",
		navSafety: "സുരക്ഷ",
		navAccount: "അക്കൗണ്ട്",
		settings: "ക്രമീകരണം",
		language: "ഭാഷ",
		simple: "ലളിത ഹോം",
		large: "വലിയ അക്ഷരം",
		contrast: "കൂടുതൽ കോൺട്രാസ്റ്റ്",
		voice: "ശബ്ദ സ്ഥിരീകരണം",
		logout: "ലോഗ് ഔട്ട്",
		account: "അക്കൗണ്ട്",
		profile: "പ്രൊഫൈൽ",
		payments: "പണമടയ്ക്കൽ",
		home: "വീട്",
		work: "ജോലി",
		emergency: "അടിയന്തര ബന്ധം",
		supportTitle: "സഹായം",
		ruralTitle: "ഗ്രാമ ബുക്കിംഗ് സഹായം",
		ruralBody: "ആപ്പ് ബുദ്ധിമുട്ടാണെങ്കിൽ ഡെസ്കിലേക്ക് വിളിക്കുക. ബസ് സ്റ്റോപ്പ്, സ്കൂൾ, ക്ഷേത്രം അല്ലെങ്കിൽ കട എന്ന അടയാളം തയ്യാറാക്കുക.",
		pickupTitle: "കയറുന്ന സ്ഥലം ഉറപ്പാക്കുക",
		dropTitle: "ലക്ഷ്യം തിരഞ്ഞെടുക്കുക",
		searchPh: "നഗരം, ഗ്രാമം, ക്ഷേത്രം, ബസ് സ്റ്റോപ്പ്…",
		landmarks: "അടയാളങ്ങൾ",
		saved: "സംരക്ഷിച്ചവ",
		recent: "സമീപകാലം",
		filterAll: "എല്ലാം",
		filterVillage: "ഗ്രാമങ്ങൾ",
		filterTown: "പട്ടണങ്ങൾ",
		filterCity: "നഗരങ്ങൾ",
		booked: "ബുക്കിംഗ് സംരക്ഷിച്ചു"
	},
	bn: {
		tagline: "প্রতিটি রাস্তা। প্রতিটি গ্রাম।",
		proto: "প্রোটোটাইপ · নমুনা ভাড়া · এটি লাইভ সেবা নয়",
		continue: "এগিয়ে যান",
		back: "পিছনে",
		skip: "এড়িয়ে যান",
		next: "পরবর্তী",
		save: "সেভ",
		cancel: "বাতিল",
		search: "খুঁজুন",
		done: "হয়ে গেছে",
		start: "শুরু করুন",
		on1t: "ভারতের প্রতিটি রাস্তার জন্য একটি অ্যাপ",
		on1b: "শহর, মফস্বল, গ্রাম — যেখানে রাস্তা বলা যায়, সেখানে বাইক, অটো ও ক্যাব।",
		on2t: "এখানে বুক করুন, অথবা ফোনে",
		on2b: "স্মার্টফোন কঠিন হলে রাহ ডেস্কে কল করুন। একজন আপনার সঙ্গে বুক করবেন।",
		on3t: "যে নিরাপত্তা দেখা যায়",
		on3b: "চালকের নাম, গাড়ির নম্বর, যাত্রা ভাগ এবং SOS যাত্রার অংশ।",
		langTitle: "ভাষা বেছে নিন",
		langSub: "বুকিং, নিরাপত্তা ও কল-বুকিং এই ভাষায়। নীতিমালা প্রমাণিত অনুবাদ পর্যন্ত ইংরেজিতে থাকবে।",
		phoneTitle: "আপনার মোবাইল নম্বর",
		phoneSub: "শুধু ভারতীয় নম্বর। এই ডেমো SMS পাঠায় না।",
		phoneBad: "৬, ৭, ৮ বা ৯ দিয়ে শুরু ১০ সংখ্যার নম্বর দিন।",
		sendCode: "ডেমো কোড",
		otpTitle: "৬ সংখ্যার কোড",
		otpSub: "ডেমো কোড 482913। যেকোনো ৬ সংখ্যা চলবে।",
		verify: "যাচাই",
		changeNumber: "নম্বর বদলান",
		nameTitle: "আপনাকে কী বলে ডাকব?",
		nameSub: "শুধু চালক ও রাহ সহায়তা এটি দেখবেন। এটি সর্বজনীন নয়।",
		namePh: "আপনার নাম",
		hello: "নমস্কার",
		whereTo: "কোথায় যাবেন?",
		pickup: "ওঠার জায়গা",
		drop: "গন্তব্য",
		sampleFix: "নমুনা অবস্থান — আপনার আসল GPS নয়",
		callCta: "কল করে রাইড বুক করুন",
		callSub: "প্রবীণদের এবং যাদের কথা বলা সহজ তাদের জন্য",
		bookPhone: "এই ফোনে বুক করুন",
		vehicleTitle: "গাড়ি বেছে নিন",
		bookNow: "এখনই বুক",
		schedule: "পরে",
		ready: "পাওয়া যাবে",
		limited: "এখানে কম",
		unavailable: "এই যাত্রায় নয়",
		confirmRide: "বুকিং নিশ্চিত করুন",
		searching: "কাছের চালক খুঁজছি",
		driverFound: "চালক নির্ধারিত",
		simDriver: "নমুনা চালক — লাইভ অ্যাসাইনমেন্ট নয়",
		trackSim: "নমুনা চলাচল — লাইভ GPS নয়",
		arriving: "নিতে আসছেন",
		onTrip: "পথে",
		callDriver: "কল",
		message: "বার্তা",
		shareTrip: "যাত্রা ভাগ করুন",
		sos: "SOS",
		cancelRide: "রাইড বাতিল",
		sosTitle: "জরুরি SOS",
		sosBody: "এই ডেমো পুলিশ বা অ্যাম্বুলেন্সকে কল করবে না। কিছুই এই ডিভাইসের বাইরে যায় না।",
		sosConfirm: "SOS ডেমো দেখান",
		sosDone: "শুধু ডেমো। আসল সংযোগের পর জরুরি যোগাযোগদের জানানো হবে।",
		safeTitle: "সেফ মোড",
		callTitle: "কল করে রাইড বুক করুন",
		callLead: "অ্যাপের ধাপ নেই। রাহ ডেস্কের একজন আপনার সঙ্গে বুক করেন।",
		official: "অফিসিয়াল বুকিং নম্বর",
		numberNote: "প্রোটোটাইপ নম্বর। কল সেন্টারে যুক্ত হয় না।",
		callNow: "এই নম্বরে কল করুন",
		how: "ফোন বুকিং কীভাবে হয়",
		how1: "আপনি রাহ নম্বরে কল করেন।",
		how2: "মোবাইল নম্বর বলেন।",
		how3: "গ্রাম, বাস স্টপ, স্কুল বা মন্দির দিয়ে ওঠার জায়গা বলেন।",
		how4: "ডেস্ক গন্তব্য, গাড়ি ও ভাড়া নিশ্চিত করে।",
		how5: "রাইড হলে SMS বা ভয়েস কল আসে।",
		callLang: "আপনি নিজের ভাষায় বলতে পারেন। ডেস্ক ভারতীয় ভাষার জন্য।",
		openLink: "নমুনা লোকেশন লিঙ্ক খুলুন",
		openLinkNote: "কল GPS পাঠায় না। লিঙ্ক খুলে অনুমতি দিলে তবেই শেয়ার হয়।",
		openDesk: "কল ডেস্ক দেখুন",
		consentTitle: "রাহ ডেস্কের সঙ্গে লোকেশন শেয়ার করবেন?",
		consentBody: "আপনি অনুমতি দিলে তবেই অপারেটর এই পিন দেখেন। চুপিসারে ট্র্যাকিং নেই।",
		allowOnce: "একবার অনুমতি দিন",
		dontShare: "শেয়ার করবেন না",
		sharingOn: "লোকেশন শেয়ার চালু",
		sharingOff: "লোকেশন শেয়ার হচ্ছে না",
		linkWaiting: "ডেস্ক লোকেশন লিঙ্ক পাঠিয়েছে",
		navHome: "হোম",
		navRides: "রাইড",
		navOffers: "অফার",
		navSafety: "নিরাপত্তা",
		navAccount: "অ্যাকাউন্ট",
		settings: "সেটিংস",
		language: "ভাষা",
		simple: "সহজ হোম",
		large: "বড় অক্ষর",
		contrast: "বেশি কনট্রাস্ট",
		voice: "কথায় নিশ্চিতি",
		logout: "লগ আউট",
		account: "অ্যাকাউন্ট",
		profile: "প্রোফাইল",
		payments: "পেমেন্ট",
		home: "বাড়ি",
		work: "কাজ",
		emergency: "জরুরি যোগাযোগ",
		supportTitle: "সহায়তা",
		ruralTitle: "গ্রামের বুকিং সহায়তা",
		ruralBody: "অ্যাপ কঠিন লাগলে ডেস্কে কল করুন। বাস স্টপ, স্কুল, মন্দির বা দোকানের চিহ্ন তৈরি রাখুন।",
		pickupTitle: "ওঠার জায়গা নিশ্চিত করুন",
		dropTitle: "গন্তব্য বেছে নিন",
		searchPh: "শহর, গ্রাম, মন্দির, বাস স্টপ…",
		landmarks: "চিহ্ন",
		saved: "সেভ করা",
		recent: "সাম্প্রতিক",
		filterAll: "সব",
		filterVillage: "গ্রাম",
		filterTown: "মফস্বল",
		filterCity: "শহর",
		booked: "বুকিং সেভ হয়েছে"
	},
	mr: {
		tagline: "प्रत्येक रस्ता. प्रत्येक गाव.",
		proto: "नमुना · नमुना भाडे · ही थेट सेवा नाही",
		continue: "पुढे",
		back: "मागे",
		skip: "वगळा",
		next: "पुढे",
		save: "जतन करा",
		cancel: "रद्द",
		search: "शोधा",
		done: "झाले",
		start: "सुरू करा",
		on1t: "भारतातील प्रत्येक रस्त्यासाठी एक अॅप",
		on1b: "शहर, तालुका, गाव — रस्ता सांगता येईल तिथे बाइक, ऑटो आणि कॅब.",
		on2t: "इथे बुक करा, किंवा कॉलने",
		on2b: "स्मार्टफोन अवघड असेल तर राह डेस्कला कॉल करा. एक व्यक्ती तुमच्यासोबत बुक करेल.",
		on3t: "दिसणारी सुरक्षितता",
		on3b: "चालकाचे नाव, गाडी क्रमांक, प्रवास शेअर आणि SOS प्रवासाचा भाग आहेत.",
		langTitle: "भाषा निवडा",
		langSub: "बुकिंग, सुरक्षितता आणि कॉल-बुकिंग या भाषेत. धोरणे प्रमाणित भाषांतरापर्यंत इंग्रजीत.",
		phoneTitle: "तुमचा मोबाइल नंबर",
		phoneSub: "फक्त भारतीय क्रमांक. हे डेमो SMS पाठवत नाही.",
		phoneBad: "६, ७, ८ किंवा ९ ने सुरू होणारा १० अंकी क्रमांक द्या.",
		sendCode: "डेमो कोड",
		otpTitle: "६ अंकी कोड",
		otpSub: "डेमो कोड 482913. कोणतेही ६ अंक चालतील.",
		verify: "तपासा",
		changeNumber: "क्रमांक बदला",
		nameTitle: "आम्ही तुम्हाला काय म्हणू?",
		nameSub: "फक्त चालक आणि राह सहाय्य हे पाहतील. हे सार्वजनिक नाही.",
		namePh: "तुमचे नाव",
		hello: "नमस्कार",
		whereTo: "कुठे जायचे?",
		pickup: "उचलण्याची जागा",
		drop: "गंतव्य",
		sampleFix: "नमुना ठिकाण — तुमचे खरे GPS नाही",
		callCta: "कॉलने राइड बुक करा",
		callSub: "ज्येष्ठांसाठी आणि ज्यांना बोलणे सोपे आहे त्यांच्यासाठी",
		bookPhone: "या फोनवर बुक करा",
		vehicleTitle: "वाहन निवडा",
		bookNow: "आता बुक करा",
		schedule: "नंतरसाठी",
		ready: "उपलब्ध",
		limited: "इथे कमी",
		unavailable: "या प्रवासासाठी नाही",
		confirmRide: "बुकिंग निश्चित करा",
		searching: "जवळचा चालक शोधत आहोत",
		driverFound: "चालक नेमला",
		simDriver: "नमुना चालक — थेट नेमणूक नाही",
		trackSim: "नमुना हालचाल — थेट GPS नाही",
		arriving: "उचलण्यासाठी येत आहेत",
		onTrip: "वाटेत",
		callDriver: "कॉल",
		message: "संदेश",
		shareTrip: "प्रवास शेअर करा",
		sos: "SOS",
		cancelRide: "राइड रद्द करा",
		sosTitle: "आपत्कालीन SOS",
		sosBody: "हे डेमो पोलीस किंवा रुग्णवाहिकेला कॉल करणार नाही. काहीही या डिव्हाइसबाहेर जात नाही.",
		sosConfirm: "SOS डेमो दाखवा",
		sosDone: "फक्त डेमो. खऱ्या जोडणीनंतर आपत्कालीन संपर्कांना कळवले जाईल.",
		safeTitle: "सेफ मोड",
		callTitle: "कॉलने राइड बुक करा",
		callLead: "अॅपचे टप्पे नाहीत. राह डेस्कवरील व्यक्ती तुमच्यासोबत बुक करते.",
		official: "अधिकृत बुकिंग क्रमांक",
		numberNote: "नमुना क्रमांक. कॉल सेंटरशी जोडत नाही.",
		callNow: "या क्रमांकावर कॉल करा",
		how: "फोन बुकिंग कसे होते",
		how1: "तुम्ही राह क्रमांकावर कॉल करता.",
		how2: "मोबाइल क्रमांक सांगता.",
		how3: "गाव, बस थांबा, शाळा किंवा मंदिराने उचलण्याची जागा सांगता.",
		how4: "डेस्क गंतव्य, वाहन आणि भाडे निश्चित करते.",
		how5: "राइड झाल्यावर SMS किंवा व्हॉइस कॉल येतो.",
		callLang: "तुम्ही तुमच्या भाषेत बोलू शकता. डेस्क भारतीय भाषांसाठी आहे.",
		openLink: "नमुना लोकेशन लिंक उघडा",
		openLinkNote: "कॉल GPS पाठवत नाही. लिंक उघडून परवानगी दिल्यावरच शेअर होते.",
		openDesk: "कॉल डेस्क पहा",
		consentTitle: "राह डेस्कसोबत लोकेशन शेअर करायचे?",
		consentBody: "तुम्ही परवानगी दिल्यावरच ऑपरेटर हा पिन पाहतो. गुप्त ट्रॅकिंग नाही.",
		allowOnce: "एकदा परवानगी द्या",
		dontShare: "शेअर करू नका",
		sharingOn: "लोकेशन शेअर सुरू आहे",
		sharingOff: "लोकेशन शेअर होत नाही",
		linkWaiting: "डेस्कने लोकेशन लिंक पाठवली",
		navHome: "होम",
		navRides: "राइड्स",
		navOffers: "ऑफर्स",
		navSafety: "सुरक्षा",
		navAccount: "खाते",
		settings: "सेटिंग्ज",
		language: "भाषा",
		simple: "सोपे होम",
		large: "मोठे अक्षर",
		contrast: "जास्त कॉन्ट्रास्ट",
		voice: "बोलून पुष्टी",
		logout: "लॉग आउट",
		account: "खाते",
		profile: "प्रोफाइल",
		payments: "पेमेंट",
		home: "घर",
		work: "काम",
		emergency: "आपत्कालीन संपर्क",
		supportTitle: "मदत",
		ruralTitle: "गाव बुकिंग मदत",
		ruralBody: "अॅप अवघड वाटले तर डेस्कला कॉल करा. बस थांबा, शाळा, मंदिर किंवा दुकान खुण म्हणून तयार ठेवा.",
		pickupTitle: "उचलण्याची जागा निश्चित करा",
		dropTitle: "गंतव्य निवडा",
		searchPh: "शहर, गाव, मंदिर, बस थांबा…",
		landmarks: "खुणा",
		saved: "जतन केलेले",
		recent: "अलीकडील",
		filterAll: "सर्व",
		filterVillage: "गावे",
		filterTown: "तालुके",
		filterCity: "शहरे",
		booked: "बुकिंग जतन झाली"
	},
	gu: {
		tagline: "દરેક રસ્તો. દરેક ગામ.",
		proto: "નમૂનો · નમૂના ભાડું · આ લાઇવ સેવા નથી",
		continue: "આગળ",
		back: "પાછળ",
		skip: "છોડો",
		next: "આગળ",
		save: "સાચવો",
		cancel: "રદ",
		search: "શોધો",
		done: "થઈ ગયું",
		start: "શરૂ કરો",
		on1t: "ભારતના દરેક રસ્તા માટે એક એપ",
		on1b: "શહેર, નગર, ગામ — જ્યાં રસ્તો કહી શકાય ત્યાં બાઇક, ઑટો અને કેબ.",
		on2t: "અહીં બુક કરો, અથવા કૉલથી",
		on2b: "સ્માર્ટફોન અઘરું હોય તો રાહ ડેસ્કને કૉલ કરો. એક વ્યક્તિ તમારી સાથે બુક કરશે.",
		on3t: "દેખાતી સલામતી",
		on3b: "ડ્રાઇવરનું નામ, વાહન નંબર, સફર શેર અને SOS સફરનો ભાગ છે.",
		langTitle: "ભાષા પસંદ કરો",
		langSub: "બુકિંગ, સલામતી અને કૉલ-બુકિંગ આ ભાષામાં. નીતિઓ પ્રમાણિત અનુવાદ સુધી અંગ્રેજીમાં.",
		phoneTitle: "તમારો મોબાઇલ નંબર",
		phoneSub: "ફક્ત ભારતીય નંબર. આ ડેમો SMS મોકલતો નથી.",
		phoneBad: "૬, ૭, ૮ અથવા ૯થી શરૂ થતો ૧૦ અંકનો નંબર લખો.",
		sendCode: "ડેમો કોડ",
		otpTitle: "૬ અંકનો કોડ",
		otpSub: "ડેમો કોડ 482913. કોઈ પણ ૬ અંક ચાલશે.",
		verify: "ચકાસો",
		changeNumber: "નંબર બદલો",
		nameTitle: "અમે તમને શું કહીએ?",
		nameSub: "ફક્ત ડ્રાઇવર અને રાહ સહાય આ જોશે. આ જાહેર નથી.",
		namePh: "તમારું નામ",
		hello: "નમસ્તે",
		whereTo: "ક્યાં જવું છે?",
		pickup: "ઉપાડ સ્થળ",
		drop: "ગંતવ્ય",
		sampleFix: "નમૂના સ્થળ — તમારું સાચું GPS નથી",
		callCta: "કૉલથી રાઇડ બુક કરો",
		callSub: "વડીલો અને જેમને બોલવું સરળ હોય તેમના માટે",
		bookPhone: "આ ફોન પર બુક કરો",
		vehicleTitle: "વાહન પસંદ કરો",
		bookNow: "હમણાં બુક કરો",
		schedule: "પછી માટે",
		ready: "ઉપલબ્ધ",
		limited: "અહીં ઓછા",
		unavailable: "આ સફર માટે નહીં",
		confirmRide: "બુકિંગ પક્કું કરો",
		searching: "નજીકનો ડ્રાઇવર શોધીએ છીએ",
		driverFound: "ડ્રાઇવર મળ્યો",
		simDriver: "નમૂના ડ્રાઇવર — લાઇવ સોંપણી નથી",
		trackSim: "નમૂના હલનચલન — લાઇવ GPS નથી",
		arriving: "લેવા આવે છે",
		onTrip: "રસ્તામાં",
		callDriver: "કૉલ",
		message: "સંદેશ",
		shareTrip: "સફર શેર કરો",
		sos: "SOS",
		cancelRide: "રાઇડ રદ કરો",
		sosTitle: "કટોકટી SOS",
		sosBody: "આ ડેમો પોલીસ કે એમ્બ્યુલન્સને કૉલ કરશે નહીં. કંઈ પણ આ ડિવાઇસ બહાર જતું નથી.",
		sosConfirm: "SOS ડેમો બતાવો",
		sosDone: "ફક્ત ડેમો. અસલ જોડાણ પછી કટોકટી સંપર્કોને જાણ થશે.",
		safeTitle: "સેફ મોડ",
		callTitle: "કૉલથી રાઇડ બુક કરો",
		callLead: "એપના પગલાં નથી. રાહ ડેસ્કની વ્યક્તિ તમારી સાથે બુક કરે છે.",
		official: "અધિકૃત બુકિંગ નંબર",
		numberNote: "નમૂના નંબર. કૉલ સેન્ટર સાથે જોડાતો નથી.",
		callNow: "આ નંબર પર કૉલ કરો",
		how: "ફોન બુકિંગ કેવી રીતે",
		how1: "તમે રાહ નંબર પર કૉલ કરો છો.",
		how2: "મોબાઇલ નંબર કહો છો.",
		how3: "ગામ, બસ સ્ટોપ, શાળા અથવા મંદિરથી ઉપાડ સ્થળ કહો છો.",
		how4: "ડેસ્ક ગંતવ્ય, વાહન અને ભાડું પક્કું કરે છે.",
		how5: "રાઇડ થયા પછી SMS અથવા વૉઇસ કૉલ આવે છે.",
		callLang: "તમે તમારી ભાષામાં બોલી શકો છો. ડેસ્ક ભારતીય ભાષાઓ માટે છે.",
		openLink: "નમૂના લોકેશન લિંક ખોલો",
		openLinkNote: "કૉલ GPS મોકલતો નથી. લિંક ખોલીને પરવાનગી આપો તો જ શેર થાય.",
		openDesk: "કૉલ ડેસ્ક જુઓ",
		consentTitle: "રાહ ડેસ્ક સાથે લોકેશન શેર કરશો?",
		consentBody: "તમે પરવાનગી આપો પછી જ ઑપરેટર આ પિન જુએ છે. ચૂપકીદીથી ટ્રેકિંગ નથી.",
		allowOnce: "એક વાર પરવાનગી આપો",
		dontShare: "શેર ન કરો",
		sharingOn: "લોકેશન શેર ચાલુ છે",
		sharingOff: "લોકેશન શેર થતું નથી",
		linkWaiting: "ડેસ્કે લોકેશન લિંક મોકલી",
		navHome: "હોમ",
		navRides: "રાઇડ",
		navOffers: "ઑફર",
		navSafety: "સલામતી",
		navAccount: "ખાતું",
		settings: "સેટિંગ્સ",
		language: "ભાષા",
		simple: "સરળ હોમ",
		large: "મોટા અક્ષર",
		contrast: "વધુ કોન્ટ્રાસ્ટ",
		voice: "બોલીને પુષ્ટિ",
		logout: "લૉગ આઉટ",
		account: "ખાતું",
		profile: "પ્રોફાઇલ",
		payments: "ચુકવણી",
		home: "ઘર",
		work: "કામ",
		emergency: "કટોકટી સંપર્ક",
		supportTitle: "મદદ",
		ruralTitle: "ગામ બુકિંગ મદદ",
		ruralBody: "એપ અઘરી લાગે તો ડેસ્કને કૉલ કરો. બસ સ્ટોપ, શાળા, મંદિર અથવા દુકાનની નિશાની તૈયાર રાખો.",
		pickupTitle: "ઉપાડ સ્થળ પક્કું કરો",
		dropTitle: "ગંતવ્ય પસંદ કરો",
		searchPh: "શહેર, ગામ, મંદિર, બસ સ્ટોપ…",
		landmarks: "નિશાનીઓ",
		saved: "સાચવેલા",
		recent: "તાજેતરના",
		filterAll: "બધા",
		filterVillage: "ગામડાં",
		filterTown: "નગરો",
		filterCity: "શહેરો",
		booked: "બુકિંગ સચવાઈ"
	},
	pa: {
		tagline: "ਹਰ ਸੜਕ। ਹਰ ਪਿੰਡ।",
		proto: "ਨਮੂਨਾ · ਨਮੂਨਾ ਕਿਰਾਇਆ · ਇਹ ਲਾਈਵ ਸੇਵਾ ਨਹੀਂ",
		continue: "ਅੱਗੇ",
		back: "ਪਿੱਛੇ",
		skip: "ਛੱਡੋ",
		next: "ਅੱਗੇ",
		save: "ਸੰਭਾਲੋ",
		cancel: "ਰੱਦ",
		search: "ਖੋਜੋ",
		done: "ਹੋ ਗਿਆ",
		start: "ਸ਼ੁਰੂ ਕਰੋ",
		on1t: "ਭਾਰਤ ਦੀ ਹਰ ਸੜਕ ਲਈ ਇੱਕ ਐਪ",
		on1b: "ਸ਼ਹਿਰ, ਕਸਬਾ, ਪਿੰਡ — ਜਿੱਥੇ ਸੜਕ ਦੱਸੀ ਜਾ ਸਕੇ, ਉੱਥੇ ਬਾਈਕ, ਆਟੋ ਅਤੇ ਕੈਬ।",
		on2t: "ਇੱਥੇ ਬੁੱਕ ਕਰੋ, ਜਾਂ ਕਾਲ ਨਾਲ",
		on2b: "ਜੇ ਸਮਾਰਟਫੋਨ ਔਖਾ ਹੋਵੇ ਤਾਂ ਰਾਹ ਡੈਸਕ ਨੂੰ ਕਾਲ ਕਰੋ। ਇੱਕ ਵਿਅਕਤੀ ਤੁਹਾਡੇ ਨਾਲ ਬੁੱਕ ਕਰੇਗਾ।",
		on3t: "ਸੁਰੱਖਿਆ ਜੋ ਦਿਸੇ",
		on3b: "ਡਰਾਈਵਰ ਦਾ ਨਾਮ, ਗੱਡੀ ਨੰਬਰ, ਯਾਤਰਾ ਸਾਂਝੀ ਕਰਨਾ ਅਤੇ SOS ਸਫ਼ਰ ਦਾ ਹਿੱਸਾ ਹਨ।",
		langTitle: "ਭਾਸ਼ਾ ਚੁਣੋ",
		langSub: "ਬੁਕਿੰਗ, ਸੁਰੱਖਿਆ ਅਤੇ ਕਾਲ-ਬੁਕਿੰਗ ਇਸ ਭਾਸ਼ਾ ਵਿੱਚ। ਨੀਤੀਆਂ ਪ੍ਰਮਾਣਿਤ ਅਨੁਵਾਦ ਤੱਕ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ।",
		phoneTitle: "ਤੁਹਾਡਾ ਮੋਬਾਈਲ ਨੰਬਰ",
		phoneSub: "ਸਿਰਫ਼ ਭਾਰਤੀ ਨੰਬਰ। ਇਹ ਡੈਮੋ SMS ਨਹੀਂ ਭੇਜਦਾ।",
		phoneBad: "6, 7, 8 ਜਾਂ 9 ਨਾਲ ਸ਼ੁਰੂ 10 ਅੰਕਾਂ ਦਾ ਨੰਬਰ ਲਿਖੋ।",
		sendCode: "ਡੈਮੋ ਕੋਡ",
		otpTitle: "6 ਅੰਕਾਂ ਦਾ ਕੋਡ",
		otpSub: "ਡੈਮੋ ਕੋਡ 482913। ਕੋਈ ਵੀ 6 ਅੰਕ ਚੱਲਣਗੇ।",
		verify: "ਜਾਂਚੋ",
		changeNumber: "ਨੰਬਰ ਬਦਲੋ",
		nameTitle: "ਅਸੀਂ ਤੁਹਾਨੂੰ ਕੀ ਕਹੀਏ?",
		nameSub: "ਸਿਰਫ਼ ਡਰਾਈਵਰ ਅਤੇ ਰਾਹ ਸਹਾਇਤਾ ਇਹ ਵੇਖਣਗੇ। ਇਹ ਜਨਤਕ ਨਹੀਂ।",
		namePh: "ਤੁਹਾਡਾ ਨਾਮ",
		hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
		whereTo: "ਕਿੱਥੇ ਜਾਣਾ ਹੈ?",
		pickup: "ਚੁੱਕਣ ਦੀ ਥਾਂ",
		drop: "ਮੰਜ਼ਿਲ",
		sampleFix: "ਨਮੂਨਾ ਥਾਂ — ਤੁਹਾਡਾ ਸੱਚਾ GPS ਨਹੀਂ",
		callCta: "ਕਾਲ ਨਾਲ ਰਾਈਡ ਬੁੱਕ ਕਰੋ",
		callSub: "ਵੱਡਿਆਂ ਅਤੇ ਜਿਨ੍ਹਾਂ ਲਈ ਬੋਲਣਾ ਸੌਖਾ ਹੋਵੇ",
		bookPhone: "ਇਸ ਫ਼ੋਨ ਉੱਤੇ ਬੁੱਕ ਕਰੋ",
		vehicleTitle: "ਗੱਡੀ ਚੁਣੋ",
		bookNow: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
		schedule: "ਬਾਅਦ ਲਈ",
		ready: "ਉਪਲਬਧ",
		limited: "ਇੱਥੇ ਘੱਟ",
		unavailable: "ਇਸ ਸਫ਼ਰ ਲਈ ਨਹੀਂ",
		confirmRide: "ਬੁਕਿੰਗ ਪੱਕੀ ਕਰੋ",
		searching: "ਨੇੜੇ ਦਾ ਡਰਾਈਵਰ ਲੱਭ ਰਹੇ ਹਾਂ",
		driverFound: "ਡਰਾਈਵਰ ਮਿਲ ਗਿਆ",
		simDriver: "ਨਮੂਨਾ ਡਰਾਈਵਰ — ਲਾਈਵ ਅਸਾਈਨਮੈਂਟ ਨਹੀਂ",
		trackSim: "ਨਮੂਨਾ ਚਲਣ — ਲਾਈਵ GPS ਨਹੀਂ",
		arriving: "ਲੈਣ ਆ ਰਿਹਾ ਹੈ",
		onTrip: "ਰਾਹ ਵਿੱਚ",
		callDriver: "ਕਾਲ",
		message: "ਸੁਨੇਹਾ",
		shareTrip: "ਸਫ਼ਰ ਸਾਂਝਾ ਕਰੋ",
		sos: "SOS",
		cancelRide: "ਰਾਈਡ ਰੱਦ ਕਰੋ",
		sosTitle: "ਐਮਰਜੈਂਸੀ SOS",
		sosBody: "ਇਹ ਡੈਮੋ ਪੁਲਿਸ ਜਾਂ ਐਂਬੂਲੈਂਸ ਨੂੰ ਕਾਲ ਨਹੀਂ ਕਰੇਗਾ। ਕੁਝ ਵੀ ਇਸ ਡਿਵਾਈਸ ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਜਾਂਦਾ।",
		sosConfirm: "SOS ਡੈਮੋ ਵਿਖਾਓ",
		sosDone: "ਸਿਰਫ਼ ਡੈਮੋ। ਅਸਲ ਜੋੜ ਤੋਂ ਬਾਅਦ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕਾਂ ਨੂੰ ਦੱਸਿਆ ਜਾਵੇਗਾ।",
		safeTitle: "ਸੇਫ਼ ਮੋਡ",
		callTitle: "ਕਾਲ ਨਾਲ ਰਾਈਡ ਬੁੱਕ ਕਰੋ",
		callLead: "ਐਪ ਦੇ ਕਦਮ ਨਹੀਂ। ਰਾਹ ਡੈਸਕ ਦਾ ਵਿਅਕਤੀ ਤੁਹਾਡੇ ਨਾਲ ਬੁੱਕ ਕਰਦਾ ਹੈ।",
		official: "ਅਧਿਕਾਰਤ ਬੁਕਿੰਗ ਨੰਬਰ",
		numberNote: "ਨਮੂਨਾ ਨੰਬਰ। ਕਾਲ ਸੈਂਟਰ ਨਾਲ ਨਹੀਂ ਜੁੜਦਾ।",
		callNow: "ਇਸ ਨੰਬਰ ਉੱਤੇ ਕਾਲ ਕਰੋ",
		how: "ਫ਼ੋਨ ਬੁਕਿੰਗ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ",
		how1: "ਤੁਸੀਂ ਰਾਹ ਨੰਬਰ ਉੱਤੇ ਕਾਲ ਕਰਦੇ ਹੋ।",
		how2: "ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦੱਸਦੇ ਹੋ।",
		how3: "ਪਿੰਡ, ਬੱਸ ਸਟਾਪ, ਸਕੂਲ ਜਾਂ ਮੰਦਰ ਨਾਲ ਚੁੱਕਣ ਦੀ ਥਾਂ ਦੱਸਦੇ ਹੋ।",
		how4: "ਡੈਸਕ ਮੰਜ਼ਿਲ, ਗੱਡੀ ਅਤੇ ਕਿਰਾਇਆ ਪੱਕਾ ਕਰਦਾ ਹੈ।",
		how5: "ਰਾਈਡ ਬਣਨ ਤੇ SMS ਜਾਂ ਆਵਾਜ਼ ਕਾਲ ਆਉਂਦੀ ਹੈ।",
		callLang: "ਤੁਸੀਂ ਆਪਣੀ ਭਾਸ਼ਾ ਬੋਲ ਸਕਦੇ ਹੋ। ਡੈਸਕ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਲਈ ਹੈ।",
		openLink: "ਨਮੂਨਾ ਲੋਕੇਸ਼ਨ ਲਿੰਕ ਖੋਲ੍ਹੋ",
		openLinkNote: "ਕਾਲ GPS ਨਹੀਂ ਭੇਜਦੀ। ਲਿੰਕ ਖੋਲ੍ਹ ਕੇ ਇਜਾਜ਼ਤ ਦਿਓ ਤਾਂ ਹੀ ਸਾਂਝਾ ਹੁੰਦਾ ਹੈ।",
		openDesk: "ਕਾਲ ਡੈਸਕ ਵੇਖੋ",
		consentTitle: "ਰਾਹ ਡੈਸਕ ਨਾਲ ਲੋਕੇਸ਼ਨ ਸਾਂਝੀ ਕਰਨੀ ਹੈ?",
		consentBody: "ਤੁਸੀਂ ਇਜਾਜ਼ਤ ਦਿਓ ਤਾਂ ਹੀ ਆਪਰੇਟਰ ਇਹ ਪਿੰਨ ਵੇਖਦਾ ਹੈ। ਚੁੱਪਚਾਪ ਟਰੈਕਿੰਗ ਨਹੀਂ।",
		allowOnce: "ਇੱਕ ਵਾਰ ਇਜਾਜ਼ਤ ਦਿਓ",
		dontShare: "ਸਾਂਝਾ ਨਾ ਕਰੋ",
		sharingOn: "ਲੋਕੇਸ਼ਨ ਸਾਂਝੀ ਹੋ ਰਹੀ ਹੈ",
		sharingOff: "ਲੋਕੇਸ਼ਨ ਸਾਂਝੀ ਨਹੀਂ",
		linkWaiting: "ਡੈਸਕ ਨੇ ਲੋਕੇਸ਼ਨ ਲਿੰਕ ਭੇਜਿਆ ਹੈ",
		navHome: "ਹੋਮ",
		navRides: "ਰਾਈਡਾਂ",
		navOffers: "ਆਫ਼ਰ",
		navSafety: "ਸੁਰੱਖਿਆ",
		navAccount: "ਖਾਤਾ",
		settings: "ਸੈਟਿੰਗਾਂ",
		language: "ਭਾਸ਼ਾ",
		simple: "ਸੌਖਾ ਹੋਮ",
		large: "ਵੱਡੇ ਅੱਖਰ",
		contrast: "ਵੱਧ ਕੰਟਰਾਸਟ",
		voice: "ਬੋਲ ਕੇ ਪੁਸ਼ਟੀ",
		logout: "ਲੌਗ ਆਊਟ",
		account: "ਖਾਤਾ",
		profile: "ਪ੍ਰੋਫ਼ਾਈਲ",
		payments: "ਭੁਗਤਾਨ",
		home: "ਘਰ",
		work: "ਕੰਮ",
		emergency: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
		supportTitle: "ਮਦਦ",
		ruralTitle: "ਪਿੰਡ ਬੁਕਿੰਗ ਮਦਦ",
		ruralBody: "ਜੇ ਐਪ ਔਖੀ ਲੱਗੇ ਤਾਂ ਡੈਸਕ ਨੂੰ ਕਾਲ ਕਰੋ। ਬੱਸ ਸਟਾਪ, ਸਕੂਲ, ਮੰਦਰ ਜਾਂ ਦੁਕਾਨ ਦਾ ਨਿਸ਼ਾਨ ਤਿਆਰ ਰੱਖੋ।",
		pickupTitle: "ਚੁੱਕਣ ਦੀ ਥਾਂ ਪੱਕੀ ਕਰੋ",
		dropTitle: "ਮੰਜ਼ਿਲ ਚੁਣੋ",
		searchPh: "ਸ਼ਹਿਰ, ਪਿੰਡ, ਮੰਦਰ, ਬੱਸ ਸਟਾਪ…",
		landmarks: "ਨਿਸ਼ਾਨ",
		saved: "ਸੰਭਾਲੇ",
		recent: "ਹਾਲੀਆ",
		filterAll: "ਸਭ",
		filterVillage: "ਪਿੰਡ",
		filterTown: "ਕਸਬੇ",
		filterCity: "ਸ਼ਹਿਰ",
		booked: "ਬੁਕਿੰਗ ਸੰਭਾਲ ਲਈ"
	}
};
function t(lang, key) {
	return packs[lang][key] ?? en[key];
}
var VOICE = {
	en: "en-IN",
	hi: "hi-IN",
	ta: "ta-IN",
	te: "te-IN",
	kn: "kn-IN",
	ml: "ml-IN",
	bn: "bn-IN",
	mr: "mr-IN",
	gu: "gu-IN",
	pa: "pa-IN"
};
function speak(lang, text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = VOICE[lang];
	const match = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(VOICE[lang].slice(0, 2)));
	if (match) utter.voice = match;
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utter);
}
var CITY_SPOTS = [
	{
		name: "Junction",
		kind: "station",
		hint: "Main rail or metro point"
	},
	{
		name: "Central Bus Stand",
		kind: "bus",
		hint: "Intercity bus terminal"
	},
	{
		name: "District Hospital",
		kind: "hospital",
		hint: "Emergency gate"
	},
	{
		name: "Main Market",
		kind: "market",
		hint: "Clock-tower side"
	}
];
var VILLAGE_SPOTS = [
	{
		name: "Village bus stop",
		kind: "bus",
		hint: "Where the bus halts"
	},
	{
		name: "Government school",
		kind: "school",
		hint: "Primary school gate"
	},
	{
		name: "Village temple",
		kind: "temple",
		hint: "Largest temple"
	},
	{
		name: "Health centre",
		kind: "hospital",
		hint: "Primary health centre"
	}
];
function build(id, name, kind, state, district, lat, lng, aliases = [], spots) {
	return {
		id,
		name,
		kind,
		state,
		district,
		lat,
		lng,
		aliases,
		landmarks: (spots ?? (kind === "village" ? VILLAGE_SPOTS : CITY_SPOTS)).map((spot, i) => ({
			id: `${id}-${i}`,
			name: spot.name.includes(name) ? spot.name : kind === "village" ? spot.name : `${name} ${spot.name}`,
			kind: spot.kind,
			hint: spot.hint,
			lat: lat + (i - 1.5) * .012,
			lng: lng + (i % 2 - .5) * .016
		}))
	};
}
var PLACES = [
	build("blr", "Bengaluru", "metro", "Karnataka", "Bengaluru Urban", 12.9716, 77.5946, ["bangalore", "blr"], [
		{
			name: "Indiranagar Metro",
			kind: "station",
			hint: "CMH Road exit"
		},
		{
			name: "Majestic Bus Stand",
			kind: "bus",
			hint: "KSRTC platform"
		},
		{
			name: "Victoria Hospital",
			kind: "hospital",
			hint: "Main gate"
		},
		{
			name: "KR Market",
			kind: "market",
			hint: "Flower market side"
		}
	]),
	build("mum", "Mumbai", "metro", "Maharashtra", "Mumbai", 19.076, 72.8777, ["bombay"], [
		{
			name: "Dadar Station",
			kind: "station",
			hint: "East side"
		},
		{
			name: "Bandra West",
			kind: "market",
			hint: "Linking Road"
		},
		{
			name: "CSMT",
			kind: "station",
			hint: "Mainline concourse"
		},
		{
			name: "Sion Hospital",
			kind: "hospital",
			hint: "Casualty"
		}
	]),
	build("del", "New Delhi", "metro", "Delhi", "New Delhi", 28.6139, 77.209, ["delhi", "ncr"], [
		{
			name: "Kashmere Gate",
			kind: "station",
			hint: "ISBT exit"
		},
		{
			name: "Connaught Place",
			kind: "market",
			hint: "Block A"
		},
		{
			name: "AIIMS",
			kind: "hospital",
			hint: "Main gate"
		},
		{
			name: "New Delhi Station",
			kind: "station",
			hint: "Ajmeri Gate"
		}
	]),
	build("hyd", "Hyderabad", "metro", "Telangana", "Hyderabad", 17.385, 78.4867, [], [
		{
			name: "Ameerpet Metro",
			kind: "station",
			hint: "Metro exit 1"
		},
		{
			name: "MGBS",
			kind: "bus",
			hint: "Bus terminal"
		},
		{
			name: "Osmania Hospital",
			kind: "hospital",
			hint: "Afzal Gunj"
		},
		{
			name: "Charminar",
			kind: "market",
			hint: "Laad Bazaar side"
		}
	]),
	build("che", "Chennai", "metro", "Tamil Nadu", "Chennai", 13.0827, 80.2707, ["madras"], [
		{
			name: "Central Station",
			kind: "station",
			hint: "Moore Market"
		},
		{
			name: "Koyambedu",
			kind: "bus",
			hint: "CMBT"
		},
		{
			name: "GH Chennai",
			kind: "hospital",
			hint: "Park Town"
		},
		{
			name: "T Nagar",
			kind: "market",
			hint: "Pondy Bazaar"
		}
	]),
	build("kol", "Kolkata", "metro", "West Bengal", "Kolkata", 22.5726, 88.3639, ["calcutta"], [
		{
			name: "Howrah Station",
			kind: "station",
			hint: "New complex"
		},
		{
			name: "Esplanade",
			kind: "bus",
			hint: "Bus hub"
		},
		{
			name: "SSKM Hospital",
			kind: "hospital",
			hint: "Bhowanipore"
		},
		{
			name: "Gariahat",
			kind: "market",
			hint: "Market crossing"
		}
	]),
	build("pun", "Pune", "city", "Maharashtra", "Pune", 18.5204, 73.8567),
	build("ahm", "Ahmedabad", "city", "Gujarat", "Ahmedabad", 23.0225, 72.5714),
	build("jai", "Jaipur", "city", "Rajasthan", "Jaipur", 26.9124, 75.7873),
	build("lko", "Lucknow", "city", "Uttar Pradesh", "Lucknow", 26.8467, 80.9462),
	build("cok", "Kochi", "city", "Kerala", "Ernakulam", 9.9312, 76.2673, ["cochin"]),
	build("idr", "Indore", "city", "Madhya Pradesh", "Indore", 22.7196, 75.8577),
	build("cbe", "Coimbatore", "city", "Tamil Nadu", "Coimbatore", 11.0168, 76.9558),
	build("bbi", "Bhubaneswar", "city", "Odisha", "Khordha", 20.2961, 85.8245),
	build("gau", "Guwahati", "city", "Assam", "Kamrup", 26.1445, 91.7362),
	build("ixc", "Chandigarh", "city", "Chandigarh", "Chandigarh", 30.7333, 76.7794),
	build("nag", "Nagpur", "city", "Maharashtra", "Nagpur", 21.1458, 79.0882),
	build("vtz", "Visakhapatnam", "city", "Andhra Pradesh", "Visakhapatnam", 17.6868, 83.2185, ["vizag"]),
	build("pat", "Patna", "city", "Bihar", "Patna", 25.5941, 85.1376),
	build("bho", "Bhopal", "city", "Madhya Pradesh", "Bhopal", 23.2599, 77.4126),
	build("stv", "Surat", "city", "Gujarat", "Surat", 21.1702, 72.8311),
	build("ldh", "Ludhiana", "city", "Punjab", "Ludhiana", 30.901, 75.8573),
	build("mys", "Mysuru", "city", "Karnataka", "Mysuru", 12.2958, 76.6394, ["mysore"]),
	build("ixm", "Madurai", "city", "Tamil Nadu", "Madurai", 9.9252, 78.1198),
	build("vns", "Varanasi", "city", "Uttar Pradesh", "Varanasi", 25.3176, 82.9739, ["banaras", "kashi"], [
		{
			name: "Varanasi Junction",
			kind: "station",
			hint: "Station road"
		},
		{
			name: "Cantt Bus Stand",
			kind: "bus",
			hint: "Platform 1"
		},
		{
			name: "BHU Hospital",
			kind: "hospital",
			hint: "Lanka side"
		},
		{
			name: "Dashashwamedh Ghat",
			kind: "other",
			hint: "Ghat steps"
		}
	]),
	build("ixr", "Ranchi", "city", "Jharkhand", "Ranchi", 23.3441, 85.3096),
	build("hbx", "Hubballi", "town", "Karnataka", "Dharwad", 15.3647, 75.124, ["hubli"]),
	build("wgl", "Warangal", "town", "Telangana", "Hanamkonda", 17.9689, 79.5941),
	build("ixb", "Siliguri", "town", "West Bengal", "Darjeeling", 26.7271, 88.3953),
	build("udr", "Udaipur", "town", "Rajasthan", "Udaipur", 24.5854, 73.7125),
	build("tcr", "Thrissur", "town", "Kerala", "Thrissur", 10.5276, 76.2144),
	build("dhm", "Dharamshala", "town", "Himachal Pradesh", "Kangra", 32.219, 76.3234),
	build("shl", "Shillong", "town", "Meghalaya", "East Khasi Hills", 25.5788, 91.8933),
	build("ajl", "Aizawl", "town", "Mizoram", "Aizawl", 23.7271, 92.7176),
	build("goi", "Panaji", "town", "Goa", "North Goa", 15.4909, 73.8278, ["panjim"]),
	build("leh", "Leh", "town", "Ladakh", "Leh", 34.1526, 77.5771),
	build("ixz", "Port Blair", "town", "Andaman and Nicobar", "South Andaman", 11.6234, 92.7265),
	build("mjl", "Kamalabari", "town", "Assam", "Majuli", 26.95, 94.17, ["majuli"]),
	build("hwb", "Hiware Bazar", "village", "Maharashtra", "Ahmednagar", 19.083, 74.583, ["hiware"]),
	build("punsi", "Punsari", "village", "Gujarat", "Sabarkantha", 23.45, 73.05),
	build("dhr", "Dharnai", "village", "Bihar", "Jehanabad", 25.005, 84.99),
	build("kho", "Khonoma", "village", "Nagaland", "Kohima", 25.644, 94.02),
	build("maw", "Mawlynnong", "village", "Meghalaya", "East Khasi Hills", 25.201, 91.916),
	build("ank", "Ankapur", "village", "Telangana", "Nizamabad", 18.79, 78.29),
	build("kod", "Kodihalli", "village", "Karnataka", "Ramanagara", 12.64, 77.28, ["kanakapura"], [
		{
			name: "Kodihalli bus stop",
			kind: "bus",
			hint: "On the Kanakapura road"
		},
		{
			name: "Government school",
			kind: "school",
			hint: "School compound gate"
		},
		{
			name: "Hanuman temple",
			kind: "temple",
			hint: "Temple arch"
		},
		{
			name: "Primary health centre",
			kind: "hospital",
			hint: "PHC veranda"
		}
	])
];
var RTO = {
	Karnataka: "KA",
	Maharashtra: "MH",
	Delhi: "DL",
	Telangana: "TS",
	"Tamil Nadu": "TN",
	"West Bengal": "WB",
	Gujarat: "GJ",
	Rajasthan: "RJ",
	"Uttar Pradesh": "UP",
	Kerala: "KL",
	"Madhya Pradesh": "MP",
	Odisha: "OD",
	Assam: "AS",
	Chandigarh: "CH",
	"Andhra Pradesh": "AP",
	Bihar: "BR",
	Punjab: "PB",
	Jharkhand: "JH",
	"Himachal Pradesh": "HP",
	Meghalaya: "ML",
	Mizoram: "MZ",
	Goa: "GA",
	Ladakh: "LA",
	"Andaman and Nicobar": "AN",
	Nagaland: "NL"
};
function getPlace(id) {
	return PLACES.find((p) => p.id === id) ?? null;
}
function formatLine(place, landmark) {
	if (place.kind === "village" || place.kind === "town") return `${landmark.name}, ${place.name}, ${place.district}, ${place.state}`;
	return `${landmark.name}, ${place.name}, ${place.state}`;
}
function toSelection(place, landmark, source) {
	return {
		placeId: place.id,
		landmarkId: landmark.id,
		label: landmark.name,
		line: formatLine(place, landmark),
		lat: landmark.lat,
		lng: landmark.lng,
		source
	};
}
function searchPlaces(query) {
	const q = query.trim().toLowerCase();
	if (!q) return PLACES;
	return PLACES.filter((place) => {
		const blob = [
			place.name,
			place.state,
			place.district,
			place.kind,
			...place.aliases,
			...place.landmarks.map((l) => l.name)
		].join(" ").toLowerCase();
		return q.split(/\s+/).every((part) => blob.includes(part));
	});
}
function nearestPlace(lat, lng) {
	let best = PLACES[0];
	let bestD = Infinity;
	for (const place of PLACES) {
		const d = (place.lat - lat) ** 2 + (place.lng - lng) ** 2;
		if (d < bestD) {
			best = place;
			bestD = d;
		}
	}
	return best;
}
[...new Set(PLACES.map((p) => p.state))].sort();
var VEHICLES = [
	{
		id: "bike",
		capacity: 1,
		base: 25,
		perKm: 7,
		arrival: 3,
		speed: 24,
		minFare: 30
	},
	{
		id: "auto",
		capacity: 3,
		base: 35,
		perKm: 13,
		arrival: 5,
		speed: 20,
		minFare: 45
	},
	{
		id: "mini",
		capacity: 4,
		base: 60,
		perKm: 14,
		arrival: 6,
		speed: 26,
		minFare: 80
	},
	{
		id: "sedan",
		capacity: 4,
		base: 90,
		perKm: 18,
		arrival: 8,
		speed: 28,
		minFare: 120
	},
	{
		id: "xl",
		capacity: 6,
		base: 120,
		perKm: 22,
		arrival: 11,
		speed: 26,
		minFare: 160
	}
];
var PAY_METHODS = [
	"upi",
	"qr",
	"credit",
	"debit",
	"netbanking",
	"cash"
];
function vehicleMeta(id) {
	const found = VEHICLES.find((v) => v.id === id);
	if (!found) throw new Error(`Unknown vehicle ${id}`);
	return found;
}
function kmBetween(a, b) {
	const toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	const km = 12742 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
	return Math.max(.8, Math.round(km * 10) / 10);
}
function availability(id, km, kind) {
	if (id === "bike" && km > 80) return "unavailable";
	if (id === "auto" && km > 45) return "unavailable";
	if (id === "bike" && (km > 25 || kind === "village")) return "limited";
	if (id === "auto" && kind === "metro" && km > 18) return "limited";
	if ((id === "xl" || id === "sedan") && kind === "village") return "limited";
	if (id === "xl" && kind === "town") return "limited";
	return "ready";
}
function resolvePromo(raw, subtotal, vehicle, kind, used) {
	const code = raw.trim().toUpperCase();
	if (!code) return {
		ok: false,
		code: null,
		discount: 0,
		reason: "empty"
	};
	if (used.includes(code) && code === "RAAH50") return {
		ok: false,
		code,
		discount: 0,
		reason: "used"
	};
	if (code === "RAAH50") return {
		ok: true,
		code,
		discount: Math.min(50, subtotal),
		reason: "first"
	};
	if (code === "FEST25") return {
		ok: true,
		code,
		discount: Math.min(40, Math.round(subtotal * .1)),
		reason: "fest"
	};
	if (code === "VILLAGE20") {
		if ((vehicle === "bike" || vehicle === "auto") && (kind === "village" || kind === "town")) return {
			ok: true,
			code,
			discount: Math.min(20, subtotal),
			reason: "village"
		};
		return {
			ok: false,
			code,
			discount: 0,
			reason: "village-only"
		};
	}
	if (code === "CITY15") {
		if (kind === "metro" || kind === "city") return {
			ok: true,
			code,
			discount: Math.min(15, subtotal),
			reason: "city"
		};
		return {
			ok: false,
			code,
			discount: 0,
			reason: "city-only"
		};
	}
	if (code === "REFER75") {
		if (used.includes(code)) return {
			ok: false,
			code,
			discount: 0,
			reason: "used"
		};
		return {
			ok: true,
			code,
			discount: Math.min(75, subtotal),
			reason: "refer"
		};
	}
	return {
		ok: false,
		code,
		discount: 0,
		reason: "unknown"
	};
}
function quoteRide(vehicle, km, kind, promo) {
	const meta = vehicleMeta(vehicle);
	const avail = availability(vehicle, km, kind);
	const base = meta.base;
	const distanceCharge = Math.round(meta.perKm * km);
	const waiting = 0;
	const discount = promo?.ok ? promo.discount : 0;
	const taxable = Math.max(0, base + distanceCharge + waiting - discount);
	const tax = Math.round(taxable * .05);
	const total = avail === "unavailable" ? 0 : Math.max(meta.minFare, taxable + tax);
	const speed = meta.speed + Math.min(22, km * .35);
	return {
		km,
		minutes: Math.max(4, Math.round(km / speed * 60)),
		arrivalMin: meta.arrival + (kind === "village" ? 4 : kind === "town" ? 2 : 0),
		base,
		distanceCharge,
		waiting,
		tax,
		discount,
		total,
		promoCode: promo?.ok ? promo.code : null,
		availability: avail
	};
}
function inr(n) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
}
var DESK_CALLS = [
	{
		id: "c1",
		name: "Kamala",
		phone: "9000000001",
		language: "ta",
		note: "Does not use the app. She is near the government school.",
		placeId: "kod",
		landmarkId: "kod-1"
	},
	{
		id: "c2",
		name: "Harpreet",
		phone: "9000000002",
		language: "pa",
		note: "Booking for his father. Pickup is the bus stand.",
		placeId: "ldh",
		landmarkId: "ldh-1"
	},
	{
		id: "c3",
		name: "Ramesh",
		phone: "9000000003",
		language: "hi",
		note: "Village call. He will wait at the temple.",
		placeId: "dhr",
		landmarkId: "dhr-2"
	}
];
var NAMES = [
	"Asha K.",
	"Imran S.",
	"Meenakshi R.",
	"Harpreet Singh",
	"Lakshmi N.",
	"Arjun P.",
	"Fatima B.",
	"Suresh M."
];
var COLOURS = [
	"Sea-glass",
	"Marigold",
	"Ivory",
	"Ink",
	"Sage"
];
function uid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 7)}${Date.now().toString(36).slice(-3)}`;
}
function sampleSelection(placeId, index, source) {
	const place = getPlace(placeId);
	if (!place) throw new Error(placeId);
	return toSelection(place, place.landmarks[index] ?? place.landmarks[0], source);
}
function makeDriver(vehicle, state, seed) {
	const rto = RTO[state] ?? "IN";
	const a = String.fromCharCode(65 + seed % 26);
	const b = String.fromCharCode(65 + (seed >> 3) % 26);
	const num = String(1e3 + seed % 8e3).padStart(4, "0");
	const district = String(1 + seed % 39).padStart(2, "0");
	return {
		name: NAMES[seed % NAMES.length],
		rating: Math.round((4.6 + seed % 4 * .1) * 10) / 10,
		plate: `${rto}${district}${a}${b}${num}`,
		vehicle,
		trips: 180 + seed % 900,
		colour: COLOURS[seed % COLOURS.length]
	};
}
function seedRide(partial) {
	return {
		messages: [],
		progress: partial.progress ?? 1,
		...partial
	};
}
var seedPickup = sampleSelection("blr", 0, "sample");
var seedDrop = sampleSelection("blr", 3, "search");
var initialRides = [
	seedRide({
		id: "seed-1",
		status: "completed",
		pickup: seedPickup,
		drop: seedDrop,
		vehicle: "auto",
		payment: "upi",
		fare: quoteRide("auto", kmBetween(seedPickup, seedDrop), "metro", null),
		driver: makeDriver("auto", "Karnataka", 4),
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		rating: 5,
		source: "app"
	}),
	seedRide({
		id: "seed-2",
		status: "completed",
		pickup: sampleSelection("mum", 0, "search"),
		drop: sampleSelection("mum", 1, "search"),
		vehicle: "mini",
		payment: "cash",
		fare: quoteRide("mini", kmBetween(sampleSelection("mum", 0, "search"), sampleSelection("mum", 1, "search")), "metro", null),
		driver: makeDriver("mini", "Maharashtra", 9),
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 5184e5)).toISOString(),
		rating: 4,
		source: "app"
	}),
	seedRide({
		id: "seed-3",
		status: "cancelled",
		pickup: sampleSelection("kod", 0, "operator"),
		drop: sampleSelection("blr", 1, "search"),
		vehicle: "bike",
		payment: "cash",
		fare: quoteRide("bike", kmBetween(sampleSelection("kod", 0, "operator"), sampleSelection("blr", 1, "search")), "village", null),
		driver: null,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 7776e5)).toISOString(),
		cancelReason: "Plans changed",
		source: "call",
		progress: 0
	})
];
var emptyDesk = {
	callId: null,
	name: "",
	phone: "",
	language: "hi",
	note: "",
	pickup: null,
	drop: null,
	vehicle: "auto"
};
function patchRide(rides, id, patch) {
	return rides.map((ride) => ride.id === id ? {
		...ride,
		...patch
	} : ride);
}
var useRaah = create()(persist((set, get) => ({
	seenOnboarding: false,
	languageChosen: false,
	lang: "en",
	authed: false,
	phone: "",
	name: "",
	photo: "",
	screen: "splash",
	stack: [],
	extras: [],
	emergency: [],
	pickup: seedPickup,
	drop: null,
	vehicle: "auto",
	payment: "upi",
	promoInput: "",
	promo: null,
	usedPromos: [],
	when: "now",
	rides: initialRides,
	activeRideId: null,
	selectedRideId: "seed-1",
	recents: [seedDrop],
	simpleMode: false,
	largeText: false,
	highContrast: false,
	voiceOn: false,
	marketing: false,
	consent: "none",
	desk: emptyDesk,
	tickets: [],
	legalDoc: "terms",
	placeTarget: "drop",
	toast: "",
	payFailed: false,
	sosArmed: false,
	onboardStep: 0,
	replace: (screen) => set({
		screen,
		stack: []
	}),
	open: (screen) => set((s) => ({
		stack: [...s.stack, s.screen],
		screen
	})),
	back: () => set((s) => {
		const stack = [...s.stack];
		return {
			stack,
			screen: stack.pop() ?? "home"
		};
	}),
	tab: (screen) => set({
		screen,
		stack: []
	}),
	setLang: (lang) => set({
		lang,
		languageChosen: true
	}),
	setPhone: (phone) => set({ phone }),
	verifyOtp: (code) => {
		if (!/^\d{6}$/.test(code)) return false;
		set({
			authed: true,
			screen: get().name ? "home" : "name",
			stack: []
		});
		return true;
	},
	setName: (name) => {
		const clean = name.trim();
		if (get().screen === "name") {
			set({
				name: clean,
				screen: "home",
				stack: [],
				seenOnboarding: true
			});
			return;
		}
		set({ name: clean });
	},
	setPhoto: (photo) => set({ photo }),
	setPlaceTarget: (placeTarget) => set({ placeTarget }),
	choose: (selection) => {
		const s = get();
		if (s.placeTarget === "pickup") {
			set({ pickup: selection });
			get().back();
			return;
		}
		if (s.placeTarget === "drop") {
			if (selection.placeId === s.pickup.placeId && selection.landmarkId === s.pickup.landmarkId) {
				set({ toast: t(s.lang, "samePlace") });
				return;
			}
			set({
				drop: selection,
				recents: [selection, ...s.recents.filter((item) => item.landmarkId !== selection.landmarkId)].slice(0, 6)
			});
			get().replace("vehicles");
			return;
		}
		const saved = {
			id: uid("place"),
			slot: s.placeTarget,
			label: selection.label,
			selection
		};
		if (s.placeTarget === "home") set({ home: saved });
		if (s.placeTarget === "work") set({ work: saved });
		if (s.placeTarget === "extra") set({ extras: [...get().extras, saved].slice(0, 5) });
		get().back();
	},
	setVehicle: (vehicle) => set({ vehicle }),
	setPayment: (payment) => set({
		payment,
		payFailed: false
	}),
	setPromoInput: (promoInput) => set({ promoInput }),
	setPromo: (promo) => set({
		promo,
		usedPromos: get().usedPromos
	}),
	setWhen: (when) => set({ when }),
	confirmBooking: () => {
		const s = get();
		if (!s.drop) return;
		const place = getPlace(s.pickup.placeId);
		if (!place) return;
		const km = kmBetween(s.pickup, s.drop);
		const fare = quoteRide(s.vehicle, km, place.kind, s.promo);
		if (fare.availability === "unavailable") return;
		const scheduled = s.when !== "now";
		const ride = {
			id: uid("ride"),
			status: scheduled ? "scheduled" : "searching",
			pickup: s.pickup,
			drop: s.drop,
			vehicle: s.vehicle,
			payment: s.payment,
			fare,
			driver: null,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			scheduledFor: scheduled ? s.when : void 0,
			progress: 0,
			source: "app",
			messages: []
		};
		set({
			rides: [ride, ...s.rides],
			activeRideId: ride.id,
			selectedRideId: ride.id,
			usedPromos: s.promo?.ok && s.promo.code ? [...s.usedPromos, s.promo.code] : s.usedPromos,
			promo: null,
			promoInput: "",
			when: "now",
			screen: scheduled ? "history" : "assigning",
			stack: [],
			toast: t(s.lang, "booked")
		});
		if (s.voiceOn) speak(s.lang, t(s.lang, "booked"));
	},
	assignDriver: () => {
		const s = get();
		const ride = s.rides.find((r) => r.id === s.activeRideId);
		if (!ride || ride.driver) return;
		const place = getPlace(ride.pickup.placeId);
		const driver = makeDriver(ride.vehicle, place?.state ?? "Karnataka", ride.id.length * 17);
		set({
			rides: patchRide(s.rides, ride.id, {
				driver,
				status: "arriving",
				progress: 0
			}),
			screen: "tracking",
			stack: []
		});
		if (s.voiceOn) speak(s.lang, `${t(s.lang, "driverFound")}. ${driver.name}. ${driver.plate}`);
	},
	tickRide: () => {
		const s = get();
		const ride = s.rides.find((r) => r.id === s.activeRideId);
		if (!ride || ride.status !== "arriving" && ride.status !== "ongoing") return;
		const next = Math.min(1, Math.round((ride.progress + .07) * 100) / 100);
		if (ride.status === "arriving" && next >= 1) {
			set({ rides: patchRide(s.rides, ride.id, {
				status: "ongoing",
				progress: 0
			}) });
			return;
		}
		set({ rides: patchRide(s.rides, ride.id, { progress: next }) });
	},
	completeRide: () => {
		const s = get();
		if (!s.activeRideId) return;
		set({
			rides: patchRide(s.rides, s.activeRideId, {
				status: "completed",
				progress: 1
			}),
			screen: "complete",
			stack: []
		});
	},
	cancelRide: (reason) => {
		const s = get();
		const id = s.activeRideId ?? s.selectedRideId;
		if (!id) return;
		set({
			rides: patchRide(s.rides, id, {
				status: "cancelled",
				cancelReason: reason,
				driver: null
			}),
			activeRideId: s.activeRideId === id ? null : s.activeRideId,
			screen: "history",
			stack: [],
			toast: t(s.lang, "cancelled")
		});
	},
	rateRide: (rating, feedback) => {
		const s = get();
		const id = s.selectedRideId;
		if (!id) return;
		set({
			rides: patchRide(s.rides, id, {
				rating,
				feedback
			}),
			toast: t(s.lang, "ratingThanks"),
			screen: "history",
			stack: [],
			activeRideId: null
		});
	},
	addMessage: (text, from = "you") => {
		const s = get();
		const id = s.activeRideId;
		if (!id) return;
		const ride = s.rides.find((r) => r.id === id);
		if (!ride) return;
		const messages = [...ride.messages, {
			from,
			text,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		set({ rides: patchRide(s.rides, id, { messages }) });
	},
	selectRide: (id) => set({
		selectedRideId: id,
		screen: "ride",
		stack: [...get().stack, get().screen]
	}),
	saveEmergency: (name, phone) => set((s) => ({ emergency: [...s.emergency, {
		id: uid("sos"),
		name: name.trim(),
		phone
	}].slice(0, 3) })),
	removeEmergency: (id) => set((s) => ({ emergency: s.emergency.filter((c) => c.id !== id) })),
	removePlace: (slot, id) => set((s) => {
		if (slot === "home") return { home: void 0 };
		if (slot === "work") return { work: void 0 };
		return { extras: s.extras.filter((p) => p.id !== id) };
	}),
	toggle: (key) => set((s) => ({ [key]: !s[key] })),
	logout: () => set({
		authed: false,
		screen: "phone",
		stack: [],
		activeRideId: null
	}),
	wipe: () => set({
		seenOnboarding: false,
		languageChosen: false,
		lang: "en",
		authed: false,
		phone: "",
		name: "",
		photo: "",
		screen: "splash",
		stack: [],
		home: void 0,
		work: void 0,
		extras: [],
		emergency: [],
		pickup: seedPickup,
		drop: null,
		vehicle: "auto",
		payment: "upi",
		promoInput: "",
		promo: null,
		usedPromos: [],
		when: "now",
		rides: initialRides,
		activeRideId: null,
		selectedRideId: "seed-1",
		recents: [seedDrop],
		simpleMode: false,
		largeText: false,
		highContrast: false,
		voiceOn: false,
		marketing: false,
		consent: "none",
		desk: emptyDesk,
		tickets: [],
		toast: "",
		payFailed: false,
		sosArmed: false,
		onboardStep: 0
	}),
	setLegal: (legalDoc) => set({
		legalDoc,
		screen: "legal",
		stack: [...get().stack, get().screen]
	}),
	setToast: (toast) => set({ toast }),
	clearToast: () => set({ toast: "" }),
	setPayFailed: (payFailed) => set({ payFailed }),
	setSosArmed: (sosArmed) => set({ sosArmed }),
	setOnboardStep: (onboardStep) => set({ onboardStep }),
	finishIntro: () => set({
		seenOnboarding: true,
		screen: get().languageChosen ? "phone" : "language",
		stack: []
	}),
	loadCall: (call) => {
		const found = getPlace(call.placeId);
		const landmark = found?.landmarks.find((l) => l.id === call.landmarkId) ?? found?.landmarks[0];
		set({ desk: {
			callId: call.id,
			name: call.name,
			phone: call.phone,
			language: call.language,
			note: call.note,
			pickup: found && landmark ? toSelection(found, landmark, "operator") : null,
			drop: null,
			vehicle: "auto"
		} });
	},
	setDesk: (patch) => set((s) => ({ desk: {
		...s.desk,
		...patch
	} })),
	sendLocationLink: () => {
		set({
			consent: "link_sent",
			toast: t(get().lang, "linkWaiting")
		});
	},
	setConsent: (consent) => {
		set({
			consent,
			toast: t(get().lang, consent === "allowed" ? "sharingOn" : "sharingOff")
		});
	},
	createDeskBooking: () => {
		const s = get();
		if (!s.desk.pickup || !s.desk.drop) return;
		const place = getPlace(s.desk.pickup.placeId);
		if (!place) return;
		const km = kmBetween(s.desk.pickup, s.desk.drop);
		const fare = quoteRide(s.desk.vehicle, km, place.kind, null);
		if (fare.availability === "unavailable") return;
		const driver = makeDriver(s.desk.vehicle, place.state, Date.now() % 1e3);
		const ride = {
			id: uid("call"),
			status: "arriving",
			pickup: s.desk.pickup,
			drop: s.desk.drop,
			vehicle: s.desk.vehicle,
			payment: "cash",
			fare,
			driver,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			progress: .08,
			source: "call",
			messages: []
		};
		set({
			rides: [ride, ...s.rides],
			activeRideId: ride.id,
			selectedRideId: ride.id,
			pickup: s.desk.pickup,
			drop: s.desk.drop,
			vehicle: s.desk.vehicle,
			payment: "cash",
			screen: s.authed ? "tracking" : s.screen,
			stack: [],
			toast: t(s.lang, "booked")
		});
		if (s.voiceOn && s.authed) speak(s.lang, t(s.lang, "booked"));
	},
	addTicket: (topic, text) => set((s) => ({
		tickets: [{
			id: uid("t"),
			topic,
			text,
			status: "Open",
			at: (/* @__PURE__ */ new Date()).toISOString()
		}, ...s.tickets],
		toast: t(s.lang, "ticketSent")
	})),
	reportOnRide: (kind, text) => {
		const s = get();
		if (!s.selectedRideId) return;
		set({
			rides: patchRide(s.rides, s.selectedRideId, kind === "issue" ? { issue: text } : { lostItem: text }),
			tickets: [{
				id: uid("t"),
				topic: kind === "issue" ? "Safety" : "Lost item",
				text,
				status: "Open",
				at: (/* @__PURE__ */ new Date()).toISOString()
			}, ...s.tickets],
			toast: t(s.lang, "ticketSent")
		});
	},
	startScheduled: (id) => {
		set({
			rides: patchRide(get().rides, id, { status: "searching" }),
			activeRideId: id,
			selectedRideId: id,
			screen: "assigning",
			stack: []
		});
	}
}), {
	name: "raah-prototype-v1",
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (s) => ({
		seenOnboarding: s.seenOnboarding,
		languageChosen: s.languageChosen,
		lang: s.lang,
		authed: s.authed,
		phone: s.phone,
		name: s.name,
		photo: s.photo,
		screen: s.screen === "splash" ? "home" : s.screen,
		home: s.home,
		work: s.work,
		extras: s.extras,
		emergency: s.emergency,
		pickup: s.pickup,
		drop: s.drop,
		vehicle: s.vehicle,
		payment: s.payment,
		usedPromos: s.usedPromos,
		rides: s.rides,
		activeRideId: s.activeRideId,
		selectedRideId: s.selectedRideId,
		recents: s.recents,
		simpleMode: s.simpleMode,
		largeText: s.largeText,
		highContrast: s.highContrast,
		voiceOn: s.voiceOn,
		marketing: s.marketing,
		consent: s.consent,
		desk: s.desk,
		tickets: s.tickets
	})
}));
/**
* Company identity for the prototype.
* Every legal identifier below is a PLACEHOLDER.
* Do not replace these with invented "real" registrations.
* A future admin console should own this object.
*/
var company = {
	brand: "Raah",
	legalName: "Raah Mobility Private Limited",
	tagline: "Every road. Every village.",
	office: "Placeholder only — the registered office will be published after incorporation. Demo city: Bengaluru, Karnataka, India.",
	cin: "U00000KA2026PTC000000",
	gstin: "29AAAAA0000A1Z5",
	supportPhone: "1800-202-7244",
	supportTel: "+9118002027244",
	email: "support@raah.example",
	website: "https://raah.example",
	grievance: "Placeholder — Grievance Officer, grievance@raah.example",
	hours: "Daily, 6:00–23:00 IST (prototype desk, not a live call centre)"
};
var DEMO_OTP = "482913";
var vehicles = {
	en: {
		bike: "Bike",
		auto: "Auto",
		mini: "Mini cab",
		sedan: "Sedan",
		xl: "7 seater"
	},
	hi: {
		bike: "बाइक",
		auto: "ऑटो",
		mini: "मिनी कैब",
		sedan: "सेडान",
		xl: "7 सीटर"
	},
	ta: {
		bike: "பைக்",
		auto: "ஆட்டோ",
		mini: "மினி கேப்",
		sedan: "செடான்",
		xl: "7 இருக்கை"
	},
	te: {
		bike: "బైక్",
		auto: "ఆటో",
		mini: "మినీ క్యాబ్",
		sedan: "సెడాన్",
		xl: "7 సీటర్"
	},
	kn: {
		bike: "ಬೈಕ್",
		auto: "ಆಟೋ",
		mini: "ಮಿನಿ ಕ್ಯಾಬ್",
		sedan: "ಸೆಡಾನ್",
		xl: "7 ಸೀಟರ್"
	},
	ml: {
		bike: "ബൈക്ക്",
		auto: "ഓട്ടോ",
		mini: "മിനി ക്യാബ്",
		sedan: "സെഡാൻ",
		xl: "7 സീറ്റർ"
	},
	bn: {
		bike: "বাইক",
		auto: "অটো",
		mini: "মিনি ক্যাব",
		sedan: "সেডান",
		xl: "৭ সিটার"
	},
	mr: {
		bike: "बाईक",
		auto: "ऑटो",
		mini: "मिनी कॅब",
		sedan: "सेडान",
		xl: "7 सीटर"
	},
	gu: {
		bike: "બાઇક",
		auto: "ઑટો",
		mini: "મિની કેબ",
		sedan: "સેડાન",
		xl: "7 સીટર"
	},
	pa: {
		bike: "ਬਾਈਕ",
		auto: "ਆਟੋ",
		mini: "ਮਿਨੀ ਕੈਬ",
		sedan: "ਸੇਡਾਨ",
		xl: "7 ਸੀਟਰ"
	}
};
var cash = {
	en: "Cash",
	hi: "नकद",
	ta: "பணம்",
	te: "నగదు",
	kn: "ನಗದು",
	ml: "പണം",
	bn: "নগদ",
	mr: "रोख",
	gu: "રોકડ",
	pa: "ਨਕਦ"
};
var payRest = {
	upi: "UPI",
	qr: "UPI QR",
	credit: "Credit card",
	debit: "Debit card",
	netbanking: "Net banking"
};
function vehicleLabel(lang, id) {
	return vehicles[lang][id];
}
function payLabel(lang, id) {
	if (id === "cash") return cash[lang];
	return payRest[id];
}
function promoReason(reason) {
	switch (reason) {
		case "used": return "That code is already used in this prototype.";
		case "unknown": return "Code not recognised. Try RAAH50, FEST25, VILLAGE20, CITY15 or REFER75.";
		case "village-only": return "VILLAGE20 is for bike or auto in a town or village.";
		case "city-only": return "CITY15 is for city and metro rides.";
		case "empty": return "Enter a code.";
		default: return "Offer applied to this estimate.";
	}
}
var SLOTS = [
	{
		x: 26,
		y: 64
	},
	{
		x: 70,
		y: 36
	},
	{
		x: 42,
		y: 28
	},
	{
		x: 74,
		y: 70
	}
];
function slot(selection) {
	if (!selection) return null;
	const index = getPlace(selection.placeId)?.landmarks.findIndex((item) => item.id === selection.landmarkId) ?? 0;
	return SLOTS[Math.max(0, index)] ?? SLOTS[0];
}
function lerp(a, b, t) {
	return {
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t
	};
}
function MapView({ pickup, drop, progress = 0, phase = "idle", className = "h-64", caption }) {
	const place = getPlace(pickup?.placeId ?? drop?.placeId ?? "blr");
	const from = slot(pickup) ?? SLOTS[0];
	const to = slot(drop);
	const start = {
		x: from.x - 16,
		y: Math.min(88, from.y + 12)
	};
	let driver = from;
	if (phase === "to_pickup") driver = lerp(start, from, progress);
	if (phase === "to_drop" && to) driver = lerp(from, to, progress);
	const showRoute = Boolean(to && phase !== "idle");
	const routeD = to ? `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 8} ${to.x} ${to.y}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative overflow-hidden rounded-3xl bg-map ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: "absolute inset-0 h-full w-full",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "22",
						cy: "24",
						rx: "18",
						ry: "10",
						fill: "var(--color-park)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 78 C 20 70, 40 88, 70 76 S 100 84, 100 90 L 100 100 L 0 100 Z",
						fill: "var(--color-water)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M-2 40 H 102",
						stroke: "var(--color-road)",
						strokeWidth: "5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M-2 62 H 102",
						stroke: "var(--color-road)",
						strokeWidth: "4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M30 -2 V 102",
						stroke: "var(--color-road)",
						strokeWidth: "4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M68 -2 V 102",
						stroke: "var(--color-road)",
						strokeWidth: "5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M8 20 C 30 28, 50 10, 92 22",
						fill: "none",
						stroke: "var(--color-paper-deep)",
						strokeWidth: "1.4"
					}),
					showRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: routeD,
						fill: "none",
						stroke: "var(--color-primary)",
						strokeWidth: "1.8",
						strokeDasharray: "2 1.4",
						strokeLinecap: "round"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-ink",
				children: [place?.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium text-muted",
					children: [" · ", place?.state]
				})]
			}),
			place?.kind === "village" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-3 top-3 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent",
				children: "Landmark"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
				x: from.x,
				y: from.y,
				tone: "primary",
				label: "Pickup"
			}),
			to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
				x: to.x,
				y: to.y,
				tone: "ink",
				label: "Drop"
			}) : null,
			phase !== "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow",
				style: {
					left: `${driver.x}%`,
					top: `${driver.y}%`
				},
				"aria-hidden": true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute",
				style: {
					left: `${from.x}%`,
					top: `${from.y}%`
				},
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "puck absolute -left-3 -top-3 size-6 rounded-full bg-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-2 left-3 right-3 text-xs text-ink/80",
				children: caption ?? "Schematic map · sample roads · not live navigation"
			})
		]
	});
}
function Pin({ x, y, tone, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute -translate-x-1/2 -translate-y-full",
		style: {
			left: `${x}%`,
			top: `${y}%`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `block size-3.5 rounded-full border-2 border-surface ${tone === "primary" ? "bg-primary" : "bg-ink"}`,
			title: label
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function useCopy() {
	const lang = useRaah((s) => s.lang);
	return (key) => t(lang, key);
}
var variants = {
	primary: "bg-primary text-primary-ink",
	accent: "bg-accent text-accent-ink",
	soft: "bg-primary-soft text-primary",
	ghost: "bg-transparent text-ink",
	line: "border border-line bg-surface text-ink",
	danger: "bg-danger text-primary-ink"
};
function Btn({ variant = "primary", className, children, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-semibold transition active:scale-[0.99] disabled:opacity-45", variants[variant], className),
		type,
		...props,
		children
	});
}
function Header({ title, subtitle, onBack, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-start gap-2 px-4 py-3",
		children: [
			onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onBack,
				className: "mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-paper text-ink",
				"aria-label": "Back",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight text-ink",
					children: title
				}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: subtitle
				}) : null]
			}),
			right
		]
	});
}
function Avatar({ name, photo, className }) {
	const letter = (name.trim()[0] ?? "R").toUpperCase();
	if (photo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: photo,
		alt: "",
		className: cn("size-11 rounded-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid size-11 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-ink", className),
		"aria-hidden": true,
		children: letter
	});
}
function Pill({ children, tone = "soft" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", {
			soft: "bg-primary-soft text-primary",
			ok: "bg-ok-soft text-ok",
			warn: "bg-accent-soft text-accent",
			danger: "bg-danger-soft text-danger",
			line: "bg-paper text-muted"
		}[tone]),
		children
	});
}
function Card({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-3xl border border-line bg-surface p-4", className),
		children
	});
}
var inputClass = "h-12 w-full rounded-2xl border border-line bg-paper px-3 text-base text-ink outline-none ring-primary focus:ring-2";
function prettyPhone(digits) {
	const clean = digits.replace(/\D/g, "").slice(-10);
	if (clean.length <= 5) return clean;
	return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}
function OperatorConsole({ onBack }) {
	const desk = useRaah((s) => s.desk);
	const consent = useRaah((s) => s.consent);
	const loadCall = useRaah((s) => s.loadCall);
	const setDesk = useRaah((s) => s.setDesk);
	const sendLink = useRaah((s) => s.sendLocationLink);
	const create = useRaah((s) => s.createDeskBooking);
	const [query, setQuery] = (0, import_react.useState)("");
	const [aim, setAim] = (0, import_react.useState)("pickup");
	const hits = (0, import_react.useMemo)(() => searchPlaces(query).slice(0, 6), [query]);
	const pickupPlace = desk.pickup ? getPlace(desk.pickup.placeId) : null;
	const fare = desk.pickup && desk.drop && pickupPlace ? quoteRide(desk.vehicle, kmBetween(desk.pickup, desk.drop), pickupPlace.kind, null) : null;
	const blocked = !desk.pickup || !desk.drop || !fare || fare.availability === "unavailable";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full min-h-0 flex-col bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-start justify-between gap-3 border-b border-line px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-wide text-primary",
					children: "RAAH DESK"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Call-centre booking"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Prototype operator view. Caller ID is not GPS."
				})
			] }), onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onBack,
				className: "h-11 rounded-full bg-surface px-3 text-sm font-semibold",
				children: "Back to app"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[220px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-muted",
					children: "Sample incoming calls"
				}), DESK_CALLS.map((call) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => loadCall(call),
					className: `w-full rounded-2xl border p-3 text-left ${desk.callId === call.id ? "border-primary bg-surface" : "border-line bg-surface"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: call.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm tabular text-muted",
							children: ["+91 ", call.phone]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: call.note
						})
					]
				}, call.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Caller name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3",
								value: desk.name,
								onChange: (e) => setDesk({ name: e.target.value })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Mobile", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 tabular",
								value: desk.phone,
								onChange: (e) => setDesk({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: desk.note || "Choose a sample call, or type a caller."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {
						pickup: desk.pickup,
						drop: desk.drop,
						caption: consent === "allowed" ? "Customer allowed this pin. Sharing is explicit." : "No GPS yet. Book with the landmark, or send a location link.",
						className: "h-52"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: consent === "allowed" ? "ok" : consent === "denied" ? "danger" : "warn",
							children: consent === "none" ? "Location not requested" : consent === "link_sent" ? "Link sent · waiting" : consent === "allowed" ? "Customer allowed location" : "Customer declined"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "soft",
							onClick: sendLink,
							disabled: !desk.phone,
							children: "Send location SMS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "The SMS is simulated. The customer app shows the consent screen. Nothing is tracked before Allow."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAim("pickup"),
							className: `h-10 rounded-full px-3 text-sm font-semibold ${aim === "pickup" ? "bg-ink text-surface" : "bg-surface"}`,
							children: "Set pickup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAim("drop"),
							className: `h-10 rounded-full px-3 text-sm font-semibold ${aim === "drop" ? "bg-ink text-surface" : "bg-surface"}`,
							children: "Set destination"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-11 w-full rounded-xl border border-line bg-surface px-3",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Village, landmark, city…",
						"aria-label": "Find a place"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: hits.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-surface p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "px-2 text-sm font-semibold",
								children: [
									place.name,
									" · ",
									place.kind,
									" · ",
									place.state
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: place.landmarks.map((landmark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-10 rounded-full bg-paper px-3 text-sm",
									onClick: () => setDesk({ [aim]: toSelection(place, landmark, "operator") }),
									children: landmark.name
								}, landmark.id))
							})]
						}, place.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto",
						children: VEHICLES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDesk({ vehicle: item.id }),
							className: `h-12 shrink-0 rounded-2xl px-3 text-sm font-semibold ${desk.vehicle === item.id ? "bg-primary text-primary-ink" : "bg-surface"}`,
							children: vehicleLabel(desk.language, item.id)
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Pickup: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: desk.pickup?.line ?? "Not set"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1",
								children: ["Destination: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: desk.drop?.line ?? "Not set"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl tabular",
								children: fare && fare.availability !== "unavailable" ? inr(fare.total) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									fare ? `${fare.km} km · ${fare.minutes} min · ${fare.availability}` : "Choose both ends for a sample fare.",
									" · ",
									payLabel("en", "cash"),
									" by default for phone bookings."
								]
							}),
							pickupPlace && (pickupPlace.kind === "village" || pickupPlace.kind === "town") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-accent",
								children: "Road coverage may be incomplete. The landmark is the finding instruction."
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-line bg-surface p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: ["SMS preview · ", desk.language.toUpperCase()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted",
								children: [
									company.brand,
									": ",
									t(desk.language, "booked"),
									". ",
									desk.pickup?.label ?? "Pickup",
									" → ",
									desk.drop?.label ?? "Destination",
									". ",
									fare ? inr(fare.total) : "",
									" ",
									t(desk.language, "trackSim"),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-semibold",
								children: "Voice script"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									t(desk.language, "callLead"),
									" ",
									desk.name ? `${desk.name}, ` : "",
									t(desk.language, "how5")
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "w-full",
						disabled: blocked,
						onClick: create,
						children: "Create phone booking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Creates a simulated ride for the customer app beside this desk. Cash fare. Driver is not a real person. Desk number ",
							company.supportPhone,
							" is a placeholder."
						]
					})
				]
			})]
		})]
	});
}
function VehicleArt({ id, className = "h-12 w-20" }) {
	if (id === "bike") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "34",
				r: "9",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "74",
				cy: "34",
				r: "9",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M22 34h18l10-14h16l8 14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M46 20h12",
				stroke: "var(--color-accent)",
				strokeWidth: "3",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "58",
				cy: "18",
				r: "3",
				fill: "var(--color-primary)"
			})
		]
	});
	if (id === "auto") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "36",
				r: "7",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "70",
				cy: "36",
				r: "7",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 36h64",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M28 36V22h34l10 14",
				fill: "var(--color-accent-soft)",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30 22c6-8 24-8 30 0",
				fill: "var(--color-primary)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 26h10",
				stroke: "currentColor",
				strokeWidth: "2"
			})
		]
	});
	if (id === "mini") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 32c2-10 10-16 22-16h18c8 0 14 4 18 10l6 6H14Z",
				fill: "var(--color-primary-soft)",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "30",
				cy: "34",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "70",
				cy: "34",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M38 18v10M54 17v11",
				stroke: "currentColor",
				strokeWidth: "2"
			})
		]
	});
	if (id === "sedan") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 32c4-6 10-14 22-14h20c8 0 14 4 20 10l8 4H10Z",
				fill: "var(--color-paper-deep)",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "28",
				cy: "34",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "72",
				cy: "34",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M36 18l6 10M58 18l4 10",
				stroke: "currentColor",
				strokeWidth: "2"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 96 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 34V20c0-4 4-8 10-8h40c10 0 16 6 20 14l4 8H12Z",
				fill: "var(--color-primary)",
				stroke: "currentColor",
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 16v12M40 16v12M56 16v12",
				stroke: "var(--color-primary-ink)",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "28",
				cy: "36",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "72",
				cy: "36",
				r: "6",
				fill: "var(--color-road)",
				stroke: "currentColor",
				strokeWidth: "3"
			})
		]
	});
}
function Wordmark({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `font-display tracking-tight text-ink ${className}`,
		children: "Raah"
	});
}
function useTripKm() {
	const pickup = useRaah((s) => s.pickup);
	const drop = useRaah((s) => s.drop);
	const place = getPlace(pickup.placeId);
	if (!drop || !place) return null;
	return {
		pickup,
		drop,
		place,
		km: kmBetween(pickup, drop)
	};
}
function VehiclesScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const vehicle = useRaah((s) => s.vehicle);
	const setVehicle = useRaah((s) => s.setVehicle);
	const back = useRaah((s) => s.back);
	const open = useRaah((s) => s.open);
	const trip = useTripKm();
	if (!trip) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("vehicleTitle"),
			onBack: () => useRaah.getState().replace("home")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			onClick: () => useRaah.getState().replace("home"),
			children: copy("whereTo")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("vehicleTitle"),
			subtitle: `${trip.km} km · ${copy("fareNote")}`,
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [VEHICLES.map((item) => {
				const fare = quoteRide(item.id, trip.km, trip.place.kind, null);
				const selected = vehicle === item.id;
				const blocked = fare.availability === "unavailable";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: blocked,
					onClick: () => setVehicle(item.id),
					className: `flex w-full items-center gap-3 rounded-3xl border p-3 text-left ${selected ? "border-primary bg-primary-soft" : "border-line"} ${blocked ? "opacity-50" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-16 place-items-center rounded-2xl bg-paper text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleArt, { id: item.id })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: vehicleLabel(lang, item.id)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: fare.availability === "ready" ? "ok" : fare.availability === "limited" ? "warn" : "line",
									children: copy(fare.availability)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-sm text-muted",
								children: [
									item.capacity,
									" ",
									copy("seats"),
									" · ",
									fare.minutes,
									" ",
									copy("min"),
									" · ",
									fare.arrivalMin,
									" ",
									copy("min"),
									" ",
									copy("away")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tabular",
							children: blocked ? "—" : inr(fare.total)
						})
					]
				}, item.id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					onClick: () => open("fare"),
					children: copy("schedule")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: () => {
						useRaah.getState().setWhen("now");
						open("fare");
					},
					children: copy("bookNow")
				})]
			})]
		})]
	});
}
function FareScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const vehicle = useRaah((s) => s.vehicle);
	const payment = useRaah((s) => s.payment);
	const promoInput = useRaah((s) => s.promoInput);
	const setPromoInput = useRaah((s) => s.setPromoInput);
	const promo = useRaah((s) => s.promo);
	const setPromo = useRaah((s) => s.setPromo);
	const used = useRaah((s) => s.usedPromos);
	const when = useRaah((s) => s.when);
	const setWhen = useRaah((s) => s.setWhen);
	const back = useRaah((s) => s.back);
	const open = useRaah((s) => s.open);
	const trip = useTripKm();
	const [note, setNote] = (0, import_react.useState)("");
	if (!trip) return null;
	const fare = quoteRide(vehicle, trip.km, trip.place.kind, promo);
	const blocked = fare.availability === "unavailable";
	function apply() {
		const result = resolvePromo(promoInput, fare.base + fare.distanceCharge, vehicle, trip.place.kind, used);
		setNote(promoReason(result.reason));
		setPromo(result.ok ? result : null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("fareDetails"),
			subtitle: copy("fareNote"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: copy("base"),
					value: inr(fare.base)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: `${copy("distance")} · ${fare.km} km`,
					value: inr(fare.distanceCharge)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: copy("waiting"),
					value: inr(fare.waiting)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: copy("discount"),
					value: fare.discount ? `−${inr(fare.discount)}` : inr(0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
					label: copy("tax"),
					value: inr(fare.tax)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-line pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: copy("total")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-3xl tabular",
						children: blocked ? "—" : inr(fare.total)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: copy("waitingNote")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputClass,
						value: promoInput,
						onChange: (e) => setPromoInput(e.target.value.toUpperCase()),
						placeholder: copy("promoPh"),
						"aria-label": copy("promo")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						className: "shrink-0",
						onClick: apply,
						children: copy("apply")
					})]
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("payments"),
					className: "flex h-12 w-full items-center justify-between rounded-2xl bg-paper px-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: copy("payWith")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: payLabel(lang, payment)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-medium text-muted",
					children: [copy("pickTime"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "datetime-local",
						className: `${inputClass} mt-1`,
						value: when === "now" ? "" : when,
						onChange: (event) => setWhen(event.target.value || "now")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					disabled: blocked,
					onClick: () => open("confirm"),
					children: copy("continue")
				})
			]
		})]
	});
}
function Row$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular font-medium",
			children: value
		})]
	});
}
function ConfirmScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const pickup = useRaah((s) => s.pickup);
	const drop = useRaah((s) => s.drop);
	const vehicle = useRaah((s) => s.vehicle);
	const payment = useRaah((s) => s.payment);
	const when = useRaah((s) => s.when);
	const back = useRaah((s) => s.back);
	const confirm = useRaah((s) => s.confirmBooking);
	const place = getPlace(pickup.placeId);
	if (!drop || !place) return null;
	const fare = quoteRide(vehicle, kmBetween(pickup, drop), place.kind, useRaah.getState().promo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("confirmRide"),
			subtitle: copy("proto"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stop, {
					label: copy("from"),
					title: pickup.label,
					line: pickup.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stop, {
					label: copy("to"),
					title: drop.label,
					line: drop.line
				}),
				(place.kind === "village" || place.kind === "town") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-accent",
					children: copy("villageNote")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-3xl border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleArt, { id: vehicle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: vehicleLabel(lang, vehicle)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									payLabel(lang, payment),
									" · ",
									when === "now" ? copy("now") : when.replace("T", " ")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tabular",
							children: inr(fare.total)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					onClick: confirm,
					children: when === "now" ? copy("confirmRide") : copy("scheduleTitle")
				})
			]
		})]
	});
}
function Stop({ label, title, line }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-paper px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: line
			})
		]
	});
}
function AssigningScreen() {
	const copy = useCopy();
	const assign = useRaah((s) => s.assignDriver);
	(0, import_react.useEffect)(() => {
		const id = window.setTimeout(() => assign(), 1400);
		return () => window.clearTimeout(id);
	}, [assign]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[60vh] place-items-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-16 rounded-full bg-primary-soft puck" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-3xl",
				children: copy("searching")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: copy("simDriver")
			})
		] })
	});
}
function Splash() {
	const replace = useRaah((s) => s.replace);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[70vh] place-items-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold tracking-widest text-primary",
				children: "INDIA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "mt-2 block text-6xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Every road. Every village."
			})
		] })
	});
}
var slides = [
	{
		key: "on1",
		icon: Spline
	},
	{
		key: "on2",
		icon: Phone
	},
	{
		key: "on3",
		icon: ShieldCheck
	}
];
function Onboarding() {
	const copy = useCopy();
	const step = useRaah((s) => s.onboardStep);
	const setStep = useRaah((s) => s.setOnboardStep);
	const finish = useRaah((s) => s.finishIntro);
	const slide = slides[step];
	const Icon = slide.icon;
	const titles = {
		on1: "on1t",
		on2: "on2t",
		on3: "on3t"
	};
	const bodies = {
		on1: "on1b",
		on2: "on2b",
		on3: "on3b"
	};
	const title = copy(titles[slide.key]);
	const body = copy(bodies[slide.key]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[70vh] flex-col px-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: finish,
					className: "h-11 px-2 text-sm font-semibold text-muted",
					children: copy("skip")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid flex-1 place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rise w-full max-w-sm text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid size-24 place-items-center rounded-full bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-10" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-4xl text-ink",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base leading-relaxed text-muted",
							children: body
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex items-center justify-center gap-2",
				children: slides.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 rounded-full ${index === step ? "w-8 bg-primary" : "w-2 bg-line"}` }, item.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-5 w-full",
				onClick: () => {
					if (step < 2) setStep(step + 1);
					else finish();
				},
				children: step < 2 ? copy("next") : copy("start")
			})
		]
	});
}
function LanguageScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const setLang = useRaah((s) => s.setLang);
	const replace = useRaah((s) => s.replace);
	const authed = useRaah((s) => s.authed);
	const back = useRaah((s) => s.back);
	const stack = useRaah((s) => s.stack);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				title: copy("langTitle"),
				subtitle: copy("langSub"),
				onBack: stack.length ? back : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-4",
				children: LANGUAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setLang(item.id),
					className: `min-h-16 rounded-2xl border px-3 py-3 text-left ${lang === item.id ? "border-primary bg-primary-soft" : "border-line bg-surface"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-lg font-semibold",
						children: item.native
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: item.english
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					onClick: () => replace(authed ? "home" : "phone"),
					children: copy("continue")
				})
			})
		]
	});
}
function PhoneScreen() {
	const copy = useCopy();
	const phone = useRaah((s) => s.phone);
	const setPhone = useRaah((s) => s.setPhone);
	const open = useRaah((s) => s.open);
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-4xl text-ink",
				children: "Raah"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-3xl",
				children: copy("phoneTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: copy("phoneSub")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-6 flex h-14 items-center gap-3 rounded-2xl border border-line bg-paper px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "+91"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					autoComplete: "tel",
					maxLength: 10,
					value: phone,
					onChange: (event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)),
					className: "h-full w-full bg-transparent text-lg outline-none tabular",
					placeholder: "98XXXXXX00",
					"aria-label": copy("phoneTitle")
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-6 w-full",
				onClick: () => {
					if (!/^[6-9]\d{9}$/.test(phone)) {
						setError(copy("phoneBad"));
						return;
					}
					setError("");
					open("otp");
				},
				children: copy("sendCode")
			})
		]
	});
}
function OtpScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const verify = useRaah((s) => s.verifyOtp);
	const setToast = useRaah((s) => s.setToast);
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("otpTitle"),
		subtitle: copy("otpSub"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				inputMode: "numeric",
				autoComplete: "one-time-code",
				maxLength: 6,
				value: code,
				onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6)),
				className: `${inputClass} text-center text-2xl tracking-widest tabular`,
				"aria-label": copy("otpTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: ["Demo code ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink tabular",
					children: DEMO_OTP
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-5 w-full",
				onClick: () => {
					if (!verify(code)) setError(copy("phoneBad"));
				},
				children: copy("verify")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 h-11 w-full text-sm font-semibold text-primary",
				onClick: () => setToast(copy("resend")),
				children: copy("resend")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 w-full text-sm text-muted",
				onClick: back,
				children: copy("changeNumber")
			})
		]
	})] });
}
function NameScreen() {
	const copy = useCopy();
	const name = useRaah((s) => s.name);
	const setName = useRaah((s) => s.setName);
	const [value, setValue] = (0, import_react.useState)(name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: copy("nameTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: copy("nameSub")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: `${inputClass} mt-6`,
				value,
				onChange: (event) => setValue(event.target.value),
				placeholder: copy("namePh"),
				"aria-label": copy("namePh"),
				maxLength: 40
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-5 w-full",
				disabled: value.trim().length < 2,
				onClick: () => setName(value),
				children: copy("continue")
			})
		]
	});
}
var quick = [
	"bike",
	"auto",
	"mini",
	"sedan",
	"xl"
];
function HomeScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const name = useRaah((s) => s.name);
	const photo = useRaah((s) => s.photo);
	const pickup = useRaah((s) => s.pickup);
	const drop = useRaah((s) => s.drop);
	const simple = useRaah((s) => s.simpleMode);
	const rides = useRaah((s) => s.rides);
	const open = useRaah((s) => s.open);
	const tab = useRaah((s) => s.tab);
	const setTarget = useRaah((s) => s.setPlaceTarget);
	const setVehicle = useRaah((s) => s.setVehicle);
	const place = getPlace(pickup.placeId);
	const live = rides.find((ride) => ride.status === "arriving" || ride.status === "ongoing" || ride.status === "searching");
	const km = drop ? kmBetween(pickup, drop) : null;
	function goPickup() {
		setTarget("pickup");
		open("pickup");
	}
	function goDrop() {
		setTarget("drop");
		open("destination");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-3 px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl leading-none",
						children: "Raah"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							copy("hello"),
							", ",
							name.split(" ")[0]
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => tab("safe"),
					className: "grid size-11 place-items-center rounded-full bg-paper",
					"aria-label": copy("navSafety"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => open("support"),
					className: "grid size-11 place-items-center rounded-full bg-paper",
					"aria-label": copy("support"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => open("profile"),
					"aria-label": copy("profile"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name,
						photo
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {
					pickup,
					drop,
					className: simple ? "h-40" : "h-56",
					caption: copy("sampleFix")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						place?.name,
						", ",
						place?.state,
						place?.kind === "village" || place?.kind === "town" ? ` · ${copy("villageNote")}` : ""
					]
				}),
				live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						useRaah.setState({
							activeRideId: live.id,
							selectedRideId: live.id
						});
						useRaah.getState().replace(live.status === "searching" ? "assigning" : "tracking");
					},
					className: "flex w-full items-center justify-between rounded-2xl bg-primary px-4 py-3 text-left text-primary-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm",
						children: copy(live.status === "ongoing" ? "onTrip" : "arriving")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: live.driver?.name ?? copy("searching")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: copy("done")
					})]
				}) : null,
				simple ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("call"),
					className: "min-h-16 w-full rounded-3xl bg-accent px-4 py-4 text-left text-accent-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xl font-semibold",
						children: copy("callCta")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: copy("callSub")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: goDrop,
					className: "min-h-16 w-full rounded-3xl bg-primary px-4 py-4 text-left text-primary-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xl font-semibold",
						children: copy("bookPhone")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: copy("whereTo")
					})]
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: goPickup,
					className: "flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold text-muted",
							children: copy("pickup")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: pickup.label
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: goDrop,
					className: "flex h-14 w-full items-center gap-3 rounded-2xl bg-paper px-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-semibold text-muted",
						children: drop ? drop.label : copy("whereTo")
					})]
				}),
				!simple ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("call"),
					className: "flex min-h-16 w-full items-center justify-between rounded-3xl bg-accent px-4 py-3 text-left text-accent-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-lg font-semibold",
						children: copy("callCta")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: copy("callSub")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneMark, {})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: quick.map((id) => {
						const fare = place && km ? quoteRide(id, km, place.kind, null) : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setVehicle(id);
								if (drop) useRaah.getState().replace("vehicles");
								else goDrop();
							},
							className: "w-36 shrink-0 rounded-2xl border border-line p-3 text-left text-ink",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleArt, {
									id,
									className: "h-10 w-16"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block font-semibold",
									children: vehicleLabel(lang, id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted tabular",
									children: fare && fare.availability !== "unavailable" ? inr(fare.total) : copy("whereTo")
								})
							]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => tab("offers"),
					className: "flex w-full items-center justify-between rounded-2xl bg-accent-soft px-4 py-3 text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold text-accent",
						children: copy("offers")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-ink",
						children: "RAAH50 · ₹50 off the first prototype ride"
					})] })
				})
			]
		})]
	});
}
function PhoneMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: "size-10",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "14",
			y: "6",
			width: "20",
			height: "36",
			rx: "4",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M20 10h8",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		})]
	});
}
var LEGAL = {
	terms: {
		title: "Terms and conditions",
		body: [
			"Draft for client review. This is not legal advice and it is not a filed customer agreement.",
			"Raah is a prototype of a marketplace that would connect customers with independent drivers for bike, auto and cab trips across India.",
			"A booking in this prototype does not create a transport contract. No driver is dispatched and no fare is collected.",
			"Production terms will cover eligibility, fares, cancellations, conduct, and the separate rules for app bookings and call-centre bookings.",
			"The company identifiers shown in the app are placeholders until incorporation details are issued."
		]
	},
	privacy: {
		title: "Privacy policy",
		body: [
			"Draft for client review. This is not a filed privacy notice under the Digital Personal Data Protection Act, 2023.",
			"The prototype stores your name, mobile number, saved places, rides and settings only in this browser. Nothing is sent to a Raah server.",
			"Location is read only after you tap a location button or an SMS-style link and allow it. A telephone call does not share GPS.",
			"You can delete the prototype data from Settings. A production service will need a consent record, purpose limitation, retention schedule and a grievance contact.",
			"Profile details are not shown on a public page."
		]
	},
	refund: {
		title: "Refund and cancellation",
		body: [
			"Draft for client review. No money moves in this prototype.",
			"Before a driver is assigned, a live product would cancel without a fee. After arrival, a small cancellation fee may apply. This demo does not charge it.",
			"Failed digital payments would be reversed by the payment gateway to the original method. Cash trips have no digital refund.",
			"Promo codes in this demo are sample rules, not a published offer."
		]
	},
	driver: {
		title: "Driver terms",
		body: [
			"Draft for client review. There is no driver onboarding in this prototype.",
			"A future driver agreement will cover identity checks, vehicle documents, insurance, trip acceptance, fares, and suspension.",
			"The drivers you see here are simulated names and registration numbers. They are not real partners."
		]
	},
	duties: {
		title: "Customer responsibilities",
		body: [
			"Give a pickup a driver can find: a village, bus stop, school, temple, hospital or other landmark when a street address is weak.",
			"Match the vehicle number before you sit. Share the trip with someone you trust if you are travelling alone.",
			"Do not share OTP, UPI PIN or card CVV with a driver, an operator or anyone who calls you.",
			"Treat drivers with respect. Report unsafe behaviour from the safety centre."
		]
	},
	grievance: {
		title: "Grievance redressal",
		body: [
			"Placeholder officer: grievance@raah.example. This inbox is not monitored.",
			"A production grievance cell will acknowledge complaints, including safety, payment and lost items, and publish timelines.",
			"Tickets you raise in this prototype stay on this device with the status Open. They are not reviewed by a person."
		]
	},
	safety: {
		title: "Safety policy",
		body: [
			"Draft for client review. SOS in this prototype does not contact the police, medical services or any response partner.",
			"The intended live flow is: confirm SOS, notify emergency contacts, share the trip, and alert a staffed safety desk. That flow will be advertised only after partners and drills are verified.",
			"Call-centre bookings use the same trip record, driver identity and share controls as app bookings.",
			"Customers can cancel from the active ride screen."
		]
	},
	security: {
		title: "Security design intent",
		body: [
			"This screen describes design intent. It is not a compliance certificate.",
			"Production authentication will use one-time passwords with rate limits, short-lived sessions and role-based access for customers, drivers, operators and admins.",
			"Traffic will be HTTPS only. Sensitive records will be encrypted at rest. Card numbers, CVV and UPI PINs will never be stored; a licensed gateway will tokenize payments.",
			"APIs will validate input and be built to resist injection, cross-site scripting and cross-site request forgery. Secrets will not ship in the app.",
			"Location, file uploads and admin actions will be permissioned and audit-logged. Customers will be able to export or delete their account under the DPDP Act and the rules in force at launch.",
			"This prototype keeps data in the browser only, so those controls are not running yet."
		]
	}
};
function AccountScreen() {
	const copy = useCopy();
	const name = useRaah((s) => s.name);
	const phone = useRaah((s) => s.phone);
	const photo = useRaah((s) => s.photo);
	const open = useRaah((s) => s.open);
	const logout = useRaah((s) => s.logout);
	const items = [
		{
			label: copy("profile"),
			screen: "profile"
		},
		{
			label: copy("payments"),
			screen: "payments"
		},
		{
			label: copy("offers"),
			screen: "offers"
		},
		{
			label: copy("supportTitle"),
			screen: "support"
		},
		{
			label: copy("about"),
			screen: "company"
		},
		{
			label: copy("settings"),
			screen: "settings"
		},
		{
			label: copy("deskDemo"),
			screen: "operator"
		},
		{
			label: copy("review"),
			screen: "notes"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { title: copy("account") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("profile"),
					className: "mb-4 flex w-full items-center gap-3 rounded-3xl bg-paper p-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name,
						photo,
						className: "size-14"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg font-semibold",
							children: name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: ["+91 ", prettyPhone(phone)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs font-semibold text-primary",
							children: copy("verified")
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => open(item.screen),
						className: "flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium",
						children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "›"
						})]
					}, item.screen))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "mt-4 w-full",
					onClick: logout,
					children: copy("logout")
				})
			]
		})]
	});
}
function ProfileScreen() {
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
	const [draft, setDraft] = (0, import_react.useState)(name);
	const [contact, setContact] = (0, import_react.useState)("");
	const [contactPhone, setContactPhone] = (0, import_react.useState)("");
	function pick(target) {
		setTarget(target);
		open("destination");
	}
	function onPhoto(file) {
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
			setPhoto(canvas.toDataURL("image/jpeg", .82));
			URL.revokeObjectURL(url);
		};
		image.src = url;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("profile"),
			subtitle: copy("nameSub"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: draft || name,
						photo,
						className: "size-16"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-semibold text-primary",
						children: ["Change photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: (event) => onPhoto(event.target.files?.[0])
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					"aria-label": copy("namePh")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					onClick: () => draft.trim().length > 1 && setName(draft),
					children: copy("save")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: copy("verified")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold tabular",
					children: ["+91 ", prettyPhone(phone)]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceRow, {
					label: copy("home"),
					value: home?.selection.line,
					onPick: () => pick("home"),
					onClear: home ? () => removePlace("home") : void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceRow, {
					label: copy("work"),
					value: work?.selection.line,
					onPick: () => pick("work"),
					onClear: work ? () => removePlace("work") : void 0
				}),
				extras.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceRow, {
					label: item.label,
					value: item.selection.line,
					onPick: () => pick("extra"),
					onClear: () => removePlace("extra", item.id)
				}, item.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "w-full",
					onClick: () => pick("extra"),
					children: copy("addPlace")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: copy("emergency")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-2",
					children: [
						emergency.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl bg-paper px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted tabular",
								children: ["+91 ", prettyPhone(item.phone)]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-danger",
								onClick: () => removeEmergency(item.id),
								children: copy("cancel")
							})]
						}, item.id)),
						emergency.length < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								value: contact,
								onChange: (e) => setContact(e.target.value),
								placeholder: copy("namePh"),
								"aria-label": copy("emergency")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inputClass,
								inputMode: "numeric",
								value: contactPhone,
								onChange: (e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
								placeholder: "98XXXXXX00",
								"aria-label": copy("phoneTitle")
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "soft",
							disabled: !contact.trim() || !/^[6-9]\d{9}$/.test(contactPhone),
							onClick: () => {
								saveEmergency(contact, contactPhone);
								setContact("");
								setContactPhone("");
							},
							children: copy("save")
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm font-semibold text-primary",
					onClick: () => open("language"),
					children: copy("language")
				})
			]
		})]
	});
}
function PlaceRow({ label, value, onPick, onClear }) {
	const copy = useCopy();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onPick,
			className: "min-h-14 flex-1 rounded-2xl border border-line px-3 py-2 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs font-semibold text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm",
				children: value ?? copy("none")
			})]
		}), onClear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onClear,
			className: "h-12 px-2 text-sm text-danger",
			children: copy("cancel")
		}) : null]
	});
}
function SettingsScreen() {
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
		[
			copy("simple"),
			copy("simpleHint"),
			simple,
			"simpleMode"
		],
		[
			copy("large"),
			"Easier reading on a small phone.",
			large,
			"largeText"
		],
		[
			copy("contrast"),
			"Stronger text and borders.",
			contrast,
			"highContrast"
		],
		[
			copy("voice"),
			copy("voiceHint"),
			voice,
			"voiceOn"
		],
		[
			"Offers by message",
			"Prototype preference only. No messages are sent.",
			marketing,
			"marketing"
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("settings"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 px-4",
			children: [
				rows.map(([label, hint, on, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": on,
					onClick: () => toggle(key),
					className: "flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: hint
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `h-7 w-12 rounded-full p-1 ${on ? "bg-primary" : "bg-line"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block size-5 rounded-full bg-surface ${on ? "ml-5" : ""}` })
					})]
				}, key)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "w-full",
					onClick: () => open("language"),
					children: copy("language")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: copy("deleteAccount")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: copy("deleteHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "danger",
						className: "mt-3 w-full",
						onClick: wipe,
						children: copy("deleteAccount")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: copy("logoutHint")
				})
			]
		})]
	});
}
function SafeScreen() {
	const copy = useCopy();
	const open = useRaah((s) => s.open);
	const emergency = useRaah((s) => s.emergency);
	const cards = [
		[
			copy("safeSos"),
			copy("sosBody"),
			"sos"
		],
		[
			copy("safeShare"),
			copy("shareBody"),
			"share"
		],
		[
			copy("safeId"),
			"Check the name and the number plate on the car or auto before the trip starts.",
			"tracking"
		],
		[
			copy("supportTitle"),
			copy("ruralBody"),
			"support"
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("safeTitle"),
			subtitle: copy("on3b")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("sos"),
					className: "w-full rounded-3xl bg-danger px-4 py-4 text-left text-primary-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-2xl font-semibold",
						children: copy("sos")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: "Two taps. This demo contacts nobody."
					})]
				}),
				cards.map(([title, body, screen]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open(screen),
					className: "w-full rounded-3xl border border-line p-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-muted",
						children: body
					})]
				}, title)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: copy("safeContacts")
					}),
					emergency.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: copy("sosNeed")
					}) : null,
					emergency.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: [
							item.name,
							" · +91 ",
							prettyPhone(item.phone)
						]
					}, item.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						className: "mt-3",
						onClick: () => open("profile"),
						children: copy("emergency")
					})
				] })
			]
		})]
	});
}
function SosScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const armed = useRaah((s) => s.sosArmed);
	const setArmed = useRaah((s) => s.setSosArmed);
	const emergency = useRaah((s) => s.emergency);
	const [step, setStep] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("sosTitle"),
		subtitle: copy("sosBody"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: "danger",
				children: "Not connected to emergency services"
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "danger",
				className: "w-full",
				onClick: () => setStep(1),
				children: copy("sosConfirm")
			}) : null,
			step === 1 && !armed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Confirm this is intentional."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "A second tap stops an accidental SOS. Still nothing is dialled."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "line",
						onClick: () => setStep(0),
						children: copy("cancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "danger",
						onClick: () => setArmed(true),
						children: copy("sos")
					})]
				})
			] }) : null,
			armed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: copy("sosDone")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 list-disc space-y-1 pl-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Would notify ",
							emergency.length ? emergency.map((item) => item.name).join(", ") : "no saved contacts",
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Would open the trip share for those contacts." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Would alert a safety desk after that desk exists." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "mt-3",
					onClick: () => setArmed(false),
					children: copy("close")
				})
			] }) : null
		]
	})] });
}
function CallScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const open = useRaah((s) => s.open);
	const steps = [
		copy("how1"),
		copy("how2"),
		copy("how3"),
		copy("how4"),
		copy("how5")
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("callTitle"),
			subtitle: copy("callLead"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-accent px-4 py-5 text-accent-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: copy("official")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-4xl tabular",
							children: company.supportPhone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: copy("numberNote")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${company.supportTel}`,
							className: "mt-4 flex h-12 items-center justify-center rounded-2xl bg-surface font-semibold text-ink",
							children: copy("callNow")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: copy("how")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-2",
					children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 rounded-2xl bg-paper px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-ink",
							children: index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
					}, step))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: copy("callLang")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: copy("openLink")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: copy("openLinkNote")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "mt-3 w-full",
						onClick: () => open("consent"),
						children: copy("openLink")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "w-full",
					onClick: () => open("operator"),
					children: copy("openDesk")
				})
			]
		})]
	});
}
function ConsentScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const consent = useRaah((s) => s.consent);
	const setConsent = useRaah((s) => s.setConsent);
	const pickup = useRaah((s) => s.desk.pickup) ?? useRaah((s) => s.pickup);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("consentTitle"),
		subtitle: copy("consentBody"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {
				pickup,
				caption: consent === "allowed" ? copy("sharingOn") : copy("sharingOff")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: consent === "allowed" ? "ok" : consent === "denied" ? "danger" : "warn",
				children: consent === "allowed" ? copy("sharingOn") : consent === "denied" ? copy("sharingOff") : copy("linkWaiting")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					onClick: () => setConsent("denied"),
					children: copy("dontShare")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: () => setConsent("allowed"),
					children: copy("allowOnce")
				})]
			})
		]
	})] });
}
var OFFERS = [
	{
		code: "RAAH50",
		title: "First ride",
		detail: "₹50 off once on a prototype booking."
	},
	{
		code: "FEST25",
		title: "Festival week",
		detail: "Sample festive offer. 10% off, capped at ₹40."
	},
	{
		code: "VILLAGE20",
		title: "Town and village",
		detail: "₹20 off bike or auto outside the big cities."
	},
	{
		code: "CITY15",
		title: "City roads",
		detail: "₹15 off in metros and cities."
	},
	{
		code: "REFER75",
		title: "Referral sample",
		detail: "₹75 off once. A live referral would credit both people after the trip."
	}
];
function OffersScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const stack = useRaah((s) => s.stack);
	const setPromoInput = useRaah((s) => s.setPromoInput);
	const setToast = useRaah((s) => s.setToast);
	const [sponsor, setSponsor] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("offersTitle"),
			subtitle: copy("offersSub"),
			onBack: stack.length ? back : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [sponsor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-paper-deep p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted",
						children: "Sample sponsor · not a live advertisement"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-semibold",
						children: "Monsoon check on two-wheelers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "A configured banner can sit here. It does not cover the booking buttons."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 text-sm font-semibold",
						onClick: () => setSponsor(false),
						children: copy("close")
					})
				]
			}) : null, OFFERS.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: offer.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: offer.detail
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: offer.code })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "soft",
				className: "mt-3",
				onClick: () => {
					setPromoInput(offer.code);
					setToast(`${offer.code} ${copy("applied")}. Add it on the fare screen.`);
				},
				children: copy("apply")
			})] }, offer.code))]
		})]
	});
}
var FAQS = [
	["How do I book without the app?", "Call the number on Book a ride by call. Say your mobile number and a landmark."],
	["Does the call share my GPS?", "No. GPS is shared only if you open the location link and tap Allow."],
	["Is the fare final?", "The number in this prototype is a sample. A live fare can change with route, waiting and tolls."],
	["What does SOS do?", "Here it only shows the intended flow. It does not call the police."],
	["Can I pay cash?", "Yes. Cash is a first-class option, especially where digital payments are unfamiliar."]
];
function SupportScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const open = useRaah((s) => s.open);
	const tickets = useRaah((s) => s.tickets);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("supportTitle"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${company.supportTel}`,
					className: "block rounded-3xl bg-primary px-4 py-4 text-primary-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm",
							children: copy("callNow")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl tabular",
							children: company.supportPhone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm",
							children: company.hours
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: copy("ruralTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: copy("ruralBody")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "mt-3",
						variant: "soft",
						onClick: () => open("call"),
						children: copy("callCta")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: copy("faq")
				}),
				FAQS.map(([q, a]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded-2xl border border-line px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: a
					})]
				}, q)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					onClick: () => open("ticket"),
					children: copy("ticket")
				}),
				tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: ticket.topic
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: "warn",
						children: ticket.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: ticket.text
				})] }, ticket.id))
			]
		})]
	});
}
function TicketScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	const add = useRaah((s) => s.addTicket);
	const [topic, setTopic] = (0, import_react.useState)("Booking");
	const [text, setText] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("ticket"),
		subtitle: copy("ticketSent"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"Booking",
					"Payment",
					"Lost item",
					"Driver",
					"Safety",
					"Other"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTopic(item),
					className: `h-10 rounded-full px-3 text-sm font-semibold ${topic === item ? "bg-ink text-surface" : "bg-paper"}`,
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "min-h-28 w-full rounded-2xl border border-line bg-paper p-3",
				value: text,
				onChange: (e) => setText(e.target.value),
				"aria-label": copy("ticket")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "w-full",
				disabled: text.trim().length < 4,
				onClick: () => {
					add(topic, text.trim());
					setText("");
					back();
				},
				children: copy("save")
			})
		]
	})] });
}
function PaymentsScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const payment = useRaah((s) => s.payment);
	const setPayment = useRaah((s) => s.setPayment);
	const failed = useRaah((s) => s.payFailed);
	const setFailed = useRaah((s) => s.setPayFailed);
	const back = useRaah((s) => s.back);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("payments"),
			subtitle: copy("paySecure"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 px-4",
			children: [
				PAY_METHODS.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPayment(method),
					className: `flex h-14 w-full items-center justify-between rounded-2xl border px-3 text-left ${payment === method ? "border-primary bg-primary-soft" : "border-line"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: payLabel(lang, method)
					}), payment === method ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-primary",
						children: copy("applied")
					}) : null]
				}, method)),
				payment === "qr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Sample QR · not payable"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrMark, {})] }) : null,
				payment === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: copy("cashNote")
				}) : null,
				(payment === "credit" || payment === "debit") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "A live checkout would collect the card inside the gateway. This screen never asks for a card number or CVV."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "w-full",
					onClick: () => setFailed(true),
					children: copy("payFail")
				}),
				failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-danger",
						children: copy("payFail")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: copy("payFailBody")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						className: "mt-3",
						onClick: () => setFailed(false),
						children: copy("close")
					})
				] }) : null
			]
		})]
	});
}
function QrMark() {
	const cells = Array.from({ length: 49 }, (_, i) => i * 17 % 7 > 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid w-40 grid-cols-7 gap-1",
		"aria-hidden": true,
		children: cells.map((on, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `aspect-square ${on ? "bg-ink" : "bg-paper"}` }, i))
	});
}
function CompanyScreen() {
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
		["security", copy("securityTitle")]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("about"),
			subtitle: company.tagline,
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: company.brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: company.legalName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: copy("office")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: company.office
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-danger",
						children: copy("placeholder")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: [
							copy("cin"),
							": ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular",
								children: company.cin
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							copy("gstin"),
							": ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular",
								children: company.gstin
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: company.supportPhone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: company.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: company.website
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: company.grievance
					})
				] }),
				rows.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setLegal(id),
					className: "flex h-12 w-full items-center justify-between rounded-2xl border border-line px-3 text-left font-medium",
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "›"
					})]
				}, id))
			]
		})]
	});
}
function LegalScreen() {
	const back = useRaah((s) => s.back);
	const page = LEGAL[useRaah((s) => s.legalDoc)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: page.title,
			subtitle: "English master · draft for review, not a filed policy.",
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 px-4",
			children: page.body.map((para) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-ink",
				children: para
			}, para))
		})]
	});
}
function NotesScreen() {
	const copy = useCopy();
	const back = useRaah((s) => s.back);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("review"),
			subtitle: copy("notesLead"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4 text-sm leading-relaxed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "You can click through"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted",
					children: "Language, login, a booking from a city or a village, a simulated ride, SOS, offers, support, and the company placeholders. On a wide screen the call desk sits beside the phone."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Simulated, not live"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted",
					children: "OTP, fares, drivers, movement on the map, chat, payments, tickets and SOS. The map is a schematic of sample places, not a navigation feed. Device location, if you allow it, only snaps to the nearest sample area."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Still to integrate"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted",
					children: "Maps provider, SMS and voice, a real call centre, driver app, payments gateway, emergency partners, and admin-managed company registration. Android and iOS builds can wrap this product later. This review build is the customer and desk experience, not an installed APK."
				})] })
			]
		})]
	});
}
function PlacePicker() {
	const copy = useCopy();
	const target = useRaah((s) => s.placeTarget);
	const back = useRaah((s) => s.back);
	const choose = useRaah((s) => s.choose);
	const home = useRaah((s) => s.home);
	const work = useRaah((s) => s.work);
	const extras = useRaah((s) => s.extras);
	const recents = useRaah((s) => s.recents);
	const pickup = useRaah((s) => s.pickup);
	const setToast = useRaah((s) => s.setToast);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(pickup.placeId);
	const title = target === "pickup" ? copy("pickupTitle") : target === "drop" ? copy("dropTitle") : copy("addPlace");
	const results = (0, import_react.useMemo)(() => {
		return searchPlaces(query).filter((place) => {
			if (filter === "all") return true;
			if (filter === "city") return place.kind === "city" || place.kind === "metro";
			return place.kind === filter;
		});
	}, [query, filter]);
	const saved = [
		home,
		work,
		...extras
	].filter((item) => item != null);
	const focused = results.find((place) => place.id === openId) ?? results[0];
	function useGps() {
		if (!navigator.geolocation) {
			setToast(copy("gpsDenied"));
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			const place = nearestPlace(pos.coords.latitude, pos.coords.longitude);
			const landmark = place.landmarks[0];
			choose(toSelection(place, landmark, "gps"));
			setToast(`${copy("gpsSnapped")} ${place.name}.`);
		}, () => setToast(copy("gpsDenied")), {
			enableHighAccuracy: true,
			timeout: 8e3,
			maximumAge: 0
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title,
			subtitle: copy("unmapped"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: copy("searchPh"),
					"aria-label": copy("search")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: [
						["all", "filterAll"],
						["city", "filterCity"],
						["town", "filterTown"],
						["village", "filterVillage"]
					].map(([id, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: `h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${filter === id ? "bg-ink text-surface" : "bg-paper text-ink"}`,
						children: copy(key)
					}, id))
				}),
				target === "pickup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: useGps,
					className: "flex h-12 w-full items-center gap-3 rounded-2xl bg-primary-soft px-3 text-left text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: copy("tryGps")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs",
						children: copy("gpsNote")
					})] })]
				}) : null,
				saved.length > 0 && !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-semibold text-muted",
					children: copy("saved")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: saved.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => choose(item.selection),
						className: "flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: item.slot === "extra" ? item.label : copy(item.slot === "home" ? "home" : "work")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-muted",
							children: item.selection.line
						})] })]
					}, item.id))
				})] }) : null,
				recents.length > 0 && !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-semibold text-muted",
					children: copy("recent")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: recents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => choose({
							...item,
							source: "recent"
						}),
						className: "max-w-56 shrink-0 rounded-2xl bg-paper px-3 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-muted",
							children: item.line
						})]
					}, item.landmarkId))
				})] }) : null,
				focused ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {
					pickup: toSelection(focused, focused.landmarks[0], "map"),
					className: "h-52",
					caption: copy("villageNote")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: focused.landmarks.map((landmark) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => choose(toSelection(focused, landmark, "map")),
						className: "min-h-12 rounded-2xl border border-line px-3 py-2 text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: landmark.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: landmark.hint
						})]
					}, landmark.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-muted",
							children: copy("around")
						}),
						results.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpenId(place.id),
								className: "flex w-full items-center justify-between px-3 py-3 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: place.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: [
										place.district,
										", ",
										place.state
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: place.kind === "village" ? "warn" : "line",
									children: kindLabel(place.kind)
								})]
							}), openId === place.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1 border-t border-line px-2 py-2",
								children: place.landmarks.map((landmark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => choose(toSelection(place, landmark, "search")),
									className: "flex min-h-12 w-full items-center rounded-xl px-2 text-left hover:bg-paper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-medium",
										children: landmark.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted",
										children: landmark.hint
									})] })
								}, landmark.id))
							}) : null]
						}, place.id)),
						results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No sample place matches that search."
						}) : null
					]
				})
			]
		})]
	});
}
function kindLabel(kind) {
	if (kind === "metro") return "Metro";
	if (kind === "city") return "City";
	if (kind === "town") return "Town";
	return "Village";
}
function TrackingScreen() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const ride = useRide(true);
	const tick = useRaah((s) => s.tickRide);
	const complete = useRaah((s) => s.completeRide);
	const open = useRaah((s) => s.open);
	const [why, setWhy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => tick(), 800);
		return () => window.clearInterval(id);
	}, [tick]);
	if (!ride || !ride.driver) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: copy("searching")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "mt-4",
			onClick: () => useRaah.getState().replace("home"),
			children: copy("navHome")
		})]
	});
	const leftKm = Math.max(.2, Math.round(ride.fare.km * (1 - ride.progress) * 10) / 10);
	const leftMin = Math.max(1, Math.round(ride.fare.minutes * (1 - ride.progress)));
	const phase = ride.status === "ongoing" ? "to_drop" : "to_pickup";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapView, {
				pickup: ride.pickup,
				drop: ride.drop,
				progress: ride.progress,
				phase,
				className: "h-72",
				caption: copy("trackSim")
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4 pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: ride.status === "ongoing" ? copy("onTrip") : copy("arriving")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-4xl tabular",
							children: [
								leftMin,
								" ",
								copy("min")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular",
							children: [
								leftKm,
								" km · ",
								copy("trackSim")
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: "warn",
						children: ride.source === "call" ? copy("callCta") : copy("proto")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary",
						style: { width: `${Math.round(ride.progress * 100)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-3xl border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: ride.driver.name,
							className: "size-14"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: ride.driver.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										ride.driver.rating,
										" · ",
										ride.driver.trips,
										" trips · ",
										ride.driver.colour
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: copy("simDriver")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border-2 border-ink bg-road px-2 py-1 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold",
								children: copy("plate")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold tabular",
								children: ride.driver.plate
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${company.supportTel}`,
							className: "grid h-16 place-items-center rounded-2xl bg-paper text-center text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" }), copy("callDriver")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => open("chat"),
							className: "grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" }), copy("message")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => open("share"),
							className: "grid h-16 place-items-center rounded-2xl bg-paper text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-5" }), copy("shareTrip")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => open("sos"),
							className: "grid h-16 place-items-center rounded-2xl bg-danger-soft text-xs font-semibold text-danger",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5" }), copy("sos")]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						vehicleLabel(lang, ride.vehicle),
						" · ",
						copy("callDriver"),
						" opens your dialer for the prototype desk, not a live driver."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "line",
						onClick: () => setWhy((v) => !v),
						children: copy("cancelRide")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						onClick: complete,
						children: copy("endDemo")
					})]
				}),
				why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelBox, {}) : null
			]
		})]
	});
}
function CancelBox() {
	const copy = useCopy();
	const cancel = useRaah((s) => s.cancelRide);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-paper p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm font-semibold",
				children: copy("cancelWhy")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"Plans changed",
					"Wrong pickup",
					"Wait is too long",
					"Booked by mistake"
				].map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => cancel(reason),
					className: "h-10 rounded-full bg-surface px-3 text-sm",
					children: reason
				}, reason))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "No cancellation fee is charged in this prototype."
			})
		]
	});
}
function CompleteScreen() {
	const copy = useCopy();
	const ride = useRide(false);
	const rate = useRaah((s) => s.rateRide);
	const [stars, setStars] = (0, import_react.useState)(5);
	const [text, setText] = (0, import_react.useState)("");
	if (!ride) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: copy("completed")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: copy("trackSim")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-5xl tabular",
				children: inr(ride.fare.total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					ride.fare.km,
					" km · ",
					payLabel(useRaah.getState().lang, ride.payment)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-semibold",
				children: copy("rate")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2",
				children: [
					1,
					2,
					3,
					4,
					5
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStars(n),
					className: `grid size-12 place-items-center rounded-2xl text-lg font-semibold ${n <= stars ? "bg-accent text-accent-ink" : "bg-paper"}`,
					"aria-label": `${n}`,
					children: n
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "mt-3 min-h-24 w-full rounded-2xl border border-line bg-paper p-3 text-base outline-none",
				value: text,
				onChange: (event) => setText(event.target.value),
				placeholder: copy("feedbackPh")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-4 w-full",
				onClick: () => rate(stars, text),
				children: copy("done")
			})
		]
	});
}
function HistoryScreen() {
	const copy = useCopy();
	const rides = useRaah((s) => s.rides);
	const select = useRaah((s) => s.selectRide);
	const start = useRaah((s) => s.startScheduled);
	const [tab, setTab] = (0, import_react.useState)("all");
	const filters = [
		{
			id: "all",
			label: copy("filterAll")
		},
		{
			id: "scheduled",
			label: copy("upcoming")
		},
		{
			id: "arriving",
			label: copy("active")
		},
		{
			id: "completed",
			label: copy("completed")
		},
		{
			id: "cancelled",
			label: copy("cancelled")
		}
	];
	const list = rides.filter((ride) => {
		if (tab === "all") return true;
		if (tab === "arriving") return ride.status === "arriving" || ride.status === "ongoing" || ride.status === "searching";
		return ride.status === tab;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { title: copy("navRides") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto px-4",
				children: filters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(item.id),
					className: `h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${tab === item.id ? "bg-ink text-surface" : "bg-paper"}`,
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2 px-4",
				children: [list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: copy("emptyRides")
				}) : null, list.map((ride) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border border-line p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(ride.id),
						className: "flex w-full items-center gap-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleArt, {
								id: ride.vehicle,
								className: "h-10 w-16"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-semibold",
									children: ride.drop.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm text-muted",
									children: ride.pickup.label
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold tabular",
									children: inr(ride.fare.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: ride.status === "cancelled" ? "danger" : ride.status === "completed" ? "ok" : "warn",
									children: ride.status
								})]
							})
						]
					}), ride.status === "scheduled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "mt-3 w-full",
						variant: "soft",
						onClick: () => start(ride.id),
						children: copy("bookNow")
					}) : null]
				}, ride.id))]
			})
		]
	});
}
function RideDetail() {
	const copy = useCopy();
	const lang = useRaah((s) => s.lang);
	const ride = useSelected();
	const back = useRaah((s) => s.back);
	const report = useRaah((s) => s.reportOnRide);
	const [lost, setLost] = (0, import_react.useState)("");
	const [issue, setIssue] = (0, import_react.useState)("");
	if (!ride) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			title: copy("receipt"),
			subtitle: new Date(ride.createdAt).toLocaleString("en-IN"),
			onBack: back
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: ride.source === "call" ? "Booked by the call desk · prototype" : "Booked in the app · prototype"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopLine, {
					label: copy("from"),
					value: ride.pickup.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopLine, {
					label: copy("to"),
					value: ride.drop.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: copy("base"),
							v: inr(ride.fare.base)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: copy("distance"),
							v: inr(ride.fare.distanceCharge)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: copy("tax"),
							v: inr(ride.fare.tax)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: copy("discount"),
							v: inr(ride.fare.discount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: copy("total"),
							v: inr(ride.fare.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								vehicleLabel(lang, ride.vehicle),
								" · ",
								payLabel(lang, ride.payment),
								" · ",
								ride.status
							]
						}),
						ride.driver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [
								ride.driver.name,
								" · ",
								ride.driver.plate,
								" · ",
								ride.driver.rating
							]
						}) : null,
						ride.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: ["Your rating: ", ride.rating]
						}) : null,
						ride.cancelReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: ride.cancelReason
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-medium",
					children: [copy("lost"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${inputClass} mt-1`,
						value: lost,
						onChange: (e) => setLost(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "w-full",
					disabled: lost.trim().length < 3,
					onClick: () => report("lost", lost),
					children: copy("lost")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-medium",
					children: [copy("issue"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "mt-1 min-h-20 w-full rounded-2xl border border-line bg-paper p-3",
						value: issue,
						onChange: (e) => setIssue(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					className: "w-full",
					disabled: issue.trim().length < 3,
					onClick: () => report("issue", issue),
					children: copy("issue")
				})
			]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular",
			children: v
		})]
	});
}
function StopLine({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs font-semibold text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block",
		children: value
	})] });
}
function ChatScreen() {
	const copy = useCopy();
	const ride = useRide(true);
	const back = useRaah((s) => s.back);
	const add = useRaah((s) => s.addMessage);
	const [text, setText] = (0, import_react.useState)("");
	function send(value) {
		const clean = value.trim();
		if (!clean) return;
		add(clean, "you");
		setText("");
		window.setTimeout(() => useRaah.getState().addMessage(copy("driverReply"), "driver"), 600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("chatTitle"),
		subtitle: copy("chatSim"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 px-4",
		children: [
			(ride?.messages ?? []).map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `max-w-xs rounded-2xl px-3 py-2 text-sm ${message.from === "you" ? "ml-auto bg-primary text-primary-ink" : "bg-paper"}`,
				children: message.text
			}, index)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 pt-2",
				children: [
					copy("quick1"),
					copy("quick2"),
					copy("quick3")
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => send(item),
					className: "h-10 rounded-full bg-paper px-3 text-sm",
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: text,
					onChange: (e) => setText(e.target.value),
					"aria-label": copy("message")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "shrink-0",
					onClick: () => send(text),
					children: copy("message")
				})]
			})
		]
	})] });
}
function ShareScreen() {
	const copy = useCopy();
	const ride = useRide(true) ?? useSelected();
	const back = useRaah((s) => s.back);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
		title: copy("shareTitle"),
		subtitle: copy("shareBody"),
		onBack: back
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-line p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-primary",
					children: "RAAH TRIP PREVIEW"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl",
					children: ride?.driver?.name ?? "Driver not assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tabular text-lg",
					children: ride?.driver?.plate
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: ride?.pickup.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: ride?.drop.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted",
					children: "Not a public link. Expires when a live trip would end."
				})
			]
		})
	})] });
}
function useRide(activeOnly) {
	const rides = useRaah((s) => s.rides);
	const activeId = useRaah((s) => s.activeRideId);
	const selected = useRaah((s) => s.selectedRideId);
	const id = activeOnly ? activeId : selected;
	return rides.find((ride) => ride.id === id) ?? null;
}
function useSelected() {
	const rides = useRaah((s) => s.rides);
	const selected = useRaah((s) => s.selectedRideId);
	return rides.find((ride) => ride.id === selected) ?? null;
}
function CustomerScreens() {
	switch (useRaah((s) => s.screen)) {
		case "splash": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
		case "onboarding": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
		case "language": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageScreen, {});
		case "phone": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneScreen, {});
		case "otp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtpScreen, {});
		case "name": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameScreen, {});
		case "home": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
		case "pickup":
		case "destination": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePicker, {});
		case "vehicles": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehiclesScreen, {});
		case "fare": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FareScreen, {});
		case "confirm": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmScreen, {});
		case "assigning": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssigningScreen, {});
		case "tracking": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingScreen, {});
		case "complete": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteScreen, {});
		case "history": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryScreen, {});
		case "ride": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RideDetail, {});
		case "payments": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsScreen, {});
		case "offers": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OffersScreen, {});
		case "support": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportScreen, {});
		case "ticket": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketScreen, {});
		case "company": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyScreen, {});
		case "legal": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalScreen, {});
		case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, {});
		case "profile": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileScreen, {});
		case "safe": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeScreen, {});
		case "sos": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SosScreen, {});
		case "call": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallScreen, {});
		case "consent": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsentScreen, {});
		case "chat": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatScreen, {});
		case "share": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareScreen, {});
		case "account": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountScreen, {});
		case "operator": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorConsole, { onBack: () => useRaah.getState().back() });
		case "notes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesScreen, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
	}
}
var TABS = [
	"home",
	"history",
	"offers",
	"safe",
	"account"
];
function TabBar() {
	const copy = useCopy();
	const screen = useRaah((s) => s.screen);
	const tab = useRaah((s) => s.tab);
	const items = [
		{
			id: "home",
			label: copy("navHome"),
			icon: House
		},
		{
			id: "history",
			label: copy("navRides"),
			icon: History
		},
		{
			id: "offers",
			label: copy("navOffers"),
			icon: Tag
		},
		{
			id: "safe",
			label: copy("navSafety"),
			icon: Shield
		},
		{
			id: "account",
			label: copy("navAccount"),
			icon: UserRound
		}
	];
	if (!TABS.includes(screen)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid grid-cols-5 border-t border-line bg-surface px-1 py-1",
		children: items.map((item) => {
			const Icon = item.icon;
			const on = screen === item.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => tab(item.id),
				className: `flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold ${on ? "text-primary" : "text-muted"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
			}, item.id);
		})
	});
}
function ProtoChrome() {
	const copy = useCopy();
	const consent = useRaah((s) => s.consent);
	const open = useRaah((s) => s.open);
	const toast = useRaah((s) => s.toast);
	const clear = useRaah((s) => s.clearToast);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "bg-ink px-3 py-1.5 text-center text-xs font-medium text-surface",
			children: copy("proto")
		}),
		consent === "link_sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => open("consent"),
			className: "w-full bg-accent px-3 py-2 text-left text-sm font-semibold text-accent-ink",
			children: copy("linkWaiting")
		}) : null,
		toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: clear,
			className: "w-full bg-primary-soft px-3 py-2 text-left text-sm text-primary",
			children: toast
		}) : null
	] });
}
function RaahApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		Promise.resolve(useRaah.persist.rehydrate()).then(() => {
			if (!live) return;
			const state = useRaah.getState();
			if (!state.authed && ![
				"splash",
				"onboarding",
				"language",
				"phone",
				"otp"
			].includes(state.screen)) state.replace(state.seenOnboarding ? state.languageChosen ? "phone" : "language" : "splash");
			else if (state.authed && !state.name) state.replace("name");
			setReady(true);
		});
		return () => {
			live = false;
		};
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "text-6xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Every road. Every village."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {});
}
function Stage() {
	const contrast = useRaah((s) => s.highContrast);
	const large = useRaah((s) => s.largeText);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.contrast = contrast ? "high" : "normal";
		document.documentElement.dataset.type = large ? "large" : "base";
	}, [contrast, large]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[28rem_minmax(0,1fr)] lg:gap-4 lg:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-contrast": contrast ? "high" : "normal",
			"data-type": large ? "large" : "base",
			className: "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface lg:h-[calc(100dvh-2rem)] lg:min-h-0 lg:overflow-hidden lg:rounded-3xl lg:border lg:border-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtoChrome, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerScreens, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden min-h-0 lg:block lg:h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-3xl lg:border lg:border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorConsole, {})
		})]
	});
}
var SplitComponent = RaahApp;
//#endregion
export { SplitComponent as component };
