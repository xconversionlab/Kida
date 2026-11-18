import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyCaptainDocumentChecks,
  isCaptainApplicationApprovalReady,
} from "./operations-review.ts";

test("Captain approval fails closed when no documents have been checked", () => {
  assert.equal(isCaptainApplicationApprovalReady(emptyCaptainDocumentChecks()), false);
  assert.equal(isCaptainApplicationApprovalReady(undefined), false);
});

test("Captain approval requires every original-document check", () => {
  const checks = {
    ...emptyCaptainDocumentChecks(),
    identity: true,
    drivingLicence: true,
    commercialPermit: true,
    insurance: true,
    fitnessPuc: true,
  };

  assert.equal(isCaptainApplicationApprovalReady(checks), false);
  checks.vehicleRegistration = true;
  assert.equal(isCaptainApplicationApprovalReady(checks), true);
});

test("false, missing, or non-boolean document checks never satisfy approval", () => {
  const checks = {
    ...emptyCaptainDocumentChecks(),
    identity: true,
    drivingLicence: true,
    commercialPermit: true,
    insurance: true,
    fitnessPuc: true,
    vehicleRegistration: "verified",
  } as unknown as Record<string, boolean>;

  assert.equal(isCaptainApplicationApprovalReady(checks), false);
});
