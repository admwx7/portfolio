import { LitElement, TemplateResult, customElement, css, property } from 'lit-element';
import RouterService, { Route } from '../../services/Router';
import '../../pages/404';

/**
 * `am-pages` an element for interfacing with RouterService and rendering the currently selected page to the user.
 */
@customElement('am-pages')
export class AmPages extends LitElement {
  static styles = css`
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

  private routeObserver: () => void;

  /* The currently selected page to display */
  @property({ type: Object }) private page: TemplateResult;

  /* Lifecycle Methods */
  connectedCallback() {
    super.connectedCallback();

    this.routeObserver = RouterService.onRouteChange(({ render }: Route) => this.page = render());
  }
  disconnectedCallback() {
    super.disconnectedCallback();

    this.routeObserver();
  }
  render(): TemplateResult {
    const { page } = this;
    return page;
  }
}
