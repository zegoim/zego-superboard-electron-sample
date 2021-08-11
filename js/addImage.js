/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 16:50:36
 * @LastEditTime: 2021-08-11 13:11:55
 * @LastEditors: Please set LastEditors
 * @Description: 添加自定义图形、插入图片
 * @FilePath: /superboard/js/addImage.js
 */

var customGraphList = [
    'https://storage.zego.im/goclass/wbpic/diamond.svg',
    'https://storage.zego.im/goclass/wbpic/star.svg',
    'https://storage.zego.im/goclass/wbpic/axis.svg',
    'https://storage.zego.im/goclass/wbpic/chemical_instrument.svg'
]; // 自定义图形列表
var selectedInsetImgFile = null; // 当前选择的插入图片文件

// 页面加载完成更新自定义图形列表到页面
window.addEventListener('load', initGraphListDomHandle);

/**
 * @description: 选择本地插入图片
 * @description: 这里只展示选择本地文件，开发者根据实际情况处理
 */
layui.upload.render({
    elem: '#selectImage', // 绑定元素
    accept: 'images', // 只接受 image 文件
    auto: false, // 不自动上传
    choose: function(obj) {
        // 选择完文件
        obj.preview(function(index, file, result) {
            // file 为当前选中文件
            selectedInsetImgFile = file;
            toast('选择文件成功');
        });
    }
});

/**
 * @description: 自定义图形工具下设置当前自定义图形
 * @param {*} index 自定义图形下标
 * @param {*} event event
 * @return {*}
 */
async function setCustomGraph(index, event) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    await zegoSuperBoardSubView.addImage(1, 0, 0, customGraphList[index]);

    updateActiveGraphDomHandle(index, event);
}

/**
 * @description: 追加自定义图形到页面
 * @description: 这里只展示更新页面功能，开发者根据实际情况处理
 * @param {*} address 自定义图形地址
 * @return {*}
 */
function appendGraphDomHandle(address) {
    var $str =
        '<li data-index="' +
        (customGraphList.length - 1) +
        '" class="custom-graph-item" onclick="setCustomGraph(' +
        (customGraphList.length - 1) +
        ',event)"><img src="' +
        address +
        '" alt=""></li>';
    $('.custom-graph-setting').append($str);
    // 更新尺寸
    $('.custom-graph-setting').css('width', 12 + 46 * Math.ceil(customGraphList.length / 4) + 'px');
}

/**
 * @description: 更新自定义图形列表到页面
 * @description: 这里只展示更新页面功能，开发者根据实际情况处理
 */
function initGraphListDomHandle() {
    var $str = '';
    customGraphList.forEach(function(element, index) {
        $str +=
            '<li data-index="' +
            index +
            '" class="custom-graph-item active" onclick="setCustomGraph(' +
            index +
            ',event)"><img src="' +
            element +
            '" alt="" /></li>';
    });
    $('.custom-graph-setting').html($str);
}

/**
 * @description: 更新当前自定义图形
 * @description: 这里只展示更新页面功能，开发者根据实际情况处理
 * @param {*} index 下标
 * @param {*} event event
 * @return {*}
 */
function updateActiveGraphDomHandle(index, event) {
    event.stopPropagation();
    $('.custom-graph-item').removeClass('active');
    $('.custom-graph-item:nth-of-type(' + (index + 1) + ')').addClass('active');
}

/**
 * @description: 通过 URL 添加自定义图形
 */
$('#addImageByURLBtn1').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var url = layui.form.val('form1').customGraphUrl; // 当前选择的自定义图形 URL
    if (!url) return toast('请输入 URL');

    // 查找本地是否已存在
    var index = customGraphList.findIndex(function(element) {
        return element === url;
    });
    try {
        await zegoSuperBoardSubView.addImage(1, 0, 0, url, toast);
        toast('上传成功');
        if (index === -1) {
            // 不存在 -> 添加到本地自定义图形列表
            customGraphList.push(url);
            appendGraphDomHandle(url);
        }
    } catch (errorData) {
        toast(errorData.code + '：' + (imageErrorTipsMap[errorData.code] || errorData.msg));
    }
});

/**
 * @description: 通过 URL 插入网络图片
 */
$('#addImageByURLBtn2').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var url = layui.form.val('form1').customImageUrl;
    if (!url) return toast('请输入 URL');

    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, url, toast);
        toast('上传成功');
    } catch (errorData) {
        toast(errorData.code + '：' + (imageErrorTipsMap[errorData.code] || errorData.msg));
    }
});

/**
 * @description: 选择本地文件添加
 */
$('#addImageByFileBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    if (!selectedInsetImgFile) return toast('请先选择文件');
    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, selectedInsetImgFile, toast);
        toast('上传成功');
    } catch (errorData) {
        toast(errorData.code + '：' + (imageErrorTipsMap[errorData.code] || errorData.msg));
    }
});
