/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:58:21
 * @LastEditTime: 2021-09-10 11:05:26
 * @LastEditors: Please set LastEditors
 * @Description: 初始化相关
 * @FilePath: /superboard/js/login/init.js
 */

// 环境相关配置
var zegoEnvConfig = {
    env: loginUtils.getEnv(), // 1 国内 2 海外
    superBoardEnv: 'prod', // 合并层 SDK 环境
    appID: 3606078772, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
    serverProd: 'wss://webliveroom3606078772-api.zego.im/ws', // 国内正式环境 `wss://webliveroom${appID}-api.zego.im/ws`
    overseaAppID: 1068511430, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
    betaAppID: 1100697004, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
    betaServer: 'wss://webliveroom1100697004-api.zego.im/ws', // 国内测试环境
    overseaServer: 'wss://webliveroom-hk-test.zegocloud.com/ws', // 海外测试环境
    overseaServerProd: 'wss://webliveroom1068511430-api.zegocloud.com/ws', // 海外正式环境 `wss://webliveroom${overseaAppID}-api.zegocloud.com/ws`
    alphaAppID: 1803117167, // alpha
    alphaServer: 'wss://webliveroom1803117167-api.zego.im/ws' // alpha
    // 统一接入
    // alphaAppID: 3104114736,
    // alphaServer: 'wss://webliveroom-alpha.zego.im/ws'
};

// SDK 功能配置
var zegoFeatureConfig = {
    fontFamily: 'system', // Superboard SDK 字体
    disableH5ImageDrag: 'false', // 图片是否禁用拖拽 true: 禁用 false: 正常
    thumbnailMode: '1', // 缩略图清晰度 1: 普通 2: 标清 3: 高清
    pptStepMode: '1', // PPT 切页模式 1: 正常 2: 不跳转
    dynamicPPT_HD: 'false', // false: 正常 true: 高清
    dynamicPPT_AutomaticPage: 'true', // true: 自动翻页 false: 禁止
    unloadVideoSrc: 'false' // false: 正常 true: 禁止
};

// SDK 其他配置
var zegoOtherConfig = {
    // 获取登录房间 token，开发者自行在后台实现改接口；测试环境可以使用 ZEGO 提供的接口获取（参考 https://doc-zh.zego.im/article/7638#3_3）
    // tokenUrl: 'https://wsliveroom-alpha.zego.im:8282/token',
    tokenUrl: 'https://sig-liveroom-admin.zego.cloud/thirdToken/get',
    roomID: loginUtils.getRoomID(), // 房间 ID
    userID: loginUtils.getUserID(), // 用户 ID
    userName: '' // 用户名称
};

// 配置集合
var zegoConfig = {
    ...zegoEnvConfig,
    ...zegoFeatureConfig,
    ...zegoOtherConfig
};

var parentDomID = 'main-whiteboard'; // SupboardView 挂载的父容器
var zegoEngine; // Express SDK 实例
var zegoSuperBoard; // 合并层 SDK 实例

/**
 * @description: 校验配置 appID、tokenUrl
 */
function checkConfig() {
    if (!zegoConfig.appID || !zegoConfig.tokenUrl) {
        alert('请填写 appID 和 tokenUrl');
        return false;
    }
    return true;
}

/**
 * @description: 根据配置初始化 SDK
 * @return {String} token
 */
