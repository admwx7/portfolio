import { LitElement, TemplateResult, html, css, property, customElement } from "lit-element";

@customElement('am-card')
export class AmCard extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 0 0 calc(100% / var(--size) - var(--gutter) * var(--size));
      margin: calc(var(--gutter) / 2);
      padding: var(--padding);
      border-radius: 2px;
      flex-direction: column;
      align-items: center;

      --size: calc(var(--columns) / var(--column-width, 4));
    }
    ::slotted([slot="title"]) {
      padding-top: var(--padding);
    }
    ::slotted([slot="description"]) {
      flex: 1 1 auto;
      padding-top: var(--padding);
      text-align: center;
    }
    ::slotted([slot="icon"]) {
      height: 30px;
      width: 30px;
      padding: calc(var(--padding) * 2);
      border-radius: 100%;
      background-color: var(--primary-background-color);
      box-shadow: 0 0 4px 0 var(--shadow-color, var(--divider-shadow-color));
      border: 1px solid var(--divider-shadow-color);
      color: var(--accent-color);
      fill: var(--accent-color);
    }
  `;

  @property({ type: Boolean, reflect: true }) selectable = false;
  @property({ type: Boolean, reflect: true }) selected = false;

  render(): TemplateResult {
    return html`
      <slot name="icon"></slot>
      <slot name="title"></slot>
      <slot name="description"></slot>
      <slot name="links"></slot>
    `;
  }
}
