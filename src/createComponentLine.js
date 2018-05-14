/**
 * 创建组件内容
 * 
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');
const process = require('process');
const readline = require('readline');
const inquirer = require('inquirer');

const templateAction = require('./lib/template-source');
const webappAction = require('./lib/webapp');

const logger = require('./lib/logger');

// 物料模板选项映射表
const templatesJson = fse.readJsonSync(__dirname + '/lib/template-source/template.json');

// 项目物料模板选项映射表
const webappTemplatesJson = fse.readJsonSync(__dirname + '/lib/webapp/template.json');

// 几个主要的技术栈
const JavascriptFrameMap = {
    '1': 'react',
    '2': 'vue',
    '3': 'angular',
    '4': 'jquery或其它'
};

let templateTip = '',
    componentChoice = [],
    webappChoice = [],
    JavascriptFrameChoice = [];


for (let key in templatesJson) {
    componentChoice.push({
        name: templatesJson[key].label,
        value: key,
        short: templatesJson[key].label
    });
    templateTip += `\n${key}. [${templatesJson[key].name}] : ${templatesJson[key].description}`;
}

for (let key in webappTemplatesJson) {
    webappChoice.push({
        name: webappTemplatesJson[key].label,
        value: key,
        short: webappTemplatesJson[key].label
    });
}

for (let key in JavascriptFrameMap) {
    JavascriptFrameChoice.push({
        name: JavascriptFrameMap[key],
        value: key,
        short: JavascriptFrameMap[key]
    });
}

/**
 * 创建一个新项目
 * 
 */
function createWebapp(callback) {

    const currentPath = process.cwd();

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Input the name of Webapp(Must be lowerCase)? ',
            validate: function (value) {
                var result = value.match(/^([a-z0-9]+)+$/);
                if (result) {
                    return true;
                }
                return 'Webapp name must be lowerCase or not empty.';
            }
        },
        {
            type: 'list',
            name: 'template',
            message: 'Select a template of Webapp? ',
            choices: webappChoice,
            validate: function (value) {
                if (templatesJson[value]) {
                    return true;
                }
                return 'Selete a Webapp Template.';
            },
            filter: function (value) {
                return webappTemplatesJson[value].name;
            }
        },
        {
            type: 'comfirm',
            name: 'end',
            message: 'Sure to create this Webapp (y/n/yes/no)? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'You have input nothing, input y/n/yes/no';
            }
        }
    ]).then(inputs => {
        // 如果输入的是肯定的
        if (/^(y)(es)?$/ig.test(inputs.end)) {
            webappAction.createWebapp(inputs, currentPath, callback);
        } else {
            logger('Canceled to Create Webapp.', 'red');
        }
    });
}

/**
 * 创建组件
 * 
 */
function createComponent(callback) {
    const currentPath = process.cwd();

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Input the name of component(Must be CamelCase)? ',
            validate: function (value) {
                var result = value.match(/^([A-Z][A-Za-z0-9]+)+$/);
                if (result) {
                    return true;
                }
                return 'Component name must be like CamelCase or not empty.';
            }
        },
        {
            type: 'list',
            name: 'template',
            message: 'Select a template of resouce?',
            choices: componentChoice,
            validate: function (value) {
                if (templatesJson[value]) {
                    return true;
                }
                return 'The selected template must be one of the above.';
            }
        },
        {
            type: 'input',
            name: 'author',
            message: 'Input the author of component (default empty)? '
        },
        {
            type: 'input',
            name: 'version',
            message: 'Input the version of component (default 1.0.0)? ',
            default: '1.0.0'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Input the description of component (default empty)?  '
        },
        {
            type: 'input',
            name: 'license',
            message: 'Input the license of component (default ISC)? ',
            default: 'ISC'
        },
        {
            type: 'comfirm',
            name: 'end',
            message: 'Sure to create this component (y/n/yes/no)? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'You have input nothing, input y/n/yes/no';
            }
        }
    ]).then(inputs => {
        // 如果输入的是肯定的
        if (/^(y)(es)?$/ig.test(inputs.end) && inputs.template) {
            inputs['stack'] = templatesJson[inputs.template].stack;
            inputs['template'] = templatesJson[inputs.template].name;
            templateAction.createComponent(inputs, currentPath, callback);
        } else {
            logger('Canceled to Create Component.', 'red');
        }
    });
}

/**
 * 创建自定义物料模板
 * 
 */
function createTemplate(serverPath) {
    const currentPath = process.cwd();

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Input the name of Template(Must be lowerCase)? ',
            validate: function (value) {
                var result = value.match(/^([a-z][a-z0-9]+)+$/);
                if (result) {
                    return true;
                }
                return 'Template name must be lowerCase or not empty.';
            }
        },
        {
            type: 'list',
            name: 'stack',
            message: 'Select a stack of Javascript Frame?',
            choices: JavascriptFrameChoice,
            validate: function (value) {
                if (templatesJson[value]) {
                    return true;
                }
                return 'The selected template must be one of the above.';
            }
        },
        {
            type: 'input',
            name: 'label',
            message: 'Input a label of Template? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'Label can not be empty.';
            }
        },
        {
            type: 'input',
            name: 'description',
            message: 'Input the description of component? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'Description can not be empty.';
            }
        },
        {
            type: 'input',
            name: 'directory',
            message: 'Input the directory of your Template? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'Directory can not be empty.';
            }
        },
        {
            type: 'comfirm',
            name: 'end',
            message: 'Sure to create this Template (y/n/yes/no)? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'You have input nothing, input y/n/yes/no';
            }
        }
    ]).then(inputs => {
        // 如果输入的是肯定的
        if (/^(y)(es)?$/ig.test(inputs.end) && inputs.stack) {
            inputs['stack'] = JavascriptFrameMap[inputs.stack];
            templateAction.createTemplate(inputs, serverPath, templatesJson);
        } else {
            logger('Canceled to Create Template.', 'red');
        }
    });
}


/**
 * 删除自定义物料模板
 * 
 */
function removeTemplate(serverPath) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Delete a template of resouce? ',
            choices: componentChoice,
            validate: function (value) {
                if (templatesJson[value]) {
                    return true;
                }
                return 'Selete a template to delete.';
            }
        },
        {
            type: 'comfirm',
            name: 'end',
            message: 'Sure to delete this Template (y/n/yes/no)? ',
            validate: function (value) {
                if (value) {
                    return true;
                }
                return 'You have input nothing, input y/n/yes/no';
            }
        }
    ]).then(inputs => {
        // 如果输入的是肯定的
        if (/^(y)(es)?$/ig.test(inputs.end)) {
            templateAction.removeTemplate(templatesJson[inputs.name].name, serverPath, templatesJson);
        } else {
            logger('Canceled to remove Template.', 'red');
        }
    });
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
    listTemplates,
    createWebapp
};