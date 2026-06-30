/** Local demo mode — no backend required. Set NEXT_PUBLIC_DEMO_MODE=false to use real API. */
export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

/** Default XP balance for local demo (marketplace / belanja) */
export const DEMO_STARTING_XP = 500;

export function demoDelay(ms = 350): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
