/**
 * Whether the router has pushed at least one entry this session. TopBar uses
 * this to decide between `navigate(-1)` (pop, so hardware/gesture back keeps
 * working) and `navigate(backTo)` (push, for a page opened via deep link with
 * no history to pop).
 */
let navigated = false;

export function markNavigated(): void {
  navigated = true;
}

export function hasInAppHistory(): boolean {
  return navigated;
}
