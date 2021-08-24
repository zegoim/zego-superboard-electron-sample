/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:23:27
 * @LastEditTime: 2021-08-25 02:27:04
 * @LastEditors: Please set LastEditors
 * @Description: 房间页更新 DOM 的相关方法、相关工具方法
 * @FilePath: /superboard_demo_web/js/utils.js
 */

/**
 * @description 动态加载 Script 资源
 * @param {*} url 资源地址
 * @return {*} Promise
 */
function loadScript(url) {
    // 不支持 Promise 的浏览器开发者需要自行做好兼容
    return new Promise(function(resolve) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = url;
        if (script.readyState) {
            // IE Browser
            script.onreadystatechange = function() {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                }
            };
        } else {
            // Others Browser
            script.onload = function() {
                console.log(url + ' 加载成功');
                resolve();
            };
            script.onerror = function() {
                console.error(url + ' 加载异常');
            };
        }
        head.appendChild(script);
    });
}

/**
 * @description: 批量动态加载 Script 资源
 * @param {*} pathList
 * @return {*}
 */
function loadAllScript(pathList) {
    var tasks = pathList.map(function(path) {
        return loadScript(path);
    });
    return Promise.all(tasks);
}

/**
 * @description: 复制邀请链接
 * @param {*}
 * @return {*}
 */
function copyInviteLink() {
    $('#showInviteLink').select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    alert('复制成功');
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

// bootstrap tooltip、popover 初始化
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('#openPopover').popover();
});

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

// 绑定预览事件
$('#thumb-button').click(function(event) {
    $('#thumbModal').toggleClass('active');
});

// 绑定关闭缩略图弹框事件
$('.thumb-header span').click(function(event) {
    $('#thumbModal').removeClass('active');
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
