/**
 * Parses a JWToken so it can be read and used
 * @param token
 */
export function parseJwt(token: string): Object {
  return JSON.parse(
    window.atob(
      token.split('.')[1].
        replace('-', '+').
        replace('_', '/')
    ));
}
