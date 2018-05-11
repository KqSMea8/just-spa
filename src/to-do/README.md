
## Portal-fe 开发指南

#### 一、安装使用调试

&emsp;&emsp;checkout代码后，进入portal-fe目录，执行

```
$ npm i  # 使用npm（不要使用tnpm）安装所需要的npm包， 如果部分包安装失败，则单独安装

$ npm run dev 开发  # 启动开发调试，并访问 http://localhost:3000/www/campaign.html

$ npm run release # 两个命令都可以编译并打包生成tar.gz包

```

#### 二、项目结构

- 目录介绍

```
portal-fe/
    |-src/
        |-actions/          # actions名称文件
        |-api/              # 网络请求playframework对应的调用文件
        |-biz-components    # 上层业务组件目录
        |-component         # 中层公用组件目录，bootstrap为原子级别组件
        |-containers        # 路由对应的container组价
        |-entry             # 业务对应的入口编译文件，在webpack.config中配置的
        |-html              # 前端html文件模板
        |-less              # 必备的less
        |-reducers          # reducers文件
        |-utils             # 工具文件目录
        |-style.less        # 页面引用的业务css入口
    |-dev                   # 调试文件编译目录
    |-build                 # build发布前编译目录
    |-pkg                   # 生成的编译压缩包tar.gz目录
    |-GulpFile.js           # gulp 任务配置
    |-webpack.config.js     # webpack 配置文件
```

#### 三、项目架构分层

&emsp;&emsp;页面组件分层逻辑和图如下：html-> entry -> container -> biz-components -> components -> atom components(react-bootstrap)

![](http://7tszky.com1.z0.glb.clouddn.com/Fkfj49ZMU6wh979v4n83bttWUgMF)


#### 四、开发完成后发布测试

&emsp;&emsp;使用run run release打包完成后，生成的包在项目 /pkg目录下，打开下面织云发布地址（如果没权限请先发布权限）

测试环境发布包：
http://yun.isd.com/index.php/package/versions/?product=gdt&package=gdt_contract_ad_fe

&emsp;&emsp;对应的发布机器为：

```
10.235.21.101 http://test1-tsa.oa.com/www/campaign.html

10.151.140.167 http://test2-tsa.oa.com/www/campaign.html

10.151.139.241 http://test3-tsa.oa.com/www/campaign.html

10.151.141.12 http://test4-tsa.oa.com/www/campaign.html
```

&emsp;&emsp;预发和线上环境发布包：
http://yun.isd.com/index.php/package/versions/?product=gdt&package=gdt_contract_ad_fe-prod

&emsp;&emsp;对应的发布机器为：

```
预发布：10.235.22.47

线上：10.235.22.30
```

#### 线上调试正则

/\/www\/js\/(\S+?)\_\S+?\.js/  E:/BizRd-trunk-base/www-base-fe/portal-fe/dev/www/js/$1.js


