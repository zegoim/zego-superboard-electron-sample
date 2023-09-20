/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:58:21
 * @LastEditTime: 2021-09-10 11:05:26
 * @LastEditors: Please set LastEditors
 * @Description: initialization related
 * @FilePath: /superboard/js/login/init.js
 */

// Environment-related configurations
var sdkPathPre = '../../sdk/v290';
var zegoEnvConfig = {
    env: loginUtils.getEnv(), // 1 mainland 2 overseas
    superBoardEnv: 'prod',
    appID: 3606078772,
    appSignStr: '7fa02dba76aef58cb3cd6b01fdc64a7d52b0a4608db4f079ad1ce6ac6d15ac9d',
    appIDBeta: 1100697004,
    appSignStrBeta: '25fea61fd253b252f48a48ea84f909d7d6849f82d9089ced0cb5c054e6cafa06',
    appIDAlpha: 1803117167,
    appSignStrAlpha: '22128c7680537c7d2e94fa4562f268a14b629634f23f585f4e4845361116d439',
    sdkPath: {
        express: sdkPathPre + '/zego-superboard-electron/zego-express-engine-electron/ZegoExpressEngine.js',
        superboard: sdkPathPre + '/zego-superboard-electron/index.js',
    }
};

var ZegoExpressEngine = require(zegoEnvConfig.sdkPath.express);
var ZegoSuperBoard = require(zegoEnvConfig.sdkPath.superboard);

var zegoSuperBoardManager;
var zegoSuperBoard;



// SDK feature configurations
var zegoFeatureConfig = {
    fontFamily: 'system', // Superboard SDK fontFamily
    disableH5ImageDrag: 'false', /// Whether to disable drag and drop for images 
    thumbnailMode: '1', // Thumbnail sharpness 1: normal 2: SD 3: HD
    pptStepMode: '1', // PPT page mode 1: normal 2: do not jump
    ventor_img_type: '1' // 1: png 2: svg
};

// Other SDK configurations
var zegoOtherConfig = {
    roomID: loginUtils.getRoomID(),
    userID: loginUtils.getUserID(),
    userName: '',
    logDirs: {
        win32: 'c:/zegowblog/',
        darwin: process.env.HOME + '/zegowblog/'
    }
};

var logDir = zegoOtherConfig.logDirs[require('os').platform()];

// 配置集合
var zegoConfig = {
    ...zegoEnvConfig,
    ...zegoFeatureConfig,
    ...zegoOtherConfig
};

var parentDomID = 'main-whiteboard'; // SupboardView Mounted parent container

/**
 * @description: Verify the configured appID
 */
function checkConfig() {
    if (!zegoConfig.appID) {
        alert('please enter your appID');
        return false;
    }
    return true;
}

/**
 * @description: Initialize the SDK based on the configuration
 */
async function initZegoSDK() {
    var appID = zegoConfig.appID;
    var userID = zegoConfig.userID;
    var isTestEnv = zegoConfig.superBoardEnv === 'beta';
    var appSign = isTestEnv ? zegoConfig.appSignStrBeta : zegoConfig.appSignStr;

    // if (zegoConfig.env === '2') {
    //     appID = zegoConfig.overseaAppID;
    //     appSign = isTestEnv ? zegoConfig.overseaServer : zegoConfig.overseaServerProd;
    // }

    if (zegoConfig.superBoardEnv === 'beta') {
        appID = zegoConfig.appIDBeta;
        appSign = zegoConfig.appSignStrBeta;
    }

    if (zegoConfig.superBoardEnv === 'alpha') {
        appID = zegoConfig.appIDAlpha;
        appSign = zegoConfig.appSignStrAlpha;
    }
    console.warn('====superboard demo appid:', zegoConfig.superBoardEnv, appID, userID)

    ZegoExpressEngine.setLogConfig &&
    ZegoExpressEngine.setLogConfig({
                logPath: logDir,
                logSize: 5 * 1024 * 1024
            });
    console.log('mytag config',{
        appID,
        appSign,
        scenario: 0
    })
    await ZegoExpressEngine.createEngine({
        appID,
        appSign,
        scenario: 0
    });

    // Initialize Superboard SDK
    zegoSuperBoardManager = new ZegoSuperBoard()
    zegoSuperBoard = zegoSuperBoardManager.getInstance()
    zegoSuperBoard.init({
        parentDomID,
        userID,
        appID,
        appSign:loginUtils.getAppSignArray(appSign),
        isTestEnv: false,
        dataFolder: logDir,
        cacheFolder: logDir,
        logFolder: logDir,
    })

    document.title = `Superboard version:${zegoSuperBoard.getSDKVersion()},RTC version:${ZegoExpressEngine.getVersion()}`;
    initExpressSDKConfig();
    initSuperBoardSDKConfig();

    layui.use(['layer', 'jquery', 'form'], async function () {
        var form = layui.form,
        $ = layui.$;
        $("#logLevel").val('disable');

        // 添加扬声器
        var speakers = await getSpeakers();
        if(!speakers.length) return;
        $("#speaker").empty();
        for (let index = 0; index < speakers.length; index++) {
            var label = speakers[index].label.toString();
            $("#speaker").append("<option value='"+  label  +"'>"+ label +"</option>");
        }
        $("#speaker").val(speakers.find(device => device.deviceId === 'default').label)

        form.render('select');
    })
}

/**
 * @description: Initialize the Express SDK based on the configuration.
 */
function initExpressSDKConfig() {
    zegoSuperBoard.enableSyncScale(true);
    zegoSuperBoard.enableResponseScale(true);
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

    zegoSuperBoard.enableCustomCursor(true);
}

/**
 * @description: Initialize the SDK and log in to the room based on the configuration.
 */
async function init() {
    try {
        // disabled safari scaling 
        loginUtils.disableScaling();
        if (!checkConfig()) return;

        var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

        if (loginInfo && loginInfo.roomID) {
            // Update local zegoConfig.
            Object.assign(zegoConfig, loginInfo);
            await initZegoSDK(Number(zegoConfig.time));
            loginRoom();

            // Display the room page.
            loginUtils.togglePageDomHandle(true);

           
            zegoSuperBoard.enableSyncScale(true);
            zegoSuperBoard.enableResponseScale(true);

        } else {
            loginUtils.togglePageDomHandle(false);
        }
        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);
        loginUtils.updateEnvDomHandle(zegoConfig.env);
    } catch (error) {
        console.error(error);
    }
}

async function getSpeakers() {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !navigator.mediaDevices.enumerateDevices){
        return Promise.resolve([]);
    };
    await navigator.mediaDevices.getUserMedia({audio:true});
    let devices = await navigator.mediaDevices.enumerateDevices();
    let speakers = devices.filter(function (device) {
        return device.kind === 'audiooutput' && device.deviceId
    })
    return Promise.resolve(speakers);
}

init();
