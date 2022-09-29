/*
 * @Author: ZegoDev
 * @Date: 2021-08-18 17:53:39
 * @LastEditTime: 2021-08-23 12:27:40
 * @LastEditors: Please set LastEditors
 * @Description: Related methods and related tool methods for updating DOM on the login page
 * @FilePath: /superboard/js/login/utils.js
 */

// new VConsole()

var loginUtils = {
    /**
     * @description: Display or hide the login page and room page.
     * @param {Boolean} type true: display; false: hide.
     */
    togglePageDomHandle: function (type) {
        if (type) {
            // Display the room page.
            $('#room-page').addClass('active');
            $('#login-page').removeClass('active');
        } else {
            // Display the login page.
            $('#room-page').removeClass('active');
            $('#login-page').addClass('active');
        }
    },

    /**
     * @description: Update the room ID on the page.
     * @param {String} roomID Room ID
     */
    updateRoomIDDomHandle: function (roomID) {
        // Login page input box.
        $('#roomID').val(roomID);
        // Room ID in the top right corner of the room page.
        $('#showRoomID').html(roomID);
    },

    /**
     * @description: Update the selection for the access environment on the page.
     * @param {Number|String} env Access environment 1: China 2: Outside China
     */
    updateEnvDomHandle: function (env) {
        $('.radio-inline:nth-of-type(' + env + ') .inlineRadio').attr('checked', true);
        $('.radio-inline:nth-of-type(' + (env == 1 ? 2 : 1) + ') .inlineRadio').attr('checked', false);
    },

    /**
     * @description: Update the room member list dialog on the room page.
     * @description: The list displays the user name and user ID.
     * @param {Array} userList [{userName: string; userID: string}]
     */
    updateUserListDomHandle: function (userList) {
        $('#memberNum').html(userList.length);
        $('#subMemberNum').html(userList.length);
        $('#user-list').html('');
        var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
        var $str = '';
        userList.forEach(function (element) {
            $str += '<li class="user-item">' + element.userName + ' (' + element.userID + (loginInfo.userID === element.userID?'_自己':'')+')' + '</li>';
        });
        $('#user-list').html($str);
    },

    getToken: function (expire_time) {
        var appId = 0;
        switch (zegoConfig.superBoardEnv) {
            case 'prod':
                appId = zegoConfig.env == 1 ? zegoConfig.appID :zegoConfig.overseaAppID
                break;
            case 'beta':
                appId = zegoConfig.betaAppID
                break;
            case 'alpha':
                appId = zegoConfig.alphaAppID
                break;
            default:
                break;
        }

        return new Promise(function (resolve) {
            $.get(
                'https://wsliveroom-alpha.zego.im:8282/token',
                {
                    app_id: appId,
                    id_name: zegoConfig.userID
                },
                function(token) {
                    if (token) {
                        resolve(token);
                    }
                },
                'text'
            );
        });
    },

    /**
     * @description: Obtain values of specified parameters in the URL.
     * @param {String} variable Target parameter
     * @returns {String|Boolean} false is returned if no data is found.
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
     * @description: Obtain the current roomID.
     * @description: roomID is determined by roomID in the URL, roomID in the page input box, and roomID in sessionStorage.loginInfo.
     * @returns {String}
     */
    getRoomID: function () {
        // Obtain roomID in the URL. The invitation link will carry roomID. If it exists, the value in the URL prevails.
        var roomID = loginUtils.getQueryVariable('roomID') || '';
        // Obtain the loginInfo of the logged-in user.
        var loginInfo = sessionStorage.getItem('loginInfo');
        if (loginInfo) {
            loginInfo = JSON.parse(loginInfo);
            if (loginInfo.roomID) {
                // Logged in
                if (!roomID) {
                    // loginInfo prevails.
                    roomID = loginInfo.roomID;
                } else {
                    // Update roomID in the loginInfo.
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
     * @description: Obtain the current access environment.
     * @description: env is determined by env in the URL, env in the page input box, env in sessionStorage.loginInfo, and the default value.
     * @returns {String} '1': China '2': Outside China
     */
    getEnv: function () {
        // Obtain env in the URL. The invitation link will carry env.
        var env = loginUtils.getQueryVariable('env') || '';

        // Obtain the loginInfo of the logged-in user.
        var loginInfo = sessionStorage.getItem('loginInfo');
        if (loginInfo) {
            loginInfo = JSON.parse(loginInfo);
            if (loginInfo.roomID) {
                // Logged in
                if (!env) {
                    // loginInfo prevails.
                    env = loginInfo.env;
                } else {
                    // Update env in the loginInfo.
                    sessionStorage.setItem('loginInfo', JSON.stringify({
                        ...loginInfo,
                        env
                    }));
                }
            }
        }
        // Add a default value.
        return env || '1';
    },

    /**
     * @description: Generate and obtain the userID.
     * @description: Generated userID will be stored in sessionStorage. If it is not cleared, the userID is always used.
     * @returns {String} Newly generated or existing userID.
     */
    getUserID: function () {
        var userID = loginUtils.getQueryVariable('userID') || '';
        // Obtain the userID of the logged-in user.
        var loginInfo = sessionStorage.getItem('loginInfo');
        // var userID;
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
     * @description: Update the page URL.
     * @param {String} key1 Field name 1
     * @param {String|Number} value1 Field value 1
     * @param {String} key2 Field name 2
     * @param {String|Number} value2 Field value 2
     */
    updateUrl: function (key1, value1, key2, value2) {
        var url = window.location.href;
        var newUrl1 = loginUtils.updateQueryStringParameter(url, key1, value1);
        var newUrl2 = loginUtils.updateQueryStringParameter(newUrl1, key2, value2);
        // Add parameters to the current URL. The page is not updated if no historical records exist.
        window.history.replaceState({
            path: newUrl2
        }, '', newUrl2);
    },

    /**
     * @description: Update a single parameter in the page URL.
     * @param {String} url URL
     * @param {String} key Field name
     * @param {String|Number} value Field value
     * @returns {String} URL after update is completed.
     */
    updateQueryStringParameter: function (url, key, value) {
        if (!value) return url;

        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        if (url.match(re)) {
            // Replace
            return url.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            // Added parameters
            return url + separator + key + '=' + value;
        }
    }
};