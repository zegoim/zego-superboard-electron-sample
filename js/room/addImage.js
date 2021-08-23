/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 16:50:36
 * @LastEditTime: 2021-08-23 19:27:26
 * @LastEditors: Please set LastEditors
 * @Description: 添加自定义图形、插入图片
 * @FilePath: /superboard/js/room/addImage.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var selectedInsetImgFile = null; // 当前选择的本地文件
var customGraphList = [
    'https://storage.zego.im/goclass/wbpic/diamond.svg',
    'https://storage.zego.im/goclass/wbpic/star.svg',
    'https://storage.zego.im/goclass/wbpic/axis.svg',
    'https://storage.zego.im/goclass/wbpic/chemical_instrument.svg'
]; // Zego 内置自定义图形列表
var imageErrorTipsMap = {
    3000002: '参数错误',
    3000005: '下载失败',
    3030008: '图片大小超过限制，请重新选择',
    3030009: '图片格式暂不支持',
    3030010: 'url地址错误或无效'
}; // 自定义图形、图片上传错误

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
            // 存储选择的文件，file 为当前选中文件
            selectedInsetImgFile = file;
            toast('选择文件成功');
        });
    }
});

/**
 * @description: 自定义图形工具下设置当前自定义图形
 * @param {Number} graphIndex 自定义图形在列表中的下标，用于标识当前目标自定义图形 URL
 * @param {Event} event event 鼠标点击事件
 */
async function setCustomGraph(graphIndex, event) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    await zegoSuperBoardSubView.addImage(1, 0, 0, customGraphList[graphIndex]);

    // 更新当前选择自定义图形的样式
    addImageUtils.updateActiveGraphDomHandle(graphIndex, event);
}

/**
 * @description: 通过 URL 添加自定义图形
 */
$('#addImageByURLBtn1').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取页面上输入的自定义图形 URL，这里使用的是 layui，开发者可根据实际情况获取
    var url = layui.form.val('form1').customGraphUrl;
    if (!url) return toast('请输入 URL');

    // 查找本地 customGraphList 是否已存在该自定义图形 URL
    var index = customGraphList.findIndex(function(element) {
        return element === url;
    });
    try {
        await zegoSuperBoardSubView.addImage(1, 0, 0, url, toast);
        toast('上传成功');
        if (index === -1) {
            // 不存在 -> 添加到本地自定义图形列表
            customGraphList.push(url);
            // 通过 URL 追加自定义图形到页面自定义图形列表
            addImageUtils.appendGraphDomHandle(url);
        }
    } catch (errorData) {
        toast(errorData.code + '：' + imageErrorTipsMap[errorData.code]);
    }
});

/**
 * @description: 通过 URL 插入网络图片
 */
$('#addImageByURLBtn2').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取页面上输入的网络图片 URL，这里使用的是 layui，开发者可根据实际情况获取
    var url = layui.form.val('form1').customImageUrl;
    if (!url) return toast('请输入 URL');

    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, url, toast);
        toast('上传成功');
    } catch (errorData) {
        toast(errorData.code + '：' + imageErrorTipsMap[errorData.code]);
    }
});

/**
 * @description: 选择本地文件，设置当前要添加到 SuperboardView 上的自定义图形
 */
$('#addImageByFileBtn').click(async function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 判断本地是否已经选择文件
    if (!selectedInsetImgFile) return toast('请先选择文件');
    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, selectedInsetImgFile, toast);
        toast('上传成功');
    } catch (errorData) {
        toast(errorData.code + '：' + imageErrorTipsMap[errorData.code]);
    }
});

// 更新 DOM 的相关方法、相关工具方法
var addImageUtils = {
    /**
     * @description: 通过 URL 追加自定义图形到页面自定义图形列表
     * @description: 这里只展示更新页面功能，开发者根据实际情况处理
     * @description: 给追加的自定义图形 LI 元素绑定点击事件，用于设置当前要添加到 SuperboardView 上的自定义图形
     * @param {String} address 自定义图形 URL 地址
     */
    appendGraphDomHandle: function(address) {
        var $str =
            '<li data-index="' +
            (customGraphList.length - 1) +
            '" class="custom-graph-item" onclick="setCustomGraph(' +
            (customGraphList.length - 1) +
            ',event)"><img src="' +
            address +
            '" alt=""></li>';
        $('.custom-graph-setting').append($str);
        // 更新尺寸，这里的 12、46 用于计算页面自定义图形容器的尺寸
        $('.custom-graph-setting').css('width', 12 + 46 * Math.ceil(customGraphList.length / 4) + 'px');
    },

    /**
     * @description: 更新自定义图形列表到页面
     * @description: 这里只展示更新页面功能，开发者根据实际情况处理
     * @description: 给每一个自定义图形 LI 元素绑定点击事件，用于设置当前要添加到 SuperboardView 上的自定义图形
     */
    initGraphListDomHandle: function() {
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
    },

    /**
     * @description: 更新当前选择自定义图形的样式
     * @description: 这里只展示更新页面功能，开发者根据实际情况处理
     * @param {Number} graphIndex 自定义图形在列表中的下标，用于标识当前目标自定义图形 URL
     * @param {Event} event 鼠标点击事件
     */
    updateActiveGraphDomHandle: function(graphIndex, event) {
        event.stopPropagation();
        $('.custom-graph-item').removeClass('active');
        $('.custom-graph-item:nth-of-type(' + (graphIndex + 1) + ')').addClass('active');
    }
};

// 页面 DOM 加载完成更新自定义图形列表到页面
$(document).ready(addImageUtils.initGraphListDomHandle);
