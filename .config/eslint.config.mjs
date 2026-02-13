import sharedConfig from '@aigestion/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...sharedConfig,
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.next/**'],
  },
];
