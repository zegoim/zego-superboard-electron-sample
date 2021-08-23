/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:38
 * @LastEditTime: 2021-08-23 17:35:48
 * @LastEditors: Please set LastEditors
 * @Description: 文件预加载
 * @FilePath: /superboard/js/room/cacheFile.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 文件预加载
 */
$('#cacheFileBtn').click(function() {
    // 获取页面上输入的文件 ID，这里使用的是 layui，开发者可根据实际情况获取
    var fileID = layui.form.val('form3').fileID;
    if (!fileID) return toast('请输入文件 ID');

    zegoSuperBoard.cacheFile(fileID);
});
