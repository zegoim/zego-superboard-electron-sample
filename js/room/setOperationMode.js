/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 21:28:34
 * @LastEditTime: 2021-08-25 01:52:17
 * @LastEditors: Please set LastEditors
 * @Description: 设置白板操作模式
 * @FilePath: /superboard/js/room/operationMode.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var setOperationModeUtils = {
    /**
     * @description: 开启、关闭页面上滚动、绘制、放缩操作模式 switch
     * @description: 这里只展示更新页面上 switch 的功能，开发者根据实际情况处理
     * @param {Boolean} type true: 开启 false: 关闭
     */
    updateOperatedModeDomHandle: function(type) {
        if (type) {
            layui.form.val('form2', {
                drawMode: 'on',
                scrollMode: 'on',
                scaleMode: 'on'
            });
        } else {
            layui.form.val('form2', {
                drawMode: '',
                scrollMode: '',
                scaleMode: ''
            });
        }
    },
    /**
     * @description: 开启、关闭页面上不可操作模式 switch
     * @description: 这里只展示更新页面上 switch 的功能，开发者根据实际情况处理
     * @param {Boolean} type true: 开启 false: 关闭
     */
    updateUnOperatedModeDomHandle: function(type) {
        layui.form.val('form2', {
            unOperatedMode: type ? 'on' : ''
        });
    },

    /**
     * @description: 获取页面不可操作模式、滚动模式、绘制模式、放缩模式的 switch 开关状态
     * @description: 这里只展示获取方法，开发者根据实际情况获取
     * @param {String} str 'unOperatedMode': 不可操作模式 'scrollMode' 滚动模式 'drawMode' 绘制模式 'scaleMode': 放缩模式
     * @return {Boolean} true: 开 false 关
     */
    getTargetOperatedMode: function(str) {
        var data = layui.form.val('form2');
        return data[str] === 'on';
    },

    /**
     * @description: 计算当前需要设置的操作模式
     * @return {Number} operationMode 当前需要设置的操作模式
     */
    calOperatedMode: function() {
        var drawMode = setOperationModeUtils.getTargetOperatedMode('drawMode') ? 4 : 0;
        var scrollMode = setOperationModeUtils.getTargetOperatedMode('scrollMode') ? 2 : 0;
        var scaleMode = setOperationModeUtils.getTargetOperatedMode('scaleMode') ? 8 : 0;
        var operationMode = drawMode | scrollMode | scaleMode;

        // 滚动、绘制、放缩均不开启即不可操作模式
        !operationMode && (operationMode = 1);

        return operationMode;
    }
};

/**
 * @description: 监听不可操作模式 switch 开关状态，更新其他模式的 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(unOperatedMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开 false: 关闭
    // 不可操作模式关闭下，默认开启滚动、绘制、缩放
    var operationMode = this.checked ? 1 : 14;
    setOperationModeUtils.updateOperatedModeDomHandle(operationMode !== 1);
    console.warn('SuperBoard Demo operationMode', operationMode);

    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 监听滚动模式 switch 开关状态，更新不可操作模式的 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(scrollMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 计算当前需要设置的操作模式
    var operationMode = setOperationModeUtils.calOperatedMode();
    // 根据当前计算结果 开启、关闭页面上不可操作模式 switch
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 监听绘制模式 switch 开关状态，更新不可操作模式的 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(drawMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 计算当前需要设置的操作模式
    var operationMode = setOperationModeUtils.calOperatedMode();
    // 根据当前计算结果 开启、关闭页面上不可操作模式 switch
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 监听放缩模式 switch 开关状态，更新不可操作模式的 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(scaleMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 计算当前需要设置的操作模式
    var operationMode = setOperationModeUtils.calOperatedMode();
    // 根据当前计算结果 开启、关闭页面上不可操作模式 switch
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});
