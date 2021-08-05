/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-06 03:28:55
 * @LastEditors: Please set LastEditors
 * @Description: 白板、文件相关
 * @FilePath: /superboard_demo_web/js/whiteboard.js
 */

/**
 * @description: 创建普通白板
 * @param {*}
 * @return {*}
 */
async function createWhiteboardView() {
    try {
        zegoSuperBoardSubViewModel = await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + '创建的白板' + WBNameIndex++,
            perPageWidth: 500,
            perPageHeight: 500,
            pageCount: 5 // 默认水平分页
        });
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
    } catch (error) {}
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 * @return {*}
 */
async function createFileView(fileID) {
    try {
        zegoSuperBoardSubViewModel = await zegoSuperBoard.createFileView({ fileID });
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);

        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
    } catch (error) {}
}

/**
 * @description: 查询白板列表
 * @param {*}
 * @return {*}
 */
async function querySuperBoardSubViewList() {
    try {
        zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
        console.warn('zegoSuperBoardSubViewModelList', zegoSuperBoardSubViewModelList);

        if (!zegoSuperBoardSubViewModelList.length) {
            // 显示白板占位
            togglePlaceholderDomHandle(1);
        } else {
            // 隐藏白板占位
            togglePlaceholderDomHandle(2);
        }

        // 更新白板列表
        updateWhiteboardListDomHandle();

        // 更新当前选中白板
        zegoSuperBoardSubViewModel && updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
    } catch (error) {}
}

// 切换白板
layui.form.on('select(whiteboardList)', function(data) {
    var uniqueID = data.value;
    if (uniqueID) {
        zegoSuperBoardSubViewModelList.forEach(function(element) {
            if (uniqueID === element.uniqueID) {
                zegoSuperBoardSubViewModel = element;
            }
        });
        zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID);
    }
});

// 绑定创建普通白板事件
$('.shareWhiteboard').click(function() {
    // 限频
    createWhiteboardView();
});

// 绑定创建文件白板事件
$('#file-list').click(function(event) {
    // 限频
    var target = event.target;
    var fileID = $(target)
        .parent('#file-list')
        .find('li')
        .attr('data-file-id');
    createFileView(fileID);
});
