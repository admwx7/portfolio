/**
 * Allows multiple calls within a set period of time to resolve to a single run of a set of logic on either rising or
 *  falling of the timeout period.
 * @param func - the logic to run when debouncing
 * @param timeout - the time to wait between calls to func in milliseconds
 * @param rising - toggles between rising and falling calls (start or end of timeout)
 */
export function debounce(func: Function, timeout: number, rising = false): (..._args: any[]) => void {
  let timer: number = null;

  return function (..._args: any[]) {
    const _this = this;
    
    if (rising && !timer) func.apply(_this, _args);

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      if (!rising) func.apply(_this, _args);
    }, timeout);
  };
}
