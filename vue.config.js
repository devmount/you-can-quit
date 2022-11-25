process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
	configureWebpack: {
		performance: {
			maxEntrypointSize: 1024000,
			maxAssetSize: 1024000
		},
		output: {
			filename: 'js/[contenthash]-[name].js',
			chunkFilename: 'js/[chunkhash]-[name].bundle.js',
		},
	},
	productionSourceMap: false,
	publicPath: '/',
}
