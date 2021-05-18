process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
	configureWebpack: {
		performance: {
			maxEntrypointSize: 1024000,
			maxAssetSize: 1024000
		},
		output: {
			filename: 'js/[name].js',
			chunkFilename: 'js/[name].bundle.js',
		},
	},
	productionSourceMap: false,
	publicPath: '/',
}
