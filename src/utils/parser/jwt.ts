/**
 * Parses a JWToken so it can be read and used.
 *
 * @param token
 * @returns - JWT token parsed into a JS object.
 */
export function parseJwt(token: string): Record<string, string> {
  return JSON.parse(
    window.atob(
      token.split('.')[1]?.
        replace('-', '+').
        replace('_', '/') || ''
    ));
}
