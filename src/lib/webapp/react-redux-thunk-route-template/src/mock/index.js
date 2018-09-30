import Mock from 'mockjs';

import indexData from './index.json';

//注入 mock请求返回数据，项目中使用
Mock.mock(new RegExp('/index'), indexData);