import { createSpaConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createSpaConfig({
  output: {
    format: 'esm',
    dir: 'dist'
  },
  developmentMode: process.env.ROLLUP_WATCH === 'true',
  injectServiceWorker: true,
  nodeResolve: {
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
  },
});

export default {
  ...baseConfig,
  input: './index.html',
  plugins: [
    ...baseConfig.plugins,
    typescript(), // Mostly works, however multi-entry to allow all of the pages as entry points breaks when using html
  ],
};
