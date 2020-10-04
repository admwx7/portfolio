import { LitElement, customElement, css, html, property } from 'lit-element';
import { reset } from '../../theme/shared-styles';

import '@material/mwc-textfield';
import '../../elements/am-character-pane';
import { Character } from '../../elements/am-character-pane/types';

/**
 * Page for containing user to DNDBeyond interactions.
 */
@customElement('am-page-dnd')
export class AmPageDnd extends LitElement {
  static styles = [
    reset,
    css`
      mwc-icon {
        font-size: 2em;

        animation-name: spin;
        animation-duration: 5000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }

      @keyframes spin {
        from {
          transform:rotate(0deg);
        }
        to {
          transform:rotate(360deg);
        }
      }
    `,
  ];

  @property() characterId = '';
  @property({ type: Array }) characters: Character[] = [];
  @property({ type: Boolean }) loading = false;

  constructor() {
    super();

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.renderCharacterPane = this.renderCharacterPane.bind(this);
  }
  render() {
    const { characterId, characters, handleKeyUp, handleValueChange, loading, renderCharacterPane } = this;

    return html`
      <mwc-textfield id="character-id"
        .iconTrailing="${loading ? 'loop' : ''}"
        .value=${characterId}
        @input=${handleValueChange}
        @keyup=${handleKeyUp}
      ></mwc-textfield>
      ${characters.map(renderCharacterPane)}
    `;
  }
  private renderCharacterPane(character: Character) {
    return html`<am-character-pane .data=${character}></am-character-pane>`;
  }

  /**
   * Captures the keyup events and triggers adding IDs when "Enter" is captured.
   *
   * @param event
   * @param event.code
   */
  private async handleKeyUp({ code }: KeyboardEvent): Promise<void> {
    const { characterId } = this;
    if (code !== 'Enter' || !characterId) return;

    try {
      this.loading = true;
      const data = new Character(await (
        await fetch(`https://us-central1-portfolio-138c8.cloudfunctions.net/character/${characterId}`)
      ).json());
      this.characters = [...this.characters, data];
    } catch (e) {
      console.error(e);
    } finally {
      this.characterId = '';
      this.loading = false;
    }
  }
  /**
   * Captures change events for the characterId and updates the associated property.
   *
   * @param event
   * @param event.target
   */
  private handleValueChange({ target: { value } }: { target: HTMLInputElement }): void {
    this.characterId = value;
  }
}
