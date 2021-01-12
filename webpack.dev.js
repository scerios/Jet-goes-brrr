const common = require('./webpack.common');
const path = require('path');
const { merge } = require('webpack-merge');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    watch: true,
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new NodemonPlugin({
            script: './server.js',
            watch: path.resolve('./dist')
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
});