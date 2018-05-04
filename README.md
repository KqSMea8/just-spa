#### 一、Getting Started.

&emsp;&emsp;Just是一套前端工程化工具，用户对物料库进行处理，快速进行组价的创建、开发、调试、打包构建。从而提高组件开发效率，统一组件规范，分离组件功能并减少人员变动给项目维护带来的额外成本。

```

npm i just-spa -g
just init: 创建一个组件或项目。根据物料库快速生成一个组件或项目。
just template: 根据自定义物料库目录创建一个新的物料库。
just rmtemplate: 删除一个自定义物料库。
just list: 查看存在的所有物料库列表。
just i/install: 安装组件的第三方依赖，同 npm/tnpm install。
just start/run -port: 启动调试服务器。一般只需要运行一次。-p或-port表示指定端口开启服务。
just clear/clean: 清除缓存。清除build构建的缓存目录。
just dev/watch: 在当前目录下创建组件调试环境。
just build: 编译打包组件为单个输出的ES5文件并编译CSS文件。例如：just build ComponentName
just help: 查看帮助。查看just所有命令。
just -v/version: 显示当前安装的just版本。

```

&emsp;&emsp;创建组件后执行`just watch`开启调试, 然后执行`just start`启动调试服务器，并使用浏览器打开http://localhost:8000

#### 二、just 体系介绍

###### 工具特点

&emsp;&emsp;组件高内聚低耦合

&emsp;&emsp;敏捷开发，高效调试

&emsp;&emsp;支持线上线下数据联调

&emsp;&emsp;快速打包

###### 组件

&emsp;&emsp;这里的组件可以是任何需要开发调试的组件，为了保证组件规范(目录文档规范和代码规范)的一致性，可以将组件进行一层抽象，形成拼装组件的物料，然后用户快速创建统一化的组件。


###### 物料库定义规范

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

#### 单元测试

mocha和enzyme

#### 常见问题及解决方案

- Mac下面提示找不到命令或权限不足：

&emsp;&emsp;执行cd，到user的目录下，修改.bash_profile, 添加一行  alias just="node /usr/local/lib/node_modules/just-spa/bin/just"，修改完执行 source .bash_profile 生效


