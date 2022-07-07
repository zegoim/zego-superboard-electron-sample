/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:07:48
 * @LastEditTime: 2021-08-27 01:16:38
 * @LastEditors: Please set LastEditors
 * @Description: Upload custom H5 file
 * @FilePath: /superboard/js/room/uploadH5File.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var selectedH5File = null; // The currently selected local H5 archive

/**
 * @description: Select a local H5 compressed package.
 * @description: Only selected local files are displayed here. You can handle it as required.
 */
layui.upload.render({
    elem: '#selectH5',
    accept: 'file',
    exts: 'zip',
    auto: false,
    choose: function (obj) {
        // The file is selected.
        obj.preview(function (index, file, result) {
            // Save the selected file. The file parameter indicates the file that is currently selected.
            selectedH5File = file;
            roomUtils.toast('file selected successfully');
        });
    }
});

/**
 * @description: Upload a user-defined H5 file.
 */
$('#uploadH5FileBtn').click(async function () {
    // Determine the file, width, height, pageCount, and h5ThumbnailList.
    if (!selectedH5File) {
        return roomUtils.toast('No file selected');
    }

    // Obtain the width, height, pageCount, and h5ThumbnailListStr entered on the page. layui is used here. You can obtain them as required.
    var data = layui.form.val('form3');
    var h5Width = Number(data.h5Width);
    var h5Height = Number(data.h5Height);
    var h5PageCount = Number(data.h5PageCount);
    // Convert the h5ThumbnailListStr entered on the page to an array.
    var h5ThumbnailList = data.h5ThumbnailListStr ? data.h5ThumbnailListStr.split(',') : null;
    if (!h5Width || !h5Height || !h5PageCount || !h5ThumbnailList) {
        return roomUtils.toast('wrong file parameters');
    }

    // Specify the data required to upload a custom H5 interface.
    var config = {
        width: h5Width, // custom file width
        height: h5Height, // height of custom file
        pageCount: h5PageCount, // the number of pages of the custom file
        thumbnailList: h5ThumbnailList // Custom file thumbnail relative path array
    };
    try {
        var fileID = await zegoSuperBoard.uploadH5File(selectedH5File, config, function (res) {
            roomUtils.toast(res.uploadPercent + '%');
        });

        // A file whiteboard is created immediately after the upload. You can handle it as required.
        // The method of creating a file whiteboard is shown in js/room/whiteboard.js.
        createFileView(fileID);
    } catch (errorData) {
        roomUtils.toast(errorData);
    }
});