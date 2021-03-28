export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ts(): string {
  return (new Date()).toISOString();
}

export function tsInt(): number {
  return (new Date()).getTime();
}
