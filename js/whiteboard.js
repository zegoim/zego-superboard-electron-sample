/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-05 02:16:54
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
        var zegoSuperBoardSubViewModel = await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + '创建的白板' + ++WBNameIndex,
            perPageWidth: 500,
            perPageHeight: 500,
            pageCount: 5 // 默认水平分页
        });
    } catch (error) {}
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 * @return {*}
 */
async function createFileView(fileID) {
    try {
        var zegoSuperBoardSubViewModel = await zegoSuperBoard.createFileView(fileID);
    } catch (error) {}
}

// 绑定创建普通白板事件
$('.shareWhiteboard').click(function() {
    // 限频
    createWhiteboardView();
});
