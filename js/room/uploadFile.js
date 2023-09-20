/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:11
 * @LastEditTime: 2021-09-10 10:25:47
 * @LastEditors: Please set LastEditors
 * @Description: Upload static and dynamic files
 * @FilePath: /superboard/js/room/uploadFile.js
 */

// zegoSuperBoard is a global Super Board instance.
// zegoConfig is a global configuration.
// toast is a global pop-up box. You can use pop-up boxes as required.

var uploadFileTipsMap = {
    1: 'uploading',
    2: 'Uploaded',
    4: 'In line',
    8: 'Converting',
    16: 'Conversion successful',
    32: 'Conversion failed',
    64: 'Cancel upload'
};

var uploadFileUtils = {
    /**
     * @description: Update the files in the File List dialog on the page.
     * @description: Create a file whiteboard for each file in the <li> tag and bind the whiteboard to the file.
     * @description: The method of creating a file whiteboard is shown in js/room/whiteboard.js.
     * @param {Object} fileListData File list data
     * @param {String} superBoardEnv Current environment of the ZegoSuperBoard SDK
     */
    updateFileListDomHandle: function(fileListData, superBoardEnv) {
        var fileListEnv;
        switch (superBoardEnv) {
            case 'beta':
                fileListEnv = 'docs_test';
                break;
            case 'alpha':
                fileListEnv = 'docs_alpha';
                break;
            default:
                fileListEnv = 'docs_prod';
                break;
        }
        var fileList = fileListData[fileListEnv];
        console.log('mytag  fileListData[fileListEnv]', fileListEnv);
        var $fileListCon = $('#file-list');
        // Clear the original file list.
        $fileListCon.html('');
        // Use the latest file list.
        var $str = '';
        fileList.forEach((element) => {
            $str +=
                '<li onclick="createFileViewByFileID(event)" class="file-item" data-file-id="' +
                element.id +
                '"><div class="state ' +
                (element.isDynamic ? 'dynamic' : element.isH5 ? 'h5' : '') +
                '">' +
                (element.isDynamic ? 'dynamic' : element.isH5 ? 'H5' : 'static') +
                '</div>' +
                element.name +
                '</li>';
        });
        $fileListCon.html($str);
    },
    closeFileDomHandle: function() {
        // Close the File List dialog.
        $('#filelistModal').modal('hide');
        // Close the drop-down list for static or animated file uploading.
        $('.layui-dropdown').hide();
    },
    /**
     * @description: Obtain the file list from fileList.json in the local root directory.
     * @description: Only the sample code for obtaining fileList is displayed here. You can handle it as required.
     * @param {String} filelistUrl File list URL
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

var uploadSeq = 0;
/**
 * @description: Select a static or animated file and upload it.
 * @param {Number} renderType Rendering mode
 * @param {File} file File object
 */
function uploadFile(renderType, file, enableSizeReducedImages) {
    if (!file) return roomUtils.toast('Please select a file first');
    uploadFileUtils.closeFileDomHandle(); 
    zegoSuperBoard
        .uploadFile(
            file.path,
            renderType,
            function(res) {
                uploadSeq = res.seq;
                roomUtils.toast(uploadFileTipsMap[res.status] + (res.uploadPercent ? res.uploadPercent + '%' : ''));
            }
        )
        .then(function(fileID) { 
            // A file whiteboard is created immediately after the upload. You can handle it as required.
            // The method of creating a file whiteboard is shown in js/room/whiteboard.js.
            createFileView(fileID);
        })
        .catch(roomUtils.toast);
}

$('#cancelUploadFileBtn').click(async function() {
     // if (!fileHash) return roomUtils.toast('Please enter fileHash');
     zegoSuperBoard
     .cancelUploadFile(uploadSeq).then((rs)=>{
        rs ? roomUtils.toast('cancle upload succeeded.') : roomUtils.toast('cancle upload failed.')
     })
     .catch(roomUtils.toast);
});

/**
 * @description: Click Upload File in the File List dialog to show the drop-down list.
 * @description: Only the dialog is displayed here. You can handle it as required.
 */
layui.dropdown.render({
    elem: '#openPopover',
    content: $('#uploadPopoverContent').html()
});

/**
 * @description: Click Upload File in the File List dialog to show the drop-down list.
 * @description: Only the dialog is displayed here. You can handle it as required.
 */
layui.dropdown.render({
    elem: '#openPopover2',
    content: $('#uploadPopoverContent2').html()
});
/**
 * @description: Click File at the bottom of the page to query the current file list and update the page.
 */
$('.share-item.file').click(async function() {
    // Obtain the file list.
    var fileListData = await uploadFileUtils.getFilelist();

    // Update the files in the File List dialog on the page.
    uploadFileUtils.updateFileListDomHandle(fileListData, zegoConfig.superBoardEnv);
});

/**
 * @description: Click the file sharing icon in the middle of the page to query the current file list and update the page.
 */
$('#shareFile').click(async function() {
    // Obtain the file list.
    var fileListData = await uploadFileUtils.getFilelist();

    // Update the files in the File List dialog on the page.
    uploadFileUtils.updateFileListDomHandle(fileListData, zegoConfig.superBoardEnv);
});
