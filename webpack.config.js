// webpack.config.js
var path = require('path');
var webpack = require('webpack');

var config = {
    context: path.resolve(__dirname + '/src'),
    entry: {
        app: ['webpack/hot/dev-server', './app.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js',
        publicPath: 'http://localhost:8080/build/'
    },
    devServer: {
        contentBase: './public',
        publicPath: 'http://localhost:8080/build/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
    ],
    target: "async-node",
    node: {
        fs: "empty"
    },
};

module.exports = config;
