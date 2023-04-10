/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 14:33:55
 * @LastEditTime: 2021-08-27 11:42:14
 * @LastEditors: Please set LastEditors
 * @Description: Create, destroy, switch, and query whiteboard lists
 * @FilePath: /superboard/js/room/whiteboard.js
 */

var viewSeq = 1; // Whiteboard index, when multiple common whiteboards are created, the names and numbers of the whiteboards are superimposed
var cacheSheetMap = {}; // Cache the sheetIndex { uniqueID: sheetIndex } corresponding to the last excel whiteboard

/**
 * @description: Return to the current ZegoSuperBoardSubView.
 * @return {ZegoSuperBoardSubView|null}
 */
function getCurrentSuperBoardSubView() {
    var current = null;
    var superBoardView = zegoSuperBoard.getSuperBoardView();
    if (superBoardView) {
        current = superBoardView.getCurrentSuperBoardSubView();
    }
    return current;
}

/**
 * @description: Determine whether a thumbnail exists for the current file.
 * @description: The thumbnail exists when fileType is set to 1, 8, 512, and 4096.
 * @return {Boolearn} true: yes; false: no.
 */
function hasThumb() {
    var current = getCurrentSuperBoardSubView();
    if (current) {
        var model = current.getModel();
        return model.fileType === 1 || model.fileType === 8 || model.fileType === 512 || model.fileType === 4096;
    } else {
        return false;
    }
}

/**
 * @description: Determine whether step switching can be enabled for the current file, that is, whether it is a whiteboard of an animated PPT file or a custom H5 file.
 * @description: Step switching can be enabled when fileType is set to 512 and 4096.
 * @return {Boolearn} true: yes; false: no.
 */
function canJumpStep() {
    var current = getCurrentSuperBoardSubView();
    if (current) {
        var model = current.getModel();
        return model.fileType === 512 || model.fileType === 4096;
    } else {
        return false;
    }
}

/**
 * @description: Update the drop-down list of the whiteboard list on the page.
 * @description: Hide the sheetList drop-down list when the whiteboard is not an Excel file whiteboard.
 * @description: When no whiteboards are created, initialize the total number of pages and the current page number to 1.
 */
async function updateWhiteboardList() {
    // Obtain the model list.
    var modelList = await zegoSuperBoard.querySuperBoardSubViewList();
    console.warn('SuperBoard Demo querySuperBoardSubViewList', modelList);
    roomUtils.updateWhiteboardListDomHandle(modelList);
    if (!modelList || !modelList.length) {
        roomUtils.toggleSheetSelectDomHandle(false);
        roomUtils.updateCurrPageDomHandle(1);
        roomUtils.updatePageCountDomHandle(1);
    }
}

/**
 * @description: Obtain the specified SuperBoardSubViewModel based on the uniqueID.
 * @param {String} uniqueID Whiteboard ID
 * @return {SuperBoardSubViewModel} SuperBoardSubViewModel
 */
async function getSuperBoardSubViewModelByUniqueID(uniqueID) {
    var modelList = await zegoSuperBoard.querySuperBoardSubViewList();
    var model;
    modelList.forEach(function(element) {
        if (uniqueID === element.uniqueID) {
            model = element;
        }
    });
    return model;
}

const debounce = function(fn, delay = 500) {
    let timer = null;
    return function() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            // 将原始函数的 this 和参数都传进来。
            fn.apply(this, arguments);
            timer = null;
        }, delay);
    };
};

function reloadViewCurrnetPage() {
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
    zegoSuperBoardSubView.reloadView({ forceReload: true, reloadType: 1 });
}

// let debounceAlert = debounce((error) => alert('debounce' + JSON.stringify(error)), 1000);
let debounceReloadView = debounce((type) => {
    roomUtils.toast(type === 1 ? 'reload current' : 'reload all');
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
    zegoSuperBoardSubView.reloadView({ forceReload: true, reloadType: type });
}, 1000);

// let throttleReloadView = throttle((type) => {
//     roomUtils.toast(type === 1 ? "reload current" : "reload all");
//     var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
//     zegoSuperBoardSubView.reloadView({ forceReload: true, reloadType: type });
// }, 1000);

/**
 * @description: Listen for the whiteboard callback.
 */
