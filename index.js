
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const axon = require('axon');
const socketPub = axon.socket('push');
const downloadGitRepo = require('download-git-repo');
const childProcess = require('child_process');
const logger = require('./src/lib/logger');
const fileAsync = require('./src/fileAsync');

const configs = require('./src/configs');
const { isWinPlatform, getPortFromParams } = require('./src/utils');

const { createComponent, createWebapp, createTemplate, removeTemplate, listTemplates } = require('./src/componentLine');

const args = process.argv.splice(1);
const currentPath = process.cwd();
const serverPath = path.dirname(path.resolve(args[0], '../'));

const command = args[1] || '';
const commandParams = args.slice(2) || [];

const devRootHost = 'http://localhost';

const buildPath = configs.BUILD_PATH; // build输出目录
const npm = configs.NPM;              // npm的安装命令

let cdDisk = '';

// 如果匹配到windows环境的盘符，则需要转盘符
if (/(\w:)/ig.test(serverPath)) {
    cdDisk = serverPath.match(/(\w:)/gi)[0] + ' && ';
}

/**
 * 初始化命令集合
 * 
 */
function _initCommandSet(serverPath, command, commandParams) {

    logger(`当前包管理工具为 ${npm}.`, 'cyan');

    // 命令行处理
    switch (command) {
        case 'test':
            downloadGitRepo('gitlab@git.code.oa.com:ouvenzhang/webapp-compoments-template.git', 'tmp',{ clone: true }, function (err, data) {
                console.log(err, data);
                console.log(err ? 'Error' : 'Success')
            });
            break;
        case 'i':
        case 'install':
            _installOrUpdateAllDependencies(commandParams, 'install');
            break;
        case 'update':
            _installOrUpdateAllDependencies(commandParams, 'update');
            break;
        case 'init':
            createComponent(() => {
                logger('auto install dependencies', 'cyan');
            });         // 根据物料创建组件
            break;
        case 'template':
            createTemplate(serverPath); // 创建物料模板
            break;
        case 'webapp':
            createWebapp((webappName) => {
                logger(`项目初始化完成，执行：cd ${webappName} & ${npm} i 安装项目依赖`, 'cyan');
                // _installDependencies(commandParams, componentName, 'install');
            }); // 根据项目组件物料库创建项目
            break;
        case 'rmtemplate':
            removeTemplate(serverPath); // 删除物料模板
            break;
        case 'list':
            listTemplates();            // 删除物料模板
            break;
        case 'clear':
        case 'clean':
            _clearCacheBuildDir([       // 如果命令为空，则输出help
                serverPath + buildPath
            ]);
            break;
        case 'run':
        case 'start':
            _initStart(commandParams);
            break;
        case '':
        case 'help':
            // 如果命令为help，则输出help
            _consoleHelp();
            break;
        case 'watch':
        case 'dev':
            _clearCacheBuildDir([       // 如果命令为空，则输出help
                serverPath + buildPath
            ]);
            // watch、dev均可开启调试模式
            _initFileWatch(serverPath);
            break;
        case 'build':
            // 编译打包组件为单个可输出文件
            _buildEs5Component(commandParams);
            break;
        case 'set':
            // 设置npm运行命令，选择npm还是tnpm
            _setNpmCommand(commandParams);
            break;
        case '-v':
        case 'version':
            _showVersion();
            break;
        default:
            // 如果命令为空，且没有该命令，则提示没有该命令
            logger(`抱歉，没有找到"${command}"命令。您可以尝试just help来查看所有命令.`, 'red');
            _consoleHelp();
            break;
    }
}

/**
 * 设置npm运行命令，选择npm、cnpm还是tnpm
 * 
 * @param {any} commandParams 
 */
function _setNpmCommand(commandParams) {
    // 使用一个子进程进入服务器目录并启动组件服务
    if (!commandParams[0]) {
        logger('请输入要设置的npm工具，输入例如：just set npm/tnpm/cnpm', 'red');
        return;
    }

    configs['NPM'] = commandParams[0];

    fse.outputJson(path.join(serverPath, './src', 'configs.json'), configs, {
        encoding: 'utf8',
        spaces: 4
    }, function(err, data) {
        if (err) throw err;
        logger(`${commandParams[0]} has been setted successfully.`, 'cyan');
    });
}

/**
 * 编译打包组件为单个可输出文件
 * 
 * @param {any} commandParams 
 */
