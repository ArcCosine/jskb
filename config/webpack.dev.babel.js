import merge  from 'webpack-merge'
import common from './webpack.common.js' // import common setting.
import path from 'path'

const devConfig = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        https: true,
        hot: true,
        host: '0.0.0.0',
        port: 9200,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "./dist"),
        },
    }
})

export default devConfig
