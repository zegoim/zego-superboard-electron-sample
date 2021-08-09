/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-08-09 15:53:01
 * @LastEditors: Please set LastEditors
 * @Description: 房间相关
 * @FilePath: /superboard_demo_web/js/room.js
 */

/**
 * @description: 初始化 SDK
 * @param {*} token
 * @return {*}
 */
function initSDK(token) {
    // 初始化 Express SDK
    var appID = zegoConfig.appID;
    var server = zegoConfig.server;
    var isTestEnv = zegoConfig.superBoardEnv === 'test';

    if (zegoConfig.env === '2') {
        // 海外环境
        appID = zegoConfig.overseaAppID;
        server = zegoConfig.overseaServer;
    }
    zegoEngine = new ZegoExpressEngine(appID, server);

    // 初始化合并层 SDK
    zegoSuperBoard = ZegoSuperBoardManager.getInstance();
    zegoSuperBoard.init(zegoEngine, {
        parentDomID,
        appID,
        token,
        isTestEnv
    });

    initExpressSDKConfig();
    initSuperBoardSDKConfig();
}

/**
 * @description: 根据配置初始化 Express SDK
 * @param {*}
 * @return {*}
 */
function initExpressSDKConfig() {
    // 设置日志级别
    zegoEngine.setLogConfig({ logLevel: 'disable' });
    // 关闭 debug
    zegoEngine.setDebugVerbose(false);

    // 注册房间成员变更回调
    onRoomUserUpdate();
}

/**
 * @description: 根据配置初始化 SuperBoard SDK
 * @param {*}
 * @return {*}
 */
function initSuperBoardSDKConfig() {
    // 设置字体
    if (zegoConfig.fontFamily === 'ZgFont') {
        // 设置白板、文件挂载容器内的字体
        document.getElementById(parentDomID).style.fontFamily = zegoConfig.fontFamily;
    }
    // 设置动态 PPT 步数切页模式
    zegoSuperBoard.setCustomizedConfig('pptStepMode', zegoConfig.pptStepMode);
    // 设置缩略图清晰度模式
    zegoSuperBoard.setCustomizedConfig('thumbnailMode', zegoConfig.thumbnailMode);

    // 设置 PPT 转码清晰度
    zegoSuperBoard.setCustomizedConfig('dynamicPPT_HD', $('#dynamicPPT_HD').val());
    // 设置 PPT 自动翻页
    zegoSuperBoard.setCustomizedConfig('dynamicPPT_AutomaticPage', $('#dynamicPPT_AutomaticPage').val());
    // 设置 PPT 视频下载
    zegoSuperBoard.setCustomizedConfig('unloadVideoSrc', $('#unloadVideoSrc').val());

    // 注册白板回调
    onSuperBoardEventHandle();

    // 注册其他回调
    onDocumentEventHandle();
}

/**
 * @description: 监听房间成员变更
 * @param {*}
 * @return {*}
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
        updateUserListDomHandle();
    });
}

/**
 * @description: 登录房间
 * @param {*}
 * @return {*}
 */
function loginRoom() {
    return new Promise(async function(resolve, reject) {
        // 获取 token
        var appID = zegoConfig.env === '1' ? zegoConfig.appID : zegoConfig.overseaAppID;
        var token = await getToken(appID, zegoConfig.userID, zegoConfig.tokenUrl);

        // 初始化 SDK
        initSDK(token);

        // 登录房间
        try {
            await zegoSuperBoard.loginRoom(
                zegoConfig.roomID,
                token,
                {
                    userID: zegoConfig.userID,
                    userName: zegoConfig.username
                },
                {
                    maxMemberCount: 10,
                    userUpdate: true
                }
            );

            console.warn('SuperBoard Demo 登录成功');

            // 添加自己到成员列表
            userList.unshift({
                userID: zegoConfig.userID,
                userName: zegoConfig.userName
            });
            // 更新成员列表
            updateUserListDomHandle();

            resolve();
        } catch (error) {
            reject();
        }
    });
}

/**
 * @description: 退出房间
 * @param {*}
 * @return {*}
 */
function logoutRoom() {
    // 退出房间
    zegoEngine.logoutRoom(zegoConfig.roomID);
    // 清除 sessionStorage
    sessionStorage.removeItem('loginInfo');

    // 清空成员列表
    userList = [];

    togglePageDomHandle(2);
}

// 绑定登录房间事件
$('#login-btn').click(async function() {
    // 校验 roomID、userName
    var roomID = $('#roomID').val();
    var userName = $('#userName').val();
    if (!userName || !roomID) {
        alert('请输入用户名和房间 ID');
        return;
    }

    // 登录信息
    var loginInfo = {
        env: $('.inlineRadio:checked').val(),
        roomID,
        userName,
        userID: zegoConfig.userID,
        superBoardEnv: $('#superBoardEnv select').val(),
        fontFamily: $('#fontFamily select').val(),
        thumbnailMode: $('#thumbnailMode select').val(),
        pptStepMode: $('#pptStepMode select').val(),
        dynamicPPT_HD: $('#dynamicPPT_HD select').val(),
        dynamicPPT_AutomaticPage: $('#dynamicPPT_AutomaticPage select').val(),
        unloadVideoSrc: $('#unloadVideoSrc select').val()
    };

    // 更新 zegoConfig
    Object.assign(zegoConfig, loginInfo);

    await loginRoom();
    sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));

    // 显示房间页
    $('#room-page').css('display', 'flex');
    $('#login-page').css('display', 'none');

    // 更新房间号
    $('#showRoomID').html(zegoConfig.roomID);
});

// 绑定退出房间事件
$('#logout-btn').click(function() {
    logoutRoom();
});
