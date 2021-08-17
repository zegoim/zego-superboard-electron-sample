/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-17 13:55:25
 * @LastEditors: Please set LastEditors
 * @Description: 创建、销毁、切换、查询白板
 * @FilePath: /superboard_demo_web/js/whiteboard.js
 */

var viewSeq = 1; // 白板索引，创建多个普通白板时，白板名称编号进行叠加
var cacheSheetMap = {}; // 缓存上次 excel 对应的白板 { uniqueID: sheetIndex }

/**
 * @description: 返回当前 ZegoSuperBoardSubView
 * @return {*} ZegoSuperBoardSubView | null;
 */
function getCurrentSuperBoardSubView() {
    var superBoardView = zegoSuperBoard.getSuperBoardView();
    if (superBoardView) {
        return superBoardView.getCurrentSuperBoardSubView();
    } else {
        return null;
    }
}

/**
 * @description: 判断当前文件是否有缩略图
 * @description: fileType 为 1、8、512、4096 时存在缩略图
 * @return {*} true: 有 false: 无
 */
function hasThumb() {
    var zegoSuperBoardSubViewModel = getCurrentSuperBoardSubView().getModel();
    return (
        zegoSuperBoardSubViewModel.fileType === 1 ||
        zegoSuperBoardSubViewModel.fileType === 8 ||
        zegoSuperBoardSubViewModel.fileType === 512 ||
        zegoSuperBoardSubViewModel.fileType === 4096
    );
}

/**
 * @description: 判断当前文件是否可以切步，即是否是动态 PPT、自定义 H5
 * @description: fileType 为 512、4096 时可以切步
 * @return {*} true: 可以 false: 不可以
 */
function canJumpStep() {
    var zegoSuperBoardSubViewModel = getCurrentSuperBoardSubView().getModel();
    return zegoSuperBoardSubViewModel.fileType === 512 || zegoSuperBoardSubViewModel.fileType === 4096;
}

/**
 * @description: 更新页面白板列表
 */
async function updateWhiteboardList() {
    // 获取 model 列表
    var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
    console.warn('SuperBoard Demo querySuperBoardSubViewList', zegoSuperBoardSubViewModelList);

    // 更新页面白板列表
    updateWhiteboardListDomHandle(zegoSuperBoardSubViewModelList);

    // 列表为空，隐藏页面 sheet 下拉框
    if (!zegoSuperBoardSubViewModelList || !zegoSuperBoardSubViewModelList.length) {
        // 隐藏 sheet 下拉框
        toggleSheetSelectDomHandle(false);

        // 初始化 currentPage、totalPage 为 1
        updateCurrPageDomHandle(1);
        updatePageCountDomHandle(1);
    }
}

/**
 * @description: 根据 uniqueID 获取指定 SuperBoardSubViewModel
 * @param {*} uniqueID 白板标识
 * @return {*} SuperBoardSubViewModel
 */
async function getSuperBoardSubViewModelByUniqueID(uniqueID) {
    var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
    var zegoSuperBoardSubViewModel;
    zegoSuperBoardSubViewModelList.forEach(function(element) {
        if (uniqueID === element.uniqueID) {
            zegoSuperBoardSubViewModel = element;
        }
    });
    return zegoSuperBoardSubViewModel;
}

/**
 * @description: 重置白板工具
 */
function resetToolTypeDomHandle() {
    $('.tool-item').removeClass('active');
    $('.pencil-text-setting').removeClass('active');
    $('.tool-item.pen').addClass('active');
}

/**
 * @description: 是否禁止点击工具，增加禁止样式
 * @description: 非动态 PPT、自定义 H5 时需要禁止
 * @description: 每次切换白板时调用
 * @param {*} type true: 禁止 false: 隐藏
 */
function toggleDisabledDomHandle(type) {
    if (type) {
        $('.tool-item.clickType').addClass('disabled');
    } else {
        $('.tool-item.clickType').removeClass('disabled');
    }
}

/**
 * @description: 监听白板回调
 */
