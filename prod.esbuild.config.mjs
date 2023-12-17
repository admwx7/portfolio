import esbuild from 'esbuild';
import { config } from './esbuild.config.mjs';

const CONFIG = {
  ...config,
  minify: true,
};

const build = () => esbuild.build(CONFIG);
await build();
