// webpack configuration
import HtmlWebpackPlugin from 'html-webpack-plugin'

import path from 'path'
import webpack from 'webpack'

// const devMode = process.env.NODE_ENV !== 'production'

const config = {
    entry: {
        app: ['./src/ts/main.ts']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/darkkifu.min.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                            url: false
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.ts/,
                use:[
                    'ts-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
    ],
 externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
}

module.exports = config