function _buildEs5Component(commandParams) {
    // 使用一个子进程进入服务器目录并启动组件服务
    if (!commandParams[0]) {
        logger('请输入要打包的组件名称，输入例如：just build ComponentName', 'red');
        return;
    }

    let componentDir = path.join(currentPath, commandParams[0]);

    if (!componentDir) {
        logger('输入的组件名称不正确，任务即将跳过', 'magenta');
        return;
    }

    logger(`running: 开始build组件...`, 'cyan');
    childProcess.exec(`cd "${serverPath}" && ${cdDisk} node "./command/build-es5" --src "${serverPath}" --dist "${componentDir}" --name "${commandParams[0]}"`, (error, stdout, stderr) => {
        if (error) {
            logger(`childProcess.exec error: ${error}`, 'magenta');
            return;
        }
        if (stderr) {
            logger(`warning: ${stderr}`, 'magenta');
        }
        logger(`stdout: ${stdout}`, 'cyan');
        logger(`Es5组件构建任务完成.`, 'green');
    });
}

/**
 * 显示版本
 * 
 */
function _showVersion() {
    fse.readJson(`${serverPath}/package.json`).then(packageObj => {
        logger(`version: ${packageObj.version}`, 'cyan');
    });
}

/**
 * 清楚build缓存目录，强制直接删除
 * 
 */
function _clearCacheBuildDir(dirs) {
    for (let dir of dirs) {
        fse.removeSync(dir);
    }
}

/**
 * 安装或更新当前组件依赖
 * 
 * @param {any} commandParams 
 * @param {any} command 
 */
function _installDependencies(commandParams, componentName, command) {

    let params = _readDependencies(componentName).join(' ');

    // 如果当前组件没有第三方依赖则返回
    if(!(/\w/ig.test(params))) {
        return ;
    }
    // 使用一个子进程进入服务器目录并启动组件服务
    logger(`running: cd "${serverPath}" && ${cdDisk} ${npm} ${command} ${params}`, 'cyan')
    childProcess.exec(`cd "${serverPath}" && ${cdDisk} ${npm} ${command} ${params}`, (error, stdout, stderr) => {
        if (error) {
            logger(`childProcess.exec error: ${error}`, 'magenta');
            return;
        }
        if (stderr) {
            logger(`warning: ${stderr}`, 'magenta');
        }
        logger(`stdout: ${stdout}`, 'cyan');
        logger(`组件依赖安装成功.`, 'cyan');
    });
}

/**
 * 安装或更新所有依赖
 * 
 * @param {any} commandParams 
 * @param {any} command 
 */
function _installOrUpdateAllDependencies(commandParams, command) {

    let params = commandParams.length ? (commandParams || []).join(' ') : _readDirDependencies(currentPath).join(' ');

    // 使用一个子进程进入服务器目录并启动组件服务
    logger(`running: cd "${serverPath}" && ${cdDisk} ${npm} ${command} ${params}`, 'cyan')
    childProcess.exec(`cd "${serverPath}" && ${cdDisk} ${npm} ${command} ${params}`, (error, stdout, stderr) => {
        if (error) {
            logger(`childProcess.exec error: ${error}`, 'magenta');
            return;
        }
        if (stderr) {
            logger(`warning: ${stderr}`, 'magenta');
        }
        logger(`stdout: ${stdout}`, 'cyan');
        logger(`组件依赖安装成功.`, 'cyan');
    });
}

/**
 * 启动服务器命
 * 
 */
function _initStart(commandParams = []) {

    const port = getPortFromParams(commandParams);
    const devRootUrl = `${devRootHost}:${port}`;

    logger(`starting dev server...`, 'magenta');

    // 使用一个子进程进入服务器目录并启动组件服务
    logger(`Serverd in ${serverPath}${buildPath}`, 'cyan');

    fse.pathExists(serverPath + buildPath, (err, exists) => {
        if (!exists) {
            logger('未运行调试服务，请先选择组件调试目录运行"just watch"再尝试.', 'red');
            return;
        }

        // 输出运行命令信息
        logger(`cd "${serverPath}" && ${cdDisk} node "server.js" --devpath "${currentPath}" ${commandParams.join(' ')}`, 'cyan');
        childProcess.exec(`cd "${serverPath}" && ${cdDisk} node "server.js" --devpath "${currentPath}" ${commandParams.join(' ')}`, (error, stdout, stderr) => {
            logger(`${stdout}`, 'cyan');
            logger(`${error}`, 'red');
            logger(`${stderr}`, 'red');
        }).on('exit', function (code) {
            logger(`restarting dev server...`, 'magenta');
            logger(`dev server stoped...code:${code} success.`, 'cyan');

            _initStart(commandParams);
        });

        logger(`dev server started.`, 'magenta');
        setTimeout(() => {
            logger(`Listening at ${devRootUrl}/ 请尝试访问 ${devRootUrl}`, 'green');
            // childProcess.exec(`start ${devRootUrl}`);  // 自动打开浏览器操作可以使用opn的npm包优化
        }, 400);

    })
}

