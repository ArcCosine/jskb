import merge  from 'webpack-merge'
import common from './webpack.common.js' // import common setting.
import path from 'path'

const devConfig = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        https: true,
        inline: true,
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 9200
    }
})

export default devConfig
