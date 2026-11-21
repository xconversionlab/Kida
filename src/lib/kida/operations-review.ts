export type CaptainDocumentChecks = {
  identity: boolean;
  drivingLicence: boolean;
  commercialPermit: boolean;
  insurance: boolean;
  fitnessPuc: boolean;
  vehicleRegistration: boolean;
  captainPhoto: boolean;
};

export const REQUIRED_CAPTAIN_DOCUMENT_CHECKS = [
  "identity",
  "drivingLicence",
  "commercialPermit",
  "insurance",
  "fitnessPuc",
  "vehicleRegistration",
  "captainPhoto",
] as const satisfies readonly (keyof CaptainDocumentChecks)[];

/** Approval requires Operations to check every original document. */
export function isCaptainApplicationApprovalReady(
  checks: Partial<CaptainDocumentChecks> | null | undefined,
): checks is CaptainDocumentChecks {
  return REQUIRED_CAPTAIN_DOCUMENT_CHECKS.every((key) => checks?.[key] === true);
}

export function emptyCaptainDocumentChecks(): CaptainDocumentChecks {
  return {
    identity: false,
    drivingLicence: false,
    commercialPermit: false,
    insurance: false,
    fitnessPuc: false,
    vehicleRegistration: false,
    captainPhoto: false,
  };
}
