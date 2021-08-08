/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-08 18:50:39
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

    onResizeHandle();

    // 白板大小自适应，移动端软键盘收缩会引起变化
    window.addEventListener('resize', onResizeHandle);
}

/**
 * @description: resize 回调
 * @param {*} e
 * @return {*}
 */
function onResizeHandle(e) {
    if (!resizeTicking) {
        resizeTicking = true;
        setTimeout(function() {
            reloadView(1);
            resizeTicking = false;
        }, 1000);
    }
}

/**
 * @description:
 * @param {*} type 1: 自适应 2: 自定义
 * @return {*}
 */
function reloadView(type) {
    var dom = document.getElementById(parentDomID);
    var width = dom.clientWidth + 2; // +边框
    var height = dom.clientHeight + 2; // +边框

    if (type === 2) {
        // 自定义尺寸
        var width_set = +layui.form.val('form2').parentWidth;
        var height_set = +layui.form.val('form2').parentHeight;
        if (!width || !height || width < 1 || height < 1) return toast('请输入有效的宽高值');
        if (width_set > width || height_set > height) {
            return toast('请输入小于当前容器尺寸的宽高值');
        }
        width = width_set;
        height = height_set;
        dom.style.cssText += `width:${width}px;height:${height}px;`;
    }
    $('#parentWidthHeight').html(width + ' * ' + height);

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        // 动画100ms
        setTimeout(function() {
            zegoSuperBoardSubView.reloadView();
        }, 120);
    }
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

/**
 * @description: 设置根据类型
 * @param {*} toolType 根据类型
 * @param {*} event event
 * @return {*}
 */
function setToolType(toolType, event) {
    if (toolType === 256) {
        var zegoSuperBoardSubViewModel = zegoSuperBoard
            .getSuperBoardView()
            .getCurrentSuperBoardSubView()
            .getModel();
        // 非动态 PPT、自定义 H5 不允许使用点击工具
        if (zegoSuperBoardSubViewModel.fileType !== 512 && zegoSuperBoardSubViewModel.fileType !== 4096) return;
    }

    if (toolType !== undefined) {
        zegoSuperBoard.setToolType(toolType);
    } else {
        // 默认矩形
        zegoSuperBoard.setToolType(8);
    }
    updateActiveToolDomHandle(toolType, event);
}

// 画笔粗细
function setBrushSize(brushSize, event) {
    zegoSuperBoard.setBrushSize(brushSize);

    updateActiveBrushSizeDomHandle(event);
}

// 画笔颜色
function setBrushColor(color, event) {
    zegoSuperBoard.setBrushColor(color);

    updateActiveBrushColorDomHandle(event);
}

// 文本大小
function setFontSize(fontSize, event) {
    zegoSuperBoard.setFontSize(fontSize);

    updateActiveFontSizeDomHandle(event);
}

// 文本粗体
function setFontBold(event) {
    var bold = zegoSuperBoard.isFontBold();
    zegoSuperBoard.setFontBold(!bold);

    updateActiveFontBoldHandle(event);
}

// 文本斜体
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

/**
 * @desc: 上传自定义图形、图片
 * @param type 0: 插入图片 1: 自定义图形
 */
async function addImage(type) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;
    var positionX = 0,
        positionY = 0,
        address;
    if (type === 1) {
    } else {
    }

    try {
        await zegoSuperBoardSubView.addImage(type, positionX, positionY, address);
        if (type === 1) {
        } else {
        }
    } catch (error) {
        debugger;
    }
}

/**
 * @description: 设置背景图
 * @param {*}
 * @return {*}
 */
function setBackgroundImage() {}

/**
 * @description: 上传 H5 文件
 * @param {*}
 * @return {*}
 */
async function uploadH5File() {
    // 判断file、width、height、pageCount、h5ThumbnailList
    if (!selectedH5File) {
        return toast('未选择文件');
    }
    var data = layui.form.val('form3');
    var h5Width = data.h5Width;
    var h5Height = data.h5Height;
    var h5PageCount = data.h5PageCount;
    var h5ThumbnailList = data.h5ThumbnailListStr ? data.h5ThumbnailListStr.split(',') : null;
    if (!h5Width || !h5Height || !h5PageCount || !h5ThumbnailList) {
        return toast('文件参数有误');
    }

    var config = {
        width: h5Width,
        height: h5Height,
        pageCount: h5PageCount,
        thumbnailList: h5ThumbnailList
    };
    try {
        var fileID = await zegoSuperBoard.uploadH5File(selectedH5File, config, toast);
        // 创建文件白板
        createFileView(fileID);
    } catch (error) {}
}

/**
 * @description: 文件预加载
 * @param {*}
 * @return {*}
 */
