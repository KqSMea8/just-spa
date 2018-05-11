import * as ActionTypes from '../actions';
import moment from 'moment';
import _ from 'lodash';
import * as AdGroupValidator from '../biz-components/AdGroupValidator';


/** 登录状态 */
function loginStatus(state = null, action) {
    switch (action.type) {
        case ActionTypes.FETCH_LOGIN_STATUS.SUCCESS:
            return action.data;

        default:
            return state;
    }
}

function placementGroupTagTrees(state = {}, action) {
    let key = _.get(action, 'params.advertiserId') || 'default';
    switch (action.type) {
        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_TREE_LIST.QUERY:
            return _.assign(state,  _.set({}, key, { query: true, error: null }));

        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_TREE_LIST.SUCCESS:
            return _.assign({}, state,  _.set({}, key, { list: action.data }));

        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_TREE_LIST.ERROR:
            return  _.assign(state, _.set({}, key, { query: false, error: action.message }));

        default:
            return state;
    }
}

/** 行业列表
{
  query: boolean,
  error: error,
  list: [
    { id, name, parentId, status, level}, ...
  ]
}
*/
function industryList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_INDUSTRY_LIST.QUERY:
            return { query: true, list: state.list };

        case ActionTypes.FETCH_INDUSTRY_LIST.SUCCESS:
            return { list: action.data };

        case ActionTypes.FETCH_INDUSTRY_LIST.ERROR:
            return { error: action.message, list: state.list };

        default:
            return state;
    }
}

/** dsp列表
{
  query: boolean,
  error: error,
  list: [
    { }, ...
  ]
}
*/
function dspList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_DSP_LIST.QUERY:
            return _.assign(state, { query: true, error: null });

        case ActionTypes.FETCH_DSP_LIST.SUCCESS:
            return action.data;

        case ActionTypes.FETCH_DSP_LIST.ERROR:
            return _.assign(state, { query: false, error: action.message });

        default:
            return state;
    }
}

/** 频道 map
{
  query: boolean,
  error: error,
  placementGroupTagId1: {level1: {id, name, level, pageShortIds}, level2:{}, ...},
  placementGroupTagId2: {level1: {id, name, level, pageShortIds}, level2:{}, ...},
  ...
}
*/
function channels(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CHANNEL_LIST.QUERY:
            return _.assign(state, { query: true, error: null });

        case ActionTypes.FETCH_CHANNEL_LIST.SUCCESS:
            return action.data;

        case ActionTypes.FETCH_CHANNEL_LIST.ERROR:
            return  _.assign(state, { query: false, error: action.message });

        default:
            return state;
    }
}


/** 频道 map
{
  adGroupId1: {query: boolean, error: error, hasQuantityGuaranteedRisk: boolean},
  adGroupId2: {query: boolean, error: error, hasQuantityGuaranteedRisk: boolean},
  ...
}
*/
function isQuantityGuaranteed(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_INDUSTRY_VALIDATE.QUERY:
            return _.assign(state,  _.set({}, action.params.adGroupId, { query: true, error: null }));

        case ActionTypes.FETCH_INDUSTRY_VALIDATE.SUCCESS:
            return _.assign(state,  _.set({}, action.data.adGroupId, action.data));

        case ActionTypes.FETCH_INDUSTRY_VALIDATE.ERROR:
            return  _.assign(state, _.set({}, action.params.adGroupId, { query: false, error: action.message }));

        default:
            return state;
    }
}


/** 频道名称 map
{
  query: boolean,
  error: error,
  placementGroupTagId1: {pageShortId1: "频道1", pageShortId1: "频道2", ...},
  placementGroupTagId2: {pageShortId3: "频道3", pageShortId4: "频道4", ...},
  ...
}
*/
function channelNames(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CHANNEL_LIST.QUERY:
            return _.assign(state, { query: true, error: null });

        case ActionTypes.FETCH_CHANNEL_LIST.SUCCESS:
        {
            let channelNames = {};
            _.forEach(action.data, (channelMap, level) => {
                let names = {};
                let options = _.reduce(_.values(channelMap), (result, c) => {
                    return _.concat(result, c);
                }, []);
                _.forEach(options, channel => {
                    _.forEach(channel.pageShortIds, id => {
                        names[id] = channel.name;
                    });
                });
                channelNames[level] = names;
            });
            return channelNames;
        }

        case ActionTypes.FETCH_CHANNEL_LIST.ERROR:
            return  _.assign(state, { query: false, error: action.message });

        default:
            return state;
    }
}

/** 版位标签集合
{
  query: boolean,
  error: error,
  id1: { id, name },
  id2: { id, name }
}
*/
function placementGroupTags(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_LIST.QUERY:
            return _.assign(state, { query: true });

        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_LIST.SUCCESS:
            return action.data;

        case ActionTypes.FETCH_PLACEMENT_GROUP_TAG_LIST.ERROR:
            return  _.assign(state, { query: false, error: action.message });

        default:
            return state;
    }
}

