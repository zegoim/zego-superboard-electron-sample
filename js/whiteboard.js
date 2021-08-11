/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-11 15:33:26
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
    zegoSuperBoard.on('error', toast);
    zegoSuperBoard.on('superBoardSubViewScrolled', function(uniqueID, page, step) {
        console.warn('SuperBoard Demo superBoardSubViewScrolled', ...arguments);
        var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
        if (zegoSuperBoardSubView && zegoSuperBoardSubView.getModel().uniqueID == uniqueID) {
            // 初次查询页数获取不到，只能使用当前回调中的值
            updateCurrPageDomHandle(page);
        }
    });
    zegoSuperBoard.on('remoteSuperBoardSubViewAdded', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewAdded', ...arguments);
        // 初次查询一定要在此回调中
        querySuperBoardSubViewList();
    });
    zegoSuperBoard.on('remoteSuperBoardSubViewRemoved', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewRemoved', ...arguments);
        querySuperBoardSubViewList();
    });
    zegoSuperBoard.on('remoteSuperBoardSubViewSwitched', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewSwitched', ...arguments);
        querySuperBoardSubViewList();
    });
    zegoSuperBoard.on('remoteSuperBoardSubViewExcelSwitched', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewExcelSwitched', ...arguments);
        querySuperBoardSubViewList();
    });
    zegoSuperBoard.on('remoteSuperBoardAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardAuthChanged', ...arguments);
    });
    zegoSuperBoard.on('remoteSuperBoardGraphicAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardGraphicAuthChanged', ...arguments);
    });
    zegoSuperBoard.on('remoteScaleChanged', function() {
        console.warn('SuperBoard Demo remoteScaleChanged', ...arguments);
    });
}

/**
 * @description: 监听其他回调
 * @param {*}
 * @return {*}
 */
function onDocumentEventHandle() {
    window.addEventListener('keydown', function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (!e) return;
        switch (e.keyCode) {
            case 8: // 监听 backspace 按键，批量删除选中图元
            case 46: // 监听 Delete 按键，批量删除选中图元
                clearSelected();
                break;
            default:
                break;
        }
    });
}

/**
 * @description: 创建普通白板
 * @param {*}
 * @return {*}
 */
async function createWhiteboardView() {
    try {
        // 限频
        await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + '创建的白板' + seqMap.viewSeq++,
            perPageWidth: 500,
            perPageHeight: 500,
            pageCount: 5 // 默认水平分页
        });
        var zegoSuperBoardSubViewModel = zegoSuperBoard
            .getSuperBoardView()
            .getCurrentSuperBoardSubView()
            .getModel();

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
        toggleThumbBtnDomHandle(2);
    } catch (errorData) {
        toast(errorData);
    }
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 * @return {*}
 */
async function createFileView(fileID) {
    try {
        await zegoSuperBoard.createFileView({ fileID });
        var zegoSuperBoardSubViewModel = zegoSuperBoard
            .getSuperBoardView()
            .getCurrentSuperBoardSubView()
            .getModel();

        // 隐藏白板占位
        togglePlaceholderDomHandle(2);

        querySuperBoardSubViewList();
        updateCurrWhiteboardDomHandle(zegoSuperBoardSubViewModel.uniqueID);
        toggleThumbBtnDomHandle(
            zegoSuperBoardSubViewModel.fileType === 1 ||
                zegoSuperBoardSubViewModel.fileType === 8 ||
                zegoSuperBoardSubViewModel.fileType === 512 ||
                zegoSuperBoardSubViewModel.fileType === 4096
                ? 1
                : 2
        );
    } catch (errorData) {
        toast(errorData);
    }
}

/**
 * @description: 销毁白板
 * @param {*} type 1: 销毁当前白板 2: 销毁所有白板
 * @return {*}
 */
async function destroySuperBoardSubView(type) {
    if (type === 1) {
        var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
        if (!zegoSuperBoardSubView) return;
        try {
            loading('销毁中');
            await zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubView.getModel().uniqueID);
            closeLoading();
            toast('销毁成功');

            querySuperBoardSubViewList();
        } catch (errorData) {
            closeLoading();
            toast(errorData);
        }
    } else {
        try {
            loading('销毁中');

            var tasks = [];
            var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
            zegoSuperBoardSubViewModelList.forEach(function(zegoSuperBoardSubViewModel) {
                tasks.push(zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubViewModel.uniqueID));
            });
            await Promise.all(tasks);
            querySuperBoardSubViewList();
            closeLoading();
            toast('销毁成功');
        } catch (errorData) {
            closeLoading();
            toast(errorData);
        }
    }
}

