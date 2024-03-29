import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Renders the app logo, designed fully with HTML + CSS
 *
 * @todo really need to convert this to an SVG
 */
@customElement('am-logo')
export class AmLogo extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;

      --block-size: var(--am-logo-sizing, 16px);
      --rotation: 0deg;
      --slant: -45deg;

      width: calc(6 * var(--block-size));
      height: calc(4 * var(--block-size));
      margin: calc(1/2 * var(--block-size));
      padding: calc(-1/2 * var(--block-size));
    }
    hr {
      border: none;
      margin: 0;
      padding: 0;
    }

    .guideline {
      position: absolute;
      border-width: 1px;
      border-color: var(--primary-text-color);
    }
    .horizontal {
      width: calc(7 * var(--block-size));
      left: calc(-1/2 * var(--block-size));
      border-bottom-style: solid;
    }
    .vertical {
      top: calc(-1/2 * var(--block-size));
      height: calc(5 * var(--block-size));
      border-right-style: solid;
    }

    .fill {
      position: absolute;
      height: var(--block-size);
      width: var(--block-size);
      z-index: 1;
      overflow: hidden;
    }
    .fill::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .rotate {
      --rotation: -146.31deg;
    }
    .fill.light::after {
      background: repeating-linear-gradient(
        calc(var(--slant) - var(--rotation)),
        var(--divider-color) 1px,
        var(--light-divider-color) 1px,
        var(--dark-divider-color) 2px,
        var(--divider-color) 2px,
        var(--dark-divider-color) 1px,
        var(--light-divider-color) 2px
      );
    }
    .fill.accent::after {
      background: repeating-linear-gradient(
        calc(var(--slant) - var(--rotation)),
        var(--accent-color) 1px,
        var(--light-accent-color) 1px,
        var(--dark-accent-color) 2px,
        var(--accent-color) 2px,
        var(--dark-accent-color) 1px,
        var(--light-accent-color) 2px
      );
    }
    .rotate::after {
      width: var(--block-size);
      height: 150%;
      top: 100%;
      left: 0;
      transform: rotate(var(--rotation));
      transform-origin: top left;
    }
    .shift-right::after {
      left: 30%;
      top: 122%;
    }
    .shift-right-2::after {
      left: 60%;
      top: 90%;
    }

    .top-0 {
      top: 0;
    }
    .top-1 {
      top: var(--block-size);
    }
    .top-2 {
      top: calc(2 * var(--block-size));
    }
    .top-3 {
      top: calc(3 * var(--block-size));
    }
    .top-4 {
      top: calc(4 * var(--block-size));
    }
    .right-0 {
      right: 0;
    }
    .right-1 {
      right: var(--block-size);
    }
    .right-2 {
      right: calc(2 * var(--block-size));
    }
    .right-3 {
      right: calc(3 * var(--block-size));
    }
    .right-4 {
      right: calc(4 * var(--block-size));
    }
    .right-5 {
      right: calc(5 * var(--block-size));
    }
    .right-6 {
      right: calc(6 * var(--block-size));
    }
    .bottom-0 {
      bottom: 0;
    }
    .bottom-1 {
      bottom: var(--block-size);
    }
    .bottom-2 {
      bottom: calc(2 * var(--block-size));
    }
    .bottom-3 {
      bottom: calc(3 * var(--block-size));
    }
    .bottom-4 {
      bottom: calc(4 * var(--block-size));
    }
    .left-0 {
      left: 0;
    }
    .left-1 {
      left: var(--block-size);
    }
    .left-2 {
      left: calc(2 * var(--block-size));
    }
    .left-3 {
      left: calc(3 * var(--block-size));
    }
    .left-4 {
      left: calc(4 * var(--block-size));
    }
    .left-5 {
      left: calc(5 * var(--block-size));
    }
    .left-6 {
      left: calc(6 * var(--block-size));
    }

    .width-1 {
      width: var(--block-size);
    }
    .width-2 {
      width: calc(2 * var(--block-size));
    }
    .width-3 {
      width: calc(3 * var(--block-size));
    }
    .height-1 {
      height: var(--block-size);
    }
    .height-2 {
      height: calc(2 * var(--block-size));
    }
    .height-3 {
      height: calc(3 * var(--block-size));
    }
    .height-4 {
      height: calc(4 * var(--block-size));
    }
  `;

  // static override shadowRootOptions: ShadowRootInit = { mode: 'open', delegatesFocus: true };

  override render(): TemplateResult {
    return html`
      <!-- Corner block -->
      <div class="fill rotate light top-0 left-0 height-3 width-2"></div>
      <div class="fill rotate light top-0 left-0 height-2 width-2"></div>
      <div class="fill light top-0 left-0"></div>

      <!-- Letter M -->
      <div class="fill rotate shift-right-2 light left-2 bottom-0 height-4 width-3"></div>
      <div class="fill light right-0 top-0 height-4 width-1"></div>

      <!-- Letter A -->
      <div class="fill rotate shift-right accent left-0 top-0 height-4 width-3"></div>
      <div class="fill accent left-2 bottom-1"></div>
      <div class="fill accent left-3 top-0 height-4 width-1"></div>

      <!-- Guidelines -->
      <hr class="guideline horizontal top-0" />
      <hr class="guideline horizontal top-1" />
      <hr class="guideline horizontal top-2" />
      <hr class="guideline horizontal top-3" />
      <hr class="guideline horizontal top-4" />
      <hr class="guideline vertical" />
      <hr class="guideline vertical left-0" />
      <hr class="guideline vertical left-1" />
      <hr class="guideline vertical left-2" />
      <hr class="guideline vertical left-3" />
      <hr class="guideline vertical left-4" />
      <hr class="guideline vertical left-5" />
      <hr class="guideline vertical left-6" />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'am-logo': AmLogo;
  }
}

export default AmLogo;
