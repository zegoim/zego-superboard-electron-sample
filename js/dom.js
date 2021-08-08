/*
 * @Author: ZegoDev
 * @Date: 2021-08-02 15:35:52
 * @LastEditTime: 2021-08-08 12:42:11
 * @LastEditors: Please set LastEditors
 * @Description: dom 相关方法
 * @FilePath: /superboard_demo_web/js/dom.js
 */

/**
 * @description: 更新文件列表
 * @param {*}
 * @return {*}
 */
function updateFileListDomHandle() {
    var fileList = zegoConfig.fileListData[zegoConfig.superBoardEnv === 'test' ? 'docs_test' : 'docs_prod'];
    var $fileListCon = $('#file-list');
    // 清空原有
    $fileListCon.html('');

    var $str = '';
    fileList.forEach((element) => {
        $str +=
            '<li class="file-item" data-file-id="' +
            element.id +
            '"><div class="state ' +
            (element.isDynamic || element.isH5 ? 'dynamic' : '') +
            '">' +
            (element.isDynamic || element.isH5 ? '动态' : '静态') +
            '</div>' +
            element.name +
            '</li>';
    });
    $fileListCon.html($str);
}

/**
 * @description: 显示、隐藏登录页、房间页
 * @param {*} type 1: 显示 2: 隐藏
 * @return {*}
 */
function togglePageHandle(type) {
    if (type === 1) {
        // 显示房间页
        $('#room-page').css('display', 'flex');
        $('#login-page').css('display', 'none');
    } else {
        // 显示登录页
        $('#room-page').css('display', 'none');
        $('#login-page').css('display', 'block');
    }
}

/**
 * @description: 更新房间号
 * @param {*}
 * @return {*}
 */
function updateRoomIDDomHandle() {
    $('#showRoomID').html(zegoConfig.roomID);
    $('#roomID').val(zegoConfig.roomID);
}

/**
 * @description: 更新房间成员列表
 * @param {*}
 * @return {*}
 */
function updateUserListDomHandle() {
    $('#memberNum').html(userList.length);

    $('#subMemberNum').html(userList.length);
    $('#user-list').html('');

    var $str = '';
    userList.forEach(function(element) {
        $str += '<li class="user-item">' + element.userName + '</li>';
    });
    $('#user-list').html($str);
}

/**
 * @description: 更新缩略图列表
 * @param {*} thumbnailUrlList 缩略图 url
 * @return {*}
 */
function updateThumbListDomHandle(thumbnailUrlList, currPage) {
    $('.thumb-main').html('');
    var $str = '';
    thumbnailUrlList.forEach(function(element, index) {
        $str +=
            '<li onclick="flipToPage(' +
            (index + 1) +
            ')" class="thumb-item' +
            (index === currPage - 1 ? ' active' : '') +
            '"><span>' +
            (index + 1) +
            '</span><div class="thumb-image"><img src="' +
            element +
            '"/></div></li>';
    });
    $('.thumb-main').html($str);
}

/**
 * @description: 缩放
 * @param {*}
 * @return {*}
 */