function cacheFile() {
    var data = layui.form.val('form3');
    var fileID = data.fileID;
    if (!fileID) return toast('请输入文件 ID');
    zegoSuperBoard.cacheFile(fileID);
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

    zegoSuperBoardSubViewModel.fileType === 512 ||
        (zegoSuperBoardSubViewModel.fileType === 4096 &&
            toggleStepDomHandle(
                zegoSuperBoardSubViewModel.fileType === 512 || zegoSuperBoardSubViewModel.fileType === 4096 ? 1 : 2
            ));
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

// 切换 zoom
layui.form.on('select(zoomList)', function(data) {
    var zoom = +data.value;
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.setScaleFactor(zoom);
});

// 开启笔锋
layui.form.on('switch(handwriting)', function(data) {
    zegoSuperBoard.enableHandwriting(this.checked);
});

// 不可操作模式
layui.form.on('switch(unOperatedMode)', function(data) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var operationMode;
    if (this.checked) {
        operationMode = 1;
        updateOperatedModeDomHandle(2);
    } else {
        // 可操作模式下，默认开启滚动、绘制、缩放
        operationMode = 14;
        updateOperatedModeDomHandle(1);
    }

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

// 滚动模式
layui.form.on('switch(scrollMode)', function(data) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var data = layui.form.val('form2');
    var drawMode = data.drawMode === 'on' ? 4 : 0;
    var scrollMode = data.scrollMode === 'on' ? 2 : 0;
    var zoomMode = data.zoomMode === 'on' ? 8 : 0;
    var operationMode = drawMode | scrollMode | zoomMode;
    if (!operationMode) {
        // 滚动、绘制、放缩均不开启即不可操作模式
        operationMode = 1;
        updateUnOperatedModeDomHandle(1);
    } else {
        updateUnOperatedModeDomHandle(2);
    }

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

// 绘制模式
layui.form.on('switch(drawMode)', function(data) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var data = layui.form.val('form2');
    var drawMode = data.drawMode === 'on' ? 4 : 0;
    var scrollMode = data.scrollMode === 'on' ? 2 : 0;
    var zoomMode = data.zoomMode === 'on' ? 8 : 0;
    var operationMode = drawMode | scrollMode | zoomMode;
    if (!operationMode) {
        // 滚动、绘制、放缩均不开启即不可操作模式
        operationMode = 1;
        updateUnOperatedModeDomHandle(1);
    } else {
        updateUnOperatedModeDomHandle(2);
    }

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

// 放缩模式
layui.form.on('switch(zoomMode)', function(data) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    var data = layui.form.val('form2');
    var drawMode = data.drawMode === 'on' ? 4 : 0;
    var scrollMode = data.scrollMode === 'on' ? 2 : 0;
    var zoomMode = data.zoomMode === 'on' ? 8 : 0;
    var operationMode = drawMode | scrollMode | zoomMode;
    if (!operationMode) {
        // 滚动、绘制、放缩均不开启即不可操作模式
        operationMode = 1;
        updateUnOperatedModeDomHandle(1);
    } else {
        updateUnOperatedModeDomHandle(2);
    }

    console.warn('SuperBoard Demo operationMode', operationMode);
    zegoSuperBoardSubView.setOperationMode(operationMode);
});

// 同步缩放
layui.form.on('switch(syncScale)', function(data) {
    zegoSuperBoard.enableSyncScale(this.checked);
});

// 响应缩放
layui.form.on('switch(responseScale)', function(data) {
    zegoSuperBoard.enableResponseScale(this.checked);
});

/**
 * @description: 选择静态、动态文件
 * @param {*} file
 * @param {*} renderType
 * @return {*}
 */
function uploadFile(event, renderType) {
    var file = event.target.files[0];
    if (!file) {
        toast('请先选择文件');
        return;
    }
    // 初始化文件选择
    $('#staticFile').val('');
    $('#dynamicFile').val('');

    zegoSuperBoard
        .uploadFile(file, renderType, function(res) {
            seqMap.upload = res.fileHash || res.seq;
            toast(uploadFileTipsMap[res.status] + (res.uploadPercent || ''));
        })
        .then(function(fileID) {
            createFileView(fileID);
            // 关闭弹框
            $('#filelistModal').modal('hide');
        })
        .catch(toast);
}

// 选择 H5 文件
layui.upload.render({
    elem: '#selectH5', //绑定元素
    accept: 'file',
    exts: 'zip',
    auto: false,
    choose: function(obj) {
        // 选择完文件
        obj.preview(function(index, file, result) {
            // file 为当前选中文件
            selectedH5File = file;
            toast('选择文件成功');
        });
    }
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
    var currZoomLevel = layui.form.val('customForm').zoom;
    if (currZoomLevel === '1') return;
    var zoom = Number(currZoomLevel) - 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(zoom);
        zoomDomHandle(zoom);
    }
});

$('.zoom-add').click(function() {
    var currZoomLevel = layui.form.val('customForm').zoom;
    if (currZoomLevel === '3') return;
    var zoom = Number(currZoomLevel) + 0.25;

    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.setScaleFactor(zoom);
        zoomDomHandle(zoom);
    }
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
        toast('获取缩略图仅支持“PDF，PPT，动态PPT，H5”文件格式');
    }
});
