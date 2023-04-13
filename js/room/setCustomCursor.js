var cursorList = [
    'https://docservice-storage.zego.im/00c483552faefc8df47184643f9defee/incoming/4b2efa93e93367a47808cef55a179350?.png',
    'https://docservice-storage.zego.im/00c483552faefc8df47184643f9defee/incoming/4add2d835617108c5644203b7ae894b3?.png'
]; //Zego's built-in custom cursor list

var UPLOAD_FILE = null;

// Page DOM loaded. Update the background image list to the page.
$(document).ready(function () {
    initCursorListDomHandle();
});

/**
 * @description: Update the cursor image list to the page.
 * @description: Only updated functions on the page are displayed here. You can handle it as required.
 */
function initCursorListDomHandle() {
    var $str = '<option value>please choose</option>';
    cursorList.forEach(function (element, index) {
        $str += '<option value="' + element + '">picture' + (index + 1) + '</option>';
    });
    $('#cursorList').html($str);

    // Update the drop-down list. layui.form.render(type, filter);
    layui.form.render('select', 'form1');
}

/**
 * @description: Select a local cursor image.
 * @description: Only selected local files are displayed here. You can handle it as required.
 */
var layer = layui.upload.render({
    elem: '#selectCursorImage',
    accept: 'file',
    auto: false,
    choose: function (obj) {
        // Callback after a file is selected.
        obj.preview(async function (index, file, result) {
            UPLOAD_FILE = file
        });
    }
});

/**
 * @description: Select a local file.
 */
$('#cursorImageByFileBtn').click(async function () {

    // Check whether a file is selected locally.
    if (!UPLOAD_FILE) return roomUtils.toast('Please select a file first');
    // Save the selected file. The file parameter indicates the file that is currently selected.
    try {
        await zegoSuperBoard.setCustomCursorAttribute(1, {
            iconPath: UPLOAD_FILE,
            offsetX: +cursorOffsetX.value,
            offsetY: +cursorOffsetY.value
        });
        roomUtils.toast('file selected successfully');
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});
/**
 * @description: Listen for the drop-down list to switch the background image.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 */
layui.form.on('select(cursorUrl)', async function () {
    if (!zegoSuperBoard) return;

    // Obtain the background image selected from the drop-down list and the selected background image padding mode on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('form1');
    var cursorUrl = formData.cursorUrl; // 当前选择的背景图 URL

    try {
        await zegoSuperBoard.setCustomCursorAttribute(1, {
            iconPath: cursorUrl,
            offsetX: +cursorOffsetX.value,
            offsetY: +cursorOffsetY.value
        });
    } catch (errorData) {
        console.error(errorData);
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Set the background image based on the entered background image URL.
 */
$('#setCustomCursorByURLBtn').click(async function () {
    if (!zegoSuperBoard) return;

    // Obtain the background image selected from the drop-down list and the selected background image padding mode on the page. layui is used here. You can obtain it as required.
    var formData = layui.form.val('form1');
    var customCursorUrl = formData.inputCustomCursorUrl; // 当前选择的背景图 URL

    if (!customCursorUrl) return roomUtils.toast('Please enter URL');

    try {
        await zegoSuperBoard.setCustomCursorAttribute(1, {
            iconPath: customCursorUrl,
            offsetX: +cursorOffsetX.value,
            offsetY: +cursorOffsetY.value
        });
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description： Set custom cursor title
 */
$('#setCustomCursorTitle').click(async function () {
    if (!zegoSuperBoard) return;

    var formData = layui.form.val('form1');
    const style = {
        bold: formData.enableCustomCursorTitleBold ? true: false,
        italic: formData.enableCustomTitleItalic? true: false,
        size: formData.customCursorTitleSize ? parseInt(formData.customCursorTitleSize) : false,
        color: formData.customCursorTitleColor ? formData.customCursorTitleColor : '',
        bk_color: formData.customCursorTitleBgColor ? formData.customCursorTitleBgColor : '',
        pos: formData.customCursorTitlePosition ? parseInt(formData.customCursorTitlePosition) : false,
    }
    await zegoSuperBoard.setCustomCursorTitle(formData.customCursorTitle, style);
})