/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:58:21
 * @LastEditTime: 2021-09-10 11:05:26
 * @LastEditors: Please set LastEditors
 * @Description: initialization related
 * @FilePath: /superboard/js/login/init.js
 */

// Environment-related configurations
var zegoEnvConfig = {
    env: loginUtils.getEnv(), // 1 mainland 2 overseas
    superBoardEnv: 'prod',
    appID: 3606078772,
    serverProd: 'wss://webliveroom3606078772-api.zego.im/ws',
    overseaAppID: 1068511430,
    betaAppID: 1100697004,
    betaServer: 'wss://webliveroom1100697004-api.zego.im/ws',
    overseaServer: 'wss://webliveroom-hk-test.zegocloud.com/ws',
    overseaServerProd: 'wss://webliveroom1068511430-api.zegocloud.com/ws',
    alphaAppID: 1484763131,
    alphaServer: 'wss://webliveroom1484763131-api.zego.im/ws'
    // 统一接入
    // alphaAppID: 3104114736,
    // alphaServer: 'wss://webliveroom-alpha.zego.im/ws'
    // token:''
};

// SDK feature configurations
var zegoFeatureConfig = {
    fontFamily: 'system', // Superboard SDK fontFamily
    disableH5ImageDrag: 'false', /// Whether to disable drag and drop for images 
    thumbnailMode: '1', // Thumbnail sharpness 1: normal 2: SD 3: HD
    pptStepMode: '1', // PPT page mode 1: normal 2: do not jump
    dynamicPPT_HD: 'false', // false: 正常 true: 高清
    dynamicPPT_AutomaticPage: 'true', // true: 自动翻页 false: 禁止
    unloadVideoSrc: 'false', // false: 正常 true: 禁止
    disableH5Mouse: 'false', // false: 正常 true: 禁止
    ventor_img_type: '1' // 1: 关闭（png） 2: 开启（svg）
};

// Other SDK configurations
var zegoOtherConfig = {
    tokenUrl: 'https://wsliveroom-alpha.zego.im:8282/token',
    // tokenUrl: 'https://sig-liveroom-admin.zego.cloud/thirdToken/get',
    roomID: loginUtils.getRoomID(),
    userID: loginUtils.getUserID(),
    userName: '',
};

// 配置集合
var zegoConfig = {
    ...zegoEnvConfig,
    ...zegoFeatureConfig,
    ...zegoOtherConfig
};

var parentDomID = 'main-whiteboard'; // SupboardView Mounted parent container
var zegoEngine;
var zegoSuperBoard;

/**
 * @description: Verify the configured appID and tokenUrl
 */
function checkConfig() {
    if (!zegoConfig.appID || !zegoConfig.tokenUrl) {
        alert('请填写 appID 和 tokenUrl');
        return false;
    }
    return true;
}

/**
 * @description: Initialize the SDK based on the configuration
 */
async function initZegoSDK(time) {
    var appID = zegoConfig.appID;
    var userID = zegoConfig.userID;
    var isTestEnv = zegoConfig.superBoardEnv === 'beta';
    var server = isTestEnv ? zegoConfig.server : zegoConfig.serverProd;

    if (zegoConfig.env === '2') {
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

    zegoEngine = new ZegoExpressEngine(appID, server);

    var inputToken = $('#token').val()

    var token = inputToken ? inputToken : await loginUtils.getToken(time);

    // Initialize Superboard SDK
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
    layui.use(['layer', 'jquery', 'form'], function () {
        var form = layui.form,
        $ = layui.$;
        $("#logLevel").val(sessionStorage.getItem('logLevel'));
        form.render('select','logLevel');
    })
    return token;
}

/**
 * @description: Initialize the Express SDK based on the configuration.
 */
function initExpressSDKConfig() {
    // Set the log level.
    zegoEngine.setLogConfig({
        logLevel: 'disable'
    });
    zegoSuperBoard.setLogConfig({
        logLevel: 'disable'
    });
    // Disable debug.
    zegoEngine.setDebugVerbose(false);
}

/**
 * @description: Initialize the SuperBoard SDK based on the configuration initialization.
 */
function initSuperBoardSDKConfig() {
    console.log('mytag  zegoConfig.superBoardEnv',  zegoConfig.superBoardEnv !== 'prod');
    zegoConfig.superBoardEnv === 'alpha' && zegoSuperBoard.setCustomizedConfig('set_alpha_env', true);


    if (zegoConfig.fontFamily === 'ZgFont') {
        document.getElementById(parentDomID).style.fontFamily = zegoConfig.fontFamily;
    }

    zegoSuperBoard.setCustomizedConfig('disableH5ImageDrag', zegoConfig.disableH5ImageDrag);

    zegoSuperBoard.setCustomizedConfig('pptStepMode', zegoConfig.pptStepMode);

    zegoSuperBoard.setCustomizedConfig('thumbnailMode', zegoConfig.thumbnailMode);

    zegoSuperBoard.setCustomizedConfig('dynamicPPT_HD', zegoConfig.dynamicPPT_HD);

    zegoSuperBoard.setCustomizedConfig('dynamicPPT_AutomaticPage', zegoConfig.dynamicPPT_AutomaticPage);

    zegoSuperBoard.setCustomizedConfig('unloadVideoSrc', zegoConfig.unloadVideoSrc);
    console.log('demo set config:',zegoConfig.disableH5Mouse)
    zegoSuperBoard.setCustomizedConfig('disableH5Mouse', zegoConfig.disableH5Mouse);

    zegoSuperBoard.enableCustomCursor(true);
}

/**
 * @description: Initialize the SDK and log in to the room based on the configuration.
 */
async function init() {
    try {
        if (!checkConfig()) return;

        var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

        if (loginInfo && loginInfo.roomID) {
            // Update local zegoConfig.
            Object.assign(zegoConfig, loginInfo);

            var token = await initZegoSDK(Number(zegoConfig.time));

            const login_res = await loginRoom(token);

            console.warn('=====demo login', login_res)

            // Display the room page.
            loginUtils.togglePageDomHandle(true);

            attachActiveView();

        } else {
            loginUtils.togglePageDomHandle(false);
        }
        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);
        loginUtils.updateEnvDomHandle(zegoConfig.env);
    } catch (error) {
        console.error(error);
    }
}

init();