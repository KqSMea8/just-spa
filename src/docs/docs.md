
#### 1、just帮助命令

&emsp;&emsp;了解just所有命令，可以执行`just help`来查看。

```
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

#### 2、快速创建组件

```
just init: 创建一个组件或项目。根据物料库快速生成一个组件或项目。
just i/install: 安装组件的第三方依赖，同 npm/tnpm install。
```

&emsp;&emsp;创建组件时我们一般会选择一个本地目录(任何一个空目录)，通常我们称之为组件工作目录，使用just创建组件时要求输入组件的名称、对应物料库等必填信息和版本号、作者等选填信息。生成过程会调用对应物料库模板，在工作目录下创建组件目录。组件创建完成后如果有第三方包依赖，则需要执行`just install`来自动安装依赖，这里执行时是会分析工作目录下的所有组件的所有第三方依赖包一次性安装。如果不安装否则调试是会提示找不到包。

#### 3、物料库管理

```
just template: 根据自定义物料库目录创建一个新的物料库。

just rmtemplate: 删除一个自定义物料库。

just list: 查看存在的所有物料库列表。
```

&emsp;&emsp;通过just上传自定义物料库时，需要制指定料库名称、选用技术栈、物料库目录路径等信息，自定义物料库目录需要遵循just物料库的制作设计规范，详见[物料库规范](/#template)。此外也可以主动删除物料库，这里只能删除自定义的物料库，不能删除系统自带的基础物料库。本地可用的物料库可以通过just list来查看。

#### 4、调试服务

```
just start/run -port: 启动调试服务器。一般只需要运行一次。-p或-port表示指定端口开启服务。

just clear/clean: 清除缓存。清除build构建的缓存目录。

just dev/watch: 在当前目录下创建组件调试环境。
```

&emsp;&emsp;工作目录下的组件在开启`just watch`时会同步到just的全局调试目录下，`just start`则是在全局调试目录下启动调试服务，调试服务器默认集成了React、Vue、angular、Jquery或原生的组件调试方式。而具体的组件物料库开发则可以选用不同的前端技术栈来制作。`just clear`则是用来清楚全局调试目录下的build文件，让它重新载入组件工作目录下的组件列表。

#### 5、打包发布命令

```
just build: 编译打包组件为单个输出的ES5文件并编译CSS文件。例如：just build ComponentName
```

#### 6、辅助功能

```
just help: 查看帮助。查看just所有命令。

just -v/version: 显示当前安装的just版本。
```

#### 总结

&emsp;&emsp;just工具设计非常简单实用，上手成本极低，但却提供了完整的组件开发管理功能来帮助开发者提高效率。如果使用过程中有什么问题，欢迎issue。