function zoomDomHandle(zoom) {
    layui.form.val('customForm', {
        zoom: zoom + ''
    });
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
 * @description: 更新 currPage
 * @param {*} currPage
 * @return {*}
 */
function updateCurrPageDomHandle(currPage) {
    $('#currPage').html(currPage);
    $('.thumb-item').removeClass('active');
    $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
}

/**
 * @description: 更新接入环境
 * @param {*}
 * @return {*}
 */
function updateEnvDomHandle() {
    $('.radio-inline:nth-of-type(' + zegoConfig.env + ') .inlineRadio').attr('checked', true);
    $('.radio-inline:nth-of-type(' + (zegoConfig.env == 1 ? 2 : 1) + ') .inlineRadio').attr('checked', false);
}

/**
 * @description: 显示、隐藏白板区域占位
 * @param {*} type 1 显示 2 隐藏
 * @return {*}
 */
function togglePlaceholderDomHandle(type) {
    if (type === 1) {
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
 * @param {*} type 1: 显示 2: 隐藏
 * @return {*}
 */
function toggleSheetSelectDomHandle(type) {
    if (type === 1) {
        $('#sheetListItem').show();
    } else {
        updateExcelSheetListDomHandle('', []);
        $('#sheetListItem').hide();
    }
}

/**
 * @description: 显示、隐藏步数切换
 * @param {*} type 1: 显示 2: 隐藏
 * @return {*}
 */
function toggleStepDomHandle(type) {
    if (type === 1) {
        $('.ppt-dynamic').addClass('active');
    } else {
        $('.ppt-dynamic').removeClass('active');
    }
}

/**
 * @description: 显示、隐藏缩略图按钮
 * @param {*} type 1: 显示 2: 隐藏
 * @return {*}
 */
function toggleThumbBtnDomHandle(type) {
    if (type === 1) {
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
 * @description: 更新当前选中工具
 * @param {*} type 工具类型
 * @param {*} event event
 * @return {*}
 */
function updateActiveToolDomHandle(type, event) {
    event.stopPropagation();
    switch (type) {
        case 256:
        case 32:
        case null:
        case 128:
        case 64:
            $('.tool-item').removeClass('active');
            $('.pencil-text-setting').removeClass('active');
            $(event.currentTarget).addClass('active');
            break;
        case 1:
        case 2:
        case undefined: // 图形
            $('.tool-item').removeClass('active');
            $('.pencil-text-setting').removeClass('active');
            $(event.currentTarget)
                .addClass('active')
                .find('.pencil-text-setting')
                .addClass('active');
            if (type === undefined) {
                $('.graph-style-item').removeClass('active');
                $('.graph-style-item:nth-of-type(1)').addClass('active');
            }
            break;
        case 8: // 矩形
        case 16: // 椭圆
        case 4: // 直线
            $('.graph-style-item').removeClass('active');
            $('.graph-style-item:nth-of-type(' + (type === 8 ? 1 : type === 16 ? 2 : 3) + ')').addClass('active');
            break;
        default:
            break;
    }
}

/**
 * @description: 重置白板工具
 * @param {*}
 * @return {*}
 */
function resetToolTypeDomHandle() {
    $('.tool-item').removeClass('active');
    $('.pencil-text-setting').removeClass('active');
    $('.tool-item:nth-of-type(5)').addClass('active');
}

/**
 * @description: 更新当前笔触粗细
 * @param {*} brushSize 粗细
 * @param {*} event event
 * @return {*}
 */
function updateActiveBrushSizeDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.bs-item').removeClass('active');
    $('.bs-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 更新当前笔触颜色
 * @param {*} color 颜色
 * @param {*} event event
 * @return {*}
 */
function updateActiveBrushColorDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.color-item').removeClass('active');
    $('.color-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 更新当前文本大小
 * @param {*} event event
 * @return {*}
 */
function updateActiveFontSizeDomHandle(event) {
    event.stopPropagation();
    var index = $(event.currentTarget).attr('data-index');
    $('.pencil-size-item').removeClass('active');
    $('.pencil-size-item:nth-of-type(' + index + ')').addClass('active');
}

/**
 * @description: 文本粗体
 * @param {*} event event
 * @return {*}
 */
function updateActiveFontBoldHandle(event) {
    event.stopPropagation();
    $(event.currentTarget).toggleClass('active');
}

/**
 * @description: 文本斜体
 * @param {*} event event
 * @return {*}
 */
function updateActiveFontItalicHandle(event) {
    event.stopPropagation();
    $(event.currentTarget).toggleClass('active');
}

/**
 * @description: 开启、关闭滚动、绘制、放缩操作模式
 * @param {*} type 1: 开启 2: 关闭
 * @return {*}
 */
function updateOperatedModeDomHandle(type) {
    if (type === 1) {
        layui.form.val('form2', {
            drawMode: 'on',
            scrollMode: 'on',
            zoomMode: 'on'
        });
    } else {
        layui.form.val('form2', {
            drawMode: '',
            scrollMode: '',
            zoomMode: ''
        });
    }
}

/**
 * @description: 开启、关闭不可操作模式
 * @param {*} type 1: 开启 2: 关闭
 * @return {*}
 */
function updateUnOperatedModeDomHandle(type) {
    layui.form.val('form2', {
        unOperatedMode: type === 1 ? 'on' : ''
    });
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
    var inivateLink = location.origin + '?roomId=' + zegoConfig.roomID + '&env=' + zegoConfig.env;
    $('#showInviteLink').val(inivateLink);
    $('#showRoomEnv').html(zegoConfig.env == 1 ? '中国内地' : '海外');
});

// 组织事件
$('.pencil-text-setting').click(function(event) {
    event.stopPropagation();
});
