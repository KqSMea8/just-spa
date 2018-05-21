```html
    <link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/bootstrap-3.3.7/css/bootstrap-base64font.min.css" />
    <link rel="stylesheet" href='//i.gtimg.cn/qzone/biz/gdt/lib/bootstrap-3.3.7/css/bootstrap-theme.css?max_age=31536000' /> 
    <div id="test"></div>

```

```css
body {
    background: #ccc;
}
```

```javascript

import ${_Component} from './index.jsx';
import initProps from './data/index';
import './src/index.less';

//注入 mock请求返回数据
Mock.mock('/.build/${_Component}/data/asyncData.json', {
    "text": "hello first and hi Mock Data "
});

export default <${_Component} {...initProps}/>

```

#### 详细文档
---