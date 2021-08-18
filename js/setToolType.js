/*
 * @Author: ZegoDev
 * @Date: 2021-08-12 12:21:41
 * @LastEditTime: 2021-08-18 16:29:47
 * @LastEditors: Please set LastEditors
 * @Description: 设置白板工具
 * @FilePath: /superboard/js/setToolType.js
 */

/**
 * @description: 设置工具类型
 * @param {*} toolType 工具类型
 * @param {*} event event
 */
async function setToolType(toolType, event) {
    var zegoSuperBoardSubView = await zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    if (toolType === 256) {
        var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
        // 非动态 PPT、自定义 H5 不允许使用点击工具
        if (zegoSuperBoardSubViewModel.fileType !== 512 && zegoSuperBoardSubViewModel.fileType !== 4096) return;
    }

    if (toolType !== undefined) {
        var result = zegoSuperBoard.setToolType(toolType);
        console.warn('result', result);
        // 设置失败，直接返回
        if (!result) return toast('设置失败');

        if (toolType === 512) {
            // 默认第一个自定义图形
            setCustomGraph(0, event);
        }
    } else {
        // 默认矩形
        var result = zegoSuperBoard.setToolType(8);
        console.warn('result', result);

        // 设置失败，直接返回
        if (!result) return toast('设置失败');
    }
    updateActiveToolDomHandle(toolType, event);
}

/**
 * @description: 更新当前选中工具
 * @param {*} type 工具类型
 * @param {*} event event
 * @return {*}
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
        case undefined: // 图形
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
        case 8: // 矩形
        case 16: // 椭圆
        case 4: // 直线
            $('.graph-style-item').removeClass('active');
            $('.graph-style-item:nth-of-type(' + (type === 8 ? 1 : type === 16 ? 2 : 3) + ')').addClass('active');
            break;
        case 512: // 自定义图形
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
