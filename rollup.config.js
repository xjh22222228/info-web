// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web

import { terser } from 'rollup-plugin-terser';

export default {
  input: './index.js',
  output: {
    file: 'index.min.js',
    format: 'module',
    name: 'bundle',
    plugins: [terser()],
  },
  plugins: [],
};
