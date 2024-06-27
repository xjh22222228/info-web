import { terser } from 'rollup-plugin-terser';

export default {
  input: './index.js',
  output: {
    file: 'index.min.js',
    format: 'umd',
    name: 'bundle',
    plugins: [terser()],
  },
  plugins: [],
};