/**
 * @description: 设置渲染延时
 * @param {*}
 * @return {*}
 */
function setDeferredRenderingTime() {
    var deferredRenderingTime = getFormData('form2').deferredRenderingTime;
    if (!deferredRenderingTime) return toast('请输入延时时长');

    zegoSuperBoard.setDeferredRenderingTime(+deferredRenderingTime);
    toast('设置成功');
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
    } catch (errorData) {
        toast(errorData);
    }
}

/**
 * @description: 设置工具类型
 * @param {*} toolType 工具类型
 * @param {*} event event
 * @return {*}
 */
function setToolType(toolType, event) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    if (toolType === 256) {
        var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
        // 非动态 PPT、自定义 H5 不允许使用点击工具
        if (zegoSuperBoardSubViewModel.fileType !== 512 && zegoSuperBoardSubViewModel.fileType !== 4096) return;
    }

    if (toolType !== undefined) {
        zegoSuperBoard.setToolType(toolType);
        if (toolType === 512) {
            // 默认第一个自定义图形
            setCustomGraph(0, event);
        }
    } else {
        // 默认矩形
        zegoSuperBoard.setToolType(8);
    }
    updateActiveToolDomHandle(toolType, event);
}

/**
 * @description: 设置画笔粗细
 * @param {*} brushSize 画笔粗细
 * @param {*} event event
 * @return {*}
 */
function setBrushSize(brushSize, event) {
    zegoSuperBoard.setBrushSize(brushSize);

    updateActiveBrushSizeDomHandle(event);
}

/**
 * @description: 设置画笔颜色
 * @param {*} color 颜色
 * @param {*} event event
 * @return {*}
 */
function setBrushColor(color, event) {
    zegoSuperBoard.setBrushColor(color);

    updateActiveBrushColorDomHandle(event);
}

/**
 * @description: 设置文本大小
 * @param {*} fontSize 文本大小
 * @param {*} event event
 * @return {*}
 */
function setFontSize(fontSize, event) {
    zegoSuperBoard.setFontSize(fontSize);

    updateActiveFontSizeDomHandle(event);
}

/**
 * @description: 设置文本粗体
 * @param {*} event event
 * @return {*}
 */
function setFontBold(event) {
    var bold = zegoSuperBoard.isFontBold();
    zegoSuperBoard.setFontBold(!bold);

    updateActiveFontBoldHandle(event);
}

/**
 * @description: 设置文本斜体
 * @param {*} event event
 * @return {*}
 */
function setFontItalic(event) {
    var italic = zegoSuperBoard.isFontItalic();
    zegoSuperBoard.setFontItalic(!italic);

    updateActiveFontItalicHandle(event);
}

/**
 * @description: 清空所有页
 * @param {*}
 * @return {*}
 */
function clearAllPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearAllPage();
}

/**
 * @description: 撤销
 * @param {*}
 * @return {*}
 */
function undo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.undo();
}

/**
 * @description: 重做
 * @param {*}
 * @return {*}
 */
function redo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.redo();
}

/**
 * @description: 白板快照
 * @param {*}
 * @return {*}
 */
function snapshot() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView &&
        zegoSuperBoardSubView.snapshot().then(function(data) {
            var link = document.createElement('a');
            link.href = data.image;
            link.download = zegoSuperBoardSubView.getModel().name + seqMap.saveImg++ + '.png';
            dispatchClickEvent(link);
        });
}

/**
 * @description: 重置白板工具，在动态 PPT 白板切换到其他白板是时使用
 * @param {*} zegoSuperBoardSubViewModel zegoSuperBoardSubViewModel
 * @return {*}
 */
function resetToolType(zegoSuperBoardSubViewModel) {
    // 非动态 PPT、自定义 H5 文件下的工具初始化为画笔
    if (
        zegoSuperBoardSubViewModel.fileType !== 512 &&
        zegoSuperBoardSubViewModel.fileType !== 4096 &&
        zegoSuperBoard.getToolType() === 256
    ) {
        zegoSuperBoard.setToolType(1);
        resetToolTypeDomHandle();
    }
}

/**
 * @description: 清空当前页图元，在橡皮擦工具时生效
 * @param {*}
 * @return {*}
 */
function clearCurrentPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearCurrentPage();
}

/**
 * @description: 删除选中图元
 * @param {*}
 * @return {*}
 */
function clearSelected() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearSelected();
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

    resetToolType(zegoSuperBoardSubViewModel);

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

// 开启笔锋
layui.form.on('switch(handwriting)', function(data) {
    zegoSuperBoard.enableHandwriting(this.checked);
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