/**
 * 停止服务器命令
 * 
 */
function _stopServer() {
    // 使用一个子进程进入服务器目录并启动组件服务
    process.exit(-1);
    logger(`Server stoped.`, 'cyan');
}

/**
 * 输出帮助信息
 * 
 */
function _consoleHelp() {
    logger(`
您可以使用下面命令:
    just init: 创建一个组件或项目。根据组件物料库快速生成一个组件或项目。
    just template: 根据自定义组件物料库目录创建一个新的组件物料库。
    just rmtemplate: 删除一个自定义组件物料库。
    just list: 查看存在的所有组件物料库列表。
    just webapp: 选择项目物料库快速生成一个项目工程。
    just i/install: 安装组件的第三方依赖，同 npm/tnpm install。
    just update: 更新组件的第三方依赖，同 npm/tnpm update。
    just start/run -port: 启动调试服务器。一般只需要运行一次。-p或-port表示指定端口开启服务。
    just clear/clean: 清除缓存。清除build构建的缓存目录。
    just dev/watch: 在当前目录下创建组件调试环境。
    just build: 编译打包组件为单个输出的ES5文件并编译CSS文件。例如：just build ComponentName
    just help: 查看帮助。查看just所有命令。
    just -v/version: 显示当前安装的just版本。
    just set: 设置npm、tnpm或tnpm，例如：just set tnpm。`, 'magenta');
}

/**
 * 初始化文件目录读取和文件编辑变化监听
 * 
 */
function _initFileWatch(serverPath) {

    const currentPath = process.cwd();
    const componentDirs = _readDirSync(currentPath);

    for (let componentDir of componentDirs) {
        fileAsync(serverPath, componentDir);
    }

    // 如果组件不为空，则需要写入组件信息
    if (componentDirs.length) {
        _writeComponentInfo(componentDirs, serverPath);
    }

    // 通知dev server进行重启等操作
    socketPub.connect(configs.SOCKET_URL);
    socketPub.send('watch');
}

/**
 * 自动读取单个组件中的dependencies
 * 
 */
function _readDependencies(componentName) {

    const componentDir = path.join(process.cwd(), componentName);
    const dependencies = [];

    // 如果组件不为空，则需要进入读取组件的dependencies
    let packageJson = {};

    if(fse.pathExistsSync(componentDir + '/package.json')) {
        packageJson = fse.readJsonSync(componentDir + '/package.json');
    }

    for (let key in (packageJson.dependencies || {})) {
        if(dependencies.indexOf(key) < 0) {
            dependencies.push(key);
        }
    }

    return dependencies;
}

/**
 * 自动读取组件中的所有dependencies
 * 
 */
function _readDirDependencies() {

    const currentPath = process.cwd();
    const componentDirs = _readDirSync(currentPath);
    let dependencies = [];
    let packageNames = [];  // 本地已存在被引用的包
    if (componentDirs.length) {
        for (let componentDir of componentDirs) {
            if(fse.pathExistsSync(componentDir + '/package.json')) {
                packageJson = fse.readJsonSync(componentDir + '/package.json');
                packageNames.push(packageJson.name);
            }
        }
    }
    // 如果组件不为空，则需要进入读取组件的dependencies
    if (componentDirs.length) {
        for (let componentDir of componentDirs) {
            let packageJson = {};

            if(fse.pathExistsSync(componentDir + '/package.json')) {
                packageJson = fse.readJsonSync(componentDir + '/package.json');
            }

            for (let key in (packageJson.dependencies || {})) {
                if(dependencies.indexOf(key) < 0 && packageNames.indexOf(key) < 0) {
                    dependencies.push(key);
                }
            }
        }
    }

    return dependencies;
}

/**
 * 读取一个目录，返回这个目录下的一级子目录
 * 
 * @param {any} rootDir 
 * @returns 
 */
