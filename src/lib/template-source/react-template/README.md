```html
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