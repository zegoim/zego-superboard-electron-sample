/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:11
 * @LastEditTime: 2021-08-18 12:48:14
 * @LastEditors: Please set LastEditors
 * @Description: 上传静态、动态文件
 * @FilePath: /superboard/js/uploadFile.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var uploadFileTipsMap = {
    1: '上传中',
    2: '已上传',
    4: '排队中',
    8: '转换中',
    16: '转换成功',
    32: '转换失败',
    64: '取消上传'
}; // 上传状态

/**
 * @description: 选择静态、动态文件
 * @param {*} renderType
 * @param {*} file
 * @return {*}
 */
function uploadFile(renderType, file) {
    if (!file) return toast('请先选择文件');

    zegoSuperBoard
        .uploadFile(file, renderType, function(res) {
            toast(uploadFileTipsMap[res.status] + (res.uploadPercent ? res.uploadPercent + '%' : ''));
        })
        .then(function(fileID) {
            // 关闭弹框
            $('#filelistModal').modal('hide');
            // 关闭文件下拉框
            $('.layui-dropdown').hide();

            // 这里上传完成立即创建文件白板，开发者根据实际情况处理
            createFileView(fileID);
        })
        .catch(toast);
}

// 绑定打开上传文件选项
layui.dropdown.render({
    elem: '#openPopover',
    content: $('#uploadPopoverContent').html(),
    click: function(data, othis) {}
});

$('.share-item.file').click(async function() {
    // 获取文件列表
    var fileListData = await getFilelist();

    // 更新视图
    updateFileListDomHandle(fileListData, zegoConfig.superBoardEnv);
});

/**
 * @description: 更新文件列表
 * @param {*} fileListData
 */
function updateFileListDomHandle(fileListData, superBoardEnv) {
    var fileList = fileListData[superBoardEnv === 'test' ? 'docs_test' : 'docs_prod'];
    var $fileListCon = $('#file-list');
    // 清空原有
    $fileListCon.html('');

    var $str = '';
    fileList.forEach((element) => {
        $str +=
            '<li onclick="createFileViewByFileID(event)" class="file-item" data-file-id="' +
            element.id +
            '"><div class="state ' +
            (element.isDynamic ? 'dynamic' : element.isH5 ? 'h5' : '') +
            '">' +
            (element.isDynamic ? '动态' : element.isH5 ? 'H5' : '静态') +
            '</div>' +
            element.name +
            '</li>';
    });
    $fileListCon.html($str);
}
