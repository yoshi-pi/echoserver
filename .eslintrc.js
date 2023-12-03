module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'standard-with-typescript',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      './tsconfig.json',
      './apps/frontend/tsconfig.json',
      './apps/backend/tsconfig.json',
      './apps/backend/tsconfig.eslint.json',
    ],
  },
  plugins: ['@typescript-eslint'],
  root: true,
};
