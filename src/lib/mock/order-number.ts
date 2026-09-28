let counter = 1044;

/** Generates sequential QBite order numbers, e.g. QB1045. */
export function nextOrderNumber(): string {
  counter += 1;
  return `QB${counter}`;
}

export function peekOrderNumberSeed(seed: number) {
  counter = seed;
}
