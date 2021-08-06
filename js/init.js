/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:58:21
 * @LastEditTime: 2021-08-06 15:06:32
 * @LastEditors: Please set LastEditors
 * @Description: 初始化相关
 * @FilePath: /superboard_demo_web/js/init.js
 */

$('body').tooltip({
    selector: '[data-toggle="tooltip"]'
});

var isTouch = 'ontouchstart' in window; // 当前是否是触摸设备

// 白板、文件 SDK 配置
var zegoConfig = {
    // 获取登录房间 token，开发者自行在后台实现改接口；测试环境可以使用 ZEGO 提供的接口获取（参考 https://doc-zh.zego.im/article/7638#3_3）
    tokenUrl: 'https://doc.zego.im/data/getSdkToken',
    fileListUrl: './fileList.json', // 引入已上传的文件列表路径，可以是本地路径或者服务器路径（https://storage.zego.im/goclass/config.json）
    fileListData: {}, // 文件列表
    env: getEnv(), // 1 国内 2 海外
    appID: 3606078772, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
    overseaAppID: 1068511430, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
    superBoardEnv: 'test', // 合并层 SDK 环境
    server: 'wss://webliveroom-test.zego.im/ws', // 国内测试环境
    serverProd: 'wss://webliveroom3606078772-api.zego.im/ws', // 国内正式环境 `wss://webliveroom${appID}-api.zego.im/ws`
    overseaServer: 'wss://webliveroom-hk-test.zegocloud.com/ws', // 海外测试环境
    overseaServerProd: 'wss://webliveroom1068511430-api.zegocloud.com/ws', // 海外正式环境 `wss://webliveroom${overseaAppID}-api.zegocloud.com/ws`
    roomID: getRoomID(), // 房间 ID
    userID: getUserID(), // 用户 ID
    userName: '', // 用户名称
    fontFamily: 'system', // 白板 SDK 字体
    thumbnailMode: '1', // 缩略图清晰度 1: 普通 2: 标清 3: 高清
    pptStepMode: '1', // PPT 切页模式 1: 正常 2: 不跳转
    dynamicPPT_HD: 'false', // false: 正常 true: 高清
    dynamicPPT_AutomaticPage: 'false', // false: 自动翻页 true: 禁止
    unloadVideoSrc: 'false' // false: 正常 true: 禁止
};

var zegoEngine; // Express SDK 实例
var zegoSuperBoard; // 合并层 SDK 实例
var zegoSuperBoardSubView; // 当前大 view
var zegoSuperBoardSubViewModel; // 当前 model
var zegoSuperBoardSubViewModelList; // 房间内 model 列表
var zegoExcelSheetNameList; // 当前 excel 列表
var parentDomID = 'main-whiteboard'; // 白板、文件挂载的父容器
var WBNameIndex = 1; // 白板索引，创建多个普通白板时，白板名称编号进行叠加

var userList = []; // 房间内成员列表

/**
 * @description: 根据配置初始化并登录房间
 * @param {*}
 * @return {*}
 */
async function init() {
    // 获取文件列表
    var fileListData = await getFilelist(zegoConfig.fileListUrl);
    // 更新文件列表
    zegoConfig.fileListData = fileListData;

    // 更新视图
    updateFileListDomHandle();

    // 校验 appID、tokenUrl
    if (!zegoConfig.appID || !zegoConfig.tokenUrl) {
        alert('请填写 appID 和 tokenUrl');
        return;
    }

    // 触摸设备增加 vconsole
    if (isTouch) {
        await loadScript('./lib/vconsole.js');
        // 初始化 vconsole
        new VConsole();
    }

    // 获取 sessionStorage 已登录信息
    var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));

    if (loginInfo && loginInfo.roomID) {
        // 已登录过，显示房间页

        // 更新 loginInfo
        loginInfo.env = zegoConfig.env;
        loginInfo.roomID = zegoConfig.roomID;
        // 使用 loginInfo 自动登录房间
        Object.assign(zegoConfig, loginInfo);
        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        await loginRoom();
        togglePageHandle(1);
    } else {
        // 未登录过，显示登录页
        togglePageHandle(2);
    }

    // 更新房间号
    updateRoomIDDomHandle();

    // 更新接入环境
    updateEnvDomHandle();
}

// 默认根据配置初始化并登录房间
init();
