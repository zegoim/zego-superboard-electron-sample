/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 11:47:35
 * @LastEditTime: 2021-08-18 16:29:32
 * @LastEditors: Please set LastEditors
 * @Description: 白板缩放
 * @FilePath: /superboard/js/setScaleFactor.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 更新页面 scale
 * @description: 这里只展示更新页面内容，开发者根据实际情况展示
 * @param {*} scale 目标 scale
 */
function updateScaleDomHandle(scale) {
    layui.form.val('customForm', {
        scale: scale + ''
    });
}

/**
 * @description: 监听选择框，切换 scale
 * @description: 这里只展示选择框监听，开发者根据实际情况处理
 */
layui.form.on('select(scaleList)', async function() {
    var formData = layui.form.val('customForm');
    var scale = +formData.scale; // 当前选择的 scale

    var zegoSuperBoardSubView = await zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(scale);
});

/**
 * @description: 同步缩放
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(syncScale)', function() {
    var bool = this.checked; // 表示当前开关打开，开发者根据实际情况判断
    zegoSuperBoard.enableSyncScale(bool);
});

/**
 * @description: 响应缩放
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(responseScale)', function() {
    var bool = this.checked; // 表示当前开关打开，开发者根据实际情况判断
    zegoSuperBoard.enableResponseScale(bool);
});

/**
 * @description: 设置缩放 缩小
 */
$('#setScaleFactorCut').click(async function() {
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 1) return; // 最小为 1

    var targetScale = currScale - 0.25;

    var zegoSuperBoardSubView = await zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        updateScaleDomHandle(targetScale);
    }
});

/**
 * @description: 设置缩放 放大
 */
$('#setScaleFactorAdd').click(async function() {
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 3) return; // 最大为 3

    var targetScale = currScale + 0.25;

    var zegoSuperBoardSubView = await zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        updateScaleDomHandle(targetScale);
    }
});
