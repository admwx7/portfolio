import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import AuthService from '../../services/Auth';
import RouterService, { Route, RouteName } from '../../services/Router';

/**
 * Renders routes as links for the user in horizontal or vertical views.
 */
@customElement('am-nav')
export class AmNav extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: row;
      flex: 1 1 auto;
      justify-content: flex-end;
    }
    :host([vertical]) {
      flex-direction: column;
    }
    :host([vertical]) .page-link {
      padding-top: var(--padding);
      padding-bottom: var(--padding);
    }
    .page-link {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      text-align: center;
      min-width: 110px;
      font-weight: bold;
      font-size: 14pt;
      user-select: none;
    }
    .page-link:not([selected]):hover {
      cursor: pointer;
    }
    .page-link:not([selected]):hover {
      text-shadow: var(--text-shadow);
    }
    .page-link[selected] {
      color: var(--accent-color);
    }
    .page-link[selected]::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-style: solid;
      border-color: var(--accent-color);
      border-width: 0 0 5px 0;
    }
    :host([vertical]) .page-link[selected]::after {
      border-width: 0 5px 0 0;
    }
  `;

  private authObserver?: () => void;
  private availableRoutesObserver?: () => void;
  private routeObserver?: () => void;

  /* The currently selected page */
  @state() private page?: RouteName;
  /* Whether or not the user is signed in */
  @state() private signedIn?: boolean;
  /* Routes available to the user */
  @state() private routes?: Route[];

  /* Lifecycle Methods */
  constructor() {
    super();

    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.renderLink = this.renderLink.bind(this);
  }
  override connectedCallback() {
    super.connectedCallback();

    this.authObserver = AuthService.onAuthStateChanged?.((user: unknown) => this.signedIn = Boolean(user));
    this.availableRoutesObserver = RouterService.onAvailableRoutesChanged((routes: Route[]) => this.routes = routes);
    this.routeObserver = RouterService.onRouteChange((route: Route | null) => this.page = route?.name || undefined);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();

    this.authObserver?.();
    this.availableRoutesObserver?.();
    this.routeObserver?.();
  }
  override render(): TemplateResult {
    const { signedIn } = this;

    return html`
      ${this.routes?.filter(({ label }) => Boolean(label)).map(this.renderLink)}
      <div class="page-link" @click=${this.handleAuthChange}>
        <span>Sign ${signedIn ? 'Out' : 'In'}</span>
      </div>
    `;
  }
  renderLink({ label, name }: Route): TemplateResult {
    const { page } = this;

    return html`
      <div name=${name} class="page-link" ?selected=${name === page} @click=${this.handlePageChange}>
        <span>${label}</span>
      </div>
    `;
  }

  /* Private Methods */
  /**
   * Handles user interactions to sign in/out by calling the AuthService.
   */
  private async handleAuthChange() {
    const { signedIn } = this;

    if (signedIn) {
      await AuthService.signOut();
      await RouterService.navigate(RouteName.Home);
    } else AuthService.signIn();
  }
  /**
   * Determines which link the user clicked and fires the appropriate page-change details as an event.
   *
   * @param event
   * @param event.currentTarget
   */
  private async handlePageChange({ currentTarget }: MouseEvent) {
    const pageName = (currentTarget as Element).getAttribute('name');
    if (pageName) await RouterService.navigate(pageName as RouteName);
  }
}
