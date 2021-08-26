/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 15:11:22
 * @LastEditTime: 2021-08-26 11:29:30
 * @LastEditors: Please set LastEditors
 * @Description: 设置背景图
 * @FilePath: /superboard/js/setBackgroundImage.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var selectedBgImgFile = null; // 当前选择的本地背景图文件
var customBgList = [
    'https://storage.zego.im/goclass/wbbg/1.jpg',
    'https://storage.zego.im/goclass/wbbg/2.jpg',
    'https://storage.zego.im/goclass/wbbg/3.png',
    'https://storage.zego.im/goclass/wbbg/4.jpeg'
]; // Zego 内置的背景图列表

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
            // 存储选择的文件，file 为当前选中文件
            selectedBgImgFile = file;
            toast('选择文件成功');
        });
    }
});

/**
 * @description: 监听下拉框，切换背景图
 * @description: 这里只展示下拉框的选择监听，开发者根据实际情况处理
 */
layui.form.on('select(bgUrl)', async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取页面上下拉框中当前选择的背景图、当前选择的背景图填充模式，这里使用的是 layui，开发者可根据实际情况获取
    var formData = layui.form.val('form1');
    var bgUrl = formData.bgUrl; // 当前选择的背景图 URL
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    try {
        await zegoSuperBoardSubView.setBackgroundImage(bgUrl, imageFitMode, toast);
    } catch (errorData) {
        toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: 根据输入的背景图 URL 来设置背景图
 */
$('#setBackgroundImageByURLBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取页面上下拉框中当前选择的背景图、当前选择的背景图填充模式，这里使用的是 layui，开发者可根据实际情况获取
    var formData = layui.form.val('form1');
    var customBgUrl = formData.customBgUrl; // 当前选择的背景图 URL
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    if (!customBgUrl) return toast('请输入 URL');

    try {
        await zegoSuperBoardSubView.setBackgroundImage(customBgUrl, imageFitMode, toast);
    } catch (errorData) {
        toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: 根据本地选择的文件来设置背景图
 */
$('#setBackgroundImageByFileBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取页面上当前选择的背景图填充模式，这里使用的是 layui，开发者可根据实际情况获取
    var formData = layui.form.val('form1');
    var imageFitMode = +formData.imageFitMode; // 当前背景图填充模式

    if (!selectedBgImgFile) return toast('请先选择文件');

    try {
        await zegoSuperBoardSubView.setBackgroundImage(selectedBgImgFile, imageFitMode, toast);
    } catch (errorData) {
        toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: 清除当前背景图
 */
$('#clearBackgroundImageBtn').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearBackgroundImage();
});
