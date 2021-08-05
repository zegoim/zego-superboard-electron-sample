/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-05 19:06:12
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
            name: zegoConfig.userName + '创建的白板' + ++WBNameIndex,
            perPageWidth: 500,
            perPageHeight: 500,
            pageCount: 5 // 默认水平分页
        });
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);
    } catch (error) {}
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 * @return {*}
 */
async function createFileView(fileID) {
    try {
        zegoSuperBoardSubViewModel = await zegoSuperBoard.createFileView(fileID);
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);
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
    } catch (error) {}
}

// 绑定创建普通白板事件
$('.shareWhiteboard').click(function() {
    // 限频
    createWhiteboardView();
});