/** 版位集合
{
  query: boolean,
  error: error,
  id1: { id, name },
  id2: { id, name }
}
*/
function placementGroups(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_PLACEMET_GROUP_LIST.QUERY:
            return _.assign(state, { query: true });

        case ActionTypes.FETCH_PLACEMET_GROUP_LIST.SUCCESS:
            return action.data;

        case ActionTypes.FETCH_PLACEMET_GROUP_LIST.ERROR:
            return  _.assign(state, { query: false, error: action.message });

        default:
            return state;
    }
}

/** 默认支持的定向信息: {COSTTYPE_CPM: {}, COSTTYPE_CPD: {}} */
function defaultTargetInfo(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_DEFAULT_TARGET_INFO.ERROR:
        case ActionTypes.FETCH_DEFAULT_TARGET_INFO.QUERY:
            return {}
        case ActionTypes.FETCH_DEFAULT_TARGET_INFO.SUCCESS:
            return action.data;
        default:
            return state;
    }
}

/** 定向可选项 map: name => {form_type: .., slot_name: .., slot_desc: ..., options: ...} */
function targetConfigs(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_TARGET_CONFIGS.ERROR:
        case ActionTypes.FETCH_TARGET_CONFIGS.QUERY:
            return {}
        case ActionTypes.FETCH_TARGET_CONFIGS.SUCCESS:
            return action.data;

        default:
            return state;
    }
}
/** 根据广告联盟获取媒体 map: name => {media: .., placement: .., } */
function mediaContent(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_MEDIA_CONTENT.ERROR:
        case ActionTypes.FETCH_MEDIA_CONTENT.QUERY:
            return {}
        case ActionTypes.FETCH_MEDIA_CONTENT.SUCCESS:
            return action.data;
  
        default:
            return state;
    }
}

/** 用户信息
{
  <accountId1>: { query, error, ... },
  <accountId2>: { ... }
}
*/
function userProfiles(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_USER_PROFILE.QUERY:
            return _.assign({}, state, _.set({}, action.params.accountId, { query: true }));

        case ActionTypes.FETCH_USER_PROFILE.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.accountId, action.data));

        case ActionTypes.FETCH_USER_PROFILE.ERROR:
            return _.assign({}, state, _.set({}, action.params.accountId, { query: false, error: action.message }));

        default:
            return state;
    }
}

