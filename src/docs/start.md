## Getting Started

&emsp;&emsp;Just-spa是一套前端组件工程化工具，可以帮助开发者对物料库进行调用处理，快速进行组件的创建、开发、调试、打包构建，可管理的组件支持React、Vue、Angular或jquer等主流技术栈。从而提高组件管理和开发效率、统一组件规范并分离组件功能、减少人员变动给项目维护带来的额外成本。

#### 1、安装just-spa

```
npm i just-spa -g
```

&emsp;&emsp;如果您设置了tnpm等代理命令，请使用 `tnpm i just-spa -g` 来安装。

#### 2、快速创建和调试一个组件

&emsp;&emsp;选择一个本地工作目录，打开终端执行：

```
just init
```

&emsp;&emsp;输入生成组件的相关信息，填写名称、物料库等，即可快速生成组件。创建组件完成后执行：

```
just watch
```

&emsp;&emsp;just watch会开启组件实时watch同步调试, 然后在相同目录中开启另一个终端执行：

```
just start
```

&emsp;&emsp;just start会启动调试服务器，此时just会自动拉起浏览器打开 http://localhost:8000 ，即可看到调试组件的列表并查看just工具的详细文档。如下：

&emsp;&emsp;![](/src/docs/img/preview.png)


#### 3、just帮助命令

&emsp;&emsp;此外你可以执行`just help`来查看just的其它命令和功能。

```
just init: 创建一个组件或项目。根据组件物料库快速生成一个组件或项目。

just template: 根据自定义组件物料库目录创建一个新的组件物料库。

just rmtemplate: 删除一个自定义组件物料库。

just list: 查看存在的所有组件物料库列表。

just webapp: 调用项目物料库快速生成一个项目工程。

just i/install: 安装组件的第三方依赖，同 npm/tnpm install。

just update: 更新组件的第三方依赖，同 npm/tnpm update。

just start/run -port: 启动调试服务器。一般只需要运行一次。-p或-port表示指定端口开启服务。

just clear/clean: 清除缓存。清除build构建的缓存目录。

just dev/watch: 在当前目录下创建组件调试环境。

just build: 编译打包组件为单个输出的ES5文件并编译CSS文件。例如：just build ComponentName

just help: 查看帮助。查看just所有命令。

just -v/version: 显示当前安装的just版本。

just set: 设置npm、tnpm或tnpm，例如：just set tnpm。
```

&emsp;&emsp;具体功能用法可以查看 [详细文档](/#docs)。