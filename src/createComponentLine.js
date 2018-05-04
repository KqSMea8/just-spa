/**
 * 创建组件内容
 * 
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');
const process = require('process');
const readline = require('readline');

const templateAction = require('./lib/template-source');
const logger = require('./lib/logger');

// 物料模板选项映射表
const templatesJson = fse.readJsonSync(__dirname + '/lib/template-source/template.json');

// 几个主要的技术栈
const JavascriptFrameMap = {
    '1': 'react',
    '2': 'vue',
    '3': 'angular',
    '4': 'jquery或其它'
};

let templateTip = '',
    JavascriptFrameTip = '';

for (let key in templatesJson) {
    templateTip += `\n${key}. [${templatesJson[key].name}] : ${templatesJson[key].description}`;
}

for (let key in JavascriptFrameMap) {
    JavascriptFrameTip += `\n${key}. ${JavascriptFrameMap[key]}`;
}

/**
 * 创建组件
 * 
 */
function createComponent() {
    const currentPath = process.cwd();

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let promise;

    let componentInfo = {
        name: {
            input: 'Input the name of component?  (Must be like CamelCase. eg MobileListDetail, required):',
            value: '',
            reg: /^([A-Z][A-Za-z0-9]+)+$/,
            errorMsg: 'Component name must be like CamelCase or not empty.',
        },
        template: {
            input: `Select a template of resouce：(eg 1 or 2)${templateTip}`,
            value: '1',
            errorMsg: 'The selected template must be one of the above.'
        },
        author: {
            input: 'Input the author of component?  (eg: ouvenzhang, default empty):',
            value: ''
        },
        version: {
            input: 'Input the version of component?  (eg: 1.0.0, default "1.0.0"):',
            value: '1.0.0'
        },
        description: {
            input: 'Input the description of component?  (eg: component for product list detail, default empty):',
            value: ''
        },
        license: {
            input: 'Input the license of component?  (eg: ISC or MIT, default ISC):  ',
            value: 'ISC'
        },
        // 如果要添加输入字段，请在上面添加，保持end在最后一个
        end: {
            input: 'Are you sure to create this component in this direction?(y/n/yes/no):  ',
            value: ''
        }
    };

    for (let key in componentInfo) {
        if (!promise) {
            // 如果没有则创建promise
            promise = new Promise((resolve, reject) => {
                logger(componentInfo[key].input, 'magenta');
                readLine.question('', function (value) {
                    // 如果输入组件名称不符合驼峰命名或为空则提示
                    if (key === 'name' && value && !componentInfo[key].reg.test(value) || !value) {
                        reject(componentInfo[key].errorMsg);
                    } else {
                        componentInfo[key] = value || componentInfo[key].value;
                        logger('Auto generated lineThroughName of the component.', 'magenta');
                        resolve();
                    }
                });
            })
        } else if (key === 'end') {
            // 如果是最后一个输入，则显示完成，关闭readLine
            promise = promise.then(() => {
                return new Promise(_requestSureCancel);
                /**
                 * 如果确认时输入处理函数
                 * 
                 */
                function _requestSureCancel() {
                    logger(componentInfo[key].input || '', 'magenta');
                    readLine.question('', function (value) {
                        componentInfo[key] = value;
                        // 如果输入肯定，则创建组件
                        if (componentInfo[key] === 'Y' || componentInfo[key] === 'y' || /yes/i.test(componentInfo[key])) {
                            logger('Component will be created...', 'magenta')
                            templateAction.createComponent(componentInfo, currentPath);
                            readLine.close()
                        } else if (!componentInfo[key]) {
                            logger('You have input nothing, please retry.', 'cyan')
                            _requestSureCancel();
                        } else {
                            logger('You have canceled to create Component.', 'magenta');
                            readLine.close()
                        }
                    });
                }
            }, (errorMsg) => {

                return new Promise((resolve, reject) => {
                    reject(errorMsg);
                });

            }).catch((errorMsg) => {
                logger(errorMsg, 'red');
                process.exit(-1);
            });
        } else {
            // 如果有promise则链式调用
            promise = promise.then(() => {
                return new Promise((resolve, reject) => {
                    logger(componentInfo[key].input, 'cyan');
                    readLine.question('', function (value) {

                        // 如果是模板物料，则需要保存映射的模板名称，
                        if (key === 'template') {
                            // 选择要使用的模板，如果选择输入模板编号为空或不在选择范围内
                            if (!value || !templatesJson[value]) {
                                reject(componentInfo[key].errorMsg);
                                return;
                            }

                            // 针对自定义上传模板设置模板key和技术栈
                            componentInfo[key] = templatesJson[value || componentInfo[key].value].name;
                            componentInfo['stack'] = templatesJson[value || componentInfo[key].value].stack;

                        } else {
                            componentInfo[key] = value || componentInfo[key].value;
                        }
                        resolve();
                    });
                });
            }, (errorMsg) => {

                return new Promise((resolve, reject) => {
                    reject(errorMsg);
                });
            });
        }
    };
}

