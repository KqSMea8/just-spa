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

import _Component from './index.jsx';
import initProps from './data/index';

export default <_Component {...initProps}/>

```

- props参数说明

&emsp;&emsp;text: greeting 问好方式
&emsp;&emsp;name: 问好对象