/** 商品信息
{
  <ProductType_ProductId_SubProductId>: { query, error, ... },
  <ProductType_ProductId_SubProductId>: { ... },
}
*/
function products(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_PRODUCT.QUERY:
        {
            let key = action.params.key;
            let product = state[key];
            if (product) {
                return _.assign({}, state, _.set({}, key, _.assign({}, product, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, key, { query: true }));
            }
        }
        case ActionTypes.FETCH_PRODUCT.SUCCESS:
        {
            let { productType, productId, subordinateProductId } = action.data;
            let key = subordinateProductId ? `${productType}_${productId}_${subordinateProductId}` : `${productType}_${productId}`;
            return _.assign({}, state, _.set({}, key, action.data));
        }

        case ActionTypes.FETCH_PRODUCT.ERROR:
        {
            let key = action.params.key;
            let product = state[key];
            if (product) {
                return _.assign({}, state, _.set({}, key, _.assign({}, product, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, key, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 广告主信息
 {
   <advertiserId1>: { query, error, ... },
   <advertiserId2>: { ... },
 }
 */
function advertisers(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADVERTISER.QUERY:
            return _.assign({}, state, _.set({}, action.params.advertiserId, { query: true }));

        case ActionTypes.FETCH_ADVERTISER.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.advertiserId, action.data));

        case ActionTypes.FETCH_ADVERTISER.ERROR:
            return _.assign({}, state, _.set({}, action.params.advertiserId, { query: false, error: action.message }));

        case ActionTypes.FETCH_GRANTED_ADVERTISERS.SUCCESS: {
            return _.assign({}, state, _.reduce(action.data.advertisers, (o, a) => {
                o[ a.advertiserId ] = a;
                return o;
            }, {}));
        }

        default:
            return state;
    }
}

/** 授权广告主信息
 {
   <advertiserId1>: { query, error, ... },
   <advertiserId2>: { ... },
 }
 */
function grantedAdvertisers(state = {}, action) {
    if (!action || !action.params || !action.params.grantOnly) {
        return state;
    }

    return advertisers(state, action);
}

function whitePrivilegeCodeList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADVERTISER_WHITE_LIST.QUERY:
        {
            let advertiserId = action.params.advertiserId;
            let whiteList = state[advertiserId];
            if (whiteList) {
                return _.assign({}, state, _.set({}, advertiserId, _.assign({}, whiteList, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, advertiserId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADVERTISER_WHITE_LIST.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.advertiserId,  action.data.whiteList));

        case ActionTypes.FETCH_ADVERTISER_WHITE_LIST.ERROR:
        {
            let advertiserId = action.params.advertiserId;
            let whiteList = state[advertiserId];
            if (whiteList) {
                return _.assign({}, state, _.set({}, advertiserId, _.assign({}, whiteList, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, advertiserId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}


/** 广告退费记录
{
  <adGroupId1>: { query, error, ...},
  <adGroupId2>: { ... },
}
*/
function refundRecords(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADGROUP_REFUND_RECORD.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let record = state[adGroupId];
            if (record) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, record, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADGROUP_REFUND_RECORD.SUCCESS:
        {
            if (action.data) {
                return _.assign({}, state, _.set({}, action.data.adGroupId, action.data));
            }
            return state;
        }

        case ActionTypes.FETCH_ADGROUP_REFUND_RECORD.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let record = state[adGroupId];
            if (record) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, record, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}



/** 广告关注人信息
{
  <adGroupId1>: { query, error, ...},
  <adGroupId2>: { ... },
}
*/
function adGroupWatchList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADGROUP_WATCH_LIST.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let watchList = state[adGroupId];
            if (watchList) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, watchList, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADGROUP_WATCH_LIST.SUCCESS:
        case ActionTypes.REFRESH_ADGROUP_WATCH_LIST:
            return _.assign({}, state, _.set({}, action.data.adGroupId, {list: action.data.watchList}));

        case ActionTypes.FETCH_ADGROUP_WATCH_LIST.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let watchList = state[adGroupId];
            if (watchList) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, watchList, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 计划关注人信息
{
  <campaignId1>: { query, error, ...},
  <campaignId2>: { ... },
}
*/
function campaignWatchList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CAMPAIGN_WATCH_LIST.QUERY:
        {
            let campaignId = action.params.campaignId;
            let watchList = state[campaignId];
            if (watchList) {
                return _.assign({}, state, _.set({}, campaignId, _.assign({}, watchList, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, campaignId, { query: true }));
            }
        }

        case ActionTypes.FETCH_CAMPAIGN_WATCH_LIST.SUCCESS:
        case ActionTypes.REFRESH_CAMPAIGN_WATCH_LIST:
            return _.assign({}, state, _.set({}, action.data.campaignId, {list: action.data.watchList}));

        case ActionTypes.FETCH_CAMPAIGN_WATCH_LIST.ERROR:
        {
            let campaignId = action.params.campaignId;
            let watchList = state[campaignId];
            if (watchList) {
                return _.assign({}, state, _.set({}, campaignId, _.assign({}, watchList, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, campaignId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 计划信息
{
  <campaignId1>: { query, error, permissionsQuery, permissionsError, ... },
  <campaignId2>: { ... },
}
*/
function campaigns(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CAMPAIGN.QUERY:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId, _.assign({}, campaign, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, campaignId, { query: true }));
            }
        }

        case ActionTypes.FETCH_CAMPAIGN_LIST.SUCCESS:
        {
            return _.assign({}, state, _.zipObject(_.map(action.data.list, c => c.campaignId), action.data.list));
        }

        case ActionTypes.FETCH_CAMPAIGN.SUCCESS:
        {
            let campaignId = action.data.campaignId;
            let campaign = state[campaignId];
            console.debug(action.data);
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId, _.defaults(action.data, {permissions: campaign.permissions})));
            } else {
                return _.assign({}, state, _.set({}, campaignId, action.data));
            }
        }

        case ActionTypes.FETCH_CAMPAIGN.ERROR:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId, _.assign({}, campaign, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, campaignId, { query: false, error: action.message }));
            }
        }

        case ActionTypes.FETCH_CAMPAIGN_PERMISSIONS.QUERY:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId,
                    _.assign({}, campaign, { permissionsQuery: true, permissionsError: null })));
            } else {
                return _.assign({}, state, _.set({}, campaignId, { permissionsQuery: true, permissionsError: null }));
            }
        }
        case ActionTypes.FETCH_CAMPAIGN_PERMISSIONS.SUCCESS:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId,
                    _.assign({permissionsQuery: false}, campaign, action.data)));
            }
            return state;
        }
        case ActionTypes.FETCH_CAMPAIGN_PERMISSIONS.ERROR:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId,
                    _.assign({}, campaign, { permissionsQuery: false, permissionsError: action.message, permissions: []})));
            }
            return state;
        }

        case ActionTypes.REFRESH_CAMPAIGN:
        {
            let campaignId = action.data.campaignId;
            let campaign = state[campaignId];
            if (campaign) {
                return _.assign({}, state, _.set({}, campaignId, _.assign({}, campaign, action.data)));
            } else {
                return _.assign({}, state, _.set({}, campaignId, action.data));
            }
        }

        case ActionTypes.FETCH_ADGROUP_PERMISSIONS.SUCCESS:
        case ActionTypes.FETCH_ADGROUP.SUCCESS:
        case ActionTypes.REFRESH_ADGROUP:
        case ActionTypes.FETCH_ADGROUP_SPOTS.SUCCESS:
        case ActionTypes.FETCH_ADGROUP_APPROVERS.SUCCESS:
        case ActionTypes.FETCH_ADGROUP_BOOKINGINFO.SUCCESS:
        {
            let campaignId = action.data.campaignId || action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign && campaign.adGroups) {
                let index = _.findIndex(campaign.adGroups, a => a.adGroupId == action.data.adGroupId);
                if (index >= 0) {
                    let adGroups = _.clone(campaign.adGroups);
                    adGroups[index] = _.assign({}, adGroups[index], action.data);
                    return _.assign({}, state, _.set({}, campaignId, _.assign({}, campaign, {adGroups: adGroups})));
                }
            }
            return state;
        }

        case ActionTypes.FETCH_CREATIVE.SUCCESS:
        case ActionTypes.REFRESH_CREATIVE:
        {
            let campaignId = action.data.cid;
            let campaign = state[action.data.cid];
            if (campaign && campaign.adGroups) {
                let index = _.findIndex(campaign.adGroups, a => a.adGroupId == action.data.aid);
                if (index >= 0) {
                    let adGroup = campaign.adGroups[index];
                    if (adGroup && adGroup.creatives) {
                        let index2 = _.findIndex(adGroup.creatives, a => a.tid == action.data.tid);
                        if (index2 >= 0) {
                            let creatives = _.clone(adGroup.creatives);
                            creatives[index2] = _.assign({}, creatives[index2], action.data);

                            let adGroups = _.clone(campaign.adGroups);
                            adGroups[index] = _.assign({}, adGroup, {creatives: creatives});
                            return _.assign({}, state, _.set({}, action.data.cid, _.assign({}, campaign, {adGroups: adGroups})));
                        }
                    }
                }
            }
            return state;
        }
        //  case ActionTypes.EDIT_CAMPAIGN.COMMIT:
        // FIXME: 编辑计划之后，强制刷新；后续可以考虑改成仅更新变动的计划
        //    return state;

        case ActionTypes.FETCH_ADGROUP_REACHMAX_OUTER_KEY.SUCCESS:
        {
            let campaignId = action.params.campaignId;
            let campaign = state[campaignId];
            if (campaign && campaign.adGroups) {
                let index = _.findIndex(campaign.adGroups, a => a.adGroupId == action.params.adGroupId);
                if (index >= 0) {
                    let adGroups = _.clone(campaign.adGroups);
                    adGroups[index] = _.assign({}, adGroups[index], {reachMaxOuterKey: action.data});
                    return _.assign({}, state, _.set({}, campaignId, _.assign({}, campaign, {adGroups: adGroups})));
                }
            }

            return state;
        }
        default:
            return state;
    }
}

