import { LitElement, customElement, css, TemplateResult, html, property } from "lit-element";
import '@material/mwc-icon';

import { reset } from '../../theme/shared-styles';

/**
 * `am-flyout-icon` a card for displaying a way to contact me: twitter, linkedin, github, ...
 * @customElement
 */
@customElement('am-flyout-icon')
export class AmFlyoutIcon extends LitElement {
  static styles = [
    reset,
    css`
      :host {
        position: relative;
        margin-top: calc(var(--padding) / 2);
        margin-bottom: calc(var(--padding) / 2);
        z-index: 1;
      }
      :hover > #icon {
        filter: var(--drop-shadow);
      }
      :not(:hover) #flyout {
        pointer-events: none;
        width: 0;
        transition:
          left 0.5s ease-in-out 0s,
          opacity 0.25s ease-in-out 0s,
          width 0s ease-in-out 0.25s;
      }
      :hover #flyout {
        opacity: 1;
        left: 100%;
        transition:
          left 0.5s ease-in-out 0s,
          opacity 0.25s ease-in-out 0.25s;
      }
      :host, #icon {
        height: 36px;
        width: 36px;
        z-index: 1;
        cursor: pointer;
      }
      #icon {
        font-size: 36px;
      }
      #icon ::slotted(svg) {
        fill: var(--text-color);
      }
      #flyout {
        white-space: nowrap;
        position: absolute;
        opacity: 0;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
        width: 300px;
        padding: var(--padding);
        color: var(--text-color);
      }
      #flyout ::slotted(*) {
        display: inline-block;
        margin: 0;
        padding: 0 var(--padding);
        font-weight: bold;
        text-shadow: var(--text-shadow);
      }
    `,
  ];

  @property() href: string;

  render(): TemplateResult {
    const { href } = this;
    
    return html`
      <a target=_blank href=${href}>
        <mwc-icon id="icon">
          <slot></slot>
        </mwc-icon>
        <div id="flyout">
          <slot name="flyout"></slot>
        </div>
      </a>
    `;
  }
}
