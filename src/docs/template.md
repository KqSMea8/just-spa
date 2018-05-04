&emsp;&emsp;物料库可以理解为具体一类组件的高级抽象（可以是js组件、Css模块、布局模块等），包含生成一个组件源代码的目录模板。接入just的物料模板需要遵循以下几个规范：

- generator.json规范

&emsp;&emsp;generator.json规范。一个物料库必须包含一个generator.json，generator.json是一个json配置，里面包含了生成组件需要的每一个原料文件，包括statics(无需处理的静态文件)，templates(需要处理的文件模板)，templatedata(传入模板生成组件需要的数据)三个字段，例如：

```
{
    "statics": [
        "README.md",
        "data/index.js",
        "data/asyncData.json"
    ],
    "templates": [
        "src/events.js",
        "index.jsx",
        "src/index.less"
    ],
    "templateData": {
        "_Component": "name",
        "_component": "lineThroughName"
    }
}
```

&emsp;&emsp;1. statics: 无需处理的静态文件列表，如果是多级目录也要列出，而且要确保文件存在，这类文件将在调用物料库生成组件时会直接复制到组件目录中，不会进行额外的处理。

&emsp;&emsp;2. templates：如果物料文件中含有动态的信息(例如组件名称等)，需要填入动态组件信息的模板文件，这些文件需要全部列出来，否则将不进行处理，模板使用ES6的字符串语法规范。

&emsp;&emsp;3. templateData：动态组件信息传入的数据，例如组件名称，组件描述等。"_Component": "name" 的意思是将物料文件中含有`${_component}`的地方代替为componentsInfo.name(ComponentInfo为创建组件时输入的一些信息，另外还有author，name、version、description等)。

- 文件入口

&emsp;&emsp;一个物料库必须有一个文件入口供外部调用，例如index.jsx。入口文件中引用的其它逻辑模块文件尽量在组件src文件中定义。调用物料库生成组件后，额外依赖的第三方组件可以在组件package.json中的dependencies里面声明定义。然后使用just install自动分析安装。