/** 广告信息
{
  <adGroupId1>: { query, error, permissionsQuery,  ... },
  <adGroupId2>: { ... },
}
*/
function adGroups(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADGROUP.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, adGroup, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: true }));
            }
        }

        case ActionTypes.FETCH_CAMPAIGN_LIST.SUCCESS:
        {
            let ads = _.filter(_.reduce(action.data.list, (result, c) => {
                return _.concat(result, c.adGroups);
            }, []), a => a);
            // 保留权限
            ads = _.map(ads, a => {
                let adGroupId = a.adGroupId;
                let adGroup = state[adGroupId];
                if (adGroup) {
                    return _.defaults(a, {permissions: adGroup.permissions});
                }
                return a;
            });
            return _.assign({}, state, _.zipObject(_.map(ads, c => c && c.adGroupId), ads));
        }

        case ActionTypes.FETCH_CAMPAIGN.SUCCESS:
        {
            // 保留权限
            let adGroups = _.map(action.data.adGroups, a => {
                let adGroupId = a.adGroupId;
                let adGroup = state[adGroupId];
                if (adGroup) {
                    return _.defaults(a, {permissions: adGroup.permissions});
                }
                return a;
            });
            return _.assign({}, state, _.zipObject(_.map(adGroups, a => a.adGroupId), adGroups));
        }

        case ActionTypes.FETCH_ADGROUP.SUCCESS:
        {
            let adGroupId = action.data.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId, _.defaults(action.data, {permissions: adGroup.permissions})));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, action.data));
            }
        }

        case ActionTypes.FETCH_ADGROUP.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, adGroup, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: false, error: action.message }));
            }
        }

        case ActionTypes.FETCH_ADGROUP_PERMISSIONS.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, { permissionsQuery: true, permissionsError: null })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { permissionsQuery: true, permissionsError: null }));
            }
        }
        case ActionTypes.FETCH_ADGROUP_PERMISSIONS.SUCCESS:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, action.data, {permissionsQuery: false})));
            }
            return state;
        }
        case ActionTypes.FETCH_ADGROUP_PERMISSIONS.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, { permissionsQuery: false, permissionsError: action.message, permissions: []})));
            }
            return state;
        }

        case ActionTypes.REFRESH_ADGROUP:
        case ActionTypes.FETCH_ADGROUP_SPOTS.SUCCESS:
        case ActionTypes.FETCH_ADGROUP_APPROVERS.SUCCESS:
        case ActionTypes.FETCH_ADGROUP_BOOKINGINFO.SUCCESS:
        {
            let adGroupId = action.data.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, adGroup, action.data)));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, action.data));
            }
        }

        case ActionTypes.FETCH_CREATIVE.SUCCESS:
        case ActionTypes.REFRESH_CREATIVE:
        {
            let adGroupId = action.data.aid;
            let adGroup = state[adGroupId];
            if (adGroup && adGroup.creatives) {
                let index = _.findIndex(adGroup.creatives, a => a.tid == action.data.tid);
                if (index >= 0) {
                    let creatives = _.clone(adGroup.creatives);
                    creatives[index] = _.assign({}, creatives[index], action.data);
                    return _.assign({}, state, _.set({}, adGroupId, _.assign({}, adGroup, {creatives: creatives})));
                }
            }
            return state;
        }

        case ActionTypes.EDIT_ADGROUP.COMMIT:
            // FIXME: 编辑广告之后，强制刷新；后续可以考虑改成仅更新变动的计划
            return state;

        case ActionTypes.FETCH_ADGROUP_REACHMAX_OUTER_KEY.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, { queryingReachMaxOuterKey: true})));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { queryingReachMaxOuterKey: true}));
            }
        }
        case ActionTypes.FETCH_ADGROUP_REACHMAX_OUTER_KEY.SUCCESS:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, {reachMaxOuterKey: action.data, queryingReachMaxOuterKey: false})));
            }
            return state;
        }
        case ActionTypes.FETCH_ADGROUP_REACHMAX_OUTER_KEY.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let adGroup = state[adGroupId];
            if (adGroup) {
                return _.assign({}, state, _.set({}, adGroupId,
                    _.assign({}, adGroup, { queryingReachMaxOuterKey: false, reachMaxOuterKey: null})));
            }
            return state;
        }

        default:
            return state;
    }
}

