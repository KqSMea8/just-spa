
'use strict';

const { Grid, Row, Col, Button, Label, Image } = ReactBootstrap;

const defaultComponentBanner = './src/web/img/no-banner.jpg';

class Index extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedType: 'all',
            hashMenu: window.location.hash.replace('#', '') || ''
        }
    }

    componentDidMount() {
        // hash改变时展示文档等
        window.onhashchange = (hash) => {
            let hashMenu = hash.newURL.split('#')[1] || '';
            this.setState({ 'hashMenu': hashMenu })
        }
    }

    render() {

        let sourceTypes = {};
        let { selectedType, hashMenu } = this.state;

        let typesList = [<Label bsStyle="info" className={selectedType === 'all' ? 'active' : ''} onClick={this._changeTypes.bind(this, 'all')}>全部</Label>];

        // 读取所有的物料模板分类
        for (let key in componentInfo.templates) {
            typesList.push(<Label key={key} bsStyle="info" className={selectedType === componentInfo.templates[key].name ? 'active' : ''} onClick={this._changeTypes.bind(this, componentInfo.templates[key].name)}>{componentInfo.templates[key].label}</Label>)
        }

        let componentList = componentInfo.components.filter((component, index) => {
            if ([component.template, 'all'].includes(selectedType)) {
                return component;
            }
        });

        switch (hashMenu) {
            case 'start':
                // 显示快速开始文档
                this._renderDocs('/src/docs/start.md');
                return this._renderDocsMenu();
                break;
            case 'docs':
                // 显示详细使用文档
                this._renderDocs('/src/docs/docs.md');
                return this._renderDocsMenu();
                break;
            case 'about':
                // 显示关于文档
                this._renderDocs('/src/docs/about.md');
                return this._renderDocsMenu();
                break;
            case 'template':
                // 显示物料规范文档
                this._renderDocs('/src/docs/template.md');
                return this._renderDocsMenu();
                break;
            case 'question':
                // 显示物料规范文档
                this._renderDocs('/src/docs/question.md');
                return this._renderDocsMenu();
                break;
            case '':
            case 'index':
            default:
                document.getElementById('markdownEditor').style.display = 'none'; // 隐藏文档阅读
                // 显示首页文档
                return this._renderIndex();
                break;

            window.hashMenu = hashMenu;
        }
    }

    /**
     * 拉取目录
     * 
     * @param {any} menuName 
     * @returns 
     * @memberof Index
     */
    _renderDocsMenu(menuName) {
        let { hashMenu } = this.state;
        return (
            <div className="menu-container">
                <ul class="top-menu-list">
                    <li><a className={hashMenu === 'index' || hashMenu === '' ? 'active' : ''} href="/#index">首页</a></li>
                    <li><a className={hashMenu === 'start' ? 'active' : ''} href="/#start">快速开始</a></li>
                    <li><a className={hashMenu === 'docs' ? 'active' : ''} href="/#docs">文档</a></li>
                    <li><a className={hashMenu === 'about' ? 'active' : ''} href="/#about">介绍</a></li>
                    <li><a className={hashMenu === 'template' ? 'active' : ''} href="/#template">物料库规范</a></li>
                    <li><a className={hashMenu === 'question' ? 'active' : ''} href="/#question">Q&A</a></li>
                </ul>
            </div>
        )
    }
    /**
     * 显示系统文档
     * 
     * @memberof Preview
     */
    _renderDocs(docsUrl) {
        // 获取调试服务器组件目录下的readme
        axios.get(docsUrl, {
            params: {}
        }).then(res => {
            // 设置文档内容
            document.getElementById('markdownEditor').style.display = 'block';
            document.getElementById('preview').innerHTML = marked(res.data);
            ace.edit('mdeditor').setValue(res.data);
        }).catch(err => {
            Dialog.alert({
                content: '获取文档失败'
            });
            console.log(err);
        });
    }


    /**
     * 渲染首页内容信息
     * 
     * @returns 
     * @memberof Index
     */
    _renderIndex() {

        let sourceTypes = {};
        let { selectedType, hashMenu } = this.state;

        let typesList = [<Label bsStyle="info" className={selectedType === 'all' ? 'active' : ''} onClick={this._changeTypes.bind(this, 'all')}>全部</Label>];

        // 读取所有的物料模板分类
        for (let key in componentInfo.templates) {
            typesList.push(<Label key={key} bsStyle="info" className={selectedType === componentInfo.templates[key].name ? 'active' : ''} onClick={this._changeTypes.bind(this, componentInfo.templates[key].name)}>{componentInfo.templates[key].label}</Label>)
        }

        let componentList = componentInfo.components.filter((component, index) => {
            if ([component.template, 'all'].includes(selectedType)) {
                return component;
            }
        });

        return <div>
            <LeftMenu hashMenu={hashMenu}/>
            {this._renderDocsMenu()}
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={12}>
                        <div className="types-list">
                            {typesList}
                        </div>
                    </Col>
                </Row>
                {
                    componentList.length > 0 ? componentList.map((component, index) => {
                        let componentName = Utils.getComponentName(component.name);
                        let previewImage = component['preview-image'] ? `./.build/${componentName}/${component['preview-image']}` : defaultComponentBanner;
                        let stylePreview = { 'backgroundImage': `url(${previewImage})`};
                        return (<ul className="component-info" title={component.description || component.name}>
                            <li>
                                <a target="_blank" className="preview" href={`/src/web/preview.html?c=${component.name}&stack=${component.stack || 'react'}`}
                                    style={stylePreview}>
                                </a>
                            </li>
                            <li>name： <a className="component-name" target="_blank" href={`/src/web/preview.html?c=${component.name}&stack=${component.stack || 'react'}`}>{component.name}</a></li>
                            <li>author： {component.author || '未知'}</li>
                            <li>description： {component.description || component.name}</li>
                            <li>template： {component.template}</li>
                            <li>version： {component.version || '1.0.0'}</li>
                            {
                                component.stack ? (<li className="component-logo">
                                    <img src={`./src/web/img/${component.stack}.png`} width="50" height="45" />
                                </li>) : null
                            }
                        </ul>)
                    }) : <div class="empty-list">无</div>
                }
            </Grid>
        </div>
    }

    _changeTypes(type) {
        this.setState({
            selectedType: type
        });
    }
};

class LeftMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        let { hashMenu } = this.props;
        return (<ul className="left-menu-list">
            <li className={hashMenu === 'index' ? 'active' : ''}><a href="/#index"><i className="fa fa-window-maximize"></i>组件列表</a></li>
        </ul>)
    }
    // 可选的目录
    // <li className={hashMenu === 'app' ? 'active' : ''}><a href="/#app"><i className="fa fa-th-large"></i>应用列表</a></li>
    // <li className={hashMenu === 'debug' ? 'active' : ''}><a href="/#debug"><i className="fa fa-wrench"></i>联调设置</a></li>
    // <li className={hashMenu === 'settings' ? 'active' : ''}><a href="/#settings"><i className="fa fa-cog fa-fw"></i>系统设置</a></li>
};

ReactDOM.render(<Index />, document.getElementById('root'));

