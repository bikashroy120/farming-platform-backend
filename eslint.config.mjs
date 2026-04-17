// eslint.config.js
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * ESLint Flat Config for Node.js + Express + TypeScript + Prettier
 */
export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['node_modules', 'dist', 'build', 'coverage'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },

    rules: {
      // --- bring in recommended rulesets manually ---
      ...tseslint.configs.recommended.rules,
      ...eslintConfigPrettier.rules,

      // --- TypeScript rules ---
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // --- General JS rules ---
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // --- Prettier rules ---
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          printWidth: 80,
          arrowParens: 'avoid',
          endOfLine: 'auto',
          proseWrap: 'preserve',
        },
      ],
    },
  },
];
