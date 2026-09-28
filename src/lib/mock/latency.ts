/**
 * Simulated network latency so loading states are exercised the way they
 * would be against a real API. Kept short enough to stay snappy on mobile.
 */
export function wait(minMs = 350, maxMs = 850): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
