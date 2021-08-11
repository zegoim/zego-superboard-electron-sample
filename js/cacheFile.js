/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:38
 * @LastEditTime: 2021-08-11 15:14:34
 * @LastEditors: Please set LastEditors
 * @Description: 文件预加载
 * @FilePath: /superboard/js/cacheFile.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 文件预加载
 * @description: 这里只展示获取页面输入的文件 ID，进行预加载，开发者根据实际情况处理
 */
$('#cacheFileBtn').click(function() {
    var data = layui.form.val('form3');
    var fileID = data.fileID;
    if (!fileID) return toast('请输入文件 ID');
    zegoSuperBoard.cacheFile(fileID);
});