function onSuperBoardEventHandle() {
    // 监听错误回调，SDK 内部错误均通过此回调抛出，除了直接在接口中直接返回的错误外
    zegoSuperBoard.on('error', function(errorData) {
        console.warn('SuperBoard Demo error', errorData);
        toast(errorData);
    });

    // 监听白板翻页、滚动
    zegoSuperBoard.on('superBoardSubViewScrolled', function(uniqueID, page, step) {
        console.warn('SuperBoard Demo superBoardSubViewScrolled', ...arguments);
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        if (zegoSuperBoardSubView && zegoSuperBoardSubView.getModel().uniqueID == uniqueID) {
            // 更新页面内容
            updateCurrPageDomHandle(page);
        }
    });

    // 监听远端新增白板
    zegoSuperBoard.on('remoteSuperBoardSubViewAdded', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewAdded', ...arguments);
        // 查询、更新页面白板列表，新增的白板 SDK 内部不会自动挂载
        querySuperBoardSubViewList();
    });

    // 监听远端销毁白板
    zegoSuperBoard.on('remoteSuperBoardSubViewRemoved', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewRemoved', ...arguments);
        // 查询、更新页面白板列表，销毁的白板 SDK 内部会自动销毁
        querySuperBoardSubViewList();
    });

    // 监听远端切换白板
    zegoSuperBoard.on('remoteSuperBoardSubViewSwitched', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewSwitched', ...arguments);
        // 查询、更新页面白板列表，切换的白板 SDK 内部会自动切换
        querySuperBoardSubViewList();
    });

    // 监听远端切换 Excel Sheet
    zegoSuperBoard.on('remoteSuperBoardSubViewExcelSwitched', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewExcelSwitched', ...arguments);
        // 查询、更新页面白板列表，切换的 Excel Sheet SDK 内部会自动切换
        querySuperBoardSubViewList();
    });

    // 监听远端白板权限变更
    zegoSuperBoard.on('remoteSuperBoardAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardAuthChanged', ...arguments);
        // 内部会自动更改为当前权限与对端同步
    });

    // 监听远端白板图元权限变更
    zegoSuperBoard.on('remoteSuperBoardGraphicAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardGraphicAuthChanged', ...arguments);
        // 内部会自动更改为当前权限与对端同步
    });

    // 监听远端白板缩放
    zegoSuperBoard.on('remoteScaleChanged', function(scale) {
        console.warn('SuperBoard Demo remoteScaleChanged', scale);
        updateCurrScaleDomHandle(scale);
    });
}

/**
 * @description: 创建普通白板
 */
async function createWhiteboardView() {
    try {
        loading('创建普通白板中');

        // 这里 viewSeq 是自定义后缀，创建一次普通白板就累加一次，开发者可自行定义是否需要
        await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + '创建的白板' + viewSeq++,
            perPageWidth: 1600,
            perPageHeight: 900,
            pageCount: 5 // 默认水平分页
        });

        closeLoading();
        toast('创建成功');

        // 查询、更新页面白板列表，创建成功后白板 SDK 内部会自动渲染
        querySuperBoardSubViewList();

        // 隐藏白板占位
        togglePlaceholderDomHandle(false);
        // 隐藏打开缩略图弹框的按钮
        toggleThumbBtnDomHandle(false);
    } catch (errorData) {
        closeLoading();
        toast(errorData);
    }
}

/**
 * @description: 创建文件白板
 * @param {*} fileID 文件 ID
 */
async function createFileView(fileID) {
    try {
        loading('创建文件白板中');

        await zegoSuperBoard.createFileView({ fileID });

        closeLoading();
        toast('创建成功');

        // 查询、更新页面白板列表，创建成功后白板 SDK 内部会自动渲染
        querySuperBoardSubViewList();

        // 隐藏白板占位
        togglePlaceholderDomHandle(false);
        // 显示、隐藏打开缩略图弹框的按钮
        toggleThumbBtnDomHandle(hasThumb());
    } catch (errorData) {
        closeLoading();
        toast(errorData);
    }
}

/**
 * @description: 销毁白板
 * @param {*} type 1: 销毁当前白板 2: 销毁所有白板
 */
async function destroySuperBoardSubView(type) {
    if (type === 1) {
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        // 当前没有白板可以被删除
        if (!zegoSuperBoardSubView) return;

        try {
            loading('销毁白板中');

            await zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubView.getModel().uniqueID);

            closeLoading();
            toast('销毁成功');

            // 查询、更新页面白板列表，销毁成功后白板 SDK 内部会自动删除相关内容，并移除挂载的内容
            querySuperBoardSubViewList();
        } catch (errorData) {
            closeLoading();
            toast(errorData);
        }
    } else {
        try {
            loading('销毁全部白板中');

            // 销毁白板为异步过程，这里构建异步任务数组
            var tasks = [];
            var zegoSuperBoardSubViewModelList = await zegoSuperBoard.querySuperBoardSubViewList();
            zegoSuperBoardSubViewModelList.forEach(function(zegoSuperBoardSubViewModel) {
                tasks.push(zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubViewModel.uniqueID));
            });
            await Promise.all(tasks);

            closeLoading();
            toast('销毁全部白板成功');

            // 查询、更新页面白板列表，销毁成功后白板 SDK 内部会自动删除相关内容，并移除挂载的内容
            querySuperBoardSubViewList();
        } catch (errorData) {
            closeLoading();
            toast(errorData);
        }
    }
}

