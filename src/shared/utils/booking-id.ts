import { randomBytes } from "crypto";

/**
 * Generates a short opaque, user-readable booking id like `BKG-7F3A92`.
 * Collision risk is mitigated by unique index + retry at write time.
 */
export function generateBookingId(length: number = 6): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // randomBytes gives 0..255; map to alphabet.
  const bytes = randomBytes(length);
  let suffix = "";
  for (let i = 0; i < length; i += 1) {
    suffix += alphabet[bytes[i] % alphabet.length];
  }
  return `BKG-${suffix}`;
}

