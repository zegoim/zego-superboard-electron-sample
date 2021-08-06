/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-06 20:07:19
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

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
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

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
    } catch (error) {}
}

/**
 * @description: 查询 sheet 列表
 * @param {*}
 * @return {*}
 */
function getExcelSheetNameList() {
    // excel 文件
    var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
    var sheetIndex = 0;

    // 获取 sheetList
    zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
    updateExcelSheetListDomHandle(zegoSuperBoardSubViewModel.uniqueID, zegoExcelSheetNameList);

    // 获取当前 sheetIndex
    zegoExcelSheetNameList.forEach(function(element, index) {
        element === sheetName && (sheetIndex = index);
    });
    updateCurrSheetDomHandle(zegoSuperBoardSubViewModel.uniqueID, sheetIndex);
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

        // 更新白板列表
        updateWhiteboardListDomHandle(zegoSuperBoardSubViewModelList);

        //  获取当前挂载的白板
        zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
        if (zegoSuperBoardSubView) {
            // 隐藏白板占位
            togglePlaceholderDomHandle(2);

            zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
            // 更新当前白板
            updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
            // 更新总页数、当前页
            updatePageCountDomHandle(zegoSuperBoardSubView.getPageCount());
            updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());

            if (zegoSuperBoardSubViewModel.fileType === 4) {
                // excel 文件白板
                toggleSheetSelectDomHandle(1);
                // 查询 sheet 列表
                getExcelSheetNameList();
            } else {
                toggleSheetSelectDomHandle(2);

                zegoExcelSheetNameList = [];
                updateExcelSheetListDomHandle('', zegoExcelSheetNameList);
            }
        } else {
            // 显示白板占位
            togglePlaceholderDomHandle(1);
        }
    } catch (error) {}
}

// 切换白板
layui.form.on('select(whiteboardList)', async function(data) {
    var uniqueID = data.value;
    zegoSuperBoardSubViewModelList.forEach(function(element) {
        if (uniqueID === element.uniqueID) {
            zegoSuperBoardSubViewModel = element;
        }
    });

    if (zegoSuperBoardSubViewModel.fileType === 4) {
        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, 0);
    } else {
        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID);
    }

    zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();

    if (zegoSuperBoardSubViewModel.fileType === 4) {
        // excel 文件
        var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
        var sheetIndex = 0;

        // 获取 sheetList
        zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
        updateExcelSheetListDomHandle(zegoSuperBoardSubViewModel.uniqueID, zegoExcelSheetNameList);

        // 获取当前 sheetIndex
        zegoExcelSheetNameList.forEach(function(element, index) {
            element === sheetName && (sheetIndex = index);
        });

        toggleSheetSelectDomHandle(1);
        updateCurrSheetDomHandle(zegoSuperBoardSubViewModel.uniqueID, sheetIndex);
    } else {
        zegoExcelSheetNameList = [];
        updateExcelSheetListDomHandle('', zegoExcelSheetNameList);
        toggleSheetSelectDomHandle(2);
    }
    // 更新总页数、当前页
    updatePageCountDomHandle(zegoSuperBoardSubView.getPageCount());
    updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
});

// 切换 sheet
layui.form.on('select(sheetList)', async function(data) {
    var temp = data.value.split(',');
    var uniqueID = temp[0];
    var sheetIndex = temp[1];
    await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, sheetIndex);
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
