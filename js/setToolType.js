/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 16:24:43
 * @LastEditTime: 2021-08-11 17:21:23
 * @LastEditors: Please set LastEditors
 * @Description: 设置工具类型
 * @FilePath: /superboard/js/setToolType.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

/**
 * @description: 开启笔锋
 * @description: 监听笔锋 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(handwriting)', function() {
    // this.checked 表示当前开关打开，开发者根据实际情况判断
    var bool = this.checked;
    zegoSuperBoard.enableHandwriting(bool);
});

/**
 * @description: 设置画笔粗细
 * @param {*} brushSize 画笔粗细
 * @param {*} event event
 */
function setBrushSize(brushSize, event) {
    zegoSuperBoard.setBrushSize(brushSize);

    updateActiveBrushSizeDomHandle(event);
}

/**
 * @description: 设置画笔颜色
 * @param {*} color 颜色
 * @param {*} event event
 */
function setBrushColor(color, event) {
    zegoSuperBoard.setBrushColor(color);

    updateActiveBrushColorDomHandle(event);
}

/**
 * @description: 设置文本大小
 * @param {*} fontSize 文本大小
 * @param {*} event event
 */
function setFontSize(fontSize, event) {
    zegoSuperBoard.setFontSize(fontSize);

    updateActiveFontSizeDomHandle(event);
}

/**
 * @description: 设置文本粗体
 * @param {*} event event
 */
function setFontBold(event) {
    var bold = zegoSuperBoard.isFontBold();
    zegoSuperBoard.setFontBold(!bold);

    updateActiveFontStyleHandle(event);
}

/**
 * @description: 设置文本斜体
 * @param {*} event event
 */
function setFontItalic(event) {
    var italic = zegoSuperBoard.isFontItalic();
    zegoSuperBoard.setFontItalic(!italic);

    updateActiveFontStyleHandle(event);
}

/**
 * @description: 更新当前笔触粗细
 * @param {*} brushSize 粗细
 * @param {*} event event
 */
function updateActiveBrushSizeDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.bs-item').removeClass('active');
    $('.bs-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 更新当前笔触颜色
 * @param {*} color 颜色
 * @param {*} event event
 */
function updateActiveBrushColorDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.color-item').removeClass('active');
    $('.color-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 更新当前文本大小
 * @param {*} event event
 */
function updateActiveFontSizeDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.pencil-size-item').removeClass('active');
    $('.pencil-size-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 更新文本粗体、斜体页面样式
 * @param {*} event event
 */
function updateActiveFontStyleHandle(event) {
    event.stopPropagation();
    $(event.currentTarget).toggleClass('active');
}
