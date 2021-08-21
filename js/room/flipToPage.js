/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 22:16:06
 * @LastEditTime: 2021-08-18 16:25:44
 * @LastEditors: Please set LastEditors
 * @Description: 白板翻页
 * @FilePath: /goclass_web/Users/zego-lh/Desktop/ZEGOProject/zego-whiteboard/sample/superboard/js/flipPage.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 更新页面 currPage
 * @description: 这里只展示更新页面内容，开发者根据实际情况展示
 * @param {*} currPage 当前页
 * @return {*}
 */
function updateCurrPageDomHandle(currPage) {
    // 更新 page-bar 当前页
    $('#currPage').html(currPage);
    // 更新缩略图当前页
    $('.thumb-item').removeClass('active');
    $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
    // 自动滚动到缩略图指定位置
    var scrollTop = 112 * (currPage - 1);
    $('.thumb-main')[0].scrollTop = scrollTop;
}

/**
 * @description: 跳转到指定页
 * @param {*} page 目标页面
 * @return {*}
 */
function flipToPage(page) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToPage(page);

    updateCurrPageDomHandle(page);
}

/**
 * @description: 更新缩略图列表
 * @param {*} thumbnailUrlList 缩略图 url
 * @param {*} currPage 当前页码
 * @return {*}
 */
function updateThumbListDomHandle(thumbnailUrlList, currPage) {
    $('.thumb-main').html('');
    var $str = '';
    thumbnailUrlList.forEach(function (element, index) {
        $str +=
            '<li onclick="flipToPage(' +
            (index + 1) +
            ')" class="thumb-item' +
            (index === currPage - 1 ? ' active' : '') +
            '"><span>' +
            (index + 1) +
            '</span><div class="thumb-image"><img src="' +
            element +
            '"/></div></li>';
    });
    $('.thumb-main').html($str);
}

/**
 * @description: 绑定上一页事件
 */
$('#previousPage').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.flipToPrePage();

        updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
    }
});

/**
 * @description: 绑定下一页事件
 */
$('#nextPage').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.flipToNextPage();

        updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
    }
});

/**
 * @description: 绑定上一步事件
 */
$('#previousStep').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.preStep();
});

/**
 * @description: 绑定下一步事件
 */
$('#nextStep').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.nextStep();
});

/**
 * @description: 绑定跳转到指定页事件
 */
$('#flipToPageBtn').click(function () {
    var page = layui.form.val('form2').targetPage;
    if (!page) return toast('请输入目标页码，从 1 开始');
    flipToPage(+page);
});

/**
 * @description: 获取缩略图 URL 列表
 */
$('#thumb-button').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        var type = zegoSuperBoardSubView.getModel().fileType;
        // 仅支持 PDF，PPT，动态 PPT 文件格式
        var supportType = [1, 8, 512, 4096];
        if (supportType.includes(type)) {
            var thumbnailUrlList = zegoSuperBoardSubView.getThumbnailUrlList();

            updateThumbListDomHandle(thumbnailUrlList, zegoSuperBoardSubView.getCurrentPage());
        } else {
            toast('获取缩略图仅支持“PDF，PPT，动态PPT，H5”文件格式');
        }
    }
});