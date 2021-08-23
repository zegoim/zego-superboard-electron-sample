/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-08-20 18:26:45
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
        // 更新页面弹框房间成员列表
        updateUserListDomHandle(userList);
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
    // 更新页面弹框房间成员列表
    updateUserListDomHandle(userList);
}

/**
 * @description: 登录房间
 * @param {*} token
 */
async function loginRoom(token) {
    try {
        // 注册房间成员变更回调
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
        // 添加自己到成员列表
        pushOwn();
        // 注册白板回调（room 内方法）
        onSuperBoardEventHandle();
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description: 校验输入参数 roomID、userName
 */
function checkInput() {
    var roomID = $('#roomID').val();
    var userName = $('#userName').val();
    if (!userName || !roomID) {
        alert('请输入用户名和房间 ID');
        return false;
    }
    return { roomID, userName };
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
    togglePageDomHandle(false);
    // 清除页面已挂载白板
    $('#main-whiteboard').html('');
    // 清空页面白板列表下拉框（room 内方法）
    updateWhiteboardListDomHandle([]);
    // 清空页面 excel sheet 列表下拉框（room 内方法）
    toggleSheetSelectDomHandle(false);
    // 显示页面白板占位（room 内方法）
    togglePlaceholderDomHandle(true);
    // 隐藏缩略图按钮（room 内方法）
    toggleThumbBtnDomHandle(false);
    // 清空缩略图列表（room 内方法）
    updateThumbListDomHandle([]);
}

// 绑定登录房间事件
$('#login-btn').click(async function() {
    var result = checkInput();
    if (!result) return;
    // 登录信息
    var settingData = layui.form.val('settingForm');
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
    // 更新 zegoConfig
    Object.assign(zegoConfig, loginInfo);
    // 初始化 SDK
    var token = await initZegoSDK();
    // 登录房间
    await loginRoom(token);
    // 存储 sessionStorage
    sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
    // 更新页面 url
    updateUrl('roomID', loginInfo.roomID, 'env', loginInfo.env);
    // 显示房间页
    togglePageDomHandle(true);
    updateRoomIDDomHandle();
    // 挂载当前激活白板（room 内方法）
    attachActiveView();
});

// 绑定退出房间事件
$('#logout-btn').click(logoutRoom);
