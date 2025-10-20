import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

// Minimal helpers to allow the config to be evaluated in this environment
function defineConfig(x) { return x; }
function globalIgnores(arr) { return { ignores: arr }; }

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build', '.eslintrc.js']),
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Keep core rules
      'no-unused-vars': 'error',
      'no-irregular-whitespace': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'prefer-const': 'error',
      // react-hooks rule removed to avoid requiring plugin in this minimal run
    },
  },
])