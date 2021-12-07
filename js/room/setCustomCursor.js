var cursorList = [
    'https://docservice-storage.zego.im/00c483552faefc8df47184643f9defee/incoming/4b2efa93e93367a47808cef55a179350?.png',
    'https://docservice-storage.zego.im/00c483552faefc8df47184643f9defee/incoming/4add2d835617108c5644203b7ae894b3?.png'
]; // Zego 内置的自定义光标列表

// 页面 DOM 加载完成更新背景图片列表到页面
$(document).ready(function () {
    initCursorListDomHandle();
});

/**
 * @description: 更新光标图片列表到页面
 * @description: 这里只展示更新页面功能，开发者根据实际情况处理
 */
function initCursorListDomHandle() {
    var $str = '<option value>请选择</option>';
    cursorList.forEach(function(element, index) {
        $str += '<option value="' + element + '">图片' + (index + 1) + '</option>';
    });
    $('#cursorList').html($str);

    // 更新下拉框 layui.form.render(type, filter);
    layui.form.render('select', 'form1');
}

/**
 * @description: 选择本地背景图片
 * @description: 这里只展示选择本地文件，开发者根据实际情况处理
 */
layui.upload.render({
    elem: '#selectCursorImage', // 绑定元素
    accept: 'images', // 只接受 image 文件
    auto: false, // 不自动上传
    choose: function(obj) {
        // 选择完文件的回调
        obj.preview(async function(index, file, result) {
            // 存储选择的文件，file 为当前选中文件
            try {
                await zegoSuperBoard.setCustomCursorAttribute(1, {
                    iconPath: file,
                    offsetX: +cursorOffsetX.value,
                    offsetY: +cursorOffsetY.value
                });
            } catch (errorData) {
                console.error(errorData);
                roomUtils.toast(errorData.code + '：' + errorData.msg);
            }
            roomUtils.toast('选择文件成功');
        });
    }
});

/**
 * @description: 监听下拉框，切换背景图
 * @description: 这里只展示下拉框的选择监听，开发者根据实际情况处理
 */
layui.form.on('select(cursorUrl)', async function() {
    if (!zegoSuperBoard) return;

    // 获取页面上下拉框中当前选择的背景图、当前选择的背景图填充模式，这里使用的是 layui，开发者可根据实际情况获取
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
        roomUtils.toast(errorData.code + '：' + errorData.msg);
    }
});

/**
 * @description: 根据输入的背景图 URL 来设置背景图
 */
$('#setCustomCursorByURLBtn').click(async function() {
    if (!zegoSuperBoard) return;

    // 获取页面上下拉框中当前选择的背景图、当前选择的背景图填充模式，这里使用的是 layui，开发者可根据实际情况获取
    var formData = layui.form.val('form1');
    var customCursorUrl = formData.inputCustomCursorUrl; // 当前选择的背景图 URL

    if (!customCursorUrl) return roomUtils.toast('请输入 URL');

    try {
        await zegoSuperBoard.setCustomCursorAttribute(1, {
            iconPath: customCursorUrl,
            offsetX: +cursorOffsetX.value,
            offsetY: +cursorOffsetY.value
        });
    } catch (errorData) {
        console.error(errorData);
        roomUtils.toast(errorData.code + '：' + errorData.msg);
    }
});
