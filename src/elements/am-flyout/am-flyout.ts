import { LitElement, TemplateResult, customElement, css, html, property } from 'lit-element';
import './am-flyout-icon';

export class Flyout {
  href: string;
  icon: TemplateResult;
  text: string;
}

@customElement('am-flyout')
export class AmFlyout extends LitElement {
  static styles = css`
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
    mwc-icon {
      fill: var(--text-color);
      height: 36px;
      width: 36px;
      padding-top: calc(var(--padding) / 2);
      padding-bottom: calc(var(--padding) / 2);
      cursor: pointer;
    }
    mwc-icon:hover {
      filter: var(--drop-shadow);
    }
  `;

  @property({ type: Array }) items: Flyout[] = [];

  render(): TemplateResult {
    const { items } = this;

    return html`
      <mwc-icon id="contact-me"><slot></slot></mwc-icon>
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