/**
 * 创建自定义物料模板
 * 
 */
function createTemplate(serverPath) {
    const currentPath = process.cwd();

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let promise;

    let templateInfo = {
        name: {
            input: 'Input the name of Template?  (Must be like lowerCase. 例如：react):',
            value: '',
            reg: /^([a-z][a-z0-9]+)+$/,
            errorMsg: 'Template name must be like lowerCase or not empty.',
        },
        stack: {
            input: `Select a stack of Javascript Frame (选择需要使用的技术栈，例如：1 or 2)：${JavascriptFrameTip}`,
            value: '1',
            errorMsg: 'The selected javascript frame must be one of the above.'
        },
        label: {
            input: `Input a label of Template (输入一个物料库的标签描述，例如：react组件)`,
            value: '1',
            errorMsg: 'The template label template must not be empty.'
        },
        description: {
            input: 'Input the description of Template?  (输入物料库简短的文字描述，例如：这是一个react组件)',
            value: ''
        },
        directory: {
            input: 'Input the directory of your Template?  (输入自定义物料库的目录，例如：/usr/local/template/react-template，物料库目录规范见官网文档。)',
            value: ''
        },
        // 如果要添加输入字段，请在上面添加，保持end在最后一个
        end: {
            input: 'Are you sure to create this Template?(y/n/yes/no):  ',
            value: ''
        }
    };

    for (let key in templateInfo) {
        if (!promise) {
            // 如果没有则创建promise
            promise = new Promise((resolve, reject) => {
                logger(templateInfo[key].input, 'magenta');
                readLine.question('', function (value) {
                    // 如果输入组件名称不符合命名规范或为空则提示
                    if (key === 'name' && value && !templateInfo[key].reg.test(value) || !value) {
                        reject(templateInfo[key].errorMsg);
                    } else {
                        templateInfo[key] = value || templateInfo[key].value;
                        logger('Auto generated template-key of the Template.', 'magenta');
                        resolve();
                    }
                });
            })
        } else if (key === 'end') {
            // 如果是最后一个输入，则显示完成，关闭readLine
            promise = promise.then(() => {
                return new Promise(_requestSureCancel);
                /**
                 * 如果确认时输入处理函数
                 * 
                 */
                function _requestSureCancel() {
                    logger(templateInfo[key].input || '', 'magenta');
                    readLine.question('', function (value) {
                        templateInfo[key] = value;
                        // 如果输入肯定，则创建组件
                        if (templateInfo[key] === 'Y' || templateInfo[key] === 'y' || /yes/i.test(templateInfo[key])) {
                            logger('Template will be created...', 'magenta')
                            templateAction.createTemplate(templateInfo, serverPath, templatesJson);
                            readLine.close();
                        } else if (!templateInfo[key]) {
                            logger('You have input nothing, please retry.', 'cyan')
                            _requestSureCancel();
                        } else {
                            logger('You have canceled to create Template.', 'magenta');
                            readLine.close();
                        }
                    });
                }
            }, (errorMsg) => {
                return new Promise((resolve, reject) => {
                    reject(errorMsg);
                });
            }).catch((errorMsg) => {
                logger(errorMsg, 'red');
                process.exit(-1);
            });
        } else {
            // 如果有promise则链式调用
            promise = promise.then(() => {
                return new Promise((resolve, reject) => {
                    logger(templateInfo[key].input, 'cyan');
                    readLine.question('', function (value) {

                        // 如果是模板物料，则需要保存映射的模板名称，
                        if (key === 'stack') {
                            // 选择要使用的模板，如果选择输入模板编号为空或不在选择范围内
                            if (!value || !JavascriptFrameMap[value]) {
                                reject(templateInfo[key].errorMsg);
                                return;
                            }
                            // 针对自定义上传模板
                            templateInfo[key] = JavascriptFrameMap[value];
                            logger(`You have selected ${JavascriptFrameMap[value]} frame.`, 'green')
                        } else {
                            templateInfo[key] = value || templateInfo[key].value;
                        }
                        resolve();
                    });
                });
            }, (errorMsg) => {
                return new Promise((resolve, reject) => {
                    reject(errorMsg);
                });
            });
        }
    };
}


