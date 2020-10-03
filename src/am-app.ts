import { LitElement, TemplateResult, customElement, css, html, property } from 'lit-element';
import '@material/mwc-icon';

import BreakpointService, { Breakpoint } from './services/Breakpoint';
import { colorStyles } from './theme/colors';
import { reset } from './theme/shared-styles';
import './elements/am-logo';
import './elements/am-nav';
import './elements/am-pages';

const slimBreakpoints = [Breakpoint.XSmall, Breakpoint.Small];

/**
 * `am-app` contains the app-wide structure and common functionality.
 */
@customElement('am-app')
export class AmApp extends LitElement {
  static styles = [
    reset,
    colorStyles,
    BreakpointService.generateCSSVariables(),
    css`
      :host {
        display: flex;
        flex-direction: column;
        color: var(--text-color);
        height: 100vh;
        min-height: 100vh;
        background: linear-gradient(
          150deg,
          var(--secondary-background-color) 1vh,
          var(--primary-background-color) 21vh,
          var(--primary-background-color) 79.75vh,
          var(--secondary-background-color) 80vh,
          var(--primary-background-color) 100vh
        );

        --am-logo-sizing: calc(0.75 * var(--gutter));
      }
      #header {
        flex: 0 0 auto;
        display: flex;
        justify-content: flex-start;
        padding-left: var(--padding);
        padding-right: var(--padding);
        background-color: var(--primary-background-color);
        box-shadow: 0 1px 2px 0 var(--divider-shadow-color);
        z-index: 1;
      }
      #title[center] {
        margin-left: auto;
        margin-right: auto;
      }
      #nav {
        margin-bottom: -1px;
      }
      #content, #nav {
        flex: 1 1 auto;
      }
      #content {
        overflow-y: auto;
      }
      #drawer {
        display: block;
        position: fixed;
        top: 0;
        bottom: 0;
        left: -305px;
        width: 300px;
        z-index: 999;
        border-right: 1px solid var(--divider-color);
        box-shadow: 1px 0 2px 0 var(--divider-shadow-color);

        background-color: var(--primary-background-color);
        transition-duration: 0.75s;
        transition-property: left;
      }
      #drawer[open] {
        left: 0;
      }
      #drawer[open] ~ #content {
        user-select: none;
      }
      #drawer .icon {
        --size: 32px;
        position: absolute;
        right: calc(-1 * var(--size));
        height: var(--size);
        width: var(--size);
        font-size: var(--size);
        top: 50%;
        transform: translateY(-50%);
        transition-duration: 0.75s;
        transition-property: transform;
        cursor: pointer;
        color: var(--light-primary-color);
        user-select: none;
      }
      .icon:hover {
        filter: var(--drop-shadow);
      }
      #drawer[open] .icon {
        transform: rotateY(180deg);
      }
      #menuIcon {
        cursor: pointer;
        align-self: center;
        height: 35px;
        width: 35px;
        margin-right: -35px;
      }
      #menuIcon:hover {
        filter:
          drop-shadow(1px 0 2px var(--accent-shadow-color))
          drop-shadow(-1px 0 2px var(--accent-shadow-color))
          drop-shadow(0 1px 2px var(--accent-shadow-color))
          drop-shadow(0 -1px 2px var(--accent-shadow-color));
      }
    `,
  ];

  private breakpointObserver: () => void;
  private swipeDiff = 120;
  private xDown: number = null;

  @property({ type: Boolean }) slim = false;
  @property({ type: Boolean }) open = false;

  /* Lifecycle Methods */
  constructor() {
    super();

    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchStart = this.touchStart.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();

    this.breakpointObserver =
      BreakpointService.onBreakpointChanged((breakpoint) => this.slim = slimBreakpoints.includes(breakpoint));
    document.addEventListener('click', this.closeDrawer, false);
    document.addEventListener('touchend', this.touchMove, false);
    document.addEventListener('touchstart', this.touchStart, false);
  }
  disconnectedCallback() {
    super.disconnectedCallback();

    this.breakpointObserver();
    document.removeEventListener('click', this.closeDrawer);
    document.removeEventListener('touchend', this.touchMove);
    document.removeEventListener('touchstart', this.touchStart);
  }
  render(): TemplateResult {
    const { open, slim, toggleDrawer } = this;

    return html`
      <div id="drawer" ?open=${open}>
        <am-nav id="side-nav" vertical></am-nav>
        <mwc-icon class="icon" @click=${toggleDrawer}>chevron_right</mwc-icon>
      </div>
      <div id="header">
        <mwc-icon id="menuIcon"
          class="icon"
          ?hidden=${!slim}
          @click=${toggleDrawer}
        >menu</mwc-icon>
        <a id="title" ?center=${slim} href="/">
          <am-logo></am-logo>
        </a>
        <am-nav id="nav" ?hidden=${slim}></am-nav>
      </div>
      <am-pages id="content"></am-pages>
    `;
  }

  /* Private Methods */
  /**
   * Monitors movements associated with touch actions for triggering between open and closing the drawer.
   *
   * @param event
   */
  private touchMove(event: TouchEvent) {
    if (!this.xDown) return;

    const xUp = event.changedTouches[0].clientX;
    const xDiff = this.xDown - xUp;

    if (xDiff > this.swipeDiff) {
      this.closeDrawer();
    } else if (xDiff < (-1 * this.swipeDiff)) {
      this.openDrawer();
    }
  }
  /**
   * Tracks touch start for opening / closing the left drawer.
   *
   * @param event
   */
  private touchStart(event: TouchEvent) {
    this.xDown = event.touches[0].clientX;
  }

  /* Public Methods */
  /**
   * Closes the drawer.
   */
  closeDrawer(): void {
    this.open = false;
    this.xDown = null;
  }
  /**
   * Opens the drawer.
   */
  openDrawer(): void {
    this.open = true;
    this.xDown = null;
  }
  /**
   * Toggles the drawer and prevents event propagation.
   *
   * @param event
   */
  toggleDrawer(event?: TouchEvent): void {
    if (event) event.stopPropagation();
    this.open = !this.open;
    this.xDown = null;
  }
}
