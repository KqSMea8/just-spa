
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getConfig = require('./webpack.config');
const logger = require('./src/lib/logger');
const fse = require('fs-extra');
const minimist = require('minimist');
const axios = require('axios');

const axon = require('axon');
const socketSub = axon.socket('pull');
const socketUrl = 'tcp://127.0.0.1:6677';

const childProcess = require('child_process');


const argvs = minimist(process.argv.slice(2));

const commandParams = process.argv.splice(2);
const port = argvs.p || argvs.port || 80;


const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use('/api', router);
app.use('/test', router);
app.use('/saveReadme', router);

function _isWinPlatform() {
    return process.platform.indexOf('win') > -1;
}

const config = getConfig({
    port: port || 80
});
// https://segmentfault.com/a/1190000006964335
const webpackDevServer = new WebpackDevServer(webpack(config), {

    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,

    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },

    compress: true,

    proxy: {
        '/api': 'http://localhost:' + port,
        '/test': 'http://localhost:' + port
    },

    staticOptions: {

    },

    quiet: true,
    noInfo: true,
    headers: { 'X-Custom-Header': 'yes' },
    stats: { colors: true },
    before: function (app) {
        app.use(bodyParser.json());
        // mock数据接口
        app.get('/api', function (req, res) {

            // 读取本地mock数据路径
            fse.readJson(req.query.mockUri).then(mockObj => {
                res.json(mockObj);
            }).catch(err => {
                console.error(err)
            });
        });

        // mock数据接口
        app.post('/saveReadme', function (req, res) {

            if(!argvs.devpath) {
                res.json(
                    { success: false, result: '组件目录不能为空' }
                );
                return ;
            }

            let readMePath = path.join(argvs.devpath || '', req.body.componentName, 'readme.md');

            fse.outputFile(readMePath, req.body && req.body.readmeContent).then(() => {
                res.json(
                    { success: true, result: '保存成功' }
                );
            }).catch(err => {
                res.json(
                    { success: false, result: '保存失败' }
                );
            })
        });

        // 单元测试脚本
        app.get('/test', function (req, res) {

            let componentName = req.query.componentName;
            let testFile = req.query.testFile || 'test.js';
            let testCommand = '';

            if (_isWinPlatform()) {
                testCommand = `.\\node_modules\\.bin\\mocha --compilers js:babel-core/register --no-deprecation .\\.build\\${componentName}\\test\\${req.query.testFile}`;
            } else {
                testCommand = `./node_modules/.bin/mocha --compilers js:babel-core/register --no-deprecation ./.build/${componentName}/test/${req.query.testFile}`;
            }

            childProcess.exec(testCommand, (error, stdout, stderr) => {

                // 目前根据测试结果的标识判断是否测试通过
                if (stdout.indexOf('Error') > -1) {
                    res.json({ success: false, result: stdout });
                } else if (stdout.indexOf('passing') > -1) {
                    res.json({ success: true, result: stdout });
                } else {

                    if (error) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: JSON.stringify(error) });
                        return;
                    }

                }
            });
        });

        // 运行自定义脚本
        app.get('/script', function (req, res) {

            let componentName = req.query.componentName;
            let scriptFile = req.query.scriptFile || '';
            let scriptCommand = req.query.scriptCommand || 'node';

            if (_isWinPlatform()) {
                scriptCommand = `${scriptCommand} .\\.build\\${componentName}\\${req.query.scriptFile}`;
            } else {
                scriptCommand = `./node_modules/.bin/${scriptCommand} ./.build/${componentName}/${req.query.scriptFile}`;
            }

            childProcess.exec(scriptCommand, (error, stdout, stderr) => {
                // 目前根据测试结果的标识判断是否测试通过
                if (stdout.indexOf('Error') > -1) {
                    res.json({ success: false, result: stdout });
                } else if (stdout.indexOf('passing') > -1) {
                    res.json({ success: true, result: stdout });
                } else {
                    if (error) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: JSON.stringify(error) });
                        return;
                    }
                }
            });
        });
    }
});

/**
 * 启动dev服务器
 * 
 */
function _startWebpackDevServer() {
    webpackDevServer.listen(port, 'localhost', function (err, result) {
        // 延时启动 
        if (err) {
            return console.log(err);
        }
    });
}

function _bindZmq() {
    // 监听watch服务命令
    socketSub.bind(socketUrl);

    socketSub.on('message', function (action) {
        switch (action) {
            // 当调试服务运行watch时，重启webpackDevServer
            case 'watch':
                process.exit(-1);
                break;
            default:
                break;
        }
    });
}

/**
 * 判断是否为windows平台
 * 
 * @returns 
 */
function _isWinPlatform() {
    return process.platform.indexOf('win') > -1;
}

_startWebpackDevServer();

_bindZmq();