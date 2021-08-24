/*
 * @Author: ZegoDev
 * @Date: 2021-08-12 11:56:27
 * @LastEditTime: 2021-08-24 11:59:42
 * @LastEditors: Please set LastEditors
 * @Description: 清空、撤销、重做、保存快照、清空当前页、清除选中、设置渲染延时
 * @FilePath: /superboard/js/room/other.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var saveImg = 1; // 白板快照索引

/**
 * @description: 监听按键清除选中图元
 */
window.addEventListener('keydown', function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) return;
    switch (e.keyCode) {
        case 8: // 监听 backspace 按键，批量删除选中图元
        case 46: // 监听 Delete 按键，批量删除选中图元
            clearSelected();
            break;
        default:
            break;
    }
});

/**
 * @description: 清空所有页
 */
function clearAllPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearAllPage();
}

/**
 * @description: 撤销
 */
function undo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.undo();
}

/**
 * @description: 重做
 */
function redo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.redo();
}

/**
 * @description: 白板快照
 */
function snapshot() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView &&
        zegoSuperBoardSubView.snapshot().then(function(data) {
            var link = document.createElement('a');
            link.href = data.image;
            link.download = zegoSuperBoardSubView.getModel().name + saveImg++ + '.png';
            link.click();
        });
}

/**
 * @description: 删除选中图元
 */
function clearSelected() {
    if (!zegoSuperBoard) return;
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearSelected();
}

/**
 * @description: 清空当前页图元，在橡皮擦工具时生效
 */
function clearCurrentPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearCurrentPage();
}

/**
 * @description: 设置渲染延时
 */
$('#setDeferredRenderingTimeBtn').click(function() {
    // 获取页面上输入的目标页，这里使用的是 layui，开发者可根据实际情况获取
    var deferredRenderingTime = layui.form.val('form2').deferredRenderingTime;
    if (!deferredRenderingTime) return toast('请输入延时时长');

    zegoSuperBoard.setDeferredRenderingTime(+deferredRenderingTime);
    toast('设置成功');
});
