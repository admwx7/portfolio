/**
 * Waits for a set number of milliseconds before resolving a promise.
 * @param duration
 */
export function wait(duration: number): Promise<void> {
  const promise = new Promise<void>((res) => {
    setTimeout(res, duration);
  });
  return promise;
}
