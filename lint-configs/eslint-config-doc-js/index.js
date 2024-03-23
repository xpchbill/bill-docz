module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:mdx/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    semi: ['error', 'always', { omitLastInOneLineClassBody: true }],
    'semi-spacing': ['error', { before: false, after: true }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'react/no-unknown-property': [
      2,
      {
        ignore: ['jsx', 'sx'],
      },
    ],
    'no-mixed-operators': 'error',
    'no-console': 'off',
    'react/prop-types': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
