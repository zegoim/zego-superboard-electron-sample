/*
 * @Author: ZegoDev
 * @Date: 2021-08-02 15:35:52
 * @LastEditTime: 2021-08-05 01:10:07
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
 * @param {*} type
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
 * @description: 缩放 cut
 * @param {*}
 * @return {*}
 */
function zoomCutDomHandle() {
    var currZoomLevel = $('#zoomLevel').val();
    if (currZoomLevel === '1') return;
    $('.zoom-bar-center input').val((Number(currZoomLevel) - 0.25) * 100 + '%');
}

/**
 * @description: 缩放 add
 * @param {*}
 * @return {*}
 */
function zoomAddDomHandle() {
    var currZoomLevel = $('#zoomLevel').val();
    if (currZoomLevel === '3') return;
    $('.zoom-bar-center input').val((Number(currZoomLevel) + 0.25) * 100 + '%');
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
