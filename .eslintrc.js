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
    'jsdoc',
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
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    /* TS rule overrides */
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowedNames: ['connectedCallback', 'disconnectedCallback', 'render'],
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    /* JSDocs rules */
    'jsdoc/check-access': 2,
    'jsdoc/check-alignment': 2,
    'jsdoc/check-examples': [2, {
      paddedIndent: 2,
    }],
    'jsdoc/check-indentation': 2,
    'jsdoc/check-param-names': [2, {
      checkRestProperty: true,
      checkDestructured: true,
      enableFixer: true,
    }],
    'jsdoc/check-property-names': [2, { enableFixer: true }],
    'jsdoc/check-syntax': 2,
    'jsdoc/check-tag-names': 2,
    'jsdoc/check-types': 0,
    'jsdoc/check-values': 2,
    'jsdoc/empty-tags': 2,
    'jsdoc/implements-on-classes': 2,
    'jsdoc/match-description': 2,
    'jsdoc/newline-after-description': 2,
    'jsdoc/no-defaults': [2, {
      noOptionalParamNames: true,
    }],
    'jsdoc/no-types': 2,
    'jsdoc/no-undefined-types': 0,
    'jsdoc/require-description': 2,
    'jsdoc/require-example': 0,
    'jsdoc/require-file-overview': 0,
    'jsdoc/require-hyphen-before-param-description': [2, 'always'],
    'jsdoc/require-jsdoc': [2, {
      require: {
        ArrowFunctionExpression: true,
        ClassDeclaration: true,
        ClassExpression: true,
        FunctionDeclaration: true,
        FunctionExpression: false,
        MethodDefinition: false,
      },
      contexts: [
        'TSMethodSignature',
        'MethodDefinition' +
          ':not([key.name=/^(perform|should|first)?update(d)?$/i])' +
          ':not([key.name=/^render/])' +
          ':not([key.name=/^((dis)?connected|attributeChanged|adopted)Callback$/])' +
          ' > FunctionExpression',
      ],
      checkConstructors: false,
      checkGetters: false,
      checkSetters: false,
    }],
    'jsdoc/require-param-description': 0,
    'jsdoc/require-param-name': 2,
    'jsdoc/require-param-type': 0,
    'jsdoc/require-param': 2,
    'jsdoc/require-property': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-property-name': 0,
    'jsdoc/require-property-type': 0,
    'jsdoc/require-returns-check': 2,
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-returns': 0,
    'jsdoc/require-throws': 2,
    'jsdoc/valid-types': 0,
  },
};
