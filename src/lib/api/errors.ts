export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const flakyKeysTriedOnce = new Set<string>();

/**
 * Fails exactly once per key per session so the UI's error/retry path is
 * exercised deterministically, then succeeds on the very next attempt.
 */
export function simulateFlakeOnce(key: string, message: string) {
  if (!flakyKeysTriedOnce.has(key)) {
    flakyKeysTriedOnce.add(key);
    throw new ApiError(message);
  }
}
