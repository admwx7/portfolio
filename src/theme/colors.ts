import { css } from 'lit';

export const colorStyles = css`
  :host {
    --dark-primary-color: #000;
    --primary-color: #222;
    --light-primary-color: #EEE;

    --text-color: #FFF;
    --primary-text-color: #777;
    --secondary-text-color: #000;

    --primary-background-color: #393939;
    --secondary-background-color: #545454;

    --dark-accent-color: #A3C940;
    --accent-color: #B0D64D;
    --light-accent-color: #BDE35A;
    --accent-shadow-color: rgba(176, 214, 77, 0.6);

    --dark-divider-color: #BEBFC1;
    --divider-color: #CBCCCE;
    --light-divider-color: #D8D9DB;
    --divider-shadow-color: rgba(255, 255, 255, 0.6);

    --success-color: #5cb85c;
    --warning-color: #f0ad4e;
    --error-color: #d9534f;

    --paper-checkbox-checked-color: var(--accent-color);
    --paper-checkbox-checkmark-color: var(--primary-color);
    --paper-checkbox-label-color: var(--text-color);
    --paper-fab-keyboard-focus-background: var(--primary-text-color);
    --paper-fab-iron-icon: {
      color: var(--primary-color);
    };

    --drop-shadow:
      drop-shadow(1px 0 2px var(--accent-shadow-color))
      drop-shadow(-1px 0 2px var(--accent-shadow-color))
      drop-shadow(0 1px 2px var(--accent-shadow-color))
      drop-shadow(0 -1px 2px var(--accent-shadow-color));
    --text-shadow:
      var(--primary-background-color) 1px 0 1px,
      var(--primary-background-color) -1px 0 1px,
      var(--primary-background-color) 0 1px 1px,
      var(--primary-background-color) 0 -1px 1px,
      var(--primary-background-color) 1px 1px 1px,
      var(--primary-background-color) -1px 1px 1px,
      var(--primary-background-color) -1px -1px 1px,
      var(--primary-background-color) 1px -1px 1px,
      var(--accent-shadow-color) 2px 0 10px,
      var(--accent-shadow-color) -2px 0 10px,
      var(--accent-shadow-color) 0 2px 10px,
      var(--accent-shadow-color) 0 -2px 10px,
      var(--accent-shadow-color) 4px 0 30px,
      var(--accent-shadow-color) -4px 0 30px,
      var(--accent-shadow-color) 0 4px 30px,
      var(--accent-shadow-color) 0 -4px 30px;
  }
  :host, :root {
    --md-sys-color-primary: var(--primary-color);
    --md-sys-color-on-primary: var(--text-color);
  }
`;