function onSuperBoardEventHandle() {
    // Callback of the listening-for error. All internal SDK errors are thrown using this callback, except the errors directly returned in the API.
    zegoSuperBoard.on('error', async function(errorData) {
        // 3130021: get context 失败的错误码，一般是 safari 内存不足
        // 3130022: canvas drawImage 失败错误码
        if (errorData.code === 3130021 || errorData.code === 3130022) {
            console.error('errorData', errorData);
            // debounceAlert(errorData);
            // 如果是绘制错误，则尝试重绘
            if (errorData.code === 3130021) {
                // console.error('canvas 内存不足')
                debounceReloadView(2);
            }
            // 如果是绘制错误，则尝试重绘
            if (errorData.code === 3130022) {
                // console.error('canvas drawImage 失败')
                debounceReloadView(1);
            }
        } else {
            roomUtils.toast(errorData);
        }
    });

    var mediaIdx = {};
    var confirmIndex;
    var videoCT;
    zegoSuperBoard.on('superBoardSubViewMediaPermission', async function(ele) {
        console.log('atag onMediaPermission', ele)
        videoCT = ele.ct;
        var zegoSuperBoardSubView = zegoSuperBoard && zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
        if(zegoSuperBoard && zegoSuperBoardSubView && ele.id){
            mediaIdx[`${ele.id}-${ele.type}`]? mediaIdx[`${ele.id}-${ele.type}`]++:mediaIdx[`${ele.id}-${ele.type}`] = 1;
            if(mediaIdx[`${ele.id}-${ele.type}`] > 1) return;
            console.log('atag onMediaPermission-demo', ele)
            confirmIndex = layui.layer.confirm(`由于该浏览器限制播放${ele.type === 'video'?'视频':'音频'}，请点击播放`, {icon: 3, title:'提示',btn: ['播放'],
                }, function(index){
                        layui.layer.close(index);
                        console.log('atag onMediaPermission-1', videoCT)
                        var params = {id:ele.id};
                        if(ele.ct){
                            params.ct = videoCT || ele.ct;
                        }
                        zegoSuperBoardSubView.playMedia(params).then(function(res){
                            console.log('atag onMediaPermission-res', res)
                            videoCT = 0;
                        }).catch(function(err){
                            console.log('atag onMediaPermission-err', err)
                            videoCT = 0;
                        })
                });
        }
    })

    // Listen for whiteboard page turning and scrolling.
    zegoSuperBoard.on('superBoardSubViewScrollChanged', function(uniqueID, page, step) {
        console.warn('SuperBoard Demo superBoardSubViewScrollChanged', ...arguments);
        if(confirmIndex) layui.layer.close(confirmIndex);
        var mediaIdx = {};
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        console.log('===zegoSuperBoardSubView', zegoSuperBoardSubView.getModel().uniqueID, zegoSuperBoardSubView);
        if (zegoSuperBoardSubView && zegoSuperBoardSubView.getModel().uniqueID == uniqueID) {
            // Update the page content.
            roomUtils.updateCurrPageDomHandle(page);
        }
        // 本端切换白板时，远端同时删除白板，layui select 的value会被清空，为空的情况下需要手动重新赋值
        // 本端切换白板时，远端同时切换其他白板，收到 Switched 回调赋值白板ID，与当前切换白板不一致，需要重新赋值
        console.log('===选项框数据1',layui.form.val("customForm").whiteboard, uniqueID)
        if (layui.form.val("customForm").whiteboard !== uniqueID) {
            layui.form.val('customForm', {
                whiteboard: uniqueID
            });
        }
        console.log('===选项框数据2',layui.form.val("customForm").whiteboard)
    });

    // Listen for remote whiteboard zooming.
    zegoSuperBoard.on('superBoardSubViewScaleChanged', function(uniqueID, scale) {
        console.warn('SuperBoard Demo uperBoardSubViewScaleChanged', uniqueID, scale);
        roomUtils.updateCurrScaleDomHandle(scale);
    });

    // Listen for remote whiteboard adding.
    zegoSuperBoard.on('remoteSuperBoardSubViewAdded', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewAdded', ...arguments);
        // Query and update the whiteboard list on the page. The newly added whiteboard is not mounted to the internal SDK.
        querySuperBoardSubViewListHandle();
    });

    // Listen for remote whiteboard destroying.
    zegoSuperBoard.on('remoteSuperBoardSubViewRemoved', function() {
        if(confirmIndex) layui.layer.close(confirmIndex);
        console.warn('SuperBoard Demo remoteSuperBoardSubViewRemoved', ...arguments);
        // Query and update the whiteboard list on the page. The destroyed whiteboard is also destroyed in the SDK.
        querySuperBoardSubViewListHandle();
    });

    // Listen for remote whiteboard switching.
    zegoSuperBoard.on('remoteSuperBoardSubViewSwitched', function() {
        if(confirmIndex) layui.layer.close(confirmIndex);
        console.warn('SuperBoard Demo remoteSuperBoardSubViewSwitched', ...arguments);
        // Query and update the whiteboard list on the page. After a whiteboard switching, the SDK automatically switches to the new whiteboard.
        querySuperBoardSubViewListHandle();
    });

    // Listen for remote Excel sheet switching.
    zegoSuperBoard.on('remoteSuperBoardSubViewExcelSwitched', function() {
        console.warn('SuperBoard Demo remoteSuperBoardSubViewExcelSwitched', ...arguments);
        // Query and update the whiteboard list on the page. After an Excel sheet switching, the SDK automatically switches to the new Excel sheet.
        querySuperBoardSubViewListHandle();
    });

    // Listen for remote whiteboard permission change.
    zegoSuperBoard.on('remoteSuperBoardAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardAuthChanged', ...arguments);
        // After a permission change, the change is synchronized to the peer.
    });

    // Listen for remote permission change of a whiteboard diagram element.
    zegoSuperBoard.on('remoteSuperBoardGraphicAuthChanged', function() {
        console.warn('SuperBoard Demo remoteSuperBoardGraphicAuthChanged', ...arguments);
        // After a permission change, the change is synchronized to the peer.
    });
}