async function initZegoSDK() {
    var appID = zegoConfig.appID;
    var userID = zegoConfig.userID;
    var isTestEnv = zegoConfig.superBoardEnv === 'beta';
    var server = isTestEnv ? zegoConfig.server : zegoConfig.serverProd;

    if (zegoConfig.env === '2') {
        // 海外环境
        appID = zegoConfig.overseaAppID;
        server = isTestEnv ? zegoConfig.overseaServer : zegoConfig.overseaServerProd;
    }

    if (zegoConfig.superBoardEnv === 'beta') {
        appID = zegoConfig.betaAppID;
        server = zegoConfig.betaServer;
    }

    if (zegoConfig.superBoardEnv === 'alpha') {
        appID = zegoConfig.alphaAppID;
        server = zegoConfig.alphaServer;
    }
    console.warn('====superboard demo appid:', zegoConfig.superBoardEnv, appID, userID)
    console.error('zegoConfig', zegoConfig)
    zegoEngine = new ZegoExpressEngine(appID, server);
    var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
    console.error('loginInfo', loginInfo)
    // 初始化合并层 SDK
    var token = $('#token').val() || loginInfo.token
    zegoSuperBoard = ZegoSuperBoardManager.getInstance();
    zegoSuperBoard.init(zegoEngine, {
        parentDomID,
        userID,
        appID,
        token,
        isTestEnv
    });
    document.title = `Superboard demo:${zegoSuperBoard.getSDKVersion()}`;
    initExpressSDKConfig();
    initSuperBoardSDKConfig();

    return token;
}

/**
 * @description: 根据配置初始化 Express SDK
 */
function initExpressSDKConfig() {
    // 设置日志级别
    zegoEngine.setLogConfig({
        logLevel: 'disable'
    });
    // 关闭 debug
    zegoEngine.setDebugVerbose(false);
}

/**
 * @description: 根据配置初始化 SuperBoard SDK
 */
function initSuperBoardSDKConfig() {
    // 设置 alpha 环境
    zegoConfig.superBoardEnv !== 'prod' && zegoSuperBoard.setCustomizedConfig('set_alpha_env', true);

    // 设置字体
    if (zegoConfig.fontFamily === 'ZgFont') {
        document.getElementById(parentDomID).style.fontFamily = zegoConfig.fontFamily;
    }

    // 设置动态 PPT 内部图片是否可拖拽
    zegoSuperBoard.setCustomizedConfig('disableH5ImageDrag', zegoConfig.disableH5ImageDrag);

    // 设置动态 PPT 步数切页模式
    zegoSuperBoard.setCustomizedConfig('pptStepMode', zegoConfig.pptStepMode);
    // 设置缩略图清晰度模式
    zegoSuperBoard.setCustomizedConfig('thumbnailMode', zegoConfig.thumbnailMode);

    // 设置 PPT 转码清晰度
    zegoSuperBoard.setCustomizedConfig('dynamicPPT_HD', zegoConfig.dynamicPPT_HD);
    // 设置 PPT 自动翻页
    zegoSuperBoard.setCustomizedConfig('dynamicPPT_AutomaticPage', zegoConfig.dynamicPPT_AutomaticPage);
    // 设置 PPT 视频下载
    zegoSuperBoard.setCustomizedConfig('unloadVideoSrc', zegoConfig.unloadVideoSrc);

    zegoSuperBoard.enableCustomCursor(true);
}

/**
 * @description: 根据配置初始化并登录房间
 */
async function init() {
    try {
        // 校验参数
        if (!checkConfig()) return;
        // 获取已登录信息
        var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
        // 判断是否已登录
        if (loginInfo && loginInfo.roomID) {
            // 已登录
            // 更新本地 zegoConfig
            Object.assign(zegoConfig, loginInfo);

            // 初始化SDK
            var token = await initZegoSDK();
            // 登录房间
            const login_res = await loginRoom(token);

            console.warn('=====demo login', login_res)

            // 显示房间页面
            loginUtils.togglePageDomHandle(true);

            // 挂载当前激活 SuperboardSubView（room 内方法）
            attachActiveView();

        } else {
            // 未登录
            // 显示登录页面
            loginUtils.togglePageDomHandle(false);
        }
        // 更新页面上房间号
        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);
        // 更新页面接入环境勾选
        loginUtils.updateEnvDomHandle(zegoConfig.env);
    } catch (error) {
        console.error(error);
    }
}

// 默认根据配置初始化并登录房间
init();