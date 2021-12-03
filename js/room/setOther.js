/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 16:24:43
 * @LastEditTime: 2021-08-25 02:02:09
 * @LastEditors: Please set LastEditors
 * @Description: 设置笔锋、画笔粗细、画笔颜色、文本大小、文本粗体、文本斜体
 * @FilePath: /superboard/js/room/setOther.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance

var setOtherUtils = {
    /**
     * @description: 更新页面上当前笔触粗细的样式
     * @param {Event} event event
     */
    updateActiveBrushSizeDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.bs-item').removeClass('active');
        $('.bs-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: 更新页面上当前笔触颜色的样式
     * @param {Event} event event
     */
    updateActiveBrushColorDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.color-item').removeClass('active');
        $('.color-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: 更新页面上当前文本大小的样式
     * @param {Event} event event
     */
    updateActiveFontSizeDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.pencil-size-item').removeClass('active');
        $('.pencil-size-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: 更新页面上当前文本粗体、斜体的样式
     * @param {Event} event event
     */
    updateActiveFontStyleHandle: function(event) {
        event.stopPropagation();
        $(event.currentTarget).toggleClass('active');
    }
};

/**
 * @description: 开启笔锋
 * @description: 监听页面笔锋 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(handwriting)', function() {
    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开（同步）false: 关闭（不同步）
    var bool = this.checked;
    zegoSuperBoard.enableHandwriting(bool);
});

/**
 * @description: 开启自定义光标
 * @description: 监听页面自定义光标 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(enableCustomCursor)', function() {
    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开（同步）false: 关闭（不同步）
    var bool = this.checked;
    zegoSuperBoard.enableCustomCursor(bool);
});

/**
 * @description: 开启自定义光标
 * @description: 监听页面自定义光标 switch 开关状态
 * @description: 这里只展示监听方法，开发者根据实际情况监听
 */
layui.form.on('switch(enableRemoteCursorVisible)', function() {
    // 获取当前 switch 的打开状态，开发者根据实际情况获取
    // true: 打开（同步）false: 关闭（不同步）
    var bool = this.checked;
    zegoSuperBoard.enableRemoteCursorVisible(bool);
});

/**
 * @description: 设置画笔粗细
 * @param {Number} brushSize 画笔粗细
 * @param {Event} event event
 */
function setBrushSize(brushSize, event) {
    zegoSuperBoard.setBrushSize(brushSize);

    setOtherUtils.updateActiveBrushSizeDomHandle(event);
}

/**
 * @description: 设置画笔颜色
 * @param {String} color 画笔颜色
 * @param {Event} event event
 */
function setBrushColor(color, event) {
    zegoSuperBoard.setBrushColor(color);

    setOtherUtils.updateActiveBrushColorDomHandle(event);
}

/**
 * @description: 设置文本大小
 * @param {Number} fontSize 文本大小
 * @param {Event} event event
 */
function setFontSize(fontSize, event) {
    zegoSuperBoard.setFontSize(fontSize);

    setOtherUtils.updateActiveFontSizeDomHandle(event);
}

/**
 * @description: 设置文本粗体
 * @param {Event} event event
 */
function setFontBold(event) {
    // 获取当前是否是粗体
    var bold = zegoSuperBoard.isFontBold();
    // 取反
    zegoSuperBoard.setFontBold(!bold);

    setOtherUtils.updateActiveFontStyleHandle(event);
}

/**
 * @description: 设置文本斜体
 * @param {Event} event event
 */
function setFontItalic(event) {
    // 获取当前是否是斜体
    var italic = zegoSuperBoard.isFontItalic();
    // 取反
    zegoSuperBoard.setFontItalic(!italic);

    setOtherUtils.updateActiveFontStyleHandle(event);
}
