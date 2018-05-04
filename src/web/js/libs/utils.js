var Utils = {
    /**
     * 从包名中获取组件名称
     * 
     * @param {any} packageName 
     * @returns 
     */
    getComponentName(packageName) {
        var componentName = packageName;
        var packageNameSpaces = packageName.split('/');

        if(packageNameSpaces.length > 1) {
            componentName = packageNameSpaces[packageNameSpaces.length - 1];
        }
        return componentName;
    },

    /**
     * 从Url中获取参数
     * 
     * @param {any} componentInfo
     * @returns 
     */
    getUrlParams(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null || ''; 
    }
}