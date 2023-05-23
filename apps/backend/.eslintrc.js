module.exports = {
  env: {
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
  },
  extends: ['plugin:jest/recommended'],
  plugins: ['jest'],
};