function _readDirSync(rootDir) {
    const paths = fs.readdirSync(rootDir);

    // 如果组件根目录还有下面这些文件，则允许创建组件调试
    const excludeFiles = ['package.json', 'Gulpfile.js', 'webpack.config.js', 'Gruntfile.js'];

    let componentDirs = [];
    let canCreate = true;

    paths.forEach(function (item, index) {
        var info = fs.statSync(rootDir + '/' + item);
        if (info.isDirectory()) {
            // 如果是目录
            componentDirs.push(path.resolve(rootDir, item));
        } else {
            // 如果是文件，且文件有package.json，则不使用该目录，组件目录中不能含有package.json
            if (excludeFiles.indexOf(item) > -1) {
                logger(`初始化组件目录失败，组件根目录不能包含${item}文件，组件需以文件夹方式存在于组件目录下.`, 'red');
                canCreate = false;
            }
        }
    });
    componentDirs = canCreate ? componentDirs : [];

    return componentDirs;
}

/**
 * 读取一个目录，返回这个目录下的json数据列表
 * 
 * @param {any} rootDir
 * @returns 
 */
function _readDirFileSync(rootDir) {
    const paths = fs.readdirSync(rootDir);

    let mockDataList = [];

    paths.forEach(function (item, index) {
        var info = fs.statSync(rootDir + '/' + item);
        if (info.isDirectory()) {
            // 如果是目录, 则跳过
        } else {
            // 如果是文件，且文件有.json，则返回
            if (item.indexOf('.json') >= 0) {
                mockDataList.push(item)
            }
        }
    });

    return mockDataList;
}

/**
 * 根据目录下的组件生成一份组件信息的配置
 * 
 * @param {any} workDirs 工作目录列表
 * @param {any} serverPath 服务器根目录
 */
function _writeComponentInfo(workDirs, serverPath) {

    let componentInfos = { components: [], templates: {} };
    let webappInfos = { webapps: [], templates: {} };
    let alias = {};
    // 物料模板选项映射表
    const templatesJson = fse.readJsonSync(__dirname + '/src/lib/template-source/template.json') || {};
    
    for (let componentDir of workDirs) {
        
        let packageName,
        packageInfo; // 读取组件的package.json，获取组件信息，如果没有则放入组件名称
        
        // 处理mac和windows系统差异性
        if (isWinPlatform()) {
            packageName = componentDir.split("\\");
        } else {
            packageName = componentDir.split('/');
        }
        
        // 如果存在package.json则获取组件名
        let existPackageJSON = fse.pathExistsSync(path.join(componentDir, 'package.json'));
        if (existPackageJSON) {
            let templateJson = fse.readJsonSync(path.resolve(componentDir, 'package.json'));
            packageName = packageName[packageName.length - 1];
            packageInfo = fse.readJsonSync(path.join(componentDir, 'package.json'));

            let mockDataList = _readDirFileSync(path.resolve(componentDir, 'data'));

            // 如果是应用，则添加应用信息，否则添加组件信息
            if (packageInfo.template === 'webapp') {
                webappInfos.webapps.push(Object.assign(packageInfo, {
                    name: packageName
                }));
            } else if (packageInfo.template){
                componentInfos.components.push(Object.assign({
                    name: packageName
                }, packageInfo, {
                    mockDataList: mockDataList
                }));
                alias[templateJson.name] = path.join(packageName, packageInfo.main || '');
            }
        }
    }

    componentInfos.templates = templatesJson;
    componentInfos = JSON.stringify(componentInfos);

    webappInfos = JSON.stringify(webappInfos);

    // 根据当前调试根目录生成所有组件的列表
    fse.outputFile(path.join(serverPath + buildPath, 'component-info') + '.js', `var componentInfo = JSON.parse(\`${componentInfos}\`)`, (err) => {
        if (err) throw err;
        logger(`component list info has been created successfully.`, 'cyan');
    });

    // 根据当前调试根目录生成所有组件的列表
    fse.outputFile(path.join(serverPath + buildPath, 'webapp-info') + '.js', `var webappInfo = JSON.parse(\`${webappInfos}\`)`, (err) => {
        if (err) throw err;
        logger(`webapp list info has been created successfully.`, 'cyan');
    });

    fse.outputJson(path.join(serverPath + buildPath, 'alias.json'), alias, {
        encoding: 'utf8',
        spaces: 4
    }, function(err, data) {
        if (err) throw err;
        logger(`alias info has been created successfully.`, 'cyan');
    });
}

module.exports = function () {
    _initCommandSet(serverPath, command, commandParams);
};