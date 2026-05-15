// Copyright @ 2024-present liuzi6612. All rights reserved. MIT license.
// See https://github.com/liuzi6612/info-web

import { terser } from 'rollup-plugin-terser';

export default {
  input: './index.js',
  output: {
    file: 'index.min.js',
    format: 'module',
    name: 'bundle',
    plugins: [terser()],
  },
  external: ['jsdom', 'axios', 'jschardet', 'node:url', 'he', 'node:https'],
  plugins: [],
};
