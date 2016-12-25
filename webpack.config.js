const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    name: 'client',
    entry: ['./client/client.jsx'],
    output: {
        path: path.join(__dirname, 'built/client/'),
        filename: 'client.js',
        publicPath: '/built/client'
    },
    module: {
        loaders: [{
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            }, {
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
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        root: [path.join(__dirname, 'client')],
        extensions: ['', '.js', '.jsx', '.scss', '.less']
    }
};

const serverConfig = {
    name: 'server',
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: [path.resolve(__dirname, 'server', 'server.js')],
    output: {
        path: path.join(__dirname, 'built'),
        filename: 'server.js',
        publicPath: 'built/',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            loader: 'null'
        }, {
            test: /\.scss$/,
            loader: 'css-loader/locals?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'server', 'static'),
            to: path.resolve(__dirname, 'built', 'static')
        }])
    ],
    resolve: { root: [path.resolve(__dirname, 'server')] }

};

module.exports = [config, serverConfig];