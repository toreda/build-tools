module.exports = {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					node: '14.1.1'
				},
				useBuiltIns: 'usage',
				corejs: {
					version: '3.17.2',
					shippedProposals: true
				}
			}
		],
		'@babel/preset-typescript'
	],
	plugins: ['const-enum', '@babel/transform-typescript']
};
