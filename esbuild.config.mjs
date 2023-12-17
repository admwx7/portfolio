import htmlPlugin from '@chialab/esbuild-plugin-html';
import inlineImage from 'esbuild-plugin-inline-image';
import inlineWorkerPlugin from 'esbuild-plugin-inline-worker';
import watPlugin from 'esbuild-plugin-wat';

export const config = {
  entryPoints: ['index.html'],
  resolveExtensions: ['.ts', '.js'],
  bundle: true,
  minify: false,
  sourcemap: true,
  outdir: 'dist',
  assetNames: 'assets/[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  tsconfig: 'tsconfig.json',
  loader: {
    '.ico': 'file',
    '.jpg': 'file',
    '.png': 'file',
    '.svg': 'file',
    '.webp': 'file',
  },
  plugins: [htmlPlugin(), watPlugin(), inlineImage(), inlineWorkerPlugin()],
};
export default config;
