import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { existsSync } from 'fs';

const input = existsSync('./src/index.ts')
  ? './src/index.ts'
  : './src/index.tsx';
const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);
const extensions = ['.ts', '.js', '.tsx', '.jsx'];
const babelOptions = {
  rootMode: 'upward',
  extensions,
  babelHelpers: 'bundled',
};
const jsInput = existsSync('./src/index.js') ? './src/index.js' : input;

export default [
  {
    input: jsInput,
    output: {
      format: 'cjs',
      file: './lib/index.cjs.js',
      exports: 'named',
    },
    external,
    plugins: [nodeResolve({ extensions }), babel(babelOptions)],
  },
  {
    input: jsInput,
    output: {
      format: 'esm',
      file: './lib/index.esm.js',
    },
    external,
    plugins: [
      nodeResolve({ extensions }),
      babel({
        ...babelOptions,
        plugins: [
          [
            'babel-plugin-transform-rename-import',
            {
              replacements: [],
            },
          ],
        ],
      }),
    ],
  },
];
