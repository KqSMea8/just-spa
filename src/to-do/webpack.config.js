const path = require('path');
const webpack = require('webpack');

const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// 构建目录配置
const BUILD_CONFIG = {
    dev_dir: 'dev/www/',   //构建后生成的根目录,不要带目录'/'符号
    dev_server_root: 'dev/',
    build_dir: 'build/webroot/',
    pkg_src_dir: 'build/',    // 打包源目录
    pkg_build_dir: './pkg',   // 打包输出目录
    src_dir: './src',             // 构建源目录,不要带目录'/'符号
    html_dir: 'www/',         // html目录名称，src和page相同
    js_dir: 'src/entry',           // 构建js目录,不要带目录'/'符号
    html_domain: '',
    css_domain: '',
    js_domian: ''
}

// 获取页面的每个入口文件，用于配置中的entry
function getEntry() {
    let files = {};

    files = {
        'index': './src/entry/index'
    }
    return files;
}

module.exports = {
    cache: true,
    // devtool: '#source-map',
    entry: getEntry(),
    output: {
        path: path.join(__dirname, BUILD_CONFIG.dev_dir + '/js'),
        publicPath: '/js/',
        filename: '[name].js'
    },
    externals: {
        'jquery': 'jQuery',
        'react': 'React',
        'moment': 'moment',
        'react-dom': 'ReactDOM',
        'lodash': '_',
        'bootstrap': 'bootstrap'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.less', '.scss', '.css'],
    },
    module: {
        // babel loader配置
        rules: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, 'src'),
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=stage-0,presets[]=react'
                // loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react'
            }]
        }, {
            test: /\.(less|css)$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.(png|jpg|gif|md)$/,
            use: ['file-loader?limit=10000&name=[md5:hash:base64:10].[ext]']
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ['url-loader?limit=10000&mimetype=image/svg+xml']
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ['url-loader?limit=1000000']
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)\??.*$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[md5:hash:8].[ext]',
                    outputPath: '../fonts/',    // where the fonts will go
                    publicPath: './fonts/'       // override the default path
                }
            }]
        }],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['flows', 'common'],
            minChunks: Infinity
        }),
        new webpack.LoaderOptionsPlugin({
            BUILD_CONFIG: BUILD_CONFIG
        }),
        // new uglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // 定义process.env.NODE_ENV
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('developement')
        })
    ]
};
