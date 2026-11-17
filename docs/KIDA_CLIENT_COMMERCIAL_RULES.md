# Kida — client commercial rules

These rules were transcribed from the client's WhatsApp instructions received on 17 November 2026. Rates and incentives below are client-supplied; no additional fares or taxes have been invented.

## Customer rate card

| Service | Customer rate |
|---|---:|
| E-Bike | ₹15 per km |
| Auto rickshaw | ₹20 per km |
| Mini cab | ₹25 per km |
| 7-seater cab | ₹30 per km |

The existing Sedan option is hidden from new bookings until the client supplies its rate. The current customer preview calculates the listed per-kilometre rate without adding an unapproved base fare, minimum fare or tax.

## Customer sixth-ride offer

- For every customer account, the first five rides must be completed and paid.
- The next eligible ride is free for a distance strictly below 7 km.
- The free ride applies to cab categories (Mini and 7-seater; Sedan can be included once its rate/category is approved).
- A ride of 7 km or more is charged at the normal fare; the reward remains available for a later eligible cab ride.
- The free sixth ride is funded by Kida. Kida is responsible for paying the Captain for that trip; the amount is not deducted from the Captain's earnings.
- A free ride request reserves that reward until it is completed or cancelled/expired. Completed free rides start a new five-paid-ride cycle.
- The customer app displays the rule and progress from account-backed completed bookings. The fare preview is not a payment/settlement instruction; server-verified route distance and payment integration are still required before public launch.

## Normal trip revenue allocation

- Captain share: 80% of the completed trip fare.
- Kida platform share/commission: 20% of the completed trip fare.
- The 20% platform share is part of the fare allocation, not an extra 20% added on top of the listed per-kilometre fare.
- When the customer pays the Captain directly, the 20% company commission is debited from the Captain's in-app ledger/wallet. Outstanding commission can reduce the ledger below the required opening balance and can be adjusted from future earnings/top-ups.
- When the payment is collected through the platform, the company records the 20% platform share and credits the Captain's 80% share through the ledger.
- On a free sixth ride, customer due is ₹0 and Kida funds the full Captain payout from the company ledger.

## Captain daily bonus

- ₹200 bonus after 15 completed rides in one day.
- Eligible Captain categories: Auto and cab drivers.
- E-Bike Captains are excluded.
- The award is once per Captain per business day, using India time (Asia/Kolkata).

## Compulsory Captain opening ledger balance

- Captains must pay/maintain the compulsory opening ledger balance to accept trips.
- A Captain below the required amount, or with unpaid commission that takes the ledger below that amount, must be blocked from accepting another trip until the balance is paid/toppped up.
- The client has not supplied the rupee amount of the compulsory opening balance. The database setting is intentionally nullable and ride acceptance remains disabled until the company configures that amount. Do not invent a rupee value.

## Implementation boundary

The customer fare card and sixth-ride reward preview are implemented in this branch. The migration adds the financial settings, ledger, booking-allocation and daily-bonus data model for the upcoming Partner app. Captain onboarding, document verification, trip acceptance, wallet top-up collection, actual payouts/commission deductions, and daily-bonus posting are not live because the Partner/dispatch application has not yet been built and connected.
