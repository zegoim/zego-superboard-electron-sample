/*
 * @Author: your name
 * @Date: 2021-08-10 15:11:22
 * @LastEditTime: 2021-08-12 19:07:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /superboard/js/setBackgroundImage.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var selectedBgImgFile = null; // 当前选择的背景图文件
var customBgList = [
    'https://storage.zego.im/goclass/wbbg/1.jpg',
    'https://storage.zego.im/goclass/wbbg/2.jpg',
    'https://storage.zego.im/goclass/wbbg/3.png',
    'https://storage.zego.im/goclass/wbbg/4.jpeg'
]; // 背景图片列表

// 页面 DOM 加载完成更新背景图片列表到页面
$(document).ready(initBgListDomHandle);

/**
 * @description: 更新背景图片列表到页面
 * @description: 这里只展示更新页面功能，开发者根据实际情况处理
 */
function initBgListDomHandle() {
    var $str = '<option value>请选择</option>';
    customBgList.forEach(function(element, index) {
        $str += '<option value="' + element + '">图片' + (index + 1) + '</option>';
    });
    $('#bgList').html($str);

    // 更新下拉框 layui.form.render(type, filter);
    layui.form.render('select', 'form1');
}

/**
 * @description: 选择本地背景图片
 * @description: 这里只展示选择本地文件，开发者根据实际情况处理
 */
layui.upload.render({
    elem: '#selectBgImage', // 绑定元素
    accept: 'images', // 只接受 image 文件
    auto: false, // 不自动上传
    choose: function(obj) {
        // 选择完文件的回调
        obj.preview(function(index, file, result) {
            // file 为当前选中文件
            selectedBgImgFile = file;
            toast('选择文件成功');
        });
    }
});

/**
 * @description: 监听选择框，切换背景图
 * @description: 这里只展示选择框监听，开发者根据实际情况处理
 */
layui.form.on('select(bgUrl)', async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var formData = layui.form.val('form1');
    var bgUrl = formData.bgUrl; // 当前选择的背景图 URL
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    await zegoSuperBoardSubView.setBackgroundImage(bgUrl, imageFitMode, toast);
});

/**
 * @description: 输入可用背景图 URL
 * @description: 绑定设置背景图事件
 */
$('#setBackgroundImageByURLBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var formData = layui.form.val('form1');
    var customBgUrl = formData.customBgUrl; // 当前选择的背景图 URL
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    if (!customBgUrl) return toast('请输入 URL');

    await zegoSuperBoardSubView.setBackgroundImage(customBgUrl, imageFitMode, toast);
});

/**
 * @description: 选择本地文件
 */
$('#setBackgroundImageByFileBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var formData = layui.form.val('form1');
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    if (!selectedBgImgFile) return toast('请先选择文件');

    await zegoSuperBoardSubView.setBackgroundImage(selectedBgImgFile, imageFitMode, toast);
});

/**
 * @description: 清除背景图
 */
$('#clearBackgroundImageBtn').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearBackgroundImage();
});
