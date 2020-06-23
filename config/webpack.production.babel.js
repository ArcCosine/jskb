import merge from 'webpack-merge';
import common from './webpack.common.js'; // import common setting.
import TerserPlugin from 'terser-webpack-plugin';

const config = merge(common, {
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
});

export default config;
