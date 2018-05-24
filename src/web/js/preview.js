'use strict';

const { Grid, Row, Col, Button, Label, Image, Form, InputGroup, FormGroup, ControlLabel, FormControl, Tabs, Tab } = ReactBootstrap;

const defaultComponentBanner = './src/web/img/banner.jpg';

const packageName = Utils.getUrlParams('c') || '';
const componentName = Utils.getComponentName(packageName);
const stack = Utils.getUrlParams('stack') || 'react';

// 根据不同技术栈选择不同模板
const componentUrl = `./${stack}.html?c=${packageName}`;
const component = _getComponent(componentInfo.components);

let jsonEditor;

class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({}, {
            cgiCount: 1,
            api: '',
            mockDataPath: '',
            actionType: '',
            storeKey: '',
            jsonData: '',
            apis: [],
            testFile: 'test',
            scriptCommand: 'mocha',
            scriptFile: '',
            unitTestResult: {},
            scriptResult: {},
            showReadme: false,
            debugDomain: '',
            debugIp: '',
            mockRule: '',
            mockData: '',
            mockDataSet: {},
            activeKey: 'component'
        }, this._getStateFromLocalstorage(componentName + '_componnet_key'))
    }

    componentDidMount() {
        document.title = packageName + '|' + document.title;
        window.reflectStore = function (store) {
            console.log('当前组件store:')
            console.log(store.getState());
        }
        window.showReadme = this.state.activeKey === 'readme';
    }

    componentDidUpdate() {
        localStorage.setItem(componentName + '_componnet_key', JSON.stringify(this.state));
    }

    render() {

        let { api, apis, storeKey, actionType, mockDataPath, jsonData, unitTestResult, scriptResult, testFile,
            scriptFile, scriptCommand, showReadme, activeKey, debugDomain, debugIp, mockData, mockRule, mockDataSet } = this.state;
        apis = apis.join('\n');

        let isRedux = this._isRedux();
        return (
            <div class="preview">
                <div>
                    <section className="left-nav" id="left-info">
                        <ul className="component-info" title={component.description || component.name}>
                            <li>name： {component.name}</li>
                            <li>author： {component.author || '未知'}</li>
                            <li>description： {component.description || component.name}</li>
                            <li>template： {component.template}</li>
                            <li>version： {component.version || '1.0.0'}</li>
                            {
                                component.stack ? (<li className="component-logo">
                                    <img src={`./img/${component.stack}.png`} width="50" height="45" />
                                </li>) : null
                            }
                        </ul>

                        {isRedux ? <div className="component-debugger-panel">
                            <Form>
                                <FormGroup controlId="formControlsTextarea">
                                    <div><ControlLabel>线上接口地址</ControlLabel></div>

                                    <FormControl componentClass="textarea" value={api} onChange={(e) => {
                                        this._changeHandle(e, 'api')
                                    }} placeholder="请输入要请求的接口地址，例如:http://xx.com/api/v1/get" rows="4" />
                                    <Button type="button" onClick={this._saveApi.bind(this)}>保存线上接口数据</Button>

                                    <div><ControlLabel>actionType(redux的actionType)</ControlLabel></div>
                                    <FormControl type="text" value={actionType} onChange={(e) => {
                                        this._changeHandle(e, 'actionType')
                                    }} placeholder="请输入acticonType" />

                                    <div><ControlLabel>storeKey(store上挂载的key)</ControlLabel></div>
                                    <FormControl type="text" value={storeKey} onChange={(e) => {
                                        this._changeHandle(e, 'storeKey')
                                    }} placeholder="请输入storeKey" />

                                    <div><ControlLabel>JSON数据(dispatch到store的数据)</ControlLabel></div>
                                    <FormControl value={jsonData} componentClass="textarea" onChange={(e) => {
                                        this._changeHandle(e, 'jsonData')
                                    }} placeholder="例如:{text: 'hello world'}" rows="4" />
                                    <Button type="button" bsStyle="primary" onClick={this._dispatchJSON.bind(this)}>获取JSON dispatch</Button>

                                    <div><ControlLabel>mockDataPath(本地mock数据路径)</ControlLabel></div>
                                    <FormControl value={mockDataPath} componentClass="textarea" onChange={(e) => {
                                        this._changeHandle(e, 'mockDataPath')
                                    }} placeholder="例如: E:\mock\data.json" rows="3" />
                                    <Button type="button" bsStyle="primary" onClick={this._dispatchApi.bind(this)}>请求接口dispatch</Button>
                                </FormGroup>
                            </Form>
                            <div><ControlLabel>已添加接口数据</ControlLabel></div>
                            <FormControl componentClass="textarea" value={apis} placeholder="" rows="6" />
                        </div> : null}

                    </section>
                    <section class="right-content">
                        <Tabs activeKey={activeKey} id="uncontrolled-tab-example" onSelect={this._handleSelect.bind(this)}>
                            <Tab eventKey={'component'} title="组件预览">
                                <div>
                                    <div class="menus">
                                        <a href="javascript: void(0);" onClick={this._reloadIframe} title="打开新页面预览组件">
                                            <i class="fa fa-refresh"><span>刷新</span></i>
                                        </a>
                                        <a href={componentUrl} title="打开新页面预览组件">
                                            <i class="fa fa-arrows-alt"><span>全屏</span></i>
                                        </a>
                                    </div>
                                </div>
                                <iframe name="previewContainer" id="previewContainer" class="preview-container" src={componentUrl} frameborder="1"></iframe>
                            </Tab>
                            <Tab eventKey={'readme'} title="readme调试">
                                <MdEditor />
                            </Tab>
                            <Tab eventKey={'test'} title="单元测试">
                                <div className={'unit-test ' + (unitTestResult.success === true ? 'success' : '') + (unitTestResult.success === false ? 'fail' : '')}>
                                    <Button type="button" bsStyle="success" onClick={this._triggerUnitTest.bind(this)}>单元测试</Button>
                                    <span className="script-input">
                                        /.build/{componentName}/test/<FormControl title={testFile} className="test-file-name" type="text" value={testFile} onChange={(e) => {
                                            this._changeHandle(e, 'testFile')
                                        }} placeholder="要测试的文件脚本，默认为test.js" />
                                    </span>
                                    {unitTestResult.success === true ? <i class="fa fa-check"><span>{testFile || 'test.js'}测试通过</span></i> : null}
                                    {unitTestResult.success === 'loading' ? <i className="loading"></i> : null}
                                    {unitTestResult.success === false ? <i class="fa fa-times-circle"><span>失败</span></i> : null}
                                    <FormControl componentClass="textarea" value={unitTestResult.result} placeholder="单元测试结果" rows="35" disabled />
                                </div>
                            </Tab>

                            <Tab eventKey={'script'} title="运行脚本">
                                <div className={'unit-test ' + (scriptResult.success === true ? 'success' : '') + (scriptResult.success === false ? 'fail' : '')}>
                                    <Button type="button" bsStyle="success" onClick={this._triggerScriptExcute.bind(this)}>运行脚本</Button>

                                    <span className="script-input">
                                        <FormControl title={scriptCommand} className="script-file-command" type="text" value={scriptCommand} onChange={(e) => {
                                            this._changeHandle(e, 'scriptCommand')
                                        }} placeholder="输入要运行的运行命令" />  /.build/{componentName}/
                                    <FormControl title={scriptFile} className="test-file-name" type="text" value={scriptFile} onChange={(e) => {
                                            this._changeHandle(e, 'scriptFile')
                                        }} placeholder="输入要运行的文件脚本" />
                                    </span>

                                    {scriptResult.success === true ? <i class="fa fa-check"><span>{scriptFile}运行成功</span></i> : null}
                                    {scriptResult.success === 'loading' ? <i className="loading"></i> : null}
                                    {scriptResult.success === false ? <i class="fa fa-times-circle"><span>执行失败</span></i> : null}
                                    <FormControl componentClass="textarea" value={scriptResult.result} placeholder="脚本运行结果" rows="35" disabled />
                                </div>
                            </Tab>
                            <Tab eventKey={'mock'} title="Mock联调">
                                <div>
                                    <h4>设置联调域名和IP</h4>
                                    <Form componentClass="fieldset" inline>
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="debug-domain" >
                                            <ControlLabel>联调域名</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>domain</InputGroup.Addon>
                                                <FormControl title={debugDomain} type="text" value={debugDomain} onChange={(e) => {
                                                    this._changeHandle(e, 'debugDomain')
                                                }} placeholder="例如：www.domain.com" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="debug-ip">
                                            <ControlLabel title="例如线上或测试环境IP">联调指定IP</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>IP</InputGroup.Addon>
                                                <FormControl title={debugIp} type="text" value={debugIp} onChange={(e) => {
                                                    this._changeHandle(e, 'debugIp')
                                                }} placeholder="127.0.0.1" />
                                            </InputGroup>
                                        </FormGroup>
                                        <Button type="button" bsStyle="warning" onClick={this._setDomainAndIp.bind(this)}>保存设置</Button>
                                    </Form>
                                    <hr />
                                    <h4>设置联调Mock数据</h4>
                                    <div>
                                        <FormGroup controlId="formControlsSelect" validationState="warning" >
                                            <ControlLabel>已保存配置（保存Mock规则可直接添加）</ControlLabel>
                                            <FormControl componentClass="select" placeholder="select" onChange={this._changeMockHandler.bind(this)}>
                                                <option value="">选择Mock规则</option>
                                                {
                                                    Object.keys(mockDataSet).map((key, index) => {
                                                        return <option value={key}>[{index}]  {key}</option>
                                                    })
                                                }
                                            </FormControl>
                                        </FormGroup>
                                    </div>
                                    <Form componentClass="fieldset">
                                        <FormGroup controlId="formValidationWarning4" validationState="warning" className="debug-domain" >
                                            <ControlLabel>接口地址</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>api</InputGroup.Addon>
                                                <FormControl title={mockRule} type="text" value={mockRule} onChange={(e) => {
                                                    this._changeHandle(e, 'mockRule')
                                                }} placeholder="例如：/api/v2/list" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup controlId="formValidationError4" validationState="warning" className="debug-ip">
                                            <ControlLabel title="返回数据格式">返回数据格式</ControlLabel>
                                            <InputGroup>
                                                <InputGroup.Addon>json</InputGroup.Addon>
                                                <FormControl componentClass="textarea" value={mockData} onChange={(e) => {
                                                    this._changeHandle(e, 'mockData')
                                                }} placeholder="例如：{ret: 0, data: {}, msg: 'ok'}" rows="10" />
                                            </InputGroup>
                                        </FormGroup>

                                        <Button type="button" bsStyle="success" onClick={this._saveMockRule.bind(this)}>注入Mock规则</Button>
                                        <Button type="button" bsStyle="warning" onClick={this._editJson.bind(this)}>同步到Schema编辑</Button>
                                        <Button type="button" bsStyle="danger" onClick={this._removeMockRule.bind(this)}>移除Mock规则</Button>
                                    </Form>
                                </div>
                                <div id="jsonEditor"></div>
                            </Tab>
                        </Tabs>
                    </section>
                </div>
            </div>
        );
    }

    /**
     * 切换以保存的cgi
     * 
     * @memberof Preview
     */
    _changeMockHandler(e) {
        let { mockDataSet } = this.state;
        var value = e.target.value || e.srcElement && e.srcElement.value;
        if (value && mockDataSet[value]) {
            this.setState({
                mockRule: value,
                mockData: JSON.stringify(mockDataSet[value])
            });
        }
    }

    /**
     * 编辑json
     * 
     * @memberof Preview
     */
    _editJson() {
        const { mockData } = this.state;
        if (!jsonEditor) {
            jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
                schema: {
                    type: 'object',
                    title: 'Mock Schema数据编辑',
                    properties: {
                    }
                },
                theme: 'bootstrap3'
            });
        }
        jsonEditor.setValue(JSON.parse(mockData));
    }
    /**\t
     * 设置联调Mock规则与数据
     * 
     * @memberof Preview
     */
    _saveMockRule() {
        let { mockRule, mockDataSet } = this.state;
        let mockData = jsonEditor && jsonEditor.getValue(mockData) || JSON.parse(this.state.mockData);

        // json在textarea中的格式化展示，需要优化
        this.setState({
            mockData: JSON.stringify(mockData)
        })
        // 如果是redux组件则需要判断actionType并进行动态dispatch
        if (!mockRule || !mockData) {
            Dialog.alert({
                content: 'mock接口地址或返回数据不能为空。'
            });
            return;
        } else {
            try {
                // 如果有storeKey可以支持jsonData为其它类型
                mockDataSet[mockRule] = mockData;
                this.setState({
                    mockDataSet
                });
                previewContainer.window.setMockData(mockDataSet, () => {
                    Dialog.alert({
                        content: '已保存'
                    });
                });
            } catch (e) {
                console.error(e);
                Dialog.alert({
                    content: '输入的mock数据格式必须为json'
                });
            }

        }
    }

    /**
     * 移除联调Mock规则，如果有mockRule，则移除对应的规则，否则移除所有
     * 
     * @memberof Preview
     */
    _removeMockRule() {
        let { mockRule } = this.state;

        previewContainer.window.removeMockData(() => {
            Dialog.alert({
                content: '已移除'
            });
        }, mockRule);
    }

    /**
     * 设置联调域名和Ip
     * 
     * @memberof Preview
     */
    _setDomainAndIp() {
        let { debugDomain, debugIp } = this.state;
    }

    /**
     * 显示readme文档
     * 
     * @memberof Preview
     */
    _handleSelect(selectedKey) {
        this.setState({
            activeKey: selectedKey
        });
        if (selectedKey === 'readme' || this.setState.activeKey === 'readme') {
            // 标识外层是否可以使用ctrl + S来保存readme文档
            window.showReadme = true;
        } else {
            window.showReadme = false;
        }
    }

    /**
     * 启动单元测试
     * 
     * @memberof Preview
     */
    _triggerUnitTest() {
        let { testFile } = this.state;

        this.setState({
            unitTestResult: {
                success: 'loading'
            }
        });

        // 读取固定的api
        axios.get('/test', {
            params: {
                componentName: componentName,
                testFile: testFile || 'test.js'
            }
        }).then(res => {
            this.setState({
                unitTestResult: res.data
            });
        }).catch(err => {
            console.log(err);
        });

    }


    /**
     * 启动运行脚本
     * 
     * @memberof Preview
     */
    _triggerScriptExcute() {
        let { scriptFile, scriptCommand } = this.state;

        this.setState({
            scriptResult: {
                success: 'loading'
            }
        });

        // 读取固定的api
        axios.get('/script', {
            params: {
                componentName: componentName,
                scriptFile: scriptFile || 'test/test.js',
                scriptCommand: scriptCommand || 'mocha'
            }
        }).then(res => {
            this.setState({
                scriptResult: res.data
            });
        }).catch(err => {
            console.log(err);
        });

    }

    /**
     * 刷新iframe
     * 
     * @memberof Preview
     */
    _reloadIframe() {
        previewContainer.window.location.reload();
    }

    /**
     * 从localStorage中获取state
     * 
     * @param {any} key 
     * @returns 
     * @memberof Preview
     */
    _getStateFromLocalstorage(key) {
        let localStorageString = localStorage.getItem(key);
        try {
            return JSON.parse(localStorageString);
        } catch (e) {
            return {};
        }
    }

    /**
     * 修改表单输入的处理
     * 
     * @param {any} e 
     * @param {string} name
     * @memberof Preview
     */
    _changeHandle(e, name) {
        this.setState({
            unitTestResult: {
                success: ''
            }
        });
        this.setState({
            [name]: e.target.value
        });
    }

    /**
     * 保存api
     * 
     * @memberof Preview
     */
    _saveApi() {
        let { api, apis } = this.state;
        if (!api) {
            Dialog.alert({
                content: '请填写接口地址'
            });
        } else {
            apis.push(api);
            this.setState({
                apis: apis
            })
            window.open(api, '_blank');
        }
    }

    /**
     * 请求本地数据mock数据接口并注入到组件环境中
     * 
     * @returns 
     * @memberof Preview
     */
    _dispatchApi() {
        let { actionType, storeKey, mockDataPath } = this.state;

        // 如果是redux组件则需要判断actionType并进行动态dispatch

        if (!mockDataPath || !actionType) {
            Dialog.alert({
                content: 'mockDataPath或actionType不能为空。'
            });
            return;
        }
        // 读取固定的api
        axios.get('/api', {
            params: {
                mockUri: mockDataPath
            }
        }).then(res => {

            // 如果是redux组件，则使用dispatch的参数，否则使用react组件的参数

            previewContainer.window.dispatchData(actionType, res.data, storeKey);
        }).catch(err => {
            console.log(err);
        });
    }


    /**
     * 获取输入的json数据并注入到组件环境中
     * 
     * @returns 
     * @memberof Preview
     */
    _dispatchJSON() {

        let { actionType, storeKey, jsonData } = this.state;

        // 如果是redux组件则需要判断actionType并进行动态dispatch
        if (!jsonData) {
            Dialog.alert({
                content: 'jsonData不能为空。'
            });
            return;
        }

        try {
            // 如果有storeKey可以支持jsonData为其它类型
            previewContainer.window.dispatchData(actionType || '', JSON.parse(jsonData), storeKey);
        } catch (e) {
            if (storeKey) {
                previewContainer.window.dispatchData(actionType || '', {
                    [storeKey]: jsonData
                });
            } else {
                Dialog.alert({
                    content: '输入的json格式有误'
                });
            }
        }

    }

    /**
     * 是否是react-redux组件
     * 
     * @returns 
     * @memberof Preview
     */
    _isRedux() {
        return component.template.indexOf('redux') > -1;
    }
};


class MdEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // 获取调试服务器组件目录下的readme
        axios.get(`/.build/${componentName}/readme.md`, {
            params: {}
        }).then(res => {
            console.log('获取readme文档成功');
            // 设置编辑器内容
            document.getElementById('markdownEditor').style.display = 'block';
            document.getElementById('preview').innerHTML = marked(res.data);
            ace.edit('mdeditor').setValue(res.data);
        }).catch(err => {
            Dialog.alert({
                content: '获取readme文档失败'
            });
            console.log(err);
        });
    }

    componentDidMount() {
        initMdEditor();
    }

    render() {
        return <div id="markdownEditor" className="mark-editor">
            <div id='bar'>
                <div id="toolbar">
                    <i className="fa fa-save" title="保存" onClick={() => {
                        window.MdEditor.saveReadme();
                    }}></i>
                    <i className="fa fa-bold" id="bold" title="加粗" onClick={() => {
                        window.MdEditor.insertText('**这里填写要加粗的文字**');
                    }}></i>
                    <i className="fa fa-italic" id="italic" title="斜体" onClick={() => {
                        window.MdEditor.insertText('_这里填写要斜体的文字_');
                    }}></i>
                    <i className="fa fa-chain" id="hyperlink" title="链接" onClick={() => {
                        window.MdEditor.insertText('[这里写连接的描述](这里填写连接地址)');
                    }}></i>
                    <i className="fa fa-file-text" id="code" title="代码" onClick={() => {
                        window.MdEditor.insertText('```\n这里插入代码\n```');
                    }}></i>
                    <i src="fa fa-image-o" id="image" title="上传图片" onClick={() => {
                        window.MdEditor.showDialog();
                    }}></i>
                    <i className="fa fa-expand" title="切换编辑/预览" onClick={() => {
                        window.MdEditor.toggleEditorWidth();
                    }}></i>
                </div>
            </div>
            <div id='container'>
                <div id='editor-column' className='pull-left'>
                    <div id='panel-editor' style={{ height: '100%' }}>
                        <div className="editor-content" id="mdeditor" style={{ height: '100%' }}></div>
                    </div>
                </div>
                <div id='preview-column' className='pull-right'>
                    <div id='panel-preview'>
                        <div id="preview" className="markdown-body"></div>
                    </div>
                </div>
            </div>
        </div>
    }
}

/**
 * 从component中找到当前component信息
 * 
 * @param {any} componentInfo
 * @returns 
 */
function _getComponent(componentInfo) {
    return componentInfo.find(function (item) {
        return item.name == packageName;
    })
};

ReactDOM.render(<Preview name="John" />, document.getElementById('root'));

