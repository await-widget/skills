export default [
	{
		ignores: ['**/simple-icons.json', '**/*.{js,mjs,cjs}'],
	},
	{
		files: ['**/*.tsx'],
		languageOptions: {
			globals: {
				$: 'readonly',
			},
		},
		rules: {
			'@stylistic/padding-line-between-statements': 'off',
			'@stylistic/no-mixed-operators': 'off',
			'@stylistic/object-curly-spacing': 'off',
			'@stylistic/semi-spacing': 'off',
			'@stylistic/no-extra-semi': 'off',
			'@stylistic/eol-last': 'off',
			'@stylistic/max-len': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'capitalized-comments': 'off',
			'import-x/extensions': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-empty-file': 'off',
			'require-unicode-regexp': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'unicorn/no-array-sort': 'off',
		},
	},
];
