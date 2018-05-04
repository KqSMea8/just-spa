&emsp;&emsp;物料库可以理解为具体一类组件的高级抽象（可以是js组件、Css模块、布局模块等），包含生成一个组件源代码的目录模板。接入just的物料模板需要遵循以下几个规范：

#### 1、generator.json规范

&emsp;&emsp;generator.json规范。一个物料库必须包含一个`generator.json`文件，`generator.json`是一个json配置，里面包含了生成组件需要的每一个原料文件，包括statics(无需处理的静态文件)，templates(需要处理的文件模板)templateData(传入模板生成组件需要的数据)三个字段。`generator.json`文件指定了调用物料库生成组件时应该怎样处理物料文件。

#### 2、物料文件目录

&emsp;&emsp;例如下面是一个物料库目录：

```
portal-fe/
    |-data/
        |-index.js          # 组件对应的初始mock数据
        |-asyncData.json    # 组件动态mock数据
    |-test/
        |-test.js           # 组件单元测试脚本文件
    |-src/
        |-events.js         # 组件对应操作事件模块
        |-index.less        # 组件对应的样式
    |-index.jsx             # 组件的入口文件
    |-README.md             # 组件对应的readme文档
    |-generator.json        # 组件的generator.json
```

&emsp;&emsp;对应的`generator.json`文件内容为:

```
{
    "statics": [
        "README.md",
        "data/index.js",
        "data/asyncData.json"
    ],
    "templates": [
        "test/test.js",
        "src/events.js",
        "src/index.less"
        "index.jsx",
    ],
    "templateData": {
        "_Component": "name",
        "_component": "lineThroughName"
    }
}
```

&emsp;&emsp;1. statics: 无需处理的静态文件列表，如果是多级目录也要逐个列出，而且要确保文件存在，这类文件将在调用物料库生成组件时会直接复制到组件目录中，不会进行额外的处理。

&emsp;&emsp;2. templates：如果物料文件中含有动态的信息(例如组件名称等)，需要填入动态组件信息的模板文件，这些文件需要全部列出来，否则将不进行处理，模板文件变量使用ES6的字符串语法规范。

&emsp;&emsp;3. templateData：动态组件信息传入的数据，例如组件名称，组件描述等。`{"_Component": "name"}` 的意思是将物料文件中含有`${_component}`的地方代替为componentsInfo.name(ComponentInfo为创建组件时输入的一些信息，另外还有`author`，`name`、`version`、`description`等)。

&emsp;&emsp;例如，上面templates中的`src/index.less`内容为：

```
.${_component} {
    display: block;
    backround-color: #eee;
}
```

&emsp;&emsp;如果调用物料库生成组件传入的组件名为`PageDetail`，则最终生成组件中`src/index.less`文件内容为:

```
.page-detail {
    display: block;
    backround-color: #eee;
}
```


#### 3、文件入口

&emsp;&emsp;一个物料库必须有一个文件入口供外部调用，例如`index.jsx`。入口文件中引用的其它逻辑模块文件尽量在组件src文件中定义。调用物料库生成组件后，额外依赖的第三方组件可以在组件`package.json`中的dependencies里面声明定义。这样执行`just install`时会自动分析安装。