/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:58:21
 * @LastEditTime: 2021-08-04 19:02:40
 * @LastEditors: Please set LastEditors
 * @Description: 初始化相关
 * @FilePath: /superboard_demo_web/js/init.js
 */

$("body").tooltip({
  selector: '[data-toggle="tooltip"]',
});

var isTouch = "ontouchstart" in window; // 当前是否是触摸设备

// 白板、文件 SDK 配置
var zegoConfig = {
  // 获取登录房间 token，开发者自行在后台实现改接口；测试环境可以使用 ZEGO 提供的接口获取（参考 https://doc-zh.zego.im/article/7638#3_3）
  tokenUrl: "https://doc.zego.im/data/getSdkToken",
  fileListUrl: "../fileList.json", // 引入已上传的文件列表路径，可以是本地路径或者服务器路径（https://storage.zego.im/goclass/config.json）
  fileListData: {}, // 文件列表
  env: getEnv(), // 1 国内 2 海外
  appID: 3606078772, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
  overseaAppID: 3606078772, // 从 ZEGO 申请的 appID（参考 https://doc-zh.zego.im/article/7638#3_3）
  whiteboardEnv: "test", // 白板 SDK 环境
  server: "wss://webliveroom-test.zego.im/ws", // 正式环境 `wss://webliveroom${appID}-api.zego.im/ws`
  overseaServer: "wss://webliveroom-hk-test.zegocloud.com/ws", // 正式环境 `wss://webliveroom${overseaAppID}-api.zegocloud.com/ws`
  docsEnv: "test", // 文件 SDK 环境
  roomID: getRoomID(), // 房间 ID
  userID: getUserID(), // 用户 ID
  userName: "", // 用户名称
  fontFamily: "", // 白板 SDK 字体
  thumbnailMode: "1", // 缩略图清晰度 1: 普通 2: 标清 3: 高清
  pptStepMode: "1", // PPT 切页模式 1: 正常 2: 不跳转
};

var zegoWhiteboard; // 白板 SDK 实例
var zegoDocs; // 文件 SDK 实例
var parentID = "main-whiteboard"; // 白板、文件挂载的父容器
var zegoWhiteboardView; // 当前 ZegoWhiteboardView
var zegoDocsView; // 当前 ZegoDocsView
var zegoWhiteboardViewList = []; // 房间内 ZegoWhiteboardView 列表
var WBNameIndex = 1; // 白板索引，创建多个普通白板时，白板名称编号进行叠加

var userList = []; // 房间内成员列表

/**
 * @description: 根据配置初始化并登录房间
 * @param {*}
 * @return {*}
 */
function init() {
  // 获取文件列表
  getFilelist(zegoConfig.fileListUrl).then(function (fileListData) {
    // 更新文件列表
    zegoConfig.fileListData = fileListData;

    // 更新视图
    updateFileListDomHandle();
  });

  // 校验 appID、tokenUrl
  if (!zegoConfig.appID || !zegoConfig.tokenUrl) {
    alert("请填写 appID 和 tokenUrl");
    return;
  }

  // 触摸设备增加 vconsole
  isTouch &&
    loadScript("./lib/vconsole.js").then(function () {
      // 初始化 vconsole
      new VConsole();
    });

  // 获取 sessionStorage 已登录信息
  var loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  if (loginInfo && loginInfo.roomID) {
    // 已登录过，显示房间页

    // 更新 loginInfo
    loginInfo.env = zegoConfig.env;
    loginInfo.roomID = zegoConfig.roomID;
    // 使用 loginInfo 自动登录房间
    Object.assign(zegoConfig, loginInfo);
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    loginRoom().then(function () {
      togglePageHandle(1);
    });
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
