/*
 * @Author: ZegoDev
 * @Date: 2021-08-18 17:53:39
 * @LastEditTime: 2021-08-23 12:27:40
 * @LastEditors: Please set LastEditors
 * @Description: 登录页更新 DOM 的相关方法、相关工具方法
 * @FilePath: /superboard/js/login/utils.js
 */

var loginUtils = {
    /**
     * @description: 显示、隐藏登录页、房间页
     * @param {Boolean} type true: 显示 false: 隐藏
     */
    togglePageDomHandle: function (type) {
        if (type) {
            // 显示房间页
            $('#room-page').addClass('active');
            $('#login-page').removeClass('active');
        } else {
            // 显示登录页
            $('#room-page').removeClass('active');
            $('#login-page').addClass('active');
        }
    },

    /**
     * @description: 更新页面房间号
     * @param {String} roomID 房间 ID
     */
    updateRoomIDDomHandle: function (roomID) {
        // 登录页输入框
        $('#roomID').val(roomID);
        // 房间页左上角房间号
        $('#showRoomID').html(roomID);
    },

    /**
     * @description: 更新页面接入环境勾选
     * @param {Number|String} env 接入环境 1: 国内 2: 海外
     */
    updateEnvDomHandle: function (env) {
        $('.radio-inline:nth-of-type(' + env + ') .inlineRadio').attr('checked', true);
        $('.radio-inline:nth-of-type(' + (env == 1 ? 2 : 1) + ') .inlineRadio').attr('checked', false);
    },

    /**
     * @description: 更新房间页房间成员列表弹框
     * @description: 列表中显示用户名称、用户 ID
     * @param {Array} userList [{userName: string; userID: string}]
     */
    updateUserListDomHandle: function (userList) {
        $('#memberNum').html(userList.length);
        $('#subMemberNum').html(userList.length);
        $('#user-list').html('');
        var $str = '';
        userList.forEach(function (element) {
            $str += '<li class="user-item">' + element.userName + ' (' + element.userID + ')' + '</li>';
        });
        $('#user-list').html($str);
    },

    /**
     * @description: 这里仅演示获取 token 的示例代码
     * @param {Number} appID appID
     * @param {String} userID userID
     * @param {String} tokenUrl 获取 token 的 URL
     * @return {Promise} Promise<token: string>
     */
    // getToken: function(appID, userID, tokenUrl) {
    //     return new Promise(function(resolve) {
    //         $.get(
    //             tokenUrl,
    //             {
    //                 app_id: appID,
    //                 id_name: userID
    //             },
    //             function(token) {
    //                 if (token) {
    //                     resolve(token);
    //                 }
    //             },
    //             'text'
    //         );
    //     });
    // },

    getToken: function (appId, idName, roomId, tokenUrl) {
        return new Promise(function (resolve) {
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: "json",
                url: tokenUrl,
                data: JSON.stringify({
                    version: "04",
                    appId,
                    idName,
                    roomId,
                    privilege: {
                        "1": 1,
                        "2": 1
                    },
                    expire_time: 300
                }),
                success: function (data) {
                    if (data.data.token) {
                        resolve(data.data.token);
                    }
                }
            });
        });
    },

    /**
     * @description: 获取 URL 中指定参数的值
     * @param {String} variable 目标参数
     * @returns {String|Boolean} 没有查询到则返回 false
     */
    getQueryVariable: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0].toLowerCase() == variable.toLowerCase()) {
                return pair[1];
            }
        }
        return false;
    },

    /**
     * @description: 获取当前 roomID
     * @description: 这里 roomID 由 URL 中的 roomID、页面输入框中的 roomID、sessionStorage.loginInfo 中的 roomID 最终决定
     * @returns {String}
     */
    getRoomID: function () {
        // 获取 URL 中 roomID，邀请链接中会携带 roomID，若存在以 URL 中的值为准
        var roomID = loginUtils.getQueryVariable('roomID') || '';
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
                    sessionStorage.setItem('loginInfo', JSON.stringify({
                        ...loginInfo,
                        roomID
                    }));
                }
            }
        }

        return roomID;
    },

    /**
     * @description: 获取当前接入环境
     * @description: 这里 env 由 URL 中的 env、页面输入框中的 env、sessionStorage.loginInfo 中的 env、默认值最终决定
     * @returns {String} '1': 国内 '2': 海外
     */
    getEnv: function () {
        // 获取 URL 中 env，邀请链接中会携带 env
        var env = loginUtils.getQueryVariable('env') || '';

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
                    sessionStorage.setItem('loginInfo', JSON.stringify({
                        ...loginInfo,
                        env
                    }));
                }
            }
        }
        // 增加一个默认值
        return env || '1';
    },

    /**
     * @description: 生成、获取 userID
     * @description: 生成过的 userID 会存储在 sessionStorage 中，没有清除的情况下会一直使用该 userID
     * @returns {String} 新生成或者原来的 userID
     */
    getUserID: function () {
        // 获取已登录的 userID
        var loginInfo = sessionStorage.getItem('loginInfo');
        var userID;
        if (loginInfo) {
            userID = JSON.parse(loginInfo).userID;
        } else {
            userID = 'web' + new Date().getTime();
            sessionStorage.setItem('loginInfo', JSON.stringify({
                userID
            }));
        }
        return userID;
    },

    /**
     * @description: 更新页面 URL
     * @param {String} key1 字段名称1
     * @param {String|Number} value1 字段值1
     * @param {String} key2 字段名称2
     * @param {String|Number} value2 字段值2
     */
    updateUrl: function (key1, value1, key2, value2) {
        var url = window.location.href;
        var newUrl1 = loginUtils.updateQueryStringParameter(url, key1, value1);
        var newUrl2 = loginUtils.updateQueryStringParameter(newUrl1, key2, value2);
        // 向当前 URL 添加参数，没有历史记录，不刷新页面
        window.history.replaceState({
            path: newUrl2
        }, '', newUrl2);
    },

    /**
     * @description: 更新页面 URL 中单个参数
     * @param {String} url URL
     * @param {String} key 字段名称
     * @param {String|Number} value 字段值
     * @returns {String} 更新完成后的 URL
     */
    updateQueryStringParameter: function (url, key, value) {
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
};