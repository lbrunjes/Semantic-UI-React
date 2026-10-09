import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/'],
  },

  // ----------------------------------------
  // JavaScript & TypeScript
  // ----------------------------------------
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Only "process.env.NODE_ENV" is used, it is replaced by bundlers
        process: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': 'error',
      // "import type" of a module that is also imported for values is fine
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-return-assign': ['error', 'except-parens'],
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',

      'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],

      // Heads up! "recommended" of v7 also enables React Compiler rules, these are the original ones
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // ----------------------------------------
  // Node: configs & scripts
  // ----------------------------------------
  {
    files: ['*.js', '*.mjs', 'scripts/**', 'test/bundles.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['.babel-preset.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  // ----------------------------------------
  // Tests
  // ----------------------------------------
  {
    files: ['test/**/*.js', 'test/**/*.tsx'],
    languageOptions: {
      globals: globals.vitest,
    },
    rules: {
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/tabindex-no-positive': 'off',
      'react/display-name': 'off',
      'react/forbid-foreign-prop-types': 'off',
      // Tests pass arbitrary props to check they are handled
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
    },
  },

  // ----------------------------------------
  // TypeScript
  // ----------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-unused-vars': 'off',
    },
  },

  prettier,
)
