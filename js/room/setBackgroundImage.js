/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 15:11:22
 * @LastEditTime: 2021-08-27 01:15:30
 * @LastEditors: Please set LastEditors
 * @Description: set background image
 * @FilePath: /superboard/js/setBackgroundImage.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var selectedBgImgFile = null; // The currently selected local background image file
var customBgList = [
    'https://storage.zego.im/goclass/wbbg/1.jpg',
    'https://storage.zego.im/goclass/wbbg/2.jpg',
    'https://storage.zego.im/goclass/wbbg/3.png',
    'https://storage.zego.im/goclass/wbbg/4.jpeg'
]; // Zego 内置的背景图列表

// Page DOM loaded. Update the background image list to the page.
$(document).ready(function () {
    initBgListDomHandle();
    initCursorListDomHandle();
});

/**
 * @description: Update the background image list to the page.
 * @description: Only updated functions on the page are displayed here. You can handle it as required.
 */
function initBgListDomHandle() {
    var $str = '<option value>please choose</option>';
    customBgList.forEach(function (element, index) {
        $str += '<option value="' + element + '">picture' + (index + 1) + '</option>';
    });
    $('#bgList').html($str);

    // Update the drop-down list. layui.form.render(type, filter);
    layui.form.render('select', 'form1');
}


/**
 * @description: Select a local background image.
 * @description: Only selected local files are displayed here. You can handle it as required.
 */
layui.upload.render({
    elem: '#selectBgImage',
    accept: 'images',
    auto: false,
    choose: function (obj) {
        // Callback after a file is selected.
        obj.preview(function (index, file, result) {
            // Save the selected file. The file parameter indicates the file that is currently selected.
            selectedBgImgFile = file;
            roomUtils.toast('file selected successfully');
        });
    }
});

/**
 * @description: Listen for the drop-down list to switch the background image.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 */
layui.form.on('select(bgUrl)', async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the background image selected from the drop-down list and the selected background image padding mode on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('form1');
    var bgUrl = formData.bgUrl;
    var imageFitMode = +formData.imageFitMode;

    try {
        await zegoSuperBoardSubView.setBackgroundImage(bgUrl, imageFitMode, roomUtils.toast);
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Set the background image based on the entered background image URL.
 */
$('#setBackgroundImageByURLBtn').click(async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the background image selected from the drop-down list and the selected background image padding mode on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('form1');
    var customBgUrl = formData.customBgUrl;
    var imageFitMode = +formData.imageFitMode;

    if (!customBgUrl) return roomUtils.toast('Please enter URL');

    try {
        await zegoSuperBoardSubView.setBackgroundImage(customBgUrl, imageFitMode, roomUtils.toast);
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Set the background image based on the locally selected file.
 */
$('#setBackgroundImageByFileBtn').click(async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the selected background image padding mode on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('form1');
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    if (!selectedBgImgFile) return roomUtils.toast('Please select a file first');

    try {
        await zegoSuperBoardSubView.setBackgroundImage(selectedBgImgFile, imageFitMode, roomUtils.toast);
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Clear the current background image.
 */
$('#clearBackgroundImageBtn').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearBackgroundImage();
});