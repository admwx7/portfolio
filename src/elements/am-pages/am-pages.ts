import { LitElement, TemplateResult, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import RouterService, { Route } from '../../services/Router';
import '../../pages/404';

/**
 * `am-pages` an element for interfacing with RouterService and rendering the currently selected page to the user.
 */
@customElement('am-pages')
export class AmPages extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      padding-top: calc(var(--gutter) / 2);
      overflow-x: hidden;
    }
    .page {
      display: block;
    }
  `;

  private routeObserver?: () => void;

  /* The currently selected page to display */
  @property({ type: Object }) private page?: TemplateResult;

  /* Lifecycle Methods */
  override connectedCallback() {
    super.connectedCallback();

    this.routeObserver = RouterService.onRouteChange((route: Route) => this.page = route?.render());
  }
  override disconnectedCallback() {
    super.disconnectedCallback();

    this.routeObserver?.();
  }
  override render(): TemplateResult | null {
    const { page } = this;
    return page || null;
  }
}