/**
 * @description: 查询、更新页面当前 Excel sheet 列表
 * @return {*} 当前挂载的 sheet index
 */
function getExcelSheetNameList() {
    var sheetIndex = 0;
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
    var zegoSuperBoardViewModel = zegoSuperBoardSubView.getModel();

    // 获取当前挂载的 sheetName
    var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
    console.warn('SuperBoard Demo getCurrentSheetName', sheetName);

    // 获取 sheetList
    var zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
    console.warn('SuperBoard Demo getExcelSheetNameList', zegoExcelSheetNameList);

    // 获取当前 sheetName 对应 sheetIndex
    zegoExcelSheetNameList.forEach(function(element, index) {
        element === sheetName && (sheetIndex = index);
    });
    console.warn('SuperBoard Demo getCurrentSheetIndex', sheetIndex);

    // 更新页面当前 Excel sheet 列表
    updateExcelSheetListDomHandle(zegoSuperBoardViewModel.uniqueID, zegoExcelSheetNameList);
    // 更新页面当前选中的 sheet
    updateCurrSheetDomHandle(zegoSuperBoardViewModel.uniqueID, sheetIndex);

    return sheetIndex;
}

/**
 * @description: 查询、更新页面白板列表
 * @description: 这里不做渲染白板操作，只是用来更新页面，开发者可根据实际情况处理
 * @return {*} { uniqueID: xx, sheetIndex: xx } 这里返回查询完成后，当前的 uniqueID，如果是 excel 白板，还返回 sheetIndex
 */
async function querySuperBoardSubViewList() {
    var result = { uniqueID: 0, sheetIndex: 0 };
    //  获取当前挂载的白板
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();

    // 更新页面白板下拉框
    await updateWhiteboardList();
    if (zegoSuperBoardSubView) {
        // 当前有挂载白板
        var zegoSuperBoardSubViewModel = zegoSuperBoardSubView.getModel();
        var pageCount = zegoSuperBoardSubView.getPageCount();
        var currentPage = zegoSuperBoardSubView.getCurrentPage();
        var uniqueID = zegoSuperBoardSubViewModel.uniqueID;
        var fileType = zegoSuperBoardSubViewModel.fileType;
        result.uniqueID = uniqueID;

        // 隐藏白板占位
        togglePlaceholderDomHandle(false);
        // 更新下拉框中当前白板
        updateCurrWhiteboardDomHandle(uniqueID);
        // 更新总页数、当前页
        updatePageCountDomHandle(pageCount);
        updateCurrPageDomHandle(currentPage);
        // 判断是否显示页面上的切步按钮
        toggleStepDomHandle(canJumpStep());
        // 判断是否显示页面上的缩略图按钮
        toggleThumbBtnDomHandle(hasThumb());
        // 判断是否需要禁止点击工具
        toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);
        if (fileType === 4) {
            // excel 文件白板显示 sheet 下拉框
            toggleSheetSelectDomHandle(true);
            // 查询 sheet 列表
            result.sheetIndex = getExcelSheetNameList();

            // 缓存当前 excel 白板 的 sheet
            cacheSheetMap[result.uniqueID] = result.sheetIndex;
        } else {
            // 非 excel 白板隐藏 sheet 下拉框
            toggleSheetSelectDomHandle(false);
        }
    } else {
        // 当前无挂载白板，显示白板占位
        togglePlaceholderDomHandle(true);
    }
    return result;
}

/**
 * @description: 设置工具类型
 * @param {*} toolType 工具类型
 * @param {*} event event
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
 * @description: 重置白板工具，在动态 PPT 白板、自定义 H5 白板切换到其他白板时，如何当前是点击工具，主动重置为画笔
 * @description: 这里只展示功能，开发者可根据实际情况设置
 * @param {*} fileType 文件类型
 */
