import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './am-flyout-icon';

import '@material/web/icon/icon';

/**
 * Data structure to provide to <am-flyout> when rendering flyouts.
 */
export class Flyout {
  href?: string;
  icon?: TemplateResult;
  text?: string;
}
/**
 * Renders a group of flyouts as icons that expand out to show additional content.
 */
@customElement('am-flyout')
export class AmFlyout extends LitElement {
  static override styles = css`
    :host {
      position: var(--am-contact-flyouts-position, fixed);
      top: calc(var(--padding) + var(--header-height));
      left: var(--padding);
      display: flex;
      flex-direction: column;
      user-select: none;
      z-index: 1;
    }
    #icons {
      opacity: 0;
      pointer-events: none;
      flex-direction: column;
      display: flex;
      transition: opacity 0.25s;
    }
    :hover + #icons,
    #icons:hover {
      opacity: 1;
      pointer-events: auto;
    }
    md-icon {
      fill: var(--text-color);
      color: var(--text-color);
      height: 36px;
      width: 36px;
      padding-top: calc(var(--padding) / 2);
      padding-bottom: calc(var(--padding) / 2);
      cursor: pointer;
    }
    md-icon:hover {
      filter: var(--drop-shadow);
    }
  `;

  @property({ type: Array }) items: Flyout[] = [];

  override render(): TemplateResult {
    const { items } = this;

    return html`
      <md-icon id="contact-me"><slot></slot></md-icon>
      <div id="icons">${items.map(this.renderItem)}</div>
    `;
  }
  renderItem({ href, icon, text }: Flyout): TemplateResult {
    return html`
      <am-flyout-icon href=${href}>
        ${icon}
        <p slot="flyout">${text}</p>
      </am-flyout-icon>
    `;
  }
}
