const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {

	return {
		context: path.resolve(__dirname, './src'),

		entry: {
			app: './app.ts'
		},

		output: {
			filename: '[name].[contenthash].bundle.js',
			chunkFilename: '[name].[contenthash].bundle.js',
			path: path.resolve(__dirname, 'dist'),
		},

		devtool: 'source-map',

		resolve: { extensions: ['.ts', '.js'] },

		module: {
			rules: [
				{
					test: /\.ts?$/,
					loader: 'ts-loader',
					options: { transpileOnly: true }
				},
				{
					test: /\.html$/,
					exclude: `${path.join(__dirname, "/src/index.html")}`,
					use: [
						{ loader: 'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './src')) },
						{ loader: 'html-loader' }
					]
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader"
					]
				},
				{ test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader?name=assets/[name].[ext]' },
			]
		},

		plugins: [
			new webpack.ProgressPlugin(),
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: "./index.html",
				filename: "index.html",
				chunksSortMode: "manual",
				chunks: ['vendors', 'app'],
			}),
			new MiniCssExtractPlugin({
				filename: "style.[contenthash].css",
				chunkFilename: "style.[contenthash].css"
			}),
			new CopyWebpackPlugin([
				{ from: 'assets', to: 'assets' }
			])
			//new BundleAnalyzerPlugin()
		],

		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
				}
			},
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						output: {
							comments: false
						}
					}
				})
			]
		}
	}
};