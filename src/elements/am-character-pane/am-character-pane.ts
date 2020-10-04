import { LitElement, customElement, css, html, property } from 'lit-element';

import { reset } from '../../theme/shared-styles';
import { Character } from './types';

/**
 * `am-character-pane` a pane for visualizing a character from DNDBeyond.
 */
@customElement('am-character-pane')
export class AmCharacterPane extends LitElement {
  static styles = [
    reset,
    css`
      :host {
        display: flex;
        width: calc(var(--size) * 3);
        padding: var(--padding);

        --size: 70px;
        --padding: 6px;
      }
      #avatar {
        height: var(--size);
        width: var(--size);
        overflow: hidden;
        position: relative;
        border-radius: 50%;
        display: inline-block;
        flex: 0 0 var(--size);
      }
      #avatar > img {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      #name {
        font-size: 1.4em;
      }
      #content {
        position: relative;
        flex: 0 0;
        flex-basis: calc(var(--size) * 2 - var(--padding));
        display: flex;
        flex-direction: column;
        padding-left: var(--padding);
      }
    `,
  ];

  @property({ type: Object }) data: Character;

  render() {
    const { avatarUrl, classes, name } = (this.data || {});

    return html`
      <div id="avatar"><img src="${avatarUrl}" /></div>
      <div id="content">
        <div id="name">${name}</div>
        <div id="level">Level: ${classes.reduce((acc, { level }) => acc += level, 0)}</div>
      </div>
    `;
  }
}
