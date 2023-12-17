import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { card, reset } from '../../theme/shared-styles';

/**
 * A 404 page with links to jump back to the home page.
 */
@customElement('am-page-404')
export class AmPage404 extends LitElement {
  static override styles = [
    reset,
    card,
  ];

  override render() {
    return html`
      <div class="card">
        <p>Oops you hit a 404. <a href="/">Head back to home.</a></p>
      </div>
    `;
  }
}
