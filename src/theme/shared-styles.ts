import {css} from 'lit-element';

export const reset = css`
  [hidden] {
    display: none;
  }
  h1 {
    font-size: 28pt;
    margin-top: 0;
    margin-bottom: 0;
    color: var(--accent-color);
    font-weight: bold;
  }
  h2 {
    font-size: 22pt;
    margin-top: 0;
    margin-bottom: 0;
    color: var(--accent-color);
    font-weight: bold;
  }
  h3 {
    font-size: 16pt;
    margin-top: 0;
    margin-bottom: 0;
    color: var(--accent-color);
    font-weight: bold;
  }
  p {
    font-size: 14pt;
    margin-top: 0;
    margin-bottom: 0;
  }
  a {
    color: var(--text-color);
  }
  a:hover {
    color: var(--accent-color);
  }
  a:hover > mwc-icon {
    color: var(--text-color);
    filter: var(--drop-shadow);
  }
`;
export const card = css`
  .card {
    margin: 0 auto;
    padding: var(--padding);
    color: var(--text-color);
    max-width: 1475px;
  }
  .card__content {
    padding-right: var(--padding);
    padding-left: var(--padding);
    text-align: justify;
  }
`;
export const tiles = css`
  .tiles {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
`;
