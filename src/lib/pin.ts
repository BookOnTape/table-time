/**
 * Passcode helpers. The passcode is stored as a SHA-256 hash so a curious
 * older sibling poking at localStorage does not see it in plain text. This
 * is a convenience lock, not a security boundary: anyone with the device
 * can clear storage to reset it to the default.
 */
export const DEFAULT_PIN = "1234";
export const PIN_LENGTH = 4;

const encoder = new TextEncoder();

export async function hashPin(pin: string): Promise<string> {
  if (!("crypto" in globalThis) || !crypto.subtle) {
    // Insecure contexts (plain http on a LAN) lack SubtleCrypto. Fall back
    // to a marked plain value so the lock still functions.
    return "plain:" + pin;
  }
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode("tabletime|" + pin));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPin(pin: string, storedHash: string | null): Promise<boolean> {
  const expected = storedHash ?? (await hashPin(DEFAULT_PIN));
  return (await hashPin(pin)) === expected;
}

export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}
