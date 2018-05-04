


module.exports = function reactTemplate(componentName) {
    return `// 引入组件
import Component from '../.build/${componentName}/entry';
import template from '../.build/${componentName}/template';

document.getElementById('template').outerHTML = template;

render(Component);

function render(Component) {
    document.getElementById('root').innerHTML = Component();
}

// 进行热替换调试组件内容
if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept([
        '../.build/${componentName}/index',
        '../.build/${componentName}/entry'
    ], (err) => {
        if (err) {
            console.log(err);
        }
        const NextComponent = require('../.build/${componentName}/entry').default;

        render(NextComponent);
    });
};`

}