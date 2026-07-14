export default [
	{
		files: ['**/*.{tsx,ts}'],
		languageOptions: {
			globals: {
				$: 'readonly',
			},
		},
		rules: {
			'@stylistic/max-len': 'off',
			'@stylistic/no-mixed-operators': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'capitalized-comments': 'off',
			'require-unicode-regexp': 'off',
			'unicorn/consistent-boolean-name': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/name-replacements': 'off',
		},
	},
];
