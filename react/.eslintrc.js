module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  globals: {
    window: 'readonly'
  },
  env: {
    jest: true,
    browser: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.*', 'src/test/**'] }],
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        'allowSingleExtends': true
      }
    ],
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          // side effect imports, separated from other imports by a newline
          ['^\\u0000'],
          // packages, followed by all other imports
          ['^@?\\w', '']
        ]
      }
    ],
    'import/order': 'off',
    'import/extensions': 'off'
  },
  plugins: [
    'simple-import-sort',
  ],
};
