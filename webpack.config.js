var path = require('path');
const fs = require('fs');
var webpack = require('webpack');

const dependencies = require('./package.json').alias;


const configs = {
    buidDir: '.build',   // 输出文件落地的目录
    publicPath: 'static/'   // 发布到devserver的http目录
};

const jsDir = path.resolve(process.cwd(), configs.buidDir);

// 读取本地其它组件的依赖
let alias = require(`./${configs.buidDir}/alias.json`);
// 解析本地其它组件的依赖
for(let key in alias) {
    alias[key] = path.resolve(__dirname, './.build/' + alias[key])
}

for(let key in dependencies){
    alias[key] = path.resolve(jsDir, dependencies[key])
}

// 获取页面的每个入口文件，用于配置中的entry
function getEntry(options) {
    const jsPath = jsDir;
    const dirs = fs.readdirSync(jsPath);
    let matchs = [], files = {
        common: [
            'react-hot-loader/patch',
            // 开启 React 代码的模块热替换(HMR)

            'webpack-dev-server/client?http://localhost:' + (options.port || 8000),
            // 为 webpack-dev-server 的环境打包代码
            // 然后连接到指定服务器域名与端口，可以换成本机ip

            'webpack/hot/only-dev-server',
            // 为热替换(HMR)打包好代码, only- 意味着只有成功更新运行代码才会执行热替换(HMR)
          ]
    };   // 先解析加载imports解析到的map文件
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.jsx?$/);
        // 如果_getImportsScriptList获取到的文件已经含有，则跳过不覆盖解析
        if (matchs && !files[matchs[1]]) {
            files[matchs[1]] = path.resolve(jsDir, item);
        }
    });
    return files;
}

module.exports = function getConfig(options) {
    return {
    //   devtool: 'eval',
    entry: getEntry(options),
    output: {
        path: path.join(__dirname, configs.publicPath),
        publicPath: `/${configs.publicPath}`,
        filename: '[name].js',
        chunkFilename: '[name].js',
        libraryTarget: 'umd'
    },

    devServer: {
        hot: true, // 4
        // 开启服务器的模块热替换(HMR)
        headers: {
        'Access-Control-Allow-Origin': '*', // 5
        }
    },
    resolve: {
            // 全局依赖id，例如使用了就可以在全局require使用key，使用package.json里面的配置，例如: var $ = require('juery')，另外，同时也可以使用相对路径来使用
            alias: alias,

            // extensions中第一个空串不能去，官方解释如下：
            // Using this will override the default array, meaning that webpack will no longer try to resolve modules using the default extensions. 
            // For modules that are imported with their extension, e.g. import SomeFile from './somefile.ext', to be properly resolved, an empty string must be included in the array.
            extensions: ['*', '.js', '.jsx', '.less', '.scss', '.css'],
        },
    module: {

        rules: [{
            test: /\.jsx?$/,
            include: [path.join(__dirname, configs.buidDir)],
            //exclude: /node_modules/,
            use: [{
                
                loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react'
            }]
        }, {
            test: /\.(less|css)$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.(png|jpg|gif|md)$/,
            use: ['file-loader?limit=10000']
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ['url-loader?limit=10000&mimetype=image/svg+xml']
        }],

    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common']
        }),
        new webpack.NamedModulesPlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        // webpack 2不再支持自定义属性，需要使用LoaderOptionsPlugin来引用
    ]
    };
}
