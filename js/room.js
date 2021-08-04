/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-08-04 19:36:27
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
  // 初始化互动白板 SDK
  if (zegoConfig.env === "1") {
    // 国内环境
    zegoWhiteboard = new ZegoExpressEngine(
      zegoConfig.appID,
      zegoConfig.whiteboardEnv === "test"
        ? zegoConfig.server
        : zegoConfig.serverProd
    );
  } else {
    // 海外环境
    zegoWhiteboard = new ZegoExpressEngine(
      zegoConfig.overseaAppID,
      zegoConfig.whiteboardEnv === "test"
        ? zegoConfig.overseaServer
        : zegoConfig.overseaServerProd
    );
  }

  // 初始化文件转码 SDK
  zegoDocs = new ZegoExpressDocs({
    appID: zegoConfig.appID,
    userID: zegoConfig.userID,
    token,
    isTestEnv: !!zegoConfig.docsEnv === "test",
  });

  initWhiteboardSDKConfig();
  initDocsSDKConfig();
}

/**
 * @description: 根据配置初始化白板 SDK
 * @param {*}
 * @return {*}
 */
function initWhiteboardSDKConfig() {
  // 设置日志级别
  zegoWhiteboard.setLogConfig({ logLevel: "info" });
  // 关闭 debug
  zegoWhiteboard.setDebugVerbose(false);
}

/**
 * @description: 根据配置初始化文件 SDK
 * @param {*}
 * @return {*}
 */
function initDocsSDKConfig() {
  // 设置字体
  if (zegoConfig.fontFamily) {
    // 设置白板、文件挂载容器内的字体
    document.getElementById(parentID).style.fontFamily = zegoConfig.fontFamily;
  }
  // 设置动态 PPT 步数切页模式
  zegoDocs.setConfig("pptStepMode", zegoConfig.pptStepMode);
  // 设置缩略图清晰度模式
  zegoDocs.setConfig("thumbnailMode", zegoConfig.thumbnailMode);

  // 设置 PPT 转码清晰度
  zegoDocs.setConfig("dynamicPPT_HD", $("#dynamicPPT_HD").val());
  // 设置 PPT 自动翻页
  zegoDocs.setConfig(
    "dynamicPPT_AutomaticPage",
    $("#dynamicPPT_AutomaticPage").val()
  );
  // 设置 PPT 视频下载
  zegoDocs.setConfig("unloadVideoSrc", $("#unloadVideoSrc").val());
}

/**
 * @description: 监听房间成员变更
 * @param {*}
 * @return {*}
 */
function onRoomUserUpdate() {
  zegoWhiteboard.on("roomUserUpdate", function (roomID, type, list) {
    if (type == "ADD") {
      list.forEach(function (v) {
        userList.push({
          userID: v.userID,
          userName: v.userName,
        });
      });
    } else if (type == "DELETE") {
      list.forEach(function (v) {
        var index = userList.findIndex(function (item) {
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
  return new Promise(function (resolve) {
    // 获取 token
    getToken(zegoConfig.appID, zegoConfig.userID, zegoConfig.tokenUrl).then(
      function (token) {
        // 初始化 SDK
        initSDK(token);

        // 注册房间成员变更回调
        onRoomUserUpdate();

        // 登录房间
        zegoWhiteboard
          .loginRoom(
            zegoConfig.roomID,
            token,
            {
              userID: zegoConfig.userID,
              userName: zegoConfig.username,
            },
            {
              maxMemberCount: 10,
              userUpdate: true,
            }
          )
          .then(function () {
            // 添加自己到成员列表
            userList.unshift({
              userID: zegoConfig.userID,
              userName: zegoConfig.userName,
            });

            // 更新视图
            updateUserListDomHandle();

            resolve();
          });
      }
    );
  });
}

/**
 * @description: 退出房间
 * @param {*}
 * @return {*}
 */
function logoutRoom() {
  // 退出房间
  zegoWhiteboard.logoutRoom(zegoConfig.roomID);
  // 清除 sessionStorage
  sessionStorage.removeItem("loginInfo");

  // 清空成员列表
  userList = [];

  togglePageHandle(2);
}

// 绑定登录房间事件
$("#login-btn").click(function () {
  // 校验 roomID、userName
  var roomID = $("#roomID").val();
  var userName = $("#userName").val();
  if (!userName || !roomID) {
    alert("请输入用户名和房间 ID");
    return;
  }

  // 登录信息
  var loginInfo = {
    env: $(".inlineRadio:checked").val(),
    roomID,
    userName,
    userID: zegoConfig.userID,
    server: zegoConfig.server,
    whiteboardEnv: $("#whiteboardEnv").val(),
    docsEnv: $("#docsEnv").val(),
    fontFamily: $("#fontFamily").val(),
    thumbnailMode: $("#thumbnailMode").val(),
    pptStepMode: $("#pptStepMode").val(),
  };

  // 更新 zegoConfig
  Object.assign(zegoConfig, loginInfo);

  loginRoom().then(function () {
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));

    // 显示房间页
    $("#room-page").css("display", "flex");
    $("#login-page").css("display", "none");

    // 更新房间号
    $("#showRoomID").html(zegoConfig.roomID);
  });
});

// 绑定退出房间事件
$("#logout-btn").click(function () {
  logoutRoom();
});
