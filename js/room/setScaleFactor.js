/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 11:47:35
 * @LastEditTime: 2021-08-25 01:53:43
 * @LastEditors: Please set LastEditors
 * @Description: 白板缩放
 * @FilePath: /superboard/js/room/setScaleFactor.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框
var setScaleFactorUtils = {
    /**
     * @description: 更新页面 scale
     * @description: 这里只展示更新页面内容，开发者根据实际情况处理
     * @param {Number} scale 目标 scale
     */
    updateScaleDomHandle: function(scale) {
        layui.form.val('customForm', {
            scale: scale + ''
        });
    }
};

/**
 * @description: 同步缩放
 * @description: 监听页面同步缩放 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(syncScale)', function() {
    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开（同步）false: 关闭（不同步）
    var bool = this.checked;
    zegoSuperBoard.enableSyncScale(bool);
});

/**
 * @description: 响应缩放
 * @description: 监听页面响应缩放 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(responseScale)', function() {
    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开（同步）false: 关闭（不同步）
    var bool = this.checked;
    zegoSuperBoard.enableResponseScale(bool);
});

/**
 * @description: 监听下拉框，切换 scale
 * @description: 这里只展示下拉框的选择监听，开发者根据实际情况处理
 */
layui.form.on('select(scaleList)', function() {
    // 获取页面上下拉框中当前选择的 scale，这里使用的是 layui，开发者可根据实际情况获取
    var formData = layui.form.val('customForm');
    var scale = +formData.scale; // 当前选择的 scale

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(scale);
});

/**
 * @description: 通过页面上 '-' 设置缩放 缩小
 */
$('#setScaleFactorCut').click(function() {
    // 获取页面上下拉框中当前选择的 scale，这里使用的是 layui，开发者可根据实际情况获取
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 1) return; // 最小为 1，小于 1 不允许缩小

    var targetScale = currScale - 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        setScaleFactorUtils.updateScaleDomHandle(targetScale);
    }
});

/**
 * @description: 通过页面上 '+' 设置缩放 放大
 */
$('#setScaleFactorAdd').click(function() {
    // 获取页面上下拉框中当前选择的 scale，这里使用的是 layui，开发者可根据实际情况获取
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 3) return; // 最大为 3，大于 3 不允许放大

    var targetScale = currScale + 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        setScaleFactorUtils.updateScaleDomHandle(targetScale);
    }
});
