/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-09-10 11:07:07
 * @LastEditors: Please set LastEditors
 * @Description: 房间登录、登出相关
 * @FilePath: /superboard/js/login/login.js
 */

var userList = []; // 房间内成员列表

/**
 * @description: 监听 zegoEngine
 */
function onZegoEngineEvent() {
    zegoEngine.on('roomUserUpdate', function (roomID, type, list) {
        try {
            if (type == 'ADD') {
                list.forEach(function (v) {
                    userList.push({
                        userID: v.userID,
                        userName: v.userName
                    });
                });
            } else if (type == 'DELETE') {
                list.forEach(function (v) {
                    var index = userList.findIndex(function (item) {
                        return v.userID == item.userID;
                    });
                    if (index != -1) {
                        userList.splice(index, 1);
                    }
                });
            }
            // 更新房间页房间成员列表弹框
            loginUtils.updateUserListDomHandle(userList);
        } catch (error) {
            console.error('roomUserUpdate', error)
        }
    });

    zegoEngine.on('tokenWillExpire', async function (roomID) {
        var time = 36000
        var newtoken = await loginUtils.getToken(time)
        zegoEngine.renewToken(newtoken)
        zegoSuperBoard.renewToken(newtoken)
        var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        loginInfo.token = newtoken
        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))

    })

    zegoEngine.on('roomStateUpdate', function (roomID, state, errorCode, extendedData) {
        console.warn('roomID,state,errorCode,extendedData', roomID, state, errorCode, extendedData)
    })
}

/**
 * @description: 登录成功后，添加自己到成员列表
 */
function pushOwn() {
    userList.unshift({
        userID: zegoConfig.userID,
        userName: zegoConfig.userName
    });
    // 更新房间页房间成员列表弹框
    loginUtils.updateUserListDomHandle(userList);
}

/**
 * @description: 登录房间
 * @param {String} token
 */
async function loginRoom(token) {
    try {
        // 注册 监听
        onZegoEngineEvent();
        // 登录房间
        const res = await zegoEngine.loginRoom(
            zegoConfig.roomID,
            token, {
                userID: zegoConfig.userID,
                userName: zegoConfig.userName
            }, {
                maxMemberCount: 10,
                userUpdate: true
            }
        );
        if (res) {
            // 登录成功后，添加自己到成员列表
            pushOwn();
            // 注册 Superboard 回调（room 内方法）
            onSuperBoardEventHandle();
        } else {
            console.error('登录失败', res)
        }
    } catch (error) {
        console.error('登录失败', error)
    }
}

/**
 * @description: 校验输入参数 roomID、userName
 * @returns {Object|Boolean} 校验通过返回 { roomID: string; userName: string }，不通过返回 false
 */
function checkInput() {
    var roomID = $('#roomID').val();
    var userName = $('#userName').val();
    var userID = $('#userID').val()
    var token = $('#token').val()
    var time = !!$('#time').val() ? Number($('#time').val()) : 60
    if (!userName || !roomID || !userID) {
        alert('请输入用户名、房间 ID 和 userID！');
        return false;
    }
    return {
        roomID,
        userName,
        userID,
        token,
        time
    };
}

/**
 * @description: 退出房间
 */
function logoutRoom() {
    // 退出房间
    zegoEngine.logoutRoom(zegoConfig.roomID);
    // 清除 sessionStorage
    sessionStorage.removeItem('loginInfo');
    // 清空成员列表
    userList = [];
    // 显示登录页
    loginUtils.togglePageDomHandle(false);
    // 清除页面已挂载 SuperboardSubView
    $('#main-whiteboard').html('');
    // 清空页面 SuperboardSubView 列表下拉框（room 内方法）
    roomUtils.updateWhiteboardListDomHandle([]);
    // 清空页面 excel sheet 列表下拉框（room 内方法）
    roomUtils.toggleSheetSelectDomHandle(false);
    // 显示页面 SuperboardSubView 占位（room 内方法）
    roomUtils.togglePlaceholderDomHandle(true);
    // 隐藏缩略图按钮（room 内方法）
    roomUtils.toggleThumbBtnDomHandle(false);
    // 清空缩略图列表（room 内方法）
    flipToPageUtils.updateThumbListDomHandle([]);
}

// 绑定登录房间事件
$('#login-btn').click(async function () {
    // 校验输入参数 roomID、userName、userID
    var result = checkInput();
    if (!result) return;
    // 获取页面上设置的配置信息，这里使用的是 layui，返回值如下，开发者可根据实际情况获取
    // {
    //     dynamicPPT_AutomaticPage: "true",
    //     dynamicPPT_HD: "false",
    //     fontFamily: "system",
    //     pptStepMode: "1",
    //     superBoardEnv: "test",
    //     disableH5ImageDrag: "false",
    //     thumbnailMode: "1",
    //     unloadVideoSrc: "false",
    // }
    var settingData = layui.form.val('settingForm');
    // 获取当前勾选的接入环境
    var env = $('.inlineRadio:checked').val();
    var loginInfo = {
        env,
        roomID: result.roomID,
        userName: result.userName,
        userID: result.userID,
        time: result.time,
        superBoardEnv: settingData.superBoardEnv,
        fontFamily: settingData.fontFamily,
        disableH5ImageDrag: settingData.disableH5ImageDrag,
        thumbnailMode: settingData.thumbnailMode,
        pptStepMode: settingData.pptStepMode,
        dynamicPPT_HD: settingData.dynamicPPT_HD,
        dynamicPPT_AutomaticPage: settingData.dynamicPPT_AutomaticPage,
        unloadVideoSrc: settingData.unloadVideoSrc,
        ventor_img_type: settingData.ventor_img_type,
    };
    // 更新本地 zegoConfig
    Object.assign(zegoConfig, loginInfo);
    console.warn('result', result)
    try {
        // 初始化 SDK
        var token = await initZegoSDK(zegoConfig.time);
        console.warn('token', token)
        // 登录房间
        await loginRoom(token);
        // 存储 sessionStorage
        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        // 更新页面 url
        loginUtils.updateUrl('roomID', loginInfo.roomID, 'env', loginInfo.env), 'userID', loginInfo.userID;
        // 显示房间页
        loginUtils.togglePageDomHandle(true);
        // 更新页面房间号
        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);

        // 挂载当前激活 SuperboardSubView（room 内方法）
        attachActiveView();
    } catch (error) {
        console.error(error);
    }
});

// 绑定退出房间事件
$('#logout-btn').click(logoutRoom);