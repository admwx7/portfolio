import { TemplateResult, html } from 'lit';
import AuthService, { Role } from '../Auth';
import { ObserverType, observe, fireObservers } from '../../utils/observer';

/**
 * Defines a Route object in the UI and the requirements to navigate to and render the associated page element.
 */
export interface Route {
  label?: string;
  importModule?: () => Promise<unknown>;
  name: RouteName;
  path: () => string;
  pattern: RegExp;
  render: () => TemplateResult;
  roles?: Role[];
  title?: string;
}
export interface NavigateOptions {
  updateHistory: boolean;
}
/**
 * All RouteNames in the app.
 */
export enum RouteName {
  Bank = 'bank',
  BankSignUp = 'bank-sign-up',
  Home = 'home',
  NotFound = '404',
}
/**
 * All Route definitions in the UI a user can possibly navigate to.
 */
const Routes: Record<RouteName, Route> = {
  [RouteName.Bank]: {
    label: 'Bank',
    importModule() { return import('../../pages/bank'); },
    name: RouteName.Bank,
    path() { return '/bank'; },
    pattern: /^\/bank$/,
    render() { return html`<am-page-bank class=page></am-page-bank>`; },
    title: 'Bank',
    roles: [Role.Banking],
  },
  [RouteName.BankSignUp]: {
    importModule() { return import('../../pages/bank-sign-up'); },
    name: RouteName.BankSignUp,
    path() { return '/bank-sign-up'; },
    pattern: /^\/bank-sign-up$/,
    render() { return html`<am-page-bank-sign-up class=page></am-page-bank-sign-up>`; },
    title: 'Bank Sign Up',
  },
  [RouteName.Home]: {
    label: 'Home',
    importModule() { return import('../../pages/main'); },
    name: RouteName.Home,
    path() { return '/'; },
    pattern: /^\/(home)?$/, // Adding /home for backwards compatibility, moving towards just /
    render() { return html`<am-page-main class=page></am-page-main>`; },
  },
  [RouteName.NotFound]: {
    name: RouteName.NotFound,
    path() { return '/404'; },
    pattern: /^\/404$/,
    render() { return html`<am-page-404 class=page></am-page-404>`; },
    title: '404',
  },
};

/**
 * Defines a service for managing navigation based interactions.
 */
export class RouterService {
  private _activeRoute?: RouteName;
  private get activeRoute(): RouteName {
    return this._activeRoute!;
  }
  private set activeRoute(value: RouteName) {
    const route = this.getRoute(value);
    let newValue;
    if (!value || !route) newValue = RouteName.NotFound;
    else newValue = value;
    if (this._activeRoute === newValue) return;

    this._activeRoute = newValue;
    fireObservers(ObserverType.ActiveRoute, route);
  }
  private _routes: Route[] = [Routes[RouteName.Home]];
  private get routes(): Route[] {
    return this._routes;
  }
  private set routes(value: Route[]) {
    this._routes = value;
    fireObservers(ObserverType.AvailableRoutes, value);
  }

  constructor() {
    this.handleHistoryChange = this.handleHistoryChange.bind(this);

    window.onpopstate = this.handleHistoryChange;
    AuthService.onUserRolesChanged((userRoles) => {
      this.routes = (Object.values(Routes) as Route[]).
        filter(({ roles }) => {
          return !roles || !roles.length || roles.some((role) => userRoles.includes(role));
        });
      this.handleHistoryChange();
    });

    this.handleHistoryChange();
  }

  /**
   * Handles updates to the History API and maps them into routing changes.
   */
  private handleHistoryChange() {
    const { pathname } = window.location;
    const { name }: Route =
      this.routes.find(({ pattern }: Route) => pattern.exec(pathname)) ||
      Routes[RouteName.NotFound];
    this.navigate(name, { updateHistory: false });
  }

  /**
   * Looks up a route in the set of possible routes the user has access to.
   *
   * @param routeName
   * @returns - A valid Route object from the available routes.
   */
  getRoute(routeName: RouteName): Route | null {
    return this.routes.find(({ name }) => name === routeName) || null;
  }
  /**
   * Uses the observer util to notify of changes to the currently available routes.
   *
   * @param callback - The logic to run when the routes are updated.
   * @returns - Deregistration function for cleanup.
   */
  onAvailableRoutesChanged(callback: (routes: Route[]) => void): () => void {
    if (this.routes) callback(this.routes);

    return observe(ObserverType.AvailableRoutes, callback);
  }
  /**
   * Triggers a route change for the user, ensuring the route is dynamically imported as part of the change.
   *
   * @param route
   * @param updateHistory - Flag to disable browser history updates, defaults to updating the browser history.
   */
  async navigate(routeName: RouteName, options: NavigateOptions = { updateHistory: true }): Promise<void> {
    this.activeRoute = routeName;
    const route = this.getRoute(this.activeRoute);
    try {
      await route?.importModule?.();
    } catch (e) {
      // Failed to fetch the page, load 404 instead
      this.activeRoute = RouteName.NotFound;
      console.error('Failed import', e);
    }
    if (route && options.updateHistory) {
      window.history.pushState({}, `Austin Murdock | ${route.title || route.label}`, `${route.path()}`);
    }
  }
  /**
   * Uses the observer util to notify of changes to the activeRoute.
   *
   * @param callback - The logic to run when the activeRoute is updated.
   * @returns - Deregistration function for cleanup.
   */
  onRouteChange(callback: (route: Route) => void): () => void {
    if (this.activeRoute) callback(this.getRoute(this.activeRoute)!);

    return observe(ObserverType.ActiveRoute, callback);
  }
}
