import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
	// Apply to JavaScript and TypeScript files
	{
		files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
		languageOptions: {
			parser: tsparser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				// Node.js globals
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				global: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				// Browser/DOM globals
				window: 'readonly',
				document: 'readonly',
				Document: 'readonly',
				HTMLElement: 'readonly',
				HTMLAnchorElement: 'readonly',
				HTMLInputElement: 'readonly',
				HTMLButtonElement: 'readonly',
				HTMLFormElement: 'readonly',
				MouseEvent: 'readonly',
				PopStateEvent: 'readonly',
				URLSearchParams: 'readonly',
				FormData: 'readonly',
				Headers: 'readonly',
				fetch: 'readonly',
				Window: 'readonly',
				URL: 'readonly',
				HTMLScriptElement: 'readonly',
				alert: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			// Base ESLint recommended rules
			...js.configs.recommended.rules,
			// TypeScript ESLint recommended rules (using new format)
			...tseslint.configs['recommended'].rules,
			// Custom rules from original config
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
					ignoredNodes: [
						'JSXElement',
						'JSXElement > *',
						'JSXAttribute',
						'JSXIdentifier',
						'JSXNamespacedName',
						'JSXMemberExpression',
						'JSXSpreadAttribute',
						'JSXExpressionContainer',
						'JSXOpeningElement',
						'JSXClosingElement',
						'JSXFragment',
						'JSXOpeningFragment',
						'JSXClosingFragment',
						'JSXText',
						'JSXEmptyExpression',
						'JSXSpreadChild'
					]
				}
			],
			'linebreak-style': [
				'error',
				'unix'
			],
			quotes: [
				'error',
				'single'
			],
			semi: [
				'error',
				'always'
			],
			'no-useless-concat': 'error',
			'prefer-template': 'error',
			'quote-props': [
				'error',
				'as-needed'
			],
			'max-len': [
				'error',
				{
					code: 125,
					tabWidth: 4
				}
			],
			'no-trailing-spaces': 'error',
			'@typescript-eslint/no-empty-interface': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-unsafe-function-type': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	// Ignore patterns
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'types/**',
			'example/**',
			'coverage/**'
		]
	}
];