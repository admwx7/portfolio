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
  func: (..._args: unknown[]) => void,
  timeout: number,
  rising = false
): (..._args: unknown[]) => void {
  let timer: number = null;

  return function(..._args: unknown[]) {
    // eslint-disable-next-line no-invalid-this, @typescript-eslint/no-this-alias
    const _this = this;

    if (rising && !timer) func.apply(_this, _args);

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      if (!rising) func.apply(_this, _args);
    }, timeout);
  };
}
