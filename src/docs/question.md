#### 常见问题及解决方案

- Mac下面提示找不到命令或权限不足：

&emsp;&emsp;执行cd，到user的目录下，修改.bash_profile, 添加一行  alias just="node /usr/local/lib/node_modules/just-spa/bin/just"，修改完执行 source .bash_profile 生效

- 调试时找不到依赖的包

&emsp;&emsp;进入组件工作目录下执行`just install`后重试调试。