/**
 * @description: Create a common whiteboard.
 */
async function createWhiteboardView() {
    $('#thumbModal').removeClass('active');
    try {
        roomUtils.loading('Create a normal whiteboard');

        // viewSeq is a custom suffix, and its value is accumulated with the creation of common whiteboards. You can determine whether the suffix is needed.
        await zegoSuperBoard.createWhiteboardView({
            name: zegoConfig.userName + ' whiteboard ' + viewSeq++,
            perPageWidth: 1600,
            perPageHeight: 900,
            pageCount: 5 // Default horizontal pagination
        });

        roomUtils.closeLoading();
        roomUtils.toast('Created successfully');

        // Query and update the whiteboard list on the page. After a whiteboard is created, the whiteboard SDK automatically renders it.
        querySuperBoardSubViewListHandle();

        // Display the whiteboard tool.
        roomUtils.toggleToolDomHandle(true);
        // Hide the whiteboard placeholder.
        roomUtils.togglePlaceholderDomHandle(false);
        // Hide the button for displaying the thumbnail dialog.
        roomUtils.toggleThumbBtnDomHandle(false);
    } catch (errorData) {
        roomUtils.closeLoading();
        roomUtils.toast(errorData);
    }
}

/**
 * @description: Create a file whiteboard.
 * @param {String} fileID File ID
 */
async function createFileView(fileID, enableSizeReducedImages) {
    $('#thumbModal').removeClass('active');
    try {
        roomUtils.loading('Create document in whiteboard');
        const loadOption = {
            enableSizeReducedImages
        };
        await zegoSuperBoard.createFileView({
            fileID,
            loadOption
        });
        switchSpeaker();
        console.log('mytag 文件加载完成');
        roomUtils.closeLoading();
        roomUtils.toast('Created successfully');

        // Query and update the whiteboard list on the page. After a whiteboard is created, the whiteboard SDK automatically renders it.
        querySuperBoardSubViewListHandle();

        // Display the whiteboard tool.
        roomUtils.toggleToolDomHandle(true);
        // Hide the whiteboard placeholder.
        roomUtils.togglePlaceholderDomHandle(false);
        // Display or hide the button for displaying the thumbnail dialog.
        roomUtils.toggleThumbBtnDomHandle(hasThumb());
    } catch (errorData) {
        roomUtils.closeLoading();
        roomUtils.toast(errorData);
    }
}

/**
 * @description: Destroy a whiteboard.
 * @param {String} type 1: Destroy the current whiteboard 2: Destroy all whiteboards
 */
