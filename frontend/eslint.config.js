import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React 17+ — JSX transform, no import needed
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Inline helper components are common in this codebase — warn only
      'react/no-unstable-nested-components': 'warn',

      // Quotes in JSX text — warn, fix incrementally
      'react/no-unescaped-entities': 'warn',

      // Unused vars — warn, ignore _ prefix
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // New react-hooks v7 rules — widespread patterns in this codebase;
      // kept as warn so violations surface without blocking builds
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',

      // Fast-refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Real bugs — keep as errors
      'no-undef': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],

      // Style — warn only so existing code isn't blocked
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },
  prettier,
]
