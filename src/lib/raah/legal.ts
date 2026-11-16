import type { LegalDoc } from "./types";

export const LEGAL: Record<LegalDoc, { title: string; body: string[] }> = {
  terms: {
    title: "Terms and conditions",
    body: [
      "Draft for client review. This is not legal advice and it is not a filed customer agreement.",
      "Kida is a prototype of a marketplace that would connect customers with independent drivers for bike, auto and cab trips across India.",
      "A booking in this prototype does not create a transport contract. No driver is dispatched and no fare is collected.",
      "Production terms will cover eligibility, fares, cancellations, conduct, and the separate rules for app bookings and call-centre bookings.",
      "The company identifiers shown in the app are placeholders until incorporation details are issued.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    body: [
      "Draft for client review. This is not a filed privacy notice under the Digital Personal Data Protection Act, 2023.",
      "The prototype stores your name, mobile number, saved places, rides and settings only in this browser. Nothing is sent to a Kida server.",
      "Location is read only after you tap a location button or an SMS-style link and allow it. A telephone call does not share GPS.",
      "You can delete the prototype data from Settings. A production service will need a consent record, purpose limitation, retention schedule and a grievance contact.",
      "Profile details are not shown on a public page.",
    ],
  },
  refund: {
    title: "Refund and cancellation",
    body: [
      "Draft for client review. No money moves in this prototype.",
      "Before a driver is assigned, a live product would cancel without a fee. After arrival, a small cancellation fee may apply. This demo does not charge it.",
      "Failed digital payments would be reversed by the payment gateway to the original method. Cash trips have no digital refund.",
      "Promo codes in this demo are sample rules, not a published offer.",
    ],
  },
  driver: {
    title: "Driver terms",
    body: [
      "Draft for client review. There is no driver onboarding in this prototype.",
      "A future driver agreement will cover identity checks, vehicle documents, insurance, trip acceptance, fares, and suspension.",
      "The drivers you see here are simulated names and registration numbers. They are not real partners.",
    ],
  },
  duties: {
    title: "Customer responsibilities",
    body: [
      "Give a pickup a driver can find: a village, bus stop, school, temple, hospital or other landmark when a street address is weak.",
      "Match the vehicle number before you sit. Share the trip with someone you trust if you are travelling alone.",
      "Do not share OTP, UPI PIN or card CVV with a driver, an operator or anyone who calls you.",
      "Treat drivers with respect. Report unsafe behaviour from the safety centre.",
    ],
  },
  grievance: {
    title: "Grievance redressal",
    body: [
      "Placeholder officer: grievance@raah.example. This inbox is not monitored.",
      "A production grievance cell will acknowledge complaints, including safety, payment and lost items, and publish timelines.",
      "Tickets you raise in this prototype stay on this device with the status Open. They are not reviewed by a person.",
    ],
  },
  safety: {
    title: "Safety policy",
    body: [
      "Draft for client review. SOS in this prototype does not contact the police, medical services or any response partner.",
      "The intended live flow is: confirm SOS, notify emergency contacts, share the trip, and alert a staffed safety desk. That flow will be advertised only after partners and drills are verified.",
      "Call-centre bookings use the same trip record, driver identity and share controls as app bookings.",
      "Customers can cancel from the active ride screen.",
    ],
  },
  security: {
    title: "Security design intent",
    body: [
      "This screen describes design intent. It is not a compliance certificate.",
      "Production authentication will use one-time passwords with rate limits, short-lived sessions and role-based access for customers, drivers, operators and admins.",
      "Traffic will be HTTPS only. Sensitive records will be encrypted at rest. Card numbers, CVV and UPI PINs will never be stored; a licensed gateway will tokenize payments.",
      "APIs will validate input and be built to resist injection, cross-site scripting and cross-site request forgery. Secrets will not ship in the app.",
      "Location, file uploads and admin actions will be permissioned and audit-logged. Customers will be able to export or delete their account under the DPDP Act and the rules in force at launch.",
      "This prototype keeps data in the browser only, so those controls are not running yet.",
    ],
  },
};
