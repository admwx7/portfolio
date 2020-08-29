/**
 * Provides named segmentations to the callback storage object.  This is located here to fully facilitate
 *  centralization and re-use of the observation logic while reducing chances of collision.  When creating a new
 *  named observer group, ensure the name does not collide with existing groups.  This logic can easily be
 *  decentralized in the future it becomes an issue, which is highly unexpected at this time.
 */
export enum ObserverType {
  ActiveRoute = 'active-route', // services/Route/RouterService
  AvailableRoutes = 'available-routes', // services/Router/RouterService
  Breakpoint = 'breakpoint', // services/Breakpoint/BreakpointService
  UserRoles = 'user-roles', // services/Auth/AuthService
}

type CallbackMap = Record<ObserverType, Record<string, (...params: any[]) => void>>;
const callbacks: CallbackMap =
  Object.values(ObserverType).reduce((acc, key: ObserverType) => {
    acc[key] = {};
    return acc;
  }, {} as CallbackMap);

export function fireObservers(type: ObserverType, ...params: any[]) {
  for (const id in callbacks[type]) {
    callbacks[type][id](...params);
  }
}
export function observe(type: ObserverType, callback: (...params: any[]) => void): () => void {
  let id: string;
  do { // Fetch a unique ID for this callback
    id = String(Math.random())
  } while (Boolean(callbacks[type][id]))
  callbacks[type][id] = callback;

  return () => {
    delete callbacks[type][id];
  };
}
