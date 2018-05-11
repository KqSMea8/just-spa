import { Actions, makeAjaxAction, makeTxAction } from 'redux-context';

export const BEGIN = Actions.BEGIN;
export const UPDATE = Actions.UPDATE;
export const COMMIT = Actions.COMMIT;
export const CANCEL = Actions.CANCEL;

export const FETCH_LOGIN_STATUS = makeAjaxAction('FETCH_LOGIN_STATUS'); // 获取登录状态
export const FETCH_USER_PROFILE = makeAjaxAction('FETCH_USER_PROFILE'); // 获取用户信息
export const FETCH_PLACEMENT_GROUP_TAG_TREE_LIST = makeAjaxAction('FETCH_PLACEMENT_GROUP_TAG_TREE_LIST'); // 获取版位标签列表（含广告位、广告形态等）
export const FETCH_PLACEMET_GROUP_LIST = makeAjaxAction('FETCH_PLACEMET_GROUP_LIST'); // 获取版位集合
export const FETCH_PLACEMENT_GROUP_TAG_LIST = makeAjaxAction('FETCH_PLACEMENT_GROUP_TAG_LIST'); // 获取版位标签集合
export const FETCH_ADVERTISER = makeAjaxAction('FETCH_ADVERTISER'); // 获取广告主信息
export const FETCH_ADVERTISER_WHITE_LIST = makeAjaxAction('FETCH_ADVERTISER_WHITE_LIST'); // 获取广告主信息
export const FETCH_GRANTED_ADVERTISERS = makeAjaxAction('FETCH_GRANTED_ADVERTISERS'); // 获取授权的广告主信息
export const FETCH_CAMPAIGN_LIST = makeAjaxAction('FETCH_CAMPAIGN_LIST'); // 获取计划列表
export const FETCH_CAMPAIGN = makeAjaxAction('FETCH_CAMPAIGN'); // 获取指定计划信息
export const FETCH_CAMPAIGN_PERMISSIONS = makeAjaxAction('FETCH_CAMPAIGN_PERMISSIONS'); // 获取指定计划的权限列表
export const FETCH_TARGETING_LIST = makeAjaxAction('FETCH_TARGETING_LIST'); // 获取定向包列表
export const FETCH_CAMPAIGN_PROGRESS = makeAjaxAction('FETCH_CAMPAIGN_PROGRESS'); // 获取计划执行进展报告
export const FETCH_ADGROUP = makeAjaxAction('FETCH_ADGROUP'); // 获取指定广告信息
export const FETCH_ADGROUP_SPOTS = makeAjaxAction('FETCH_ADGROUP_SPOTS'); // 获取指定广告的点位信息
export const FETCH_ADGROUP_BOOKINGINFO = makeAjaxAction('FETCH_ADGROUP_BOOKINGINFO'); // 获取指定广告的预订信息
export const FETCH_ADGROUP_APPROVERS = makeAjaxAction('FETCH_ADGROUP_APPROVERS'); // 获取指定广告的审批人信息
export const FETCH_ADGROUP_PERMISSIONS = makeAjaxAction('FETCH_ADGROUP_PERMISSIONS'); // 获取指定广告的权限列表
export const FETCH_CREATIVE = makeAjaxAction('FETCH_CREATIVE'); // 获取指定创意信息
export const FETCH_LOGIC_PLACEMENT = makeAjaxAction('FETCH_LOGIC_PLACEMENT'); // 获取指定逻辑广告位信息
export const FETCH_CREATIVE_TEMPLATE = makeAjaxAction('FETCH_CREATIVE_TEMPLATE'); // 获取指定逻辑广告位信息
export const FETCH_PRODUCT = makeAjaxAction('FETCH_PRODUCT'); // 获取指定商品详情
export const FETCH_DEFAULT_TARGET_INFO = makeAjaxAction('FETCH_DEFAULT_TARGET_INFO'); // 获取默认支持的定向信息
export const FETCH_TARGET_CONFIGS = makeAjaxAction('FETCH_TARGET_CONFIGS'); // 获取定向可选项 map
export const FETCH_MEDIA_CONTENT = makeAjaxAction('FETCH_MEDIA_CONTENT'); // 根据广告获取媒体
export const FETCH_ADGROUP_WATCH_LIST = makeAjaxAction('FETCH_ADGROUP_WATCH_LIST'); // 获取广告关注人列表
export const FETCH_CAMPAIGN_WATCH_LIST = makeAjaxAction('FETCH_CAMPAIGN_WATCH_LIST'); // 获取计划关注人列表
export const FETCH_ADTARGET = makeAjaxAction('FETCH_ADTARGET'); // 获取定向信息
export const FETCH_IMAGE = makeAjaxAction('FETCH_IMAGE'); // 获取图片
export const FETCH_VIDEO = makeAjaxAction('FETCH_VIDEO'); // 获取视频
export const FETCH_INDUSTRY_LIST = makeAjaxAction('FETCH_INDUSTRY_LIST'); // 获取行业列表
export const FETCH_CHANNEL_LIST = makeAjaxAction('FETCH_CHANNEL_LIST'); // 获取频道列表
export const FETCH_INDUSTRY_VALIDATE = makeAjaxAction('FETCH_INDUSTRY_VALIDATE'); // 获取行业校验结果
export const FETCH_ADGROUP_REFUND_RECORD = makeAjaxAction('FETCH_ADGROUP_REFUND_RECORD'); // 获取广告退费记录
export const FETCH_ADGROUP_REACHMAX_OUTER_KEY = makeAjaxAction('FETCH_ADGROUP_REACHMAX_OUTER_KEY'); // 获取 ReachMax 广告 OuterKey
export const FETCH_DSP_LIST = makeAjaxAction('FETCH_DSP_LIST'); // 获取 dsp 列表
export const FETCH_TARGET_WORD_SEARCH = makeAjaxAction('FETCH_TARGET_WORD_SEARCH'); // 获取定向关键字搜索
export const FETCH_TARGET_WORD_EXPAND = makeAjaxAction('FETCH_TARGET_WORD_EXPAND'); // 获取兴趣定向推荐

