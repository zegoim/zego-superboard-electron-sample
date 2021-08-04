/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:23:27
 * @LastEditTime: 2021-08-04 18:50:54
 * @LastEditors: Please set LastEditors
 * @Description: 工具方法
 * @FilePath: /superboard_demo_web/js/utils.js
 */

/**
 * @description 动态加载 Script 资源
 * @param {*} url 资源地址
 * @return {*} Promise
 */
function loadScript(url) {
  // 不支持 Promise 的浏览器开发者需要自行做好兼容
  return new Promise(function (resolve) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
    if (script.readyState) {
      // IE Browser
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
        }
      };
    } else {
      // Others Browser
      script.onload = function () {
        console.log(url + " 加载成功");
        resolve();
      };
      script.onerror = function () {
        console.error(url + " 加载异常");
      };
    }
    head.appendChild(script);
  });
}

/**
 * @description: 批量动态加载 Script 资源
 * @param {*} pathList
 * @return {*}
 */
function loadAllScript(pathList) {
  var tasks = pathList.map(function (path) {
    return loadScript(path);
  });
  return Promise.all(tasks);
}

/**
 * @description: 获取 url 中指定参数值
 * @param {*} variable
 * @return {*}
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * @description: 这里仅演示获取 token 的示例代码
 * @param {*} appID
 * @param {*} userID
 * @param {*} tokenUrl
 * @return {*}
 */
function getToken(appID, userID, tokenUrl) {
  return new Promise(function (resolve) {
    $.get(
      tokenUrl,
      {
        app_id: appID,
        id_name: userID,
      },
      function (token) {
        if (token) {
          resolve(token);
        }
      },
      "text"
    );
  });
}

/**
 * @description: 这里仅演示获取 fileList 的示例代码
 * @param {*} filelistUrl
 * @return {*}
 */
function getFilelist(filelistUrl) {
  return new Promise(function (resolve) {
    $.get(
      filelistUrl,
      null,
      function (fileList) {
        if (fileList) {
          resolve(fileList);
        }
      },
      "json"
    );
  });
}

/**
 * @description: 生成 userID
 * @param {*}
 * @return {*}
 */
function getUserID() {
  // 获取已登录的 userID
  var loginInfo = sessionStorage.getItem("loginInfo");
  var userID;
  if (loginInfo) {
    userID = JSON.parse(loginInfo).userID;
  } else {
    userID = "web" + new Date().getTime();
    sessionStorage.setItem("loginInfo", JSON.stringify({ userID }));
  }
  return userID;
}

/**
 * @description: 获取 roomID
 * @param {*}
 * @return {*}
 */
function getRoomID() {
  // 获取 url 中 roomID，邀请链接中会携带 roomID
  var roomID = getQueryVariable("roomID") || $("#roomID").val();
  return roomID;
}

/**
 * @description: 获取接入环境
 * @param {*}
 * @return {*}
 */
function getEnv() {
  // 获取 url 中 env，邀请链接中会携带 env
  var env = getQueryVariable("env") || $(".inlineRadio:checked").val() || "1";
  return env;
}

/**
 * @description: 复制邀请链接
 * @param {*}
 * @return {*}
 */
function copyInviteLink() {
  $("#showInviteLink").select(); // 选中文本
  document.execCommand("copy"); // 执行浏览器复制命令
  alert("复制成功");
}
