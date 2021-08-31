/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:07:48
 * @LastEditTime: 2021-08-27 01:16:38
 * @LastEditors: Please set LastEditors
 * @Description: 上传自定义 H5 文件
 * @FilePath: /superboard/js/room/uploadH5File.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框

var selectedH5File = null; // 当前选择的本地 H5 压缩包文件

/**
 * @description: 选择本地 H5 压缩包文件
 * @description: 这里只展示选择本地文件，开发者根据实际情况处理
 */
layui.upload.render({
    elem: '#selectH5', // 绑定元素
    accept: 'file', // 接收任意文件
    exts: 'zip', // 根据后缀名过滤
    auto: false, // 不自动上传
    choose: function(obj) {
        // 选择完文件
        obj.preview(function(index, file, result) {
            // 存储选择的文件，file 为当前选中文件
            selectedH5File = file;
            roomUtils.toast('选择文件成功');
        });
    }
});

/**
 * @description: 上传自定义 H5 文件
 */
$('#uploadH5FileBtn').click(async function() {
    // 判断 file、width、height、pageCount、h5ThumbnailList
    if (!selectedH5File) {
        return roomUtils.toast('未选择文件');
    }

    // 获取页面上输入的 width、height、pageCount、h5ThumbnailListStr，这里使用的是 layui，开发者可根据实际情况获取
    var data = layui.form.val('form3');
    var h5Width = Number(data.h5Width);
    var h5Height = Number(data.h5Height);
    var h5PageCount = Number(data.h5PageCount);
    // 将页面输入的 h5ThumbnailListStr 转换成数组
    var h5ThumbnailList = data.h5ThumbnailListStr ? data.h5ThumbnailListStr.split(',') : null;
    if (!h5Width || !h5Height || !h5PageCount || !h5ThumbnailList) {
        return roomUtils.toast('文件参数有误');
    }

    // 构造上传自定义 H5 接口所需数据
    var config = {
        width: h5Width, // 自定义文件的宽
        height: h5Height, // 自定义文件的高
        pageCount: h5PageCount, // 自定义文件的页数
        thumbnailList: h5ThumbnailList // 自定义文件缩略图相对路径数组
    };
    try {
        var fileID = await zegoSuperBoard.uploadH5File(selectedH5File, config, function(res) {
            roomUtils.toast(res.uploadPercent + '%');
        });

        // 这里上传完成立即创建文件白板，开发者根据实际情况处理
        // 创建文件白板方法在 js/room/whiteboard.js 中
        createFileView(fileID);
    } catch (errorData) {
        roomUtils.toast(errorData);
    }
});