function resetToolType(fileType) {
    if (fileType !== 512 && fileType !== 4096 && zegoSuperBoard.getToolType() === 256) {
        var result = zegoSuperBoard.setToolType(1);
        // 设置失败，直接返回
        if (!result) {
            return toast('设置失败');
        } else {
            resetToolTypeDomHandle();
        }
    }
}

/**
 * @description: 根据目标 uniqueID 切换指定白板
 */
async function switchWhitebopard(uniqueID) {
    var zegoSuperBoardSubViewModel = await getSuperBoardSubViewModelByUniqueID(uniqueID);
    var fileType = zegoSuperBoardSubViewModel.fileType;

    try {
        loading('切换白板中');

        // 除去 excel 白板，其他白板第二个参数可忽略
        // excel 白板默认切换到第一个 sheet（SDK 内部没有记录上一次的下标）
        // 先寻找 cacheSheetMap 中是否存在
        var sheetIndex = cacheSheetMap[uniqueID];
        await zegoSuperBoard
            .getSuperBoardView()
            .switchSuperBoardSubView(uniqueID, fileType === 4 ? sheetIndex || 0 : undefined);

        // 除去 excel 白板，隐藏页面 sheet 列表
        toggleSheetSelectDomHandle(fileType === 4);
        // excel 白板，更新页面 sheet 列表
        fileType === 4 && getExcelSheetNameList();

        // 判断是否重置画笔工具
        resetToolType(fileType);

        // 判断是否需要禁止点击工具
        toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);

        // 判断是否显示页面上的切步按钮
        toggleStepDomHandle(canJumpStep());
        // 判断是否显示页面上的缩略图按钮
        toggleThumbBtnDomHandle(hasThumb());

        // 更新页面上总页数、当前页
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        updatePageCountDomHandle(zegoSuperBoardSubView.getPageCount());
        updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());

        toast('切换成功');
        closeLoading();
    } catch (errorData) {
        closeLoading();
        toast(errorData);
    }
}

/**
 * @description: 监听白板下拉选择框
 * @description: 这里只展示监听下拉框，开发者根据实际情况处理
 */
layui.form.on('select(whiteboardList)', async function(data) {
    switchWhitebopard(data.value);
});

/**
 * @description: 监听白板 sheet 下拉选择框
 * @description: 这里只展示监听下拉框，开发者根据实际情况处理
 * @description: 获取下拉框当前选中，开发者根据实际情况处理
 */
layui.form.on('select(sheetList)', async function(data) {
    // 获取下拉框当前选中的值('uniqueID,sheetIndex')
    var temp = data.value.split(',');
    // 拆分出 uniqueID、sheetIndex
    var uniqueID = temp[0];
    var sheetIndex = temp[1];

    try {
        loading('切换中');

        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, sheetIndex);

        // 缓存当前 excel 白板 的 sheet
        cacheSheetMap[uniqueID] = sheetIndex;

        closeLoading();
        toast('切换成功');
    } catch (errorData) {
        closeLoading();
        toast(errorData);
    }
});

/**
 * @description: 根据内置文件创建文件白板
 * @description: 这里只展示根据页面指定 fileID 创建文件白板，开发者可根据实际情况设置
 * @param {*} event event
 */
function createFileViewByFileID(event) {
    var fileID = $(event.target).attr('data-file-id');

    // 创建文件白板
    createFileView(fileID);

    // 关闭文件弹框
    $('#filelistModal').modal('hide');
}

/**
 * @description: 登陆或刷新页面重新获取当前 SuperBoardSubView 并挂载，更新相关数据
 * @description: 需要业务层主动挂载，SDK 内部不会主动挂载当前 SuperBoardSubView
 */
async function attachActiveView() {
    // 查询当前白板列表
    var result = await querySuperBoardSubViewList();
    console.warn('SuperBoard Demo attachActiveView', result);
    // 设置自动进房自动挂载最新白板
    if (result.uniqueID) {
        var superBoardView = zegoSuperBoard.getSuperBoardView();
        if (superBoardView) {
            await superBoardView.switchSuperBoardSubView(result.uniqueID, result.sheetIndex);
            var curView = superBoardView.getCurrentSuperBoardSubView();
            var curViewModel = curView.getModel();

            // 缓存当前 excel 白板 的 sheet
            if (curViewModel.fileType === 4) {
                cacheSheetMap[result.uniqueID] = result.sheetIndex;
            }
            // 更新总页数、当前页
            const totalPage = curView.getPageCount();
            const curPage = curView.getCurrentPage();
            updatePageCountDomHandle(totalPage);
            updateCurrPageDomHandle(curPage);
        }
    }
}
