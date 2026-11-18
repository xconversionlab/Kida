import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

function secret(): string {
  const value = process.env.KIDA_TRIP_PIN_SECRET?.trim()
    || process.env.BETTER_AUTH_SECRET?.trim();
  if (!value || value.length < 32) {
    throw new Error("Trip PIN encryption requires a stable server-only KIDA_TRIP_PIN_SECRET (at least 32 characters).");
  }
  return value;
}

function encryptionKey(): Buffer {
  return createHash("sha256").update(secret()).digest();
}

/** HMAC verifier and AES-GCM owner-retrieval value; plaintext is never persisted. */
export function createTripPinCredentials(bookingId: string, tripPin: string) {
  if (!/^\d{4}$/.test(tripPin)) throw new Error("A four-digit trip PIN is required.");
  const key = secret();
  const hash = createHmac("sha256", key).update(bookingId + ":" + tripPin).digest("hex");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(bookingId, "utf8"));
  const encrypted = Buffer.concat([cipher.update(tripPin, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    tripPinHash: hash,
    tripPinCiphertext: [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join("."),
  };
}

export function decryptTripPin(bookingId: string, ciphertext: string | null): string | null {
  if (!ciphertext) return null;
  const [ivHex, tagHex, encryptedHex] = ciphertext.split(".");
  if (!ivHex || !tagHex || !encryptedHex || !/^[a-f0-9]+$/i.test(ivHex + tagHex + encryptedHex)) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivHex, "hex"));
    decipher.setAAD(Buffer.from(bookingId, "utf8"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
    return /^\d{4}$/.test(plain) ? plain : null;
  } catch {
    return null;
  }
}

export function matchesTripPin(bookingId: string, tripPin: string, storedHash: string | null): boolean {
  if (!storedHash || !/^[a-f0-9]{64}$/i.test(storedHash) || !/^\d{4}$/.test(tripPin)) return false;
  const candidate = Buffer.from(createHmac("sha256", secret()).update(bookingId + ":" + tripPin).digest("hex"), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}
