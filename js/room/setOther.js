/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 16:24:43
 * @LastEditTime: 2021-08-25 02:02:09
 * @LastEditors: Please set LastEditors
 * @Description: Set stroke, brush thickness, brush color, text size, text bold, text italic
 * @FilePath: /superboard/js/room/setOther.js
 */

// zegoSuperBoard is a global Super Board instance.

var setOtherUtils = {
    /**
     * @description: Update the current pen size on the page.
     * @param {Event} event event
     */
    updateActiveBrushSizeDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.bs-item').removeClass('active');
        $('.bs-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: Update the current pen color on the page.
     * @param {Event} event event
     */
    updateActiveBrushColorDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.color-item').removeClass('active');
        $('.color-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: Update the current text size on the page.
     * @param {Event} event event
     */
    updateActiveFontSizeDomHandle: function(event) {
        event.stopPropagation();
        var index = $(event.currentTarget).attr('data-index');
        $('.pencil-size-item').removeClass('active');
        $('.pencil-size-item:nth-of-type(' + index + ')').addClass('active');
    },

    /**
     * @description: Update the current bold style and italic style on the page.
     * @param {Event} event event
     */
    updateActiveFontStyleHandle: function(event) {
        event.stopPropagation();
        $(event.currentTarget).toggleClass('active');
    }
};

/**
 * @description: Enable the handwriting mode.
 * @description: Listen for the switch status of the handwriting mode.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(handwriting)', function() {
    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    var bool = this.checked;
    zegoSuperBoard.enableHandwriting(bool);
});

/**
 * @description: Enable the custom cursor.
 * @description: Listen for the switch status of the custom cursor.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(enableCustomCursor)', function() {
    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    var bool = this.checked;
    zegoSuperBoard.enableCustomCursor(bool);
});

/**
 * @description: Enable the custom cursor.
 * @description: Listen for the switch status of the custom cursor.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(enableRemoteCursorVisible)', function() {
    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    var bool = this.checked;
    zegoSuperBoard.enableRemoteCursorVisible(bool);
});

/**
 * @description: Set the pen size.
 * @param {Number} brushSize Pen size
 * @param {Event} event event
 */
function setBrushSize(brushSize, event) {
    zegoSuperBoard.setBrushSize(brushSize);

    setOtherUtils.updateActiveBrushSizeDomHandle(event);
}

/**
 * @description: Set the pen color.
 * @param {String} color Pen color
 * @param {Event} event event
 */
function setBrushColor(color, event) {
    zegoSuperBoard.setBrushColor(color);

    setOtherUtils.updateActiveBrushColorDomHandle(event);
}

/**
 * @description: Set the text size.
 * @param {Number} fontSize Text size
 * @param {Event} event event
 */
function setFontSize(fontSize, event) {
    zegoSuperBoard.setFontSize(fontSize);

    setOtherUtils.updateActiveFontSizeDomHandle(event);
}

/**
 * @description: Set the bold style.
     * @param {Event} event event
     */
function setFontBold(event) {
    // Specify whether the bold style is enabled.
    var bold = zegoSuperBoard.isFontBold();
    // Bitwise not
    zegoSuperBoard.setFontBold(!bold);

    setOtherUtils.updateActiveFontStyleHandle(event);
}

/**
 * @description: Set the italic style.
     * @param {Event} event event
     */
function setFontItalic(event) {
    // Specify whether the italic style is enabled.
    var italic = zegoSuperBoard.isFontItalic();
    // Bitwise not
    zegoSuperBoard.setFontItalic(!italic);

    setOtherUtils.updateActiveFontStyleHandle(event);
}
