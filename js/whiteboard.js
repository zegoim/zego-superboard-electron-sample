/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-07 02:37:18
 * @LastEditors: Please set LastEditors
 * @Description: 白板、文件相关
 * @FilePath: /superboard_demo_web/js/whiteboard.js
 */

/**
 * @description: 监听白板回调
 * @param {*}
 * @return {*}
 */
function onSuperBoardEventHandle() {
    zegoSuperBoard.on('remoteSuperBoardSubViewAdded', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewAdded', ...arguments);
        // 初次查询一定要在此回调中
        querySuperBoardSubViewList();
    });
}

/**
 * @description: 创建普通白板
 * @param {*}
 * @return {*}
 */
async function createWhiteboardView() {
    try {
        await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + '创建的白板' + WBNameIndex++,
            perPageWidth: 500,
            perPageHeight: 500,
            pageCount: 5 // 默认水平分页
        });
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);

        var zegoSuperBoardSubViewModel = zegoSuperBoard
            .getSuperBoardView()
            .getCurrentSuperBoardSubView()
            .getModel();

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
        toggleStepDomHandle(2);
        toggleThumbBtnDomHandle(2);
    } catch (error) {}
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 * @return {*}
 */
async function createFileView(fileID) {
    try {
        await zegoSuperBoard.createFileView({ fileID });
        console.warn('zegoSuperBoardSubViewModel', zegoSuperBoardSubViewModel);

        var zegoSuperBoardSubViewModel = zegoSuperBoard
            .getSuperBoardView()
            .getCurrentSuperBoardSubView()
            .getModel();

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
        toggleStepDomHandle(
            zegoSuperBoardSubViewModel.fileType === 512 || zegoSuperBoardSubViewModel.fileType === 4096 ? 1 : 2
        );
        toggleThumbBtnDomHandle(
            zegoSuperBoardSubViewModel.fileType === 1 ||
                zegoSuperBoardSubViewModel.fileType === 8 ||
                zegoSuperBoardSubViewModel.fileType === 512 ||
                zegoSuperBoardSubViewModel.fileType === 4096
                ? 1
                : 2
        );
    } catch (error) {}
}

/**
 * @description: 查询 sheet 列表
 * @param {*}
 * @return {*}
 */
function getExcelSheetNameList() {
    // excel 文件
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
    var sheetIndex = 0;

    // 获取 sheetList
    var zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
    updateExcelSheetListDomHandle(zegoSuperBoardSubView.getModel().uniqueID, zegoExcelSheetNameList);

    // 获取当前 sheetIndex
    zegoExcelSheetNameList.forEach(function(element, index) {
        element === sheetName && (sheetIndex = index);
    });
    updateCurrSheetDomHandle(zegoSuperBoardSubView.getModel().uniqueID, sheetIndex);
}

/**
 * @description: 查询白板列表
 * @param {*}
 * @return {*}
 */
async function querySuperBoardSubViewList() {
    try {
        var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
        console.warn('SuperBoard Demo querySuperBoardSubViewList', zegoSuperBoardSubViewModelList);

        // 更新白板列表
        updateWhiteboardListDomHandle(zegoSuperBoardSubViewModelList);

        //  获取当前挂载的白板
        var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
        if (zegoSuperBoardSubView) {
            // 隐藏白板占位
            togglePlaceholderDomHandle(2);

            var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
            // 更新当前白板
            updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
            // 更新总页数、当前页
            updatePageCountDomHandle(zegoSuperBoardSubView.getPageCount());
            updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
            toggleStepDomHandle(
                zegoSuperBoardSubViewModel.fileType === 512 || zegoSuperBoardSubViewModel.fileType === 4096 ? 1 : 2
            );
            toggleThumbBtnDomHandle(
                zegoSuperBoardSubViewModel.fileType === 1 ||
                    zegoSuperBoardSubViewModel.fileType === 8 ||
                    zegoSuperBoardSubViewModel.fileType === 512 ||
                    zegoSuperBoardSubViewModel.fileType === 4096
                    ? 1
                    : 2
            );
            if (zegoSuperBoardSubViewModel.fileType === 4) {
                // excel 文件白板
                toggleSheetSelectDomHandle(1);
                // 查询 sheet 列表
                getExcelSheetNameList();
            } else {
                toggleSheetSelectDomHandle(2);
            }
        } else {
            // 显示白板占位
            togglePlaceholderDomHandle(1);
        }
    } catch (error) {}
}

/**
 * @description: 跳转到指定页
 * @param {*} page 目标页面
 * @return {*}
 */
function flipToPage(page) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToPage(page);

    updateCurrPageDomHandle(page);
}

// 切换白板
layui.form.on('select(whiteboardList)', async function(data) {
    var uniqueID = data.value;
    var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
    var zegoSuperBoardSubViewModel;
    zegoSuperBoardSubViewModelList.forEach(function(element) {
        if (uniqueID === element.uniqueID) {
            zegoSuperBoardSubViewModel = element;
        }
    });

    if (zegoSuperBoardSubViewModel.fileType === 4) {
        // 默认切换到第一个 sheet（SDK 内部没有记录上一次的下标）
        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, 0);
        toggleSheetSelectDomHandle(1);
        getExcelSheetNameList();
    } else {
        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID);
        toggleSheetSelectDomHandle(2);
    }

    toggleStepDomHandle(
        zegoSuperBoardSubViewModel.fileType === 512 || zegoSuperBoardSubViewModel.fileType === 4096 ? 1 : 2
    );
    toggleThumbBtnDomHandle(
        zegoSuperBoardSubViewModel.fileType === 1 ||
            zegoSuperBoardSubViewModel.fileType === 8 ||
            zegoSuperBoardSubViewModel.fileType === 512 ||
            zegoSuperBoardSubViewModel.fileType === 4096
            ? 1
            : 2
    );

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
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
    $('#filelistModal').modal('hide');

    createFileView(fileID);
});

// 绑定翻页、跳步事件
// 上一页
$('#previousPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToPrevPage();

    updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
});
// 下一页
$('#nextPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.flipToNextPage();

    updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
});
// 上一步
$('#previousStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.previousStep();
});
// 下一步
$('#nextStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.nextStep();
});

// 设置缩放
$('.zoom-cut').click(function() {
    var currZoomLevel = $('#zoomLevel').val();
    if (currZoomLevel === '1') return;
    var zoom = Number(currZoomLevel) - 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(zoom);

    zoomDomHandle(zoom);
});

$('.zoom-add').click(function() {
    var currZoomLevel = $('#zoomLevel').val();
    if (currZoomLevel === '3') return;
    var zoom = Number(currZoomLevel) + 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(zoom);

    zoomDomHandle(zoom);
});

// 获取缩略图
$('#thumb-button').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    var type = zegoSuperBoardSubView.getModel().fileType;
    // 仅支持 PDF，PPT，动态 PPT 文件格式
    var supportType = [1, 8, 512, 4096];
    if (supportType.includes(type)) {
        var thumbnailUrlList = zegoSuperBoardSubView.getThumbnailUrlList();
        updateThumbListDomHandle(thumbnailUrlList, zegoSuperBoardSubView.getCurrentPage());
    } else {
        alert('获取缩略图仅支持“PDF，PPT，动态PPT，H5”文件格式');
    }
});
