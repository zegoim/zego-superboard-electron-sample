/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:11
 * @LastEditTime: 2021-08-27 01:16:21
 * @LastEditors: Please set LastEditors
 * @Description: 上传静态、动态文件
 * @FilePath: /superboard/js/room/uploadFile.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// zegoConfig 为全局配置
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

var uploadFileUtils = {
    /**
     * @description: 更新页面上文件列表弹框中的文件列表
     * @description: 给每一个文件所在 LI 元素绑定创建文件白板事件
     * @description: 创建文件白板方法在 js/room/whiteboard.js 中
     * @param {Object} fileListData 文件列表数据
     * @param {String} superBoardEnv 当前 ZegoSuperBoard SDK 环境
     */
    updateFileListDomHandle: function(fileListData, superBoardEnv) {
        var fileList = fileListData[superBoardEnv === 'test' ? 'docs_test' : 'docs_prod'];
        var $fileListCon = $('#file-list');
        // 清空原有
        $fileListCon.html('');
        // 使用最新文件列表
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
    },
    closeFileDomHandle: function() {
        // 关闭文件列表所在弹框
        $('#filelistModal').modal('hide');
        // 关闭静态、动态上传下拉框
        $('.layui-dropdown').hide();
    },
    /**
     * @description: 从本地根目录下的 fileList.json 中获取文件列表
     * @description: 这里仅演示获取 fileList 的示例代码，开发者根据实际情况处理
     * @param {String} filelistUrl 文件列表的 URL
     */
    getFilelist: function(filelistUrl = './fileList.json') {
        return new Promise(function(resolve) {
            $.get(
                filelistUrl,
                null,
                function(fileList) {
                    if (fileList) {
                        resolve(fileList);
                    }
                },
                'json'
            );
        });
    }
};

/**
 * @description: 选择静态、动态文件进行上传
 * @param {Number} renderType 渲染模式
 * @param {File} file 文件对象
 */
function uploadFile(renderType, file) {
    if (!file) return roomUtils.toast('请先选择文件');

    zegoSuperBoard
        .uploadFile(file, renderType, function(res) {
            roomUtils.toast(uploadFileTipsMap[res.status] + (res.uploadPercent ? res.uploadPercent + '%' : ''));
        })
        .then(function(fileID) {
            uploadFileUtils.closeFileDomHandle();

            // 这里上传完成立即创建文件白板，开发者根据实际情况处理
            // 创建文件白板方法在 js/room/whiteboard.js 中
            createFileView(fileID);
        })
        .catch(roomUtils.toast);
}

/**
 * @description: 点击文件列表中的上传文件，打开下拉框
 * @description: 这里只展示打开下拉框，开发者根据实际情况处理
 */
layui.dropdown.render({
    elem: '#openPopover',
    content: $('#uploadPopoverContent').html()
});

/**
 * @description: 点击页面下方的‘文件’功能，查询当前文件列表，并更新页面
 */
$('.share-item.file').click(async function() {
    // 获取文件列表
    var fileListData = await uploadFileUtils.getFilelist();

    // 更新页面上文件列表弹框中的文件列表
    uploadFileUtils.updateFileListDomHandle(fileListData, zegoConfig.superBoardEnv);
});

/**
 * @description: 点击页面中间的的‘共享文件’功能，查询当前文件列表，并更新页面
 */
$('#shareFile').click(async function() {
    // 获取文件列表
    var fileListData = await uploadFileUtils.getFilelist();

    // 更新页面上文件列表弹框中的文件列表
    uploadFileUtils.updateFileListDomHandle(fileListData, zegoConfig.superBoardEnv);
});
