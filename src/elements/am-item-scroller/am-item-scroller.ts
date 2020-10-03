import { LitElement, TemplateResult, customElement, css, html, property } from 'lit-element';

@customElement('am-item-scroller')
export class AmItemScroller extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      cursor: pointer;
      user-select: none;
    }
    ::slotted(*) {
      --offset: 0;
      position: absolute;
      left: calc(50% * (var(--offset) + 1));
    }
    ::slotted([hide]) {
      opacity: 0;
    }
  `;

  private _center = 0;
  private clientX: number = null;
  /* The minimum swip distance required to jump to the next / previous item */
  private swipeThreshold = 25;

  /* The total number of items being displayed */
  @property({ type: Number }) count: number;
  /* The item index for the currently centered item, ranges 0 to (count - 1) */
  @property({ type: Number, noAccessor: true })
  get center(): number {
    return this._center;
  }
  set center(value: number) {
    const oldValue = this._center;
    if (value <= 0) this._center = 0;
    else if (value >= this.count - 1) this._center = this.count - 1;
    else this._center = value;
    if (this._center !== oldValue) this.requestUpdate('center', oldValue);
  }

  constructor() {
    super();

    this.swipeClear = this.swipeClear.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
    this.swipeStart = this.swipeStart.bind(this);
  }
  /* Lifecycle Methods */
  async connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    // event listeners
    this.addEventListener('mousedown', this.swipeStart);
    this.addEventListener('click', this.swipeEnd);
    this.addEventListener('mouseleave', this.swipeEnd);

    this.addEventListener('touchstart', this.swipeStart);
    this.addEventListener('touchend', this.swipeEnd);
  }
  async disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();

    // event listeners
    this.removeEventListener('mousedown', this.swipeStart);
    this.removeEventListener('click', this.swipeEnd);
    this.removeEventListener('mouseleave', this.swipeEnd);
  }
  render(): TemplateResult {
    const { count = 1, center = 0 } = this;
    const offsets = this.calculateOffsets(count, center);

    return html`
      <style>${offsets}</style>
      <slot></slot>
    `;
  }

  /* Private Methods */
  /**
   * Sets the CSS variables per item to properly position them.
   *
   * @param count - Total number of items to display.
   * @param center - The item currently centered in the scroller.
   * @returns - CSS snippets as TemplateResult[].
   */
  private calculateOffsets(count: number, center: number): TemplateResult[] {
    const offsets: TemplateResult[] = [];
    for (let i = 0; i < count; i++) {
      const calculatedOffset = (i - center) / (count - 1);
      offsets.push(html`
        ::slotted(*:nth-child(${i + 1})) {
          --offset: ${calculatedOffset};
          z-index: ${Math.round(count - Math.abs(calculatedOffset) * count)};
          transform: translateX(-50%) scale(${1 - Math.abs(calculatedOffset) / 2});
          opacity: ${1 - Math.abs(calculatedOffset) / 2};
        }
      `);
    }
    return offsets;
  }
  /**
   * Clears out the swipe start location to calculate distance moved.
   */
  private swipeClear() {
    this.clientX = null;
  }
  /**
   * Ends the user swipe action, updating the offset to accomodate the distance moved.
   *
   * @param event
   */
  private swipeEnd(event: TouchEvent | MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    let clientX;
    if (event instanceof TouchEvent) clientX = event.changedTouches[0].clientX;
    else clientX = event.clientX;
    if (!this.clientX) return;

    const diff = clientX - this.clientX;
    if (Math.abs(diff) < this.swipeThreshold) return;

    if (diff < 0) this.next();
    else this.previous();
    this.swipeClear();
  }
  /**
   * Starts recording the swipe action from the user.
   *
   * @param event
   */
  private swipeStart(event: TouchEvent | MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event instanceof TouchEvent) this.clientX = event.touches[0].clientX;
    else this.clientX = event.clientX;
  }

  /* Public Methods */
  /**
   * Centers on the next item in the scroller.
   */
  next(): void {
    this.center += 1;
  }
  /**
   * Centers on the previous item in the scroller.
   */
  previous(): void {
    this.center -= 1;
  }
}
