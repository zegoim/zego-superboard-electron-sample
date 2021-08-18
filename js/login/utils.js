/*
 * @Author: ZegoDev
 * @Date: 2021-08-18 17:53:39
 * @LastEditTime: 2021-08-18 18:06:30
 * @LastEditors: Please set LastEditors
 * @Description: 登录页更新 DOM 的相关方法、相关工具方法
 * @FilePath: /superboard/js/login/dom.js
 */

/**
 * @description: 显示、隐藏登录页、房间页
 * @param {*} type true: 显示 false: 隐藏
 * @return {*}
 */
function togglePageDomHandle(type) {
    if (type) {
        // 显示房间页
        $('#room-page').addClass('active');
        $('#login-page').removeClass('active');
    } else {
        // 显示登录页
        $('#room-page').removeClass('active');
        $('#login-page').addClass('active');
    }
}

/**
 * @description: 更新页面房间号
 */
function updateRoomIDDomHandle() {
    // 登录页输入框
    $('#roomID').val(zegoConfig.roomID);
    // 房间页左上角房间号
    $('#showRoomID').html(zegoConfig.roomID);
}

/**
 * @description: 更新页面接入环境勾选
 */
function updateEnvDomHandle() {
    $('.radio-inline:nth-of-type(' + zegoConfig.env + ') .inlineRadio').attr('checked', true);
    $('.radio-inline:nth-of-type(' + (zegoConfig.env == 1 ? 2 : 1) + ') .inlineRadio').attr('checked', false);
}

/**
 * @description: 更新页面弹框房间成员列表
 * @param {*} userList
 */
function updateUserListDomHandle(userList) {
    $('#memberNum').html(userList.length);
    $('#subMemberNum').html(userList.length);
    $('#user-list').html('');
    var $str = '';
    userList.forEach(function(element) {
        $str += '<li class="user-item">' + element.userName + ' (' + element.userID + ')' + '</li>';
    });
    $('#user-list').html($str);
}

/**
 * @description: 这里仅演示获取 token 的示例代码
 * @param {*} appID
 * @param {*} userID
 * @param {*} tokenUrl
 * @return {*} Promise
 */
function getToken(appID, userID, tokenUrl) {
    return new Promise(function(resolve) {
        $.get(
            tokenUrl,
            {
                app_id: appID,
                id_name: userID
            },
            function(token) {
                if (token) {
                    resolve(token);
                }
            },
            'text'
        );
    });
}

/**
 * @description: 获取 url 中指定参数值
 * @param {*} variable
 * @return {*}
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            return pair[1];
        }
    }
    return false;
}

/**
 * @description: 获取 roomID
 */
function getRoomID() {
    // 获取 url 中 roomID，邀请链接中会携带 roomID，若存在以 url 中的值为准
    var roomID = getQueryVariable('roomID') || '';
    // 获取已登录的 loginInfo
    var loginInfo = sessionStorage.getItem('loginInfo');
    if (loginInfo) {
        loginInfo = JSON.parse(loginInfo);
        if (loginInfo.roomID) {
            // 已登录过
            if (!roomID) {
                // 以 loginInfo 中为准
                roomID = loginInfo.roomID;
            } else {
                // 更新 loginInfo 中 roomID
                sessionStorage.setItem('loginInfo', JSON.stringify({ ...loginInfo, roomID }));
            }
        }
    }

    return roomID;
}

/**
 * @description: 获取接入环境
 */
function getEnv() {
    // 获取 url 中 env，邀请链接中会携带 env
    var env = getQueryVariable('env') || '';

    // 获取已登录的 loginInfo
    var loginInfo = sessionStorage.getItem('loginInfo');
    if (loginInfo) {
        loginInfo = JSON.parse(loginInfo);
        if (loginInfo.roomID) {
            // 已登录过
            if (!env) {
                // 以 loginInfo 中为准
                env = loginInfo.env;
            } else {
                // 更新 loginInfo 中 env
                sessionStorage.setItem('loginInfo', JSON.stringify({ ...loginInfo, env }));
            }
        }
    }
    // 增加一个默认值
    return env || '1';
}

/**
 * @description: 生成 userID
 */
function getUserID() {
    // 获取已登录的 userID
    var loginInfo = sessionStorage.getItem('loginInfo');
    var userID;
    if (loginInfo) {
        userID = JSON.parse(loginInfo).userID;
    } else {
        userID = 'web' + new Date().getTime();
        sessionStorage.setItem('loginInfo', JSON.stringify({ userID }));
    }
    return userID;
}

/**
 * @description: 更新页面 URL
 * @param {*} key1 字段名称1
 * @param {*} value1 字段值1
 * @param {*} key2 字段名称2
 * @param {*} value2 字段值2
 */
function updateUrl(key1, value1, key2, value2) {
    var url = window.location.href;
    var newUrl1 = updateQueryStringParameter(url, key1, value1);
    var newUrl2 = updateQueryStringParameter(newUrl1, key2, value2);
    // 向当前 url 添加参数，没有历史记录，不刷新页面
    window.history.replaceState({ path: newUrl2 }, '', newUrl2);
}

/**
 * @description: 更新页面 URL 中单个参数
 * @param {*} url url
 * @param {*} key 字段名称
 * @param {*} value 字段值
 */
function updateQueryStringParameter(url, key, value) {
    if (!value) return url;

    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    if (url.match(re)) {
        // 替换
        return url.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        // 追加参数
        return url + separator + key + '=' + value;
    }
}
