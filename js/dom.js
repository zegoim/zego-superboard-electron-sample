/*
 * @Author: ZegoDev
 * @Date: 2021-08-02 15:35:52
 * @LastEditTime: 2021-08-18 15:50:09
 * @LastEditors: Please set LastEditors
 * @Description: dom 相关方法
 * @FilePath: /superboard_demo_web/js/dom.js
 */

// bootstrap tooltip、popover 初始化
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('#openPopover').popover();
});

/**
 * @description: 显示、隐藏登录页、房间页
 * @param {*} type true: 显示 false: 隐藏
 * @return {*}
 */
function togglePageDomHandle(type) {
    if (type) {
        // 显示房间页
        $('#room-page').addClass('active');
        $('#login-page').removeClass('active');
    } else {
        // 显示登录页
        $('#room-page').removeClass('active');
        $('#login-page').addClass('active');
    }
}

/**
 * @description: 更新 pageCount
 * @param {*} pageCount
 * @return {*}
 */
function updatePageCountDomHandle(pageCount) {
    $('#pageCount').html(pageCount);
}

/**
 * @description: 更新 currPage，包括顶部翻页按钮 + 缩略图
 * @param {*} currPage
 */
function updateCurrPageDomHandle(currPage) {
    $('#currPage').html(currPage);
    $('.thumb-item').removeClass('active');
    $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
}

/**
 * @description: 显示、隐藏白板区域占位
 * @param {*} type true 显示 false 隐藏
 * @return {*}
 */
function togglePlaceholderDomHandle(type) {
    if (type) {
        $('#main-whiteboard-placeholder').addClass('active');
    } else {
        $('#main-whiteboard-placeholder').removeClass('active');
    }
}

/**
 * @description: 更新白板列表下拉框
 * @param {*}
 * @return {*}
 */
function updateWhiteboardListDomHandle(zegoSuperBoardSubViewModelList) {
    var $str = '';
    $('#whiteboardList').html('');
    zegoSuperBoardSubViewModelList.forEach(function(element) {
        $str +=
            '<option value="' +
            element.uniqueID +
            '" data-file-type="' +
            element.fileType +
            '">' +
            element.name +
            '</option>';
    });
    $('#whiteboardList').html($str);
    // 更新下拉框 form.render(type, filter);
    layui.form.render('select', 'customForm');
}

/**
 * @description: 更新 sheetList 下拉框
 * @param {*}
 * @return {*}
 */
function updateExcelSheetListDomHandle(uniqueID, zegoExcelSheetNameList) {
    var $str = '';
    $('#sheetList').html('');
    zegoExcelSheetNameList.forEach(function(element, index) {
        $str += '<option value="' + uniqueID + ',' + index + '">' + element + '</option>';
    });
    $('#sheetList').html($str);
    // 更新下拉框 form.render(type, filter);
    layui.form.render('select', 'customForm');
}

/**
 * @description: 显示、隐藏 sheet 下拉框
 * @param {*} type true: 显示 false: 隐藏
 * @return {*}
 */
function toggleSheetSelectDomHandle(type) {
    if (type) {
        $('#sheetListItem').show();
    } else {
        updateExcelSheetListDomHandle('', []);
        $('#sheetListItem').hide();
    }
}

/**
 * @description: 更新 缩放 下拉框
 * @param {*}
 * @return {*}
 */
function updateCurrScaleDomHandle(scale) {
    $('#scaleList').val(scale);
    // 更新下拉框 form.render(type, filter);
    layui.form.render('select', 'customForm');
}

/**
 * @description: 显示、隐藏步数切换
 * @param {*} type true: 显示 false: 隐藏
 * @return {*}
 */
function toggleStepDomHandle(type) {
    if (type) {
        $('.ppt-dynamic').addClass('active');
    } else {
        $('.ppt-dynamic').removeClass('active');
    }
}

/**
 * @description: 显示、隐藏缩略图按钮
 * @param {*} type true: 显示 false: 隐藏
 * @return {*}
 */
function toggleThumbBtnDomHandle(type) {
    if (type) {
        $('#thumb-button').addClass('active');
    } else {
        $('#thumb-button').removeClass('active');
    }
}

/**
 * @description: 更新白板列表下拉框选中
 * @param {*}
 * @return {*}
 */
function updateCurrWhiteboardDomHandle(uniqueID) {
    layui.form.val('customForm', {
        whiteboard: uniqueID
    });
}

/**
 * @description: 更新 sheet 列表下拉框选中
 * @param {*}
 * @return {*}
 */
function updateCurrSheetDomHandle(uniqueID, sheetIndex) {
    layui.form.val('customForm', {
        sheet: uniqueID + ',' + sheetIndex
    });
}

/**
 * @description: 提示框
 * @param {*}
 * @return {*}
 */
function toast(content) {
    content = typeof content === 'string' ? content : JSON.stringify(content);
    layui.layer.msg(content);
}

/**
 * @description: 打开 loading
 * @param {*} content
 * @return {*}
 */
function loading(content) {
    content = typeof content === 'string' ? content : JSON.stringify(content);
    layui.layer.open({
        type: 3,
        content
    });
}

/**
 * @description: 关闭 loading
 * @param {*}
 * @return {*}
 */
function closeLoading() {
    layui.layer.closeAll();
}

// 绑定预览事件
$('#thumb-button').click(function(event) {
    $('#thumbModal').toggleClass('active');
});

// 绑定切换功能区事件
$('#right-header').click(function(event) {
    var target = event.target;
    var index = $(target).attr('data-index');
    $('.nav-item').removeClass('active');
    $(target).addClass('active');

    $('.main-feature').removeClass('active');
    $('.main-feature:nth-of-type(' + index + ')').addClass('active');
});

// 更新邀请信息
$('.inivate-btn').click(function(event) {
    var inivateLink = location.origin + '?roomID=' + zegoConfig.roomID + '&env=' + zegoConfig.env;
    $('#showInviteLink').val(inivateLink);
    $('#showRoomEnv').html(zegoConfig.env == 1 ? '中国内地' : '海外');
});

// 阻止事件
$('.pencil-text-setting').click(function(event) {
    event.stopPropagation();
});

$('.custom-graph-setting').click(function(event) {
    event.stopPropagation();
});

// 点击空白处关闭白板工具弹出框、关闭缩略图弹框
$(document).click(function(event) {
    if (!$(this).parents('.tool-item').length > 0) {
        $('.pencil-text-setting').removeClass('active');
        $('.custom-graph-setting').removeClass('active');
    }
});
