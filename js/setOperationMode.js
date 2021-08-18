/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 21:28:34
 * @LastEditTime: 2021-08-17 13:37:21
 * @LastEditors: Please set LastEditors
 * @Description: 白板操作模式
 * @FilePath: /superboard/js/operationMode.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 开启、关闭滚动、绘制、放缩操作模式
 * @description: 这里只展示 switch 开关的设置，开发者根据实际情况获设置
 * @param {*} type 1: 开启 2: 关闭
 * @return {*}
 */
function updateOperatedModeDomHandle(type) {
    if (type === 1) {
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
}
/**
 * @description: 开启、关闭不可操作模式
 * @param {*} type true: 开启 false: 关闭
 * @return {*}
 */
function updateUnOperatedModeDomHandle(type) {
    layui.form.val('form2', {
        unOperatedMode: type ? 'on' : ''
    });
}

/**
 * @description: 获取指定 switch 开关状态
 * @description: 这里只展示获取方法，开发者根据实际情况获取
 * @param {*} str 'unOperatedMode': 不可操作模式 'scrollMode' 滚动模式 'drawMode' 绘制模式 'scaleMode': 放缩模式
 * @return {*} true: 开 false 关
 */
function getTargetOperatedMode(str) {
    var data = layui.form.val('form2');
    return data[str] === 'on';
}

/**
 * @description: 设置当前的操作模式
 * @param {*}
 * @return {*} operationMode 当前需要设置的操作模式
 */
function setOperatedMode() {
    var drawMode = getTargetOperatedMode('drawMode') ? 4 : 0;
    var scrollMode = getTargetOperatedMode('scrollMode') ? 2 : 0;
    var scaleMode = getTargetOperatedMode('scaleMode') ? 8 : 0;
    var operationMode = drawMode | scrollMode | scaleMode;

    // 滚动、绘制、放缩均不开启即不可操作模式
    !operationMode && (operationMode = 1);

    return operationMode;
}

/**
 * @description: 不可操作模式
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(unOperatedMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // 可操作模式下，默认开启滚动、绘制、缩放
    // this.checked 表示当前开关打开，开发者根据实际情况判断
    var operationMode = this.checked ? 1 : 14;
    updateOperatedModeDomHandle(operationMode === 1 ? 2 : 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 滚动模式
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(scrollMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var operationMode = setOperatedMode();

    updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 绘制模式
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(drawMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var operationMode = setOperatedMode();

    updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: 放缩模式
 * @description: 监听指定 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(scaleMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var operationMode = setOperatedMode();

    updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});
