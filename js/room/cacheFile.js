/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:38
 * @LastEditTime: 2021-08-27 01:13:56
 * @LastEditors: Please set LastEditors
 * @Description: file preload
 * @FilePath: /superboard/js/room/cacheFile.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

/**
 * @description: File pre-loading
 */
$('#cacheFileBtn').click(function() {
    // Obtain the file ID entered on the page. layui is used here. You can obtain it as required.
    var fileID = layui.form.val('form3').fileID;
    if (!fileID) return roomUtils.toast('Please enter a file ID');

    zegoSuperBoard.cacheFile(fileID);
});
