/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 22:16:06
 * @LastEditTime: 2021-08-09 22:19:56
 * @LastEditors: Please set LastEditors
 * @Description: 白板翻页
 * @FilePath: /goclass_web/Users/zego-lh/Desktop/ZEGOProject/zego-whiteboard/sample/superboard/js/flipPage.js
 */

/**
 * @description: 更新页面 currPage
 * @param {*} currPage 当前页
 * @return {*}
 */
function updateCurrPageDomHandle(currPage) {
    $('#currPage').html(currPage);
    $('.thumb-item').removeClass('active');
    $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
}

// 上一页
$('#previousPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToPrevPage();

    updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
});

// 下一页
$('#nextPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToNextPage();

    updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
});

// 上一步
$('#previousStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.previousStep();
});

// 下一步
$('#nextStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.nextStep();
});
