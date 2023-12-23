import { css, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import BreakpointService, { Breakpoint } from '../services/Breakpoint';
import { reset } from '../theme/shared-styles';

const slimBreakpoints = [Breakpoint.XSmall, Breakpoint.Small];

/**
 * `am-page-bank` the banking landing page for managing accounts / communty and checking funds
 */
export default class Page extends LitElement {
  static override styles = [
    reset,
    css`
      :host {
        padding: var(--gutter);
        display: relative;
        font-size: 16pt;
      }
    `,
  ];

  private breakpointObserver?: () => void;

  @state() protected slim = false;

  override connectedCallback() {
    super.connectedCallback();

    this.breakpointObserver = BreakpointService.onBreakpointChanged((breakpoint) => {
      this.slim = slimBreakpoints.includes(breakpoint);
    });
  }
  override disconnectedCallback() {
    super.disconnectedCallback();

    this.breakpointObserver?.();
  }
}
