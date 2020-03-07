module.exports = {
	tabWidth: 4,
	useTabs: true,
	printWidth: 120,
	proseWrap: 'preserve',
	semi: true,
	trailingComma: 'none',
	singleQuote: true,
	bracketSpacing: false,
	arrowParens: "always",
	endOfLine: "lf",
	overrides: [
		{
			files: './src/**.ts',
			options: {
				tabWidth: 4
			}
		}
	]
};