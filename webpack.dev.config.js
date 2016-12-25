const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = {
    name: 'client',
    devtool: 'source-map',
    target: 'web',
    entry: [path.resolve(__dirname, 'client', 'client.jsx')],
    output: {
        path: '/',
        filename: 'client.js',
        publicPath: 'http://localhost:3000/built/'
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
        root: [path.join(__dirname, 'client')],
        extensions: ['', '.js', '.jsx', '.scss', '.sass']
    }
};
module.exports = config;