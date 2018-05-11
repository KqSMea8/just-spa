import React, {PureComponent} from 'react';

class Welcome extends PureComponent {
    render() {
        return (
            <div>
                <h1>欢迎使用 TSA 合约广告运营系统（二期）</h1>
                <hr />
                <p>合约广告运营系统汇聚了包括内广、OM、联盟等流量在内的 TSA 所有支持合约广告投放的流量，提供了询量下单、媒体审批、执行管理、进度监控、结案报告等合约广告投放环节的全方位支持。</p>
                <p>系统提供了排期（计划）、订单（广告）两级维度的数据管理能力，并整合了广告素材编辑、广告审批结果查看、广告执行进度管理等周边特性。</p>
                <p>同时针对不同流量方的差异，也提供了非常定制化的流程支持，包括流量打包规则、售价计算规则、审批规则等。</p>
                <p>你可以通过来开始使用本系统。</p>
                <hr />
                <dl>
                    <dt>FAQ</dt>
                    <dd>Q: 如何特定广告主创建排期？</dd>
                    <dd>A: 请先在 CRM 系统中分配该广告主的运营权限。</dd>
                    <dd>Q: 怎么没有我想要投放 XXX 流量？</dd>
                    <dd>A: 我们正在逐步迁移一期上的剩余流量到新系统中，也很乐意直接新系统中接入新流量，具体情况请联系 @rongjiaoxue。</dd>
                </dl>
            </div>
        );
    }
}

export default Welcome