async function destroySuperBoardSubView(type) {
    if (type === 1) {
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        // No whiteboards can be deleted.
        if (!zegoSuperBoardSubView) return;

        try {
            roomUtils.loading('destroy whiteboard');

            await zegoSuperBoard.destroySuperBoardSubView(zegoSuperBoardSubView.getModel().uniqueID);
            console.warn('===demo destroySuperBoardSubView');
            roomUtils.closeLoading();
            roomUtils.toast('Destroyed successfully');

            // Query and update the whiteboard list on the page. After a whiteboard is destroyed, the whiteboard SDK automatically deletes the relevant data and removes the mounted data.
            querySuperBoardSubViewListHandle();
        } catch (errorData) {
            roomUtils.closeLoading();
            roomUtils.toast(errorData);
        }
    } else {
        try {
            var modelList = await zegoSuperBoard.querySuperBoardSubViewList();
            for (let index = 0; index < modelList.length; index++) {
                const model = modelList[index];
                roomUtils.loading('destroying ' + model.name);
                console.warn('SuperBoard Demo destroySuperBoardSubView', model.name);
                await zegoSuperBoard.destroySuperBoardSubView(model.uniqueID);
                console.warn('SuperBoard Demo destroySuperBoardSubView suc', model.name);
                roomUtils.toast('Destroy ' + model.name + ' successfully');
                roomUtils.closeLoading();
            }
            // Query and update the whiteboard list on the page. After a whiteboard is destroyed, the whiteboard SDK automatically deletes the relevant data and removes the mounted data.
            querySuperBoardSubViewListHandle();
        } catch (errorData) {
            roomUtils.closeLoading();
            roomUtils.toast(errorData);
        }
    }
}

/**
 * @description: Query and update the current Excel sheet list on the page.
 * @return {Number} Currently mounted sheet index
 */
function getExcelSheetNameListHandle() {
    var sheetIndex = 0;
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
    var zegoSuperBoardViewModel = zegoSuperBoardSubView.getModel();

    // Obtain the sheetName of the sheet that is currently mounted.
    var sheetName = zegoSuperBoardSubView.getCurrentSheetName();
    console.warn('SuperBoard Demo getCurrentSheetName', sheetName);

    // Obtain the sheetList.
    var zegoExcelSheetNameList = zegoSuperBoardSubView.getExcelSheetNameList();
    console.warn('SuperBoard Demo getExcelSheetNameListHandle', zegoExcelSheetNameList);

    // Obtain the sheetIndex corresponding to the current sheetName.
    zegoExcelSheetNameList.forEach(function(element, index) {
        element === sheetName && (sheetIndex = index);
    });
    console.warn('SuperBoard Demo getCurrentSheetIndex', sheetIndex);

    // Update the current Excel sheet list on the page.
    roomUtils.updateExcelSheetListDomHandle(zegoSuperBoardViewModel.uniqueID, zegoExcelSheetNameList);
    // Update the currently selected sheet on the page.
    roomUtils.updateCurrSheetDomHandle(zegoSuperBoardViewModel.uniqueID, sheetIndex);

    return sheetIndex;
}

/**
 * @description: Query and update the whiteboard list on the page.
 * @description: No whiteboard rendering operation is performed, and this method is used to update the page. You can handle it as required.
 * @return {Object} { uniqueID: xx, sheetIndex: xx } Return the current uniqueID after the query is completed. If the whiteboard is an Excel file whiteboard, return the sheetIndex at the same time.
 */
async function querySuperBoardSubViewListHandle() {
    var result = {
        uniqueID: 0,
        sheetIndex: 0
    };
    // Update the whiteboard drop-down list on the page.
    await updateWhiteboardList();
    // Obtain the currently mounted whiteboard.
    var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
    console.log('===querySuperBoardSubViewListHandle', zegoSuperBoardSubView)
    if (zegoSuperBoardSubView) {
        // Currently, a mounted whiteboard exists.
        var model = zegoSuperBoardSubView.getModel();
        var pageCount = zegoSuperBoardSubView.getPageCount();
        var currentPage = zegoSuperBoardSubView.getCurrentPage();
        var uniqueID = model.uniqueID;
        var fileType = model.fileType;
        result.uniqueID = uniqueID;

        // Display the whiteboard tool.
        roomUtils.toggleToolDomHandle(true); 
        // Hide the whiteboard placeholder.
        roomUtils.togglePlaceholderDomHandle(false);
        // Update the current whiteboard in the drop-down list.
        roomUtils.updateCurrWhiteboardDomHandle(uniqueID);
        // Update the total number of pages and the current page number.
        roomUtils.updatePageCountDomHandle(pageCount);
        roomUtils.updateCurrPageDomHandle(currentPage);
        // Determine whether to display the step switching button on the page.
        roomUtils.toggleStepDomHandle(canJumpStep());
        // Determine whether to display the thumbnail icon on the page.
        roomUtils.toggleThumbBtnDomHandle(hasThumb());
        // Determine whether to disable the Click tool.
        roomUtils.toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);
        if (fileType === 4) {
            // Display the sheet drop-down list for Excel file whiteboards.
            roomUtils.toggleSheetSelectDomHandle(true);
            // Query the sheet list.
            result.sheetIndex = getExcelSheetNameListHandle();

            // Cache the sheet of the current Excel file whiteboard.
            cacheSheetMap[result.uniqueID] = result.sheetIndex;
        } else {
            // Display the sheet drop-down list when the whiteboard is not an Excel file whiteboard.
            roomUtils.toggleSheetSelectDomHandle(false);
        }
    } else {
        // Hide the whiteboard tool.
        roomUtils.toggleToolDomHandle(false);
        // No mounted whiteboards. Display the whiteboard placeholder.
        roomUtils.togglePlaceholderDomHandle(true);
    }
    return result;
}

/**
 * @description: Reset the whiteboard tool. When a whiteboard of an animated PPT file or a custom H5 file is switched to other whiteboards, the Click tool is automatically reset to Pen.
 * @description: Only functions are displayed here. You can handle it as required.
 * @param {Number} fileType File type
 */
function resetToolTypeAfterSwitch(fileType) {
    fileType !== 512 && fileType !== 4096 && zegoSuperBoard.getToolType() === 256 && initToolType();
}

/**
 * @description: The initial whiteboard tool is Pen.
 */
function initToolType() {
    var result = zegoSuperBoard.setToolType(1);
    console.warn('SuperBoard Demo initToolType', result);
    // The setting is failed, and a pop-up box of the failure message is displayed.
    if (!result) {
        return roomUtils.toast('Setup failed');
    } else {
        roomUtils.resetToolTypeDomHandle();
    }
}

/**
 * @description: Switch to a specified whiteboard based on the target uniqueID.
 * @param {String} uniqueID uniqueID
 */
async function switchWhitebopardHandle(uniqueID) {
    $('#thumbModal').removeClass('active');

    var model = await getSuperBoardSubViewModelByUniqueID(uniqueID);
    var fileType = model.fileType;

    try {
        roomUtils.loading('switch whiteboard');

        // The second parameter of whiteboards other than Excel file whiteboards can be ignored.
        // The Excel file whiteboard is switched to the first sheet by default. The last subscript is not recorded in the SDK.
        // Check whether the following strings exist in cacheSheetMap.
        var sheetIndex = cacheSheetMap[uniqueID];
        let status = await zegoSuperBoard
            .getSuperBoardView()
            .switchSuperBoardSubView(uniqueID, fileType === 4 ? sheetIndex || 0 : undefined);
        if (status) {
            switchSpeaker();
        }
        // Hide the sheet drop-down list when the whiteboard is not an Excel file whiteboard.
        roomUtils.toggleSheetSelectDomHandle(fileType === 4);
        // Excel file whiteboard. Update the sheet list on the page.
        fileType === 4 && getExcelSheetNameListHandle();

        // Determine whether to reset the Pen tool.
        resetToolTypeAfterSwitch(fileType);

        // Determine whether to disable the Click tool.
        roomUtils.toggleDisabledDomHandle(fileType !== 512 && fileType !== 4096);

        // Determine whether to display the step switching button on the page.
        roomUtils.toggleStepDomHandle(canJumpStep());
        // Determine whether to display the thumbnail icon on the page.
        roomUtils.toggleThumbBtnDomHandle(hasThumb());

        // Update the total number of pages and the current page number on the page.
        var zegoSuperBoardSubView = getCurrentSuperBoardSubView();
        roomUtils.updatePageCountDomHandle(zegoSuperBoardSubView.getPageCount());
        roomUtils.updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());

        roomUtils.toast('switch successfully');
        roomUtils.closeLoading();
    } catch (errorData) {
        roomUtils.closeLoading();
        roomUtils.toast(errorData);
    }
}

/**
 * @description: Listen for the whiteboard drop-down list.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 */
layui.form.on('select(whiteboardList)', async function(data) {
    switchWhitebopardHandle(data.value);
});

/**
 * @description: Listen for the sheet drop-down list of the whiteboard.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 * @description: Obtain the currently selected value from the drop-down list. You can handle it as required.
 */
