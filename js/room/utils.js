/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:23:27
 * @LastEditTime: 2021-08-27 01:21:15
 * @LastEditors: Please set LastEditors
 * @Description: 房间页更新 DOM 的相关方法、相关工具方法
 * @FilePath: /superboard/js/room/utils.js
 */

/**
 * @description: 第三方 UI 插件 Bootstrap tooltip 初始化
 */
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

// 房间页更新 DOM 的相关方法、相关工具方法
var roomUtils = {
    /**
     * @description: 全局提示框
     * @description: 这里使用第三方 Layui 插件提示框，开发者根据实际情况使用相应的提示框
     * @param {String|Object} content 提示内容
     */
    toast: function(content) {
        // 对象转换为字符串后提示
        content = typeof content === 'string' ? content : JSON.stringify(content);
        layui.layer.msg(content);
    },

    /**
     * @description: 全局打开 loading
     * @description: 这里使用第三方 UI 插件 Layui loading，开发者根据实际情况使用相应的 loading
     * @param {String|Object} content loading 中内容
     */
    loading: function(content) {
        content = typeof content === 'string' ? content : JSON.stringify(content);
        layui.layer.open({ type: 3, content });
    },

    /**
     * @description: 全局关闭 loading
     * @description: 这里使用第三方 UI 插件 Layui loading，开发者根据实际情况使用相应的 loading
     */
    closeLoading: function() {
        layui.layer.closeAll();
    },

    /**
     * @description: 更新页面上顶部总页数 pageCount
     * @param {Number} pageCount
     */
    updatePageCountDomHandle: function(pageCount) {
        $('#pageCount').html(pageCount);
    },

    /**
     * @description: 更新页面上当前页 currPage，包括顶部翻页按钮 + 缩略图
     * @param {Number} currPage
     */
    updateCurrPageDomHandle: function(currPage) {
        $('#currPage').html(currPage);
        $('.thumb-item').removeClass('active');
        $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
        // 自动滚动到缩略图指定页位置
        var scrollTop = 112 * (currPage - 1);
        $('.thumb-main')[0].scrollTop = scrollTop;
    },

    /**
     * @description: 显示、隐藏页面白板区域占位
     * @description: 房间内有白板时，显示白板，没有白板显示占位
     * @param {Boolean} type true 显示 false 隐藏
     */
    togglePlaceholderDomHandle: function(type) {
        if (type) {
            $('#main-whiteboard-placeholder').addClass('active');
        } else {
            $('#main-whiteboard-placeholder').removeClass('active');
        }
    },

    /**
     * @description: 更新页面顶部白板列表下拉框
     * @description: 这里使用第三方 UI 插件 Layui 的下拉框，更新页面 DOM 后需要调用 Layui 的方法重新渲染
     * @description: 开发者可根据实际情况处理
     * @param {Array} zegoSuperBoardSubViewModelList 白板列表
     */
    updateWhiteboardListDomHandle: function(zegoSuperBoardSubViewModelList) {
        var $str = '';
        $('#whiteboardList').html('');
        zegoSuperBoardSubViewModelList.forEach(function(element,index) {
            $str +=
                '<option value="' +
                element.uniqueID +
                '" data-file-type="' +
                element.fileType +
                '">' +
                index  + '-' + element.name +
                '</option>';
        });
        $('#whiteboardList').html($str);
        // 更新白板列表下拉框 DOM 后重新渲染
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: 更新页面顶部 Excel 白板 sheetList 下拉框
     * @description: 一个 Excel 可能存在多个 sheet，就会创建多个 sheet 白板
     * @description: 这里使用第三方 UI 插件 Layui 的下拉框，更新页面 DOM 后需要调用 Layui 的方法重新渲染
     * @description: 开发者可根据实际情况处理
     * @param {String} uniqueID uniqueID
     * @param {Array} zegoExcelSheetNameList Excel 对应的 sheet 列表
     */
    updateExcelSheetListDomHandle: function(uniqueID, zegoExcelSheetNameList) {
        var $str = '';
        $('#sheetList').html('');
        zegoExcelSheetNameList.forEach(function(element, index) {
            $str += '<option value="' + uniqueID + ',' + index + '">' + element + '</option>';
        });
        $('#sheetList').html($str);
        // 更新 sheetList 下拉框 DOM 后重新渲染
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: 显示、隐藏页面顶部 Excel 白板 sheetList 下拉框
     * @param {Boolean} type true: 显示 false: 隐藏
     */
    toggleSheetSelectDomHandle: function(type) {
        if (type) {
            // 显示页面 Excel 白板 sheetList 下拉框
            $('#sheetListItem').show();
        } else {
            // 更新页面 Excel 白板 sheetList 下拉框
            roomUtils.updateExcelSheetListDomHandle('', []);
            // 隐藏页面 Excel 白板 sheetList 下拉框
            $('#sheetListItem').hide();
        }
    },

    /**
     * @description: 更新页面顶部缩放列表下拉框
     * @description: 这里使用第三方 UI 插件 Layui 的下拉框，更新页面 DOM 后需要调用 Layui 的方法重新渲染
     * @param {Number} scale 缩放值
     */
    updateCurrScaleDomHandle: function(scale) {
        $('#scaleList').val(scale);
        // 更新页面缩放列表下拉框后重新渲染
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: 显示、隐藏动态 PPT 文件白板的步数切换
     * @description: 非动态 PPT 文件白板不存步数，不能切步
     * @param {Boolean} type true: 显示 false: 隐藏
     */
    toggleStepDomHandle: function(type) {
        if (type) {
            $('.ppt-dynamic').addClass('active');
        } else {
            $('.ppt-dynamic').removeClass('active');
        }
    },

    /**
     * @description: 显示、隐藏页面缩略图按钮
     * @description: fileType 为 1、8、512、4096 时存在缩略图，显示缩略图按钮
     * @param {Boolean} type true: 显示 false: 隐藏
     */
    toggleThumbBtnDomHandle: function(type) {
        if (type) {
            $('#thumb-button').addClass('active');
        } else {
            $('#thumb-button').removeClass('active');
        }
    },

    /**
     * @description: 更新页面顶部白板列表下拉框中当前选中白板
     * @description: 这里使用第三方 UI 插件 Layui 的下拉框，需要调用 Layui 的方法更新页面白板列表下拉框中当前选中白板
     * @param {String} uniqueID uniqueID
     */
    updateCurrWhiteboardDomHandle: function(uniqueID) {
        layui.form.val('customForm', { whiteboard: uniqueID });
    },

    /**
     * @description: 更新页面顶部 Excel 白板 sheetList 下拉框当前选中 sheet
     * @description: 这里使用第三方 UI 插件 Layui 的下拉框，需要调用 Layui 的方法更新页面 sheetList 下拉框中当前选中 sheet
     * @param {String} uniqueID uniqueID
     * @param {Number} sheetIndex 需要选中的 sheet 下标
     */
    updateCurrSheetDomHandle: function(uniqueID, sheetIndex) {
        layui.form.val('customForm', { sheet: uniqueID + ',' + sheetIndex });
    },

    /**
     * @description: 重置页面白板工具栏为画笔，并激活当前样式
     * @description: 初始化 SuperBoard SDK 白板工具为画笔时调用
     */
    resetToolTypeDomHandle: function() {
        $('.tool-item').removeClass('active');
        $('.pencil-text-setting').removeClass('active');
        $('.tool-item.pen').addClass('active');
    },

    /**
     * @description: 是否禁用点击工具，增加禁用样式
     * @description: 非动态 PPT、自定义 H5 文件白板时需要禁用点击工具
     * @description: 每次切换白板时调用，判断当前白板是否需要禁用点击工具
     * @param {Boolean} type true: 禁止 false: 隐藏
     */
    toggleDisabledDomHandle: function(type) {
        if (type) {
            $('.tool-item.clickType').addClass('disabled');
        } else {
            $('.tool-item.clickType').removeClass('disabled');
        }
    }
};

/**
 * @description: 绑定缩略图预览事件
 * @description: 点击缩略图按钮时打开当前文件白板的缩略图右侧弹框
 */
$('#thumb-button').click(function(event) {
    $('#thumbModal').toggleClass('active');
});

/**
 * @description: 绑定关闭缩略图列表事件
 * @description: 点击关闭按钮时，关闭缩略图右侧弹框
 */
$('.thumb-header span').click(function(event) {
    $('#thumbModal').removeClass('active');
});

/**
 * @description: 绑定切换右侧功能区 Tab 事件
 */
$('#right-header').click(function(event) {
    var target = event.target;
    var index = $(target).attr('data-index');
    $('.nav-item').removeClass('active');
    $(target).addClass('active');

    $('.main-feature').removeClass('active');
    $('.main-feature:nth-of-type(' + index + ')').addClass('active');
});

/**
 * @description: 每次打开底部邀请按钮时更新邀请弹框中的邀请信息
 */
$('.inivate-btn').click(function(event) {
    var inivateLink = location.origin + '?roomID=' + zegoConfig.roomID + '&env=' + zegoConfig.env;
    $('#showInviteLink').val(inivateLink);
    $('#showRoomEnv').html(zegoConfig.env == 1 ? '中国内地' : '海外');
});

/**
 * @description: 页面白板工具栏，阻止事件传播
 * @description: 仅为实现工具栏点击的打开弹框功能，开发者可根据实际情况处理
 */
$('.pencil-text-setting').click(function(event) {
    event.stopPropagation();
});

/**
 * @description: 页面白板工具栏，阻止事件传播
 * @description: 仅为实现工具栏点击的打开弹框功能，开发者可根据实际情况处理
 */
$('.custom-graph-setting').click(function(event) {
    event.stopPropagation();
});

/**
 * @description: 点击空白处关闭白板工具栏点击后出现的弹出框
 * @description: 仅为实现工具栏点击的打开弹框功能，开发者可根据实际情况处理
 */
$(document).click(function(event) {
    if (!$(this).parents('.tool-item').length > 0) {
        $('.pencil-text-setting').removeClass('active');
        $('.custom-graph-setting').removeClass('active');
    }
});

/**
 * @description: 复制邀请链接
 */
$('#copyLintBtn').click(function() {
    $('#showInviteLink').select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    roomUtils.toast('复制成功');
});
