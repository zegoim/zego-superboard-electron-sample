/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 11:47:35
 * @LastEditTime: 2021-08-25 01:53:43
 * @LastEditors: Please set LastEditors
 * @Description: Whiteboard Zoom
 * @FilePath: /superboard/js/room/setScaleFactor.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.
var setScaleFactorUtils = {
    /**
     * @description: Update the page scale.
     * @description: Only the updated content is displayed here. You can handle it as required.
     * @param {Number} scale Target scale
     */
    updateScaleDomHandle: function (scale) {
        layui.form.val('customForm', {
            scale: scale + ''
        });
    }
};

/**
 * @description: Synchronous zooming.
 * @description: Listen for the switch status of synchronous zooming on the page.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(syncScale)', function () {
    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    var bool = this.checked;
    zegoSuperBoard.enableSyncScale(bool);
});

/**
 * @description: Responding zooming.
 * @description: Listen for the switch status of responding zooming on the page.
 * @description: Only the listening method is displayed here. You can listen as required.
 */
layui.form.on('switch(responseScale)', function () {
    // Obtain the current switch status. You can obtain it as required.
    // true: enable; false: disable.
    var bool = this.checked;
    zegoSuperBoard.enableResponseScale(bool);
});

/**
 * @description: Listen for the drop-down list to switch the scale.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 */
layui.form.on('select(scaleList)', function () {
    // Obtain the current scale selected from the drop-down list on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('customForm');
    var scale = +formData.scale;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(scale);
});

/**
 * @description: Zoom out by clicking the minus sign (-) on the page.
 */
$('#setScaleFactorCut').click(function () {
    // Obtain the current scale selected from the drop-down list on the page. layui is used here. You can obtain it as required.
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 1) return; // The minimum is 1, less than 1 does not allow shrinking

    var targetScale = currScale - 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        setScaleFactorUtils.updateScaleDomHandle(targetScale);
    }
});

/**
 * @description: Zoom in by clicking the plus sign (+) on the page.
 */
$('#setScaleFactorAdd').click(function () {
    // Obtain the current scale selected from the drop-down list on the page. layui is used here. You can obtain it as required.
    var currScale = +layui.form.val('customForm').scale;
    if (currScale === 3) return; // Maximum is 3, larger than 3 does not allow zooming

    var targetScale = currScale + 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(targetScale);

        setScaleFactorUtils.updateScaleDomHandle(targetScale);
    }
});