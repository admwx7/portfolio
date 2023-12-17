import { ObserverType, fireObservers, observe } from '../../utils/observer';
import { debounce } from '../../utils/timing';
import { CSSResult, css } from 'lit';

export enum Breakpoint {
  XSmall = 'xsmall',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'xlarge',
}
interface Mapping {
  name: Breakpoint;
  range: number;
  columns: number,
  gutters: number;
  padding: number;
}
const BreakpointMapping: Record<Breakpoint, Mapping> = {
  [Breakpoint.XSmall]: {
    name: Breakpoint.XSmall,
    range: 0,
    columns: 4,
    gutters: 16,
    padding: 8,
  },
  [Breakpoint.Small]: {
    name: Breakpoint.Small,
    range: 600,
    columns: 8,
    gutters: 24,
    padding: 8,
  },
  [Breakpoint.Medium]: {
    name: Breakpoint.Medium,
    range: 960,
    columns: 12,
    gutters: 24,
    padding: 12,
  },
  [Breakpoint.Large]: {
    name: Breakpoint.Large,
    range: 1280,
    columns: 12,
    gutters: 24,
    padding: 12,
  },
  [Breakpoint.XLarge]: {
    name: Breakpoint.XLarge,
    range: 1920,
    columns: 12,
    gutters: 24,
    padding: 12,
  },
};

/**
 * Exposes hooks for responsive UI breakpoints, derived from the Material design spec
 * https://material.io/design/layout/responsive-layout-grid.html#breakpoints.
 *
 * WARNING: this is simplified to focus on columns / gutters at the cost of other spec related details.
 */
export class BreakpointService {
  private _breakpoint?: Breakpoint;
  private get breakpoint(): Breakpoint {
    return this._breakpoint!;
  }
  private set breakpoint(value: Breakpoint) {
    this._breakpoint = value;
    fireObservers(ObserverType.Breakpoint, value);
  }

  constructor() {
    this.handleResize = debounce(this.handleResize.bind(this), 100);

    window.onresize = this.handleResize;
    this.handleResize();
  }
  /**
   * Adjusts the Breakpoint based on an updated window size.
   */
  private handleResize() {
    const { clientWidth } = document.documentElement;
    const breakpoint = Object.values(BreakpointMapping).
      sort(({ range }, { range: range2 }) => range2 - range).
      find(({ range }) => range < clientWidth);

    if (breakpoint) this.breakpoint = breakpoint.name;
  }

  /**
   * Generates CSS variables for injection based on the breakpoint configuration object.
   *
   * @todo some experimentation has shown this should probably be managed in the CSS and this service should instead
   * read the value that's currently injected based on the @media query instead.
   */
  generateCSSVariables(): CSSResult[] {
    return Object.values(BreakpointMapping).
      sort(({ range }, { range: range2 }) => range - range2).
      map(({ columns, gutters, padding, range }) => css`
        @media (min-width: ${range}px) {
          :host {
            --columns: ${columns};
            --gutter: ${gutters}px;
            --padding: ${padding}px;
          }
        }
      `);
  }
  /**
   * Uses the observer util to notify of changes to the current browser breakpoints.
   *
   * @param callback - The logic to run when the breakpoints update.
   * @returns - Deregistration function for cleanup.
   */
  onBreakpointChanged(callback: (breakpoint: Breakpoint) => void): () => void {
    if (this.breakpoint) callback(this.breakpoint);

    return observe(ObserverType.Breakpoint, callback);
  }
}
