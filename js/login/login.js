/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-08-23 12:42:43
 * @LastEditors: Please set LastEditors
 * @Description: 房间登录、登出相关
 * @FilePath: /superboard/js/login/login.js
 */

var userList = []; // 房间内成员列表

/**
 * @description: 监听房间成员变更
 */
function onRoomUserUpdate() {
    zegoEngine.on('roomUserUpdate', function(roomID, type, list) {
        if (type == 'ADD') {
            list.forEach(function(v) {
                userList.push({
                    userID: v.userID,
                    userName: v.userName
                });
            });
        } else if (type == 'DELETE') {
            list.forEach(function(v) {
                var index = userList.findIndex(function(item) {
                    return v.userID == item.userID;
                });
                if (index != -1) {
                    userList.splice(index, 1);
                }
            });
        }
        // 更新房间页房间成员列表弹框
        loginUtils.updateUserListDomHandle(userList);
    });
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
        // 注册 监听房间成员变更
        onRoomUserUpdate();
        // 登录房间
        await zegoEngine.loginRoom(
            zegoConfig.roomID,
            token,
            {
                userID: zegoConfig.userID,
                userName: zegoConfig.userName
            },
            {
                maxMemberCount: 10,
                userUpdate: true
            }
        );
        // 登录成功后，添加自己到成员列表
        pushOwn();

        // 注册 Superboard 回调（room 内方法）
        onSuperBoardEventHandle();
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description: 校验输入参数 roomID、userName
 * @returns {Object|Boolean} 校验通过返回 { roomID: string; userName: string }，不通过返回 false
 */
function checkInput() {
    var roomID = $('#roomID').val();
    var userName = $('#userName').val();
    if (!userName || !roomID) {
        alert('请输入用户名和房间 ID');
        return false;
    }
    return {
        roomID,
        userName
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
    updateWhiteboardListDomHandle([]);
    // 清空页面 excel sheet 列表下拉框（room 内方法）
    toggleSheetSelectDomHandle(false);
    // 显示页面 SuperboardSubView 占位（room 内方法）
    togglePlaceholderDomHandle(true);
    // 隐藏缩略图按钮（room 内方法）
    toggleThumbBtnDomHandle(false);
    // 清空缩略图列表（room 内方法）
    updateThumbListDomHandle([]);
}

// 绑定登录房间事件
$('#login-btn').click(async function() {
    // 校验输入参数 roomID、userName
    var result = checkInput();
    if (!result) return;
    // 获取页面上设置的配置信息，这里使用的是 layui，返回值如下，开发者可根据实际情况获取
    // {
    //     dynamicPPT_AutomaticPage: "true",
    //     dynamicPPT_HD: "false",
    //     fontFamily: "system",
    //     pptStepMode: "1",
    //     superBoardEnv: "test",
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
        userID: zegoConfig.userID,
        superBoardEnv: settingData.superBoardEnv,
        fontFamily: settingData.fontFamily,
        thumbnailMode: settingData.thumbnailMode,
        pptStepMode: settingData.pptStepMode,
        dynamicPPT_HD: settingData.dynamicPPT_HD,
        dynamicPPT_AutomaticPage: settingData.dynamicPPT_AutomaticPage,
        unloadVideoSrc: settingData.unloadVideoSrc
    };
    // 更新本地 zegoConfig
    Object.assign(zegoConfig, loginInfo);
    try {
        // 初始化 SDK
        var token = await initZegoSDK();
        // 登录房间
        await loginRoom(token);
        // 存储 sessionStorage
        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        // 更新页面 url
        loginUtils.updateUrl('roomID', loginInfo.roomID, 'env', loginInfo.env);
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