layui.form.on('select(sheetList)', async function(data) {
    // Obtain the currently selected value from the drop-down list. ('uniqueID,sheetIndex')
    var temp = data.value.split(',');
    // Split out the uniqueID and sheetIndex.
    var uniqueID = temp[0];
    var sheetIndex = temp[1];
    try {
        roomUtils.loading('switching');

        await zegoSuperBoard.getSuperBoardView().switchSuperBoardSubView(uniqueID, +sheetIndex);

        // Cache the sheet of the current Excel file whiteboard.
        cacheSheetMap[uniqueID] = sheetIndex;

        roomUtils.closeLoading();
        roomUtils.toast('switch successfully');
    } catch (errorData) {
        roomUtils.closeLoading();
        roomUtils.toast(errorData);
    }
});

/**
 * @description: Create a file whiteboard based on the built-in file.
 * @description: Only the file whiteboard created based on the specified fileID on the page is displayed here. You can handle it as required.
 * @param {Event} event event
 */
function createFileViewByFileID(event) {
    var fileID = $(event.target).attr('data-file-id');

    // Create a file whiteboard.
    createFileView(fileID);

    // Close the File dialog.
    $('#filelistModal').modal('hide');
}

/**
 * @description: Log in or refresh the page to obtain and mount the current SuperBoardSubView to update relevant data.
 * @description: SuperBoardSubView needs to be mounted by the business layer and the internal SDK does not actively mount it.
 */
async function attachActiveView() {
    // 设置白板容器为16:9
    var dom = document.getElementById(parentDomID);
    const width = dom.clientWidth + 2;
    const height = width / (16 / 9);
    dom.style.cssText += `width:100%; height: ${height}px`;

    console.warn('SuperBoard Demo parent', $('#' + parentDomID)[0].clientWidth, $('#' + parentDomID)[0].clientHeight);

    // Query the current whiteboard list.
    var result = await querySuperBoardSubViewListHandle();
    console.warn('SuperBoard Demo attachActiveView', result);
    // When you enter a room, the latest whiteboard is automatically mounted.
    if (result.uniqueID) {
        var superBoardView = zegoSuperBoard.getSuperBoardView();
        if (superBoardView) {
            try {
                //await superBoardView.switchSuperBoardSubView(result.uniqueID, result.sheetIndex);
                await superBoardView.switchSuperBoardSubView(result.uniqueID);
                var curView = superBoardView.getCurrentSuperBoardSubView();
                var pageCount = curView.getPageCount();
                var currPage = curView.getCurrentPage();
                var curViewModel = curView.getModel();
                console.warn('SuperBoard Demo attachActiveView', pageCount, currPage);

                // Cache the sheet of the current Excel file whiteboard.
                if (curViewModel.fileType === 4) {
                    cacheSheetMap[result.uniqueID] = result.sheetIndex;
                }
                // Initialize the whiteboard tool.
                initToolType();
                // Update the total number of pages and the current page number.
                roomUtils.updatePageCountDomHandle(pageCount);
                roomUtils.updateCurrPageDomHandle(currPage);
            } catch (errorData) {
                roomUtils.toast(errorData);
            }
        }
    }
}

/**
 * @description: A third-party UI plug-in layui is used here to obtain the fileID entered on the page. You can handle it as required.
 */
$('#createFileBtn').click(function() {
    var fileID = layui.form.val('form3').createFileID;

    if (!fileID) return roomUtils.toast('Please enter fileID');
    // Create a file whiteboard.
    createFileView(fileID);
});
$('#createFileBtn2').click(function() {
    var fileID = layui.form.val('form3').createFileID;

    if (!fileID) return roomUtils.toast('Please enter fileID');
    // Create a file whiteboard.
    createFileView(fileID, 2);
});

$('#getFileBtn').click(function() {
    var fileID = layui.form.val('form3').createFileID;

    if (!fileID) return roomUtils.toast('Please enter fileID');
    // Create a file whiteboard.
    createFileView(fileID);
});

async function switchSpeaker() {
    if (!zegoSuperBoard) return;
    let value = document.getElementById('speaker').value;
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (value && zegoSuperBoardSubView) {
        let res = await zegoSuperBoardSubView.switchSpeaker(value).catch((err) => {
            console.log('atag switchSpeaker-catch', err);
        });
        console.log('atag switchSpeaker', res);
    }
}

layui.form.on('select(speaker)', function(ele) {
    if (!zegoSuperBoard) return;
    switchSpeaker();
});