export const EDIT_CAMPAIGN = makeTxAction('EDIT_CAMPAIGN');
export const EDIT_ADGROUP = makeTxAction('EDIT_ADGROUP');
export const REMOVE_ADGROUP = 'REMOVE_ADGROUP';
export const EDIT_CREATIVE = makeTxAction('EDIT_CREATIVE');
export const ADD_CREATIVE = makeTxAction('ADD_CREATIVE');

export const REFRESH_CAMPAIGN = 'REFRESH_CAMPAIGN'; // 刷新计划
export const REFRESH_CAMPAIGN_LIST = 'REFRESH_CAMPAIGN_LIST'; // 刷新计划列表
export const REFRESH_CAMPAIGN_WATCH_LIST = 'REFRESH_CAMPAIGN_WATCH_LIST'; // 刷新计划关注人
export const REFRESH_ADGROUP = 'REFRESH_ADGROUP'; // 刷新广告
export const REFRESH_ADGROUP_WATCH_LIST = 'REFRESH_ADGROUP_WATCH_LIST'; // 刷新广告关注人
export const REFRESH_CREATIVE = 'REFRESH_CREATIVE'; // 刷新素材

export const TOGGLE_ADD_ADGROUP_DIALOG = 'TOGGLE_ADD_ADGROUP_DIALOG';

export const FETCH_ADGROUP_UNQUATITYGUARANTEED = makeAjaxAction('FETCH_ADGROUP_UNQUATITYGUARANTEED') // 广告不保量记录
export const FETCH_DYNAMIC_CREATIVE_RECOMMEND_RECORDS = makeAjaxAction('FETCH_DYNAMIC_CREATIVE_RECOMMEND_RECORDS'); // 动态创意推荐方法
