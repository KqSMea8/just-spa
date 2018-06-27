```html
<div id="test"></div>
```

```css
body {
    background: #ccc;
}
```

```javascript

import { connect } from 'react-redux';
import ${_Component} from './index.jsx';

import './src/index.less';

//注入 mock请求返回数据
Mock.mock('/.build/${_Component}/data/asyncData.json', {
    "text": "hello first and hi Mock Data "
});

const props = {
    name: 'world'
};

const mapStateToProps = (state, ownProps) => {
  return {
    text: state.text
  };
}

const mapDispatchToProps = (state, ownProps) => {
  return {};
}

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(${_Component})

export default <Component {...props}/>;

```

#### 详细文档
---