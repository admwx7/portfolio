/**
 * Allows multiple calls within a set period of time to resolve to a single run of a set of logic on either rising or
 * falling of the timeout period.
 *
 * @param func - The logic to run when debouncing.
 * @param timeout - The time to wait between calls to func in milliseconds.
 * @param rising - Toggles between rising and falling calls (start or end of timeout).
 * @returns - Function for debouncing.
 */
export function debounce(
  this: unknown,
  func: (..._args: unknown[]) => void,
  timeout: number,
  rising = false
): (..._args: unknown[]) => void {
  let timer: number | null = null;

  return (..._args: unknown[]) => {
    // eslint-disable-next-line no-invalid-this, @typescript-eslint/no-explicit-any
    if (rising && !timer) func.apply(this as any, _args);

    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      // eslint-disable-next-line no-invalid-this, @typescript-eslint/no-explicit-any
      if (!rising) func.apply(this as any, _args);
    }, timeout);
  };
}
