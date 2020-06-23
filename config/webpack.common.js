// webpack configuration
import HtmlWebpackPlugin from "html-webpack-plugin";

import path from "path";
import webpack from "webpack";

const config = {
    entry: {
        app: ["./src/ts/main.tsx"]
    },
    output: {
        //path: path.resolve(__dirname, "dist"),
        filename: "./js/darkkifu.min.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                            url: false
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.ts(x?)$/,
                use: ["ts-loader"]
            },
 {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),

        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true
            }
        })
    ],
};

module.exports = config;
