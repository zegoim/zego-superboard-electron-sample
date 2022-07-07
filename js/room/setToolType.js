/*
 * @Author: ZegoDev
 * @Date: 2021-08-12 12:21:41
 * @LastEditTime: 2021-08-27 11:12:18
 * @LastEditors: Please set LastEditors
 * @Description: Set up the whiteboard tool
 * @FilePath: /superboard/js/room/setToolType.js
 */

/**
 * @description: Set the tool type.
 * @param {Number} toolType Tool type
 * @param {Event} event event
 */
function setToolType(toolType, event) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    if (toolType === 256) {
        // The target tool type is Click.
        // For non-animated PPT files or custom H5 files, the Click tool cannot be used.
        var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
        if (zegoSuperBoardSubViewModel.fileType !== 512 && zegoSuperBoardSubViewModel.fileType !== 4096) return;
    }

    if (toolType !== undefined) {
        // The target tool types include Drag, Pen, Select, Laser Pen, Text, Custom Graph, and Eraser.
        var result = zegoSuperBoard.setToolType(toolType);
        console.warn('result', result);
        // The setting is failed, and a pop-up box of the failure message is displayed.
        if (!result) return roomUtils.toast('Setup failed');

        if (toolType === 512) {
            // The target tool type is Custom Graph.
            // The first custom graph is selected by default.
            setCustomGraph(0, event);
        }
    } else {
        // When the target tool type is undefined, only business functions can be implemented, which is not supported by the SDK.
        // When toolType is undefined, it indicates that you need to select a shape from a rectangle, an ellipse, and a straight line. 
        // The rectangle is selected by default.
        var result = zegoSuperBoard.setToolType(8);
        console.warn('result', result);

        // The setting is failed, and a pop-up box of the failure message is displayed.
        if (!result) return roomUtils.toast('Setup failed');
    }
    updateActiveToolDomHandle(toolType, event);
}

/**
 * @description: Update the current tool type on the toolbar.
 * @description: The method can only be used to update the toolbar on the page. You can handle it as required.
 * @param {Number|undefined} type Tool type
 * @param {Event} event event
 */
function updateActiveToolDomHandle(type, event) {
    event.stopPropagation();
    switch (type) {
        case 256:
        case 32:
        case null:
        case 128:
        case 64:
            $('.tool-item').removeClass('active');
            $('.pencil-text-setting').removeClass('active');
            $('.custom-graph-setting').removeClass('active');
            $(event.currentTarget).addClass('active');
            break;
        case 1:
        case 2:
        case undefined: // graphics
            $('.tool-item').removeClass('active');
            $('.pencil-text-setting').removeClass('active');
            $('.custom-graph-setting').removeClass('active');
            $(event.currentTarget)
                .addClass('active')
                .find('.pencil-text-setting')
                .addClass('active');
            if (type === undefined) {
                $('.graph-style-item').removeClass('active');
                $('.graph-style-item:nth-of-type(1)').addClass('active');
            }
            break;
        case 8: // rectangle
        case 16: // oval
        case 4: // straight line
            $('.graph-style-item').removeClass('active');
            $('.graph-style-item:nth-of-type(' + (type === 8 ? 1 : type === 16 ? 2 : 3) + ')').addClass('active');
            break;
        case 512: // custom graphics
            $('.tool-item').removeClass('active');
            $('.pencil-text-setting').removeClass('active');
            $(event.currentTarget)
                .addClass('active')
                .find('.custom-graph-setting')
                .addClass('active');
            break;
        default:
            break;
    }
}