/**
 * 删除自定义物料模板
 * 
 */
function removeTemplate(serverPath) {
    const currentPath = process.cwd();

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let promise;

    let templateInfo = {
        name: {
            input: 'Input the name of Template you want to remove?  (must be like lowerCase. 例如：vue):',
            value: '',
            reg: /^([a-z][a-z0-9]+)+$/,
            errorMsg: 'Template name must be like lowerCase or not empty.',
        },
        end: {
            input: 'Are you sure to delete this Template，you can never it after you choose yes?(y/n/yes/no):  ',
            value: ''
        }
    };

    for (let key in templateInfo) {
        if (!promise) {
            // 如果没有则创建promise
            promise = new Promise((resolve, reject) => {
                logger(templateInfo[key].input, 'magenta');
                readLine.question('', function (value) {
                    // 如果输入组件名称不符合命名规范或为空则提示
                    if (key === 'name' && value && !templateInfo[key].reg.test(value) || !value) {
                        reject(templateInfo[key].errorMsg);
                    } else {
                        templateInfo[key] = value || templateInfo[key].value;
                        logger(`You will delete ${templateInfo[key]} template.`, 'magenta');
                        resolve();
                    }
                });
            })
        } else if (key === 'end') {
            // 如果是最后一个输入，则显示完成，关闭readLine
            promise = promise.then(() => {
                return new Promise(_requestSureCancel);
                /**
                 * 如果确认时输入处理函数
                 * 
                 */
                function _requestSureCancel() {
                    logger(templateInfo[key].input || '', 'red');
                    readLine.question('', function (value) {
                        templateInfo[key] = value;
                        // 如果输入肯定，则创建组件
                        if (templateInfo[key] === 'Y' || templateInfo[key] === 'y' || /yes/i.test(templateInfo[key])) {
                            logger('Template will be delete...', 'red')
                            templateAction.removeTemplate(templateInfo.name, serverPath, templatesJson);
                            readLine.close();
                        } else if (!templateInfo[key]) {
                            logger('You have input nothing, please retry.', 'cyan')
                            _requestSureCancel();
                        } else {
                            logger('You have canceled to delete Template.', 'cyan');
                            readLine.close();
                        }
                    });
                }
            }, (errorMsg) => {
                return new Promise((resolve, reject) => {
                    reject(errorMsg);
                });
            }).catch((errorMsg) => {
                logger(errorMsg, 'red');
                process.exit(-1);
            });
        }
    };
}

/**
 * 查看所有物料库
 * 
 */
function listTemplates(serverPath) {
    logger('可用物料库列表：', 'magenta');
    logger(templateTip, 'magenta');
}

module.exports = {
    createComponent,
    createTemplate,
    removeTemplate,
    listTemplates
};