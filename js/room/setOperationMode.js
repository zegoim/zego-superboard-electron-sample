/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 21:28:34
 * @LastEditTime: 2021-08-25 01:52:17
 * @LastEditors: Please set LastEditors
 * @Description: Set the whiteboard operation mode
 * @FilePath: /superboard/js/room/operationMode.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var setOperationModeUtils = {
    /**
     * @description: Enable or disable the scrolling mode, drawing mode, and zooming mode on the page.
     * @description: Only updated switch functions on the page are displayed here. You can handle it as required.
     * @param {Boolean} type true: enable; false: disable.
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
     * @description: Enable or disable the non-operational mode on the page.
     * @description: Only updated switch functions on the page are displayed here. You can handle it as required.
     * @param {Boolean} type true: enable; false: disable.
     */
    updateUnOperatedModeDomHandle: function(type) {
        layui.form.val('form2', {
            unOperatedMode: type ? 'on' : ''
        });
    },

    /**
     * @description: Obtain the switch status of the non-operational mode, scrolling mode, drawing mode, and zooming mode on the page.
     * @description: Only the obtaining method is displayed here. You can obtain it as required.
     * @param {String} str 'unOperatedMode': Non-operational mode 'scrollMode' Scrolling mode 'drawMode' Drawing mode 'scaleMode': Zooming mode
     * @return {Boolean} true: enable; false: disable.
     */
    getTargetOperatedMode: function(str) {
        var data = layui.form.val('form2');
        return data[str] === 'on';
    },

    /**
     * @description: Obtain the operation mode to be set.
     * @return {Number} operationMode Operation mode to be set
     */
    calOperatedMode: function() {
        var drawMode = setOperationModeUtils.getTargetOperatedMode('drawMode') ? 4 : 0;
        var scrollMode = setOperationModeUtils.getTargetOperatedMode('scrollMode') ? 2 : 0;
        var scaleMode = setOperationModeUtils.getTargetOperatedMode('scaleMode') ? 8 : 0;
        var operationMode = drawMode | scrollMode | scaleMode;

        // When the scrolling mode, drawing mode, and zooming mode are all disabled, the non-operational mode is enabled.
        !operationMode && (operationMode = 1);

        return operationMode;
    }
};

/**
 * @description: Listen for the switch status of the non-operational mode, and update the switch status of other operation modes.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(unOperatedMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    // When the non-operational mode is disabled, the scrolling mode, drawing mode, and zooming mode are enabled by default.
    var operationMode = this.checked ? 1 : 14;
    setOperationModeUtils.updateOperatedModeDomHandle(operationMode !== 1);
    console.warn('SuperBoard Demo operationMode', operationMode);

    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: Listen for the switch status of the scrolling mode, and update the switch status of the non-operational mode.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(scrollMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the operation mode to be set.
    var operationMode = setOperationModeUtils.calOperatedMode();
    // Enable or disable the non-operational mode based on the current operation mode.
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: Listen for the switch status of the drawing mode, and update the switch status of the non-operational mode.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(drawMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the operation mode to be set.
    var operationMode = setOperationModeUtils.calOperatedMode();
    // Enable or disable the non-operational mode based on the current operation mode.
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

/**
 * @description: Listen for the switch status of the zooming mode, and update the switch status of the non-operational mode.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(scaleMode)', function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the operation mode to be set.
    var operationMode = setOperationModeUtils.calOperatedMode();
    // Enable or disable the non-operational mode based on the current operation mode.
    setOperationModeUtils.updateUnOperatedModeDomHandle(operationMode === 1);

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});