/** 素材信息
{
  <adGroupId1>: { query, error, ... },
  <adGroupId2>: { ... },
}
*/
function creatives(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CREATIVE.QUERY:
        {
            let creativeId = action.params.creativeId;
            let creative = state[creativeId];
            if (creative) {
                return _.assign({}, state, _.set({}, creativeId, _.assign({}, creative, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, creativeId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADGROUP.SUCCESS:
            return _.assign({}, state, _.zipObject(_.map(action.data.creatives, c => c.tid), action.data.creatives));

        case ActionTypes.FETCH_CREATIVE.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.tid, action.data));

        case ActionTypes.FETCH_CREATIVE.ERROR:
        {
            let creativeId = action.params.creativeId;
            let creative = state[creativeId];
            if (creative) {
                return _.assign({}, state, _.set({}, creativeId, _.assign({}, creative, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, creativeId, { query: false, error: action.message }));
            }
        }

        case ActionTypes.REFRESH_CREATIVE:
        {
            let creativeId = action.data.tid;
            let creative = state[creativeId];
            if (creative) {
                return _.assign({}, state, _.set({}, creativeId, _.assign({}, creative, action.data)));
            } else {
                return _.assign({}, state, _.set({}, creativeId, action.data));
            }
        }

        case ActionTypes.EDIT_ADGROUP.COMMIT:
            // FIXME: 编辑广告之后，强制刷新；后续可以考虑改成仅更新变动的计划
            return state;

        default:
            return state;
    }
}

/** 逻辑广告位信息
{
  <logicPlacementId1>: { query, error, ... },
  <logicPlacementId2>: { ... },
}
*/
function logicPlacements(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_LOGIC_PLACEMENT.QUERY:
        {
            let logicPlacementId = action.params.logicPlacementId;
            let logicPlacement = state[logicPlacementId];
            if (logicPlacement) {
                return _.assign({}, state, _.set({}, logicPlacementId, _.assign({}, logicPlacement, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, logicPlacementId, { query: true }));
            }
        }

        case ActionTypes.FETCH_LOGIC_PLACEMENT.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.id, action.data));

        case ActionTypes.FETCH_LOGIC_PLACEMENT.ERROR:
        {
            let logicPlacementId = action.params.logicPlacementId;
            let logicPlacement = state[logicPlacementId];
            if (logicPlacement) {
                return _.assign({}, state, _.set({}, logicPlacementId, _.assign({}, logicPlacement, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, logicPlacementId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 逻辑广告位信息
{
  <adTargetId1>: { query, error, ... },
  <adTargetId2>: { ... },
}
*/
function adTargets(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADTARGET.QUERY:
        {
            let targetingId = action.params.targetingId;
            let target = state[targetingId];
            if (target) {
                return _.assign({}, state, _.set({}, targetingId, _.assign({}, target, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, targetingId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADTARGET.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.mid, action.data));

        case ActionTypes.FETCH_ADTARGET.ERROR:
        {
            let targetingId = action.params.targetingId;
            let target = state[targetingId];
            if (target) {
                return _.assign({}, state, _.set({}, targetingId, _.assign({}, target, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, targetingId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 素材模板信息
{
  <templateKey1>: { query, error, ... },
  <templateKey2>: { ... },
}
*/
function templates(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CREATIVE_TEMPLATE.QUERY:
        {
            let key = action.params.key;
            let template = state[key];
            if (template) {
                return _.assign({}, state, _.set({}, key, _.assign({}, template, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, key, { query: true }));
            }
        }

        case ActionTypes.FETCH_CREATIVE_TEMPLATE.SUCCESS:
        {
            let key = action.params.key;
            // 将素材封装成一个 struct 节点
            let template = action.data;
            template.type = 'STRUCT';
            template.name = 'creative';
            template.desc = '素材';
            template.use = 'required';
            // 合并 creative_template 与 ad_attributes 属性
            template.dimension = _.assign({}, template.creative_template);
            // 设置 template.dimension.creative_elements.name = creative_elements
            if (template.dimension.creative_elements && !template.dimension.creative_elements.name) {
                _.set(template.dimension.creative_elements, 'name', 'creative_elements');
            }
            // 封装后的数据存入全局缓存
            return _.assign({}, state, _.set({}, key, template));
        }

        case ActionTypes.FETCH_CREATIVE_TEMPLATE.ERROR:
        {
            let key = action.params.key;
            let template = state[key];
            if (template) {
                return _.assign({}, state, _.set({}, key, _.assign({}, template, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, key, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}


/** 计划列表
{
  query: boolean,
  error: error,
  range: object,
  data: [ <campaignId1>, <campaignId2>, ... ]
}
*/
function campaignList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CAMPAIGN_LIST.QUERY:
            return _.assign({}, state, { query: true, error: null });

        case ActionTypes.FETCH_CAMPAIGN_LIST.SUCCESS:
            return {
                query: false,
                error: null,
                pagination: _.pick(action.data, ['pageSize', 'pageIndex', 'totalCount', 'totalPages']),
                data: _.map(action.data.list, c => c.campaignId),
            };

        case ActionTypes.FETCH_CAMPAIGN_LIST.ERROR:
            return _.assign({}, state, { query: false, error: action.message });

        case ActionTypes.REFRESH_CAMPAIGN_LIST:
            return _.assign({}, state, { data: action.data });
            // case ActionTypes.EDIT_CAMPAIGN.COMMIT:
            //   // FIXME: 编辑计划之后，强制刷新；后续可以考虑改成仅更新变动的计划
            //   return {};

        default:
            return state;
    }
}

/** 计划执行进度报告
{
  <campaignId1>: { query, error, ... },
  <campaignId2>: { ... }
}
*/
function campaignReports(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_CAMPAIGN_PROGRESS.QUERY:
            return _.assign({}, state, _.set({}, action.params.campaignId, {query: true, error: null}));

        case ActionTypes.FETCH_CAMPAIGN_PROGRESS.SUCCESS:
            return _.assign({}, state, _.set({}, action.data.campaignId, action.data));

        case ActionTypes.FETCH_CAMPAIGN_PROGRESS.ERROR:
            return _.assign({}, state, _.set({}, action.params.campaignId, {query: false, error: action.message}));

        default:
            return state;
    }
}

/** 编辑计划 */
function editCampaign(state = null, action) {
    switch (action.type) {
        case ActionTypes.EDIT_CAMPAIGN.BEGIN:
            return _.defaults(action.data, {
                _id: _.uniqueId('_cid_'),
                beginDate: moment(),
                endDate: moment().add(1, 'month'),
                adGroups: [],
            });

        case ActionTypes.EDIT_CAMPAIGN.UPDATE:
            return _.assign({}, state, action.data, {
                _dirty: true,
                _needQuote: (null == action.data._needQuote ? state._needQuote : action.data._needQuote) || checkNeedQuoteForCampaign(state, action.data),
            });

        case ActionTypes.EDIT_CAMPAIGN.COMMIT:
        case ActionTypes.EDIT_CAMPAIGN.CANCEL:
            return null;

        case ActionTypes.EDIT_ADGROUP.COMMIT:
        {
            if (null == state) {
                return null;
            }
            let index = _.findIndex(state.adGroups, a =>
                (a._id && a._id === action.data._id) || (a.adGroupId && a.adGroupId === action.data.adGroupId));
            if (index >= 0) {
                // 已存在
                let adGroups = _.clone(state.adGroups);
                let existed = adGroups[index];
                adGroups.splice(index, 1, _.assign({}, existed, action.data, {
                    _needSetSpots: (null == action.data._needSetSpots ? existed._needSetSpots : action.data._needSetSpots) || AdGroupValidator.checkNeedSetSpotsForAdGroup(existed, action.data),
                }));
                return _.assign({}, state, {
                    _dirty: true,
                    _needQuote: state._needQuote || AdGroupValidator.checkNeedQuoteForAdGroup(existed, action.data),
                    adGroups,
                });
            } else {
                // 新建
                return _.assign({}, state, {
                    _dirty: true,
                    _needQuote: true,
                    adGroups: _.concat(state.adGroups, _.defaults({_needSetSpots: true}, action.data)),
                });
            }
        }

        case ActionTypes.REMOVE_ADGROUP:
        {
            let index = _.findIndex(state.adGroups, a =>
                (a._id && a._id === action.data._id) || (a.adGroupId && a.adGroupId === action.data.adGroupId));
            if (index >= 0) {
                // 已存在
                let adGroups = _.clone(state.adGroups);
                adGroups.splice(index, 1)
                return _.assign({}, state, {
                    _dirty: true,
                    adGroups,
                });
            } else {
                return state;
            }
        }

        default:
            return state;
    }
}

/** 判断计划是否需要重新询量 */
function checkNeedQuoteForCampaign(state, changes) {
    let changed = (changes.advertiserId && changes.advertiserId !== state.advertiserId)
    || (changes.beginDate && !moment(changes.beginDate).isSame(state.beginDate))
    || (null != changes.maxImpressionInclude && changes.maxImpressionInclude !== state.maxImpressionInclude)
    || (changes.endDate && !moment(changes.endDate).isSame(state.endDate));
    return changed;
}


/** 编辑广告 */
function editAdGroup(state = null, action) {
    switch (action.type) {
        case ActionTypes.EDIT_ADGROUP.BEGIN:
            return _.defaults(action.data, {
                _id: _.uniqueId('_aid_'),
            });

        case ActionTypes.EDIT_ADGROUP.UPDATE:
            if (state) {
                return _.assign({}, state, action.data, {
                    _dirty: true,
                    //  _needSetSpots: (null == action.data._needSetSpots ? state._needSetSpots : action.data._needSetSpots) || checkNeedSetSpotsForAdGroup(state, action.data),
                });
            } else {
                return null;
            }

        case ActionTypes.EDIT_CAMPAIGN.UPDATE:
        {
            if (null == state) {
                return null;
            }
            let adGroups = action.data.adGroups;
            if (!adGroups) {
                return state;
            }
            let adGroup = _.find(adGroups, a => (a._id && a._id == state._id) || (a.adGroupId && a.adGroupId == state.adGroupId));
            if (adGroup) {
                return _.assign({}, state, adGroup, {
                    _dirty: true,
                });
            }
            return state;
        }
        case ActionTypes.EDIT_ADGROUP.COMMIT:
        case ActionTypes.EDIT_ADGROUP.CANCEL:
            return null;

        default:
            return state;
    }
}

/** 是否显示编辑广告对话框 */
function showAddAdGroupDialog(state = false, action) {
    switch (action.type) {
        //    case ActionTypes.EDIT_CAMPAIGN.BEGIN:
        //      return false;
        case ActionTypes.EDIT_ADGROUP.BEGIN:
            return true;
        case ActionTypes.EDIT_ADGROUP.COMMIT:
        case ActionTypes.EDIT_ADGROUP.CANCEL:
            return false;

        default:
            return state;
    }
}

/** 定向列表
{
  <advertiserId1>: { query, error, data: [ ... ] },
  <advertiserId2>: { ... }
}
*/
function targetingList(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_TARGETING_LIST.QUERY: {
            let advertiserId = action.params.advertiserId;
            return _.assign({}, state, _.set({}, advertiserId, { query: true, error: null }));
        }

        case ActionTypes.FETCH_TARGETING_LIST.SUCCESS: {
            let advertiserId = action.params.advertiserId;
            return _.assign({}, state, _.set({}, advertiserId, {query: false, error: null, data: action.data}));
        }

        case ActionTypes.FETCH_TARGETING_LIST.ERROR: {
            let advertiserId = action.params.advertiserId;
            return _.assign({}, state, _.set({}, advertiserId, {query: false, error: action.message}));
        }

        default:
            return state;
    }
}

/** 图片信息缓存
{
  <imgId1>: {query, error, mediaId: "imgId1", baseMediaUrl: "http://cdn/img1", ...},
  <imgId2>: {mediaId: "imgId2", baseMediaUrl: "http://cdn/img2", ...}
}
*/
function imageCache(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_IMAGE.QUERY: {
            let mediaId = action.params.imageId;
            return _.assign({}, state, _.set({}, mediaId, {query: true, error: null}));
        }

        case ActionTypes.FETCH_IMAGE.SUCCESS: {
            let mediaId = action.params.imageId;
            return _.assign({}, state, _.set({}, mediaId, action.data));
        }

        case ActionTypes.FETCH_IMAGE.ERROR: {
            let mediaId = action.params.imageId;
            return _.assign({}, state, _.set({}, mediaId, { query: false, error: action.message }));
        }

        default:
            return state;
    }
}

/** 视频信息缓存
{
  <videoId1>: {query, error, mediaId: "videoId1", baseMediaUrl: "http://cdn/video1", ...},
  <videoId2>: {mediaId: "videoId2", baseMediaUrl: "http://cdn/video2", ...}
}
*/
function videoCache(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_VIDEO.QUERY: {
            let mediaId = action.params.videoId;
            return _.assign({}, state, _.set({}, mediaId, { query: true, error: null }));
        }

        case ActionTypes.FETCH_VIDEO.SUCCESS: {
            let mediaId = action.params.videoId;
            return _.assign({}, state, _.set({}, mediaId, action.data));
        }

        case ActionTypes.FETCH_VIDEO.ERROR: {
            let mediaId = action.params.videoId;
            return _.assign({}, state, _.set({}, mediaId, {query: false, error: action.message}));
        }

        default:
            return state;
    }
}

/** 广告不保量记录
 {
   <adGroupId1>: { query, error, ...},
   <adGroupId2>: { ... },
 }
 */
function unQuatityGuaranteedRecords(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_ADGROUP_UNQUATITYGUARANTEED.QUERY:
        {
            let adGroupId = action.params.adGroupId;
            let record = state[adGroupId];
            if (record) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, record, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: true }));
            }
        }

        case ActionTypes.FETCH_ADGROUP_UNQUATITYGUARANTEED.SUCCESS:
        {
            if (action.data) {
                action.data.createdTime = new Date()
                return _.assign({}, state, _.set({}, action.params.adGroupId, action.data));
            }
            return state;
        }

        case ActionTypes.FETCH_ADGROUP_UNQUATITYGUARANTEED.ERROR:
        {
            let adGroupId = action.params.adGroupId;
            let record = state[adGroupId];
            if (record) {
                return _.assign({}, state, _.set({}, adGroupId, _.assign({}, record, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, adGroupId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

/** 动态创意推荐方法
 {
   <advertiserId1>: { query, error, records },
   <advertiserId2>: { ... },
 }
 */
function dynamicCreativeRecommendRecords(state = {}, action) {
    switch (action.type) {
        case ActionTypes.FETCH_DYNAMIC_CREATIVE_RECOMMEND_RECORDS.QUERY:
        {
            let advertiserId = action.params.advertiserId;
            let recommendRecords = state[advertiserId];
            if (recommendRecords) {
                return _.assign({}, state, _.set({}, advertiserId, _.assign({}, recommendRecords, { query: true })));
            } else {
                return _.assign({}, state, _.set({}, advertiserId, { query: true }));
            }
        }

        case ActionTypes.FETCH_DYNAMIC_CREATIVE_RECOMMEND_RECORDS.SUCCESS:
        {
            if (action.data) {
                return _.assign({}, state, _.set({}, action.params.advertiserId, {records: action.data}));
            }

            return state;
        }

        case ActionTypes.FETCH_DYNAMIC_CREATIVE_RECOMMEND_RECORDS.ERROR:
        {
            let advertiserId = action.params.advertiserId;
            let recommendRecords = state[advertiserId];
            if (recommendRecords) {
                return _.assign({}, state, _.set({}, advertiserId, _.assign({}, recommendRecords, { query: false, error: action.message })));
            } else {
                return _.assign({}, state, _.set({}, advertiserId, { query: false, error: action.message }));
            }
        }

        default:
            return state;
    }
}

export default {
    loginStatus,
    placementGroupTagTrees,
    industryList, // 行业列表
    isQuantityGuaranteed, // 是否有保量风险， adGroupId -> {query, error, hasQuantityGuaranteedRisk}
    channels, // 频道 map：版位标签 ID -》Map<Integer, List<AggregatedChannel>>
    channelNames, // 频道名称 map：版位标签 ID -》Map<Integer, String>
    placementGroups, // 版位 map
    placementGroupTags, // 版位标签 map
    products, // 商品详情
    userProfiles, // 用户
    advertisers, // 广告主
    grantedAdvertisers, // 授权广告主
    whitePrivilegeCodeList,//crm白名单权限
    campaigns, // 排期
    campaignList, // 排期列表
    campaignReports, // 排期进度报告
    adGroupWatchList, // 广告关注人列表
    campaignWatchList, // 计划关注人列表
    editCampaign, // 新增的计划
    editAdGroup, // 新增的广告
    showAddAdGroupDialog, // 是否显示添加广告的对话框
    targetingList, // 广告主的定向包列表
    adGroups, // 广告 {adGroupId: {...}}
    creatives, // 素材 {creativeId: {...}}
    logicPlacements, // 逻辑广告位 {logicPlacementId: {...}}
    templates, // 素材模板 {crtSize_productType_siteSet: {...}}
    adTargets, // 定向 {mid: {...}}
    defaultTargetInfo, // 默认支持的定向信息
    targetConfigs, // 定向可选项 map: name => {form_type: .., slot_name: .., slot_desc: ..., options: ...}
    imageCache, // 图片信息缓存： {id => {imageId: "id", baseImageUrl: "http://cdn/img", ...}}
    videoCache, // 视频信息缓存： {id => {mediaId: "id", baseMediaUrl: "http://cdn/video", ...}}
    refundRecords, // 退费记录： {adGroupId: {...}, ...}
    unQuatityGuaranteedRecords, // 广告不保量记录： {adGroupId: {...}, ...}
    dspList, // dsp列表
    dynamicCreativeRecommendRecords, // 动态创意推荐方法
    mediaContent,  //联盟媒体广告位

};
