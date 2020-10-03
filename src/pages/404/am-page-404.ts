import { LitElement, customElement, html } from 'lit-element';
import { card, reset } from '../../theme/shared-styles';

/**
 * A 404 page with links to jump back to the home page.
 */
@customElement('am-page-404')
export class AmPage404 extends LitElement {
  static styles = [
    reset,
    card,
  ];

  render() {
    return html`
      <div class="card">
        <p>Oops you hit a 404. <a href="/">Head back to home.</a></p>
      </div>
    `;
  }
}
