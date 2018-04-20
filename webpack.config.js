const webpack = require('webpack');
const path = require('path');
const extractText = require('extract-text-webpack-plugin');

const bundleName = 'framework';

module.exports = {
    entry: ['./src/js/app.js', './src/scss/structure.scss'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `js/${bundleName}.bundle.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: extractText.extract(
                    [
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => [
                                    // require('postcss-cssnext')(),
                                    require('autoprefixer')(),
                                    // require('cssnano')()
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                ),
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new extractText({
            filename: `css/${bundleName}.bundle.css`,
            allChunks: true
        })
    ],
    devtool: 'source-map'
};