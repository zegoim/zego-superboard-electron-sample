/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-06 15:42:43
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

        zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();

        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);

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

        zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();

        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);

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
    } catch (error) {}
}

// 切换白板
layui.form.on('select(whiteboardList)', async function(data) {
    var uniqueID = data.value;
    if (uniqueID) {
        zegoSuperBoardSubViewModelList.forEach(function(element) {
            if (uniqueID === element.uniqueID) {
                zegoSuperBoardSubViewModel = element;
            }
        });
        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID);
        zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();

        if (zegoSuperBoardSubViewModel.fileType === 4) {
            // excel 文件
            var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
            var sheetIndex = 0;

            // 获取 sheetList
            zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();

            updateExcelSheetListDomHandle();

            // 获取当前 sheetIndex
            zegoExcelSheetNameList.forEach(function(element, index) {
                element === sheetName && (sheetIndex = index);
            });
            updateCurrSheetDomHandle(sheetIndex);
        }
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
    var fileID;
    if (target.tagName === 'LI') {
        fileID = $(target).attr('data-file-id');
    } else if (target.tagName === 'DIV') {
        fileID = $(target.parentNode).attr('data-file-id');
    }

    createFileView(fileID);
});
