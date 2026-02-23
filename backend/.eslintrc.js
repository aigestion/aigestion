module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.js',
    '*.config.ts',
    '*.setup.ts',
    'jest.setup.js',
    '../_legacy_assets_build/**',
    'infra/keys/**',
  ],
  overrides: [
    {
      // Test files: re-enable type-aware linting via tsconfig.test.json
      files: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts', 'jest.setup.ts'],
      parserOptions: {
        project: ['./tsconfig.test.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        // Mocks legitimately use `any`
        '@typescript-eslint/no-explicit-any': 'off',
        // Test helpers often return void implicitly
        '@typescript-eslint/no-floating-promises': 'off',
        // Unsafe calls are unavoidable with jest.fn() / mocks
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        // console.log is fine in tests
        'no-console': 'off',
      },
    },
  ],
};

