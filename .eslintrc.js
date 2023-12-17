// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
  ],
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'html',
  ],
  rules: {
    /* Base rule overrides */
    'arrow-parens': ['error', 'always'],
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 2,
    }],
    'max-len': ['error', {
      'code': 120,
    }],
    'new-cap': 'off',
    'no-unused-expressions': ['error', {
      allowShortCircuit: true,
      allowTernary: false,
    }],
    'no-unused-vars': 'off',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    /* TS rule overrides */
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowedNames: ['connectedCallback', 'disconnectedCallback', 'render'],
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    // Re-enable these
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
  },
};
