export async function sleep(ms: number): Promise<void> {
  const i = Math.round(ms / 1000);
  const dots = '.'.repeat(i === 0 ? 1 : i);
  console.log(dots);
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ts(): string {
  return (new Date()).toISOString();
}

export function tsInt(): number {
  return (new Date()).getTime();
}
