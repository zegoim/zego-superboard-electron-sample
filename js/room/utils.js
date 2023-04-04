/*
 * @Author: ZegoDev
 * @Date: 2021-07-28 14:23:27
 * @LastEditTime: 2021-08-27 01:21:15
 * @LastEditors: Please set LastEditors
 * @Description: Room page update DOM related methods, related tools and methods
 * @FilePath: /superboard/js/room/utils.js
 */

/**
 * @description: Initialization of the third-party UI plug-in Bootstrap tooltip.
 */
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

window.onload = () => {
    document.querySelector('#userName').value = 'userName' + String(Date.now()).slice(-5);
    document.querySelector('#userID').value = 'userID' + String(Date.now()).slice(-5);
};

// Methods and tools for updating the DOM on the room page.
var roomUtils = {
    /**
     * @description: A global pop-up box.
     * @description: A pop-up box of the third-party plug-in layui is used here. You can use pop-up boxes as required.
     * @param {String|Object} content Pop-up box content
     */
    toast: function(content) {
        // A pop-up box is displayed after an object is converted to a string.
        content = typeof content === 'string' ? content : JSON.stringify(content);
        layui.layer.msg(content);
    },

    /**
     * @description: Enable loading globally.
     * @description: Loading of the third-party plug-in layui is used here. You can use the loading as required.
     * @param {String|Object} content loading Loading content
     */
    loading: function(content) {
        content = typeof content === 'string' ? content : JSON.stringify(content);
        layui.layer.open({
            type: 3,
            content
        });
    },

    /**
     * @description: Disable loading globally.
     * @description: Loading of the third-party plug-in layui is used here. You can use the loading as required.
     */
    closeLoading: function() {
        layui.layer.closeAll();
    },

    /**
     * @description: Update the total number of pages specified by pageCount at the top of the page.
     * @param {Number} pageCount
     */
    updatePageCountDomHandle: function(pageCount) {
        $('#pageCount').html(pageCount);
    },

    /**
     * @description: Update the currPage, page-turning button, and thumbnail at the top of the page.
     * @param {Number} currPage
     */
    updateCurrPageDomHandle: function(currPage) {
        $('#currPage').html(currPage);
        $('.thumb-item').removeClass('active');
        $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
        // Automatically scroll to the page specified in the thumbnail.
        var scrollTop = 112 * (currPage - 1);
        $('.thumb-main')[0].scrollTop = scrollTop;
    },

    /**
     * @description: Display or hide the whiteboard placeholder on the page.
     * @description: If a whiteboard exists in the room, the whiteboard is displayed; otherwise, a placeholder is displayed.
     * @param {Boolean} type true: display; false: hide.
     */
    togglePlaceholderDomHandle: function(type) {
        if (type) {
            $('#main-whiteboard-placeholder').addClass('active');
        } else {
            $('#main-whiteboard-placeholder').removeClass('active');
        }
    },

    /**
     * @description: Display or hide the whiteboard tool on the page.
     * @description: If a whiteboard exists in the room, the whiteboard tool is displayed; otherwise, a placeholder is displayed.
     * @param {Boolean} type true: display; false: hide.
     */
    toggleToolDomHandle: function(type){
        if (type) {
            // 显示白板工具
            $('#main-whiteboard-tool').css({ display: 'block' });
        } else {
            // 隐藏白板工具
            $('#main-whiteboard-tool').css({ display: 'none' });
        }
    },

    /**
     * @description: Update the whiteboard list drop-down list at the top of the page.
     * @description: A drop-down list of the third-party UI plug-in layui is used here. You need to call layui to re-render after the page DOM is updated.
     * @description: You can handle it as required.
     * @param {Array} zegoSuperBoardSubViewModelList Whiteboard list
     */
    updateWhiteboardListDomHandle: function(zegoSuperBoardSubViewModelList) {
        var $str = '';
        $('#whiteboardList').html('');
        if (zegoSuperBoardSubViewModelList.length == 0) {
            $str = '<option>Please Select</option>';
        }
        zegoSuperBoardSubViewModelList.forEach(function(element, index) {
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
        // Re-render after the DOM of the whiteboard list drop-down list is updated.
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: Hide the sheetList drop-down list of the Excel file whiteboard at the top of the page.
     * @description: An Excel file may have multiple sheets. In this case, multiple sheet whiteboards are created.
     * @description: A drop-down list of the third-party UI plug-in layui is used here. You need to call layui to re-render after the page DOM is updated.
     * @description: You can handle it as required.
     * @param {String} uniqueID uniqueID
     * @param {Array} zegoExcelSheetNameList Excel The sheet list corresponding to the Excel file
     */
    updateExcelSheetListDomHandle: function(uniqueID, zegoExcelSheetNameList) {
        var $str = '';
        $('#sheetList').html('');
        zegoExcelSheetNameList.forEach(function(element, index) {
            $str += '<option value="' + uniqueID + ',' + index + '">' + element + '</option>';
        });
        $('#sheetList').html($str);
        // Re-render after the DOM of the sheetList drop-down list is updated.
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: Display or hide the sheetList drop-down list of the Excel file whiteboard at the top of the page.
     * @param {Boolean} type true: display; false: hide.
     */
    toggleSheetSelectDomHandle: function(type) {
        if (type) {
            // Display the sheetList drop-down list of the Excel file whiteboard.
            $('#sheetListItem').show();
        } else {
            // Update the sheetList drop-down list of the Excel file whiteboard.
            roomUtils.updateExcelSheetListDomHandle('', []);
            // Hide the sheetList drop-down list of the Excel file whiteboard.
            $('#sheetListItem').hide();
        }
    },

    /**
     * @description: Update the zooming list drop-down list at the top of the page.
     * @description: A drop-down list of the third-party UI plug-in layui is used here. You need to call layui to re-render after the page DOM is updated.
     * @param {Number} scale Zooming value
     */
    updateCurrScaleDomHandle: function(scale) {
        $('#scaleList').val(scale);
        // Re-render after the zooming list drop-down list is updated.
        layui.form.render('select', 'customForm');
    },

    /**
     * @description: Display or hide the step switching of whiteboards of the animated PPT file.
     * @description: For whiteboards of the non-animated PPT file, the number of steps cannot be saved, and step switching is disabled.
     * @param {Boolean} type true: display; false: hide.
     */
    toggleStepDomHandle: function(type) {
        if (type) {
            $('.ppt-dynamic').addClass('active');
        } else {
            $('.ppt-dynamic').removeClass('active');
        }
    },

    /**
     * @description: Display or hide the thumbnail icon on the page.
     * @description: The thumbnail icon is displayed when fileType is set to 1, 8, 512, and 4096.
     * @param {Boolean} type true: display; false: hide.
     */
    toggleThumbBtnDomHandle: function(type) {
        if (type) {
            $('#thumb-button').addClass('active');
        } else {
            $('#thumb-button').removeClass('active');
        }
    },

    /**
     * @description: Update the currently selected whiteboard in the whiteboard list drop-down list at the top of the page.
     * @description: A drop-down list of the third-party UI plug-in layui is used here. You need to call layui to update the currently selected whiteboard in the whiteboard list drop-down list.
     * @param {String} uniqueID uniqueID
     */
    updateCurrWhiteboardDomHandle: function(uniqueID) {
        layui.form.val('customForm', {
            whiteboard: uniqueID
        });
    },

    /**
     * @description: Update the currently selected sheet in the sheetList drop-down list of the Excel file whiteboard at the top of the page.
     * @description: A drop-down list of the third-party UI plug-in layui is used here. You need to call layui to update the currently selected sheet in the sheetList drop-down list.
     * @param {String} uniqueID uniqueID
     * @param {Number} sheetIndex Subscript of the sheet to be selected
     */
    updateCurrSheetDomHandle: function(uniqueID, sheetIndex) {
        layui.form.val('customForm', {
            sheet: uniqueID + ',' + sheetIndex
        });
    },

    /**
     * @description: Reset the whiteboard tool to Pen and enable the current tool.
     * @description: Initialize the Super Board SDK and call it when the whiteboard tool is set to Pen.
     */
    resetToolTypeDomHandle: function() {
        $('.tool-item').removeClass('active');
        $('.pencil-text-setting').removeClass('active');
        $('.tool-item.pen').addClass('active');
    },

    /**
     * @description: Indicates whether to disable the Click tool and add the disabled tool type.
     * @description: For whiteboards of non-animated PPT files or custom H5 files, the Click tool needs to be disabled.
     * @description: Call the method each time the whiteboard is switched to determine whether the Click tool needs to be disabled for the current whiteboard.
     * @param {Boolean} type true: disable; false: enable.
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
 * @description: Bind an event for the thumbnail preview.
 * @description: When you click the thumbnail icon, the dialog on the right of the thumbnail of the current file whiteboard is displayed.
 */
$('#thumb-button').click(function(event) {
    $('#thumbModal').toggleClass('active');
});

/**
 * @description: Bind an event for closing the thumbnail list.
 * @description: When you click the Close button, the dialog on the right of the thumbnail is closed.
 */
$('.thumb-header span').click(function(event) {
    $('#thumbModal').removeClass('active');
});

/**
 * @description: Bind an event for switching the tab in the functional area on the right.
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
 * @description: Update the information in the dialog each time when the Invite button is clicked.
 */
$('.inivate-btn').click(function(event) {
    var inivateLink = location.origin + '?roomID=' + zegoConfig.roomID + '&env=' + zegoConfig.env;
    $('#showInviteLink').val(inivateLink);
    $('#showRoomEnv').html(zegoConfig.env == 1 ? jQuery.i18n.prop('config-env-1') : jQuery.i18n.prop('config-env-2'));
});

/**
 * @description: The toolbar of the whiteboard on the page. It is used to stop event triggering.
 * @description: The method is used to implement the function of displaying the dialog based on the clicking of the toolbar. You can handle it as required.
 */
$('.pencil-text-setting').click(function(event) {
    event.stopPropagation();
});

/**
 * @description: The toolbar of the whiteboard on the page. It is used to stop event triggering.
 * @description: The method is used to implement the function of displaying the dialog based on the clicking of the toolbar. You can handle it as required.
 */
$('.custom-graph-setting').click(function(event) {
    event.stopPropagation();
});

/**
 * @description: A dialog that appears after the click on other tools when the whiteboard toolbar is disabled by clicking on the blank space.
 * @description: The method is used to implement the function of displaying the dialog based on the clicking of the toolbar. You can handle it as required.
 */
$(document).click(function(event) {
    if (!$(this).parents('.tool-item').length > 0) {
        $('.pencil-text-setting').removeClass('active');
        $('.custom-graph-setting').removeClass('active');
    }
});

/**
 * @description: Copy the invitation link.
 */
$('#copyLintBtn').click(function() {
    $('#showInviteLink').select();
    document.execCommand('copy');
    roomUtils.toast(jQuery.i18n.prop('Copied-successfully'));
});

/**
 * @description: debug panel
 */
$('.debug-btn').click(function() {
    if ($('#room-page-right-mask').css('display') === 'none') {
        $('#room-page-right').addClass('active');
        $('#room-page-right-mask').css('display', 'block');
    } else {
        $('#room-page-right').removeClass('active');
        $('#room-page-right-mask').css('display', 'none');
    }
});

/**
 * @description: 调试面板遮罩
 */
$('#room-page-right-mask').click(function() {
    $('#room-page-right').removeClass('active');
    $('#room-page-right-mask').css('display', 'none');
});

/**
 * @description: 判断是否H5
 */
function isH5() {
    let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    if (flag == null) {
        return false;
    } else {
        return true;
    }
}
