module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['public'],
  rules: {
  }
}
