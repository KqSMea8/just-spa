/**
 * 从页面URL中获取参数
 * 
 * @param {any} key 参数名称
 * @param {string} search 可传入url解析
 * @returns 
 */
export const getUrlParams = (key, search) => {
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    let r = (search || window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null || '';
}
