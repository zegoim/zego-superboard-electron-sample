/*
 * @Author: ZegoDev
 * @Date: 2021-08-12 11:56:27
 * @LastEditTime: 2021-08-27 01:14:41
 * @LastEditors: Please set LastEditors
 * @Description: Clear, Undo, Redo, Save Snapshot, Clear Current Page, Clear Selection, Set Render Delay
 * @FilePath: /superboard/js/room/other.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var saveImg = 1; // Whiteboard Snapshot Index

/**
 * @description: Listen for keys to clear selected diagram elements.
 */
window.addEventListener('keydown', async function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) return;
    switch (e.keyCode) {
        case 8:
        case 46:
            clearSelected();
            break;
        default:
            break;
    }
});

/**
 * @description: Clear all pages.
 */
async function clearAllPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && (await zegoSuperBoardSubView.clearAllPage());
}

/**
 * @description: Undo.
 */
function undo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.undo();
}

/**
 * @description: Redo.
 */
function redo() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.redo();
}

/**
 * @description: Whiteboard snapshot.
 */
function snapshot() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView &&
        zegoSuperBoardSubView.snapshot().then(function (data) {
            var link = document.createElement('a');
            link.href = data.image;
            link.download = zegoSuperBoardSubView.getModel().name + saveImg++ + '.png';
            link.click();
        });
}

/**
 * @description: Delete selected diagram elements.
 */
function clearSelected() {
    if (!zegoSuperBoard) return;
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearSelected();
}

/**
 * @description: Clear diagram elements on the current page. It takes effect only when the eraser is used.
 */
function clearCurrentPage() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.clearCurrentPage();
}

/**
 * @description: Set the rendering latency.
 */
$('#setDeferredRenderingTimeBtn').click(function () {
    // Obtain the target page entered on the page. layui is used here. You can obtain it as required.
    var deferredRenderingTime = layui.form.val('form2').deferredRenderingTime;
    if (!deferredRenderingTime) return roomUtils.toast('Please enter the delay time');

    zegoSuperBoard.setDeferredRenderingTime(+deferredRenderingTime);
    roomUtils.toast('set successfully');
});


$('#getNewTokenBtn').click(async function () {
    var time = Number($('#newToken').val())
    var newToken = await loginUtils.getToken(time)
    console.error('newToken', newToken)
    $('#newToken').val(newToken)
});

$('#renewTokenBtn').click(function () {
    var newtoken = $('#newToken').val()
    zegoEngine.renewToken(newtoken)
    zegoSuperBoard.renewToken(newtoken)
    var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
    loginInfo.token = newtoken
    sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
})

/**
 * @description: Listen for the drop-down list to set the log level.
 * @description: Only values listened for from the drop-down list are displayed here. You can handle it as required.
 */
layui.form.on('select(logLevel)', async function () {
    var formData = layui.form.val('form3');
    var logLevel = formData.logLevel;

    try {
        await zegoSuperBoard.setLogConfig({
            logLevel: logLevel
        });
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

// 添加扬声器设备
layui.use(['layer', 'jquery', 'form'], async function () {
    var form = layui.form,
    $ = layui.$;
    var speakerList = await getSpeakerLabels();
    for (let index = 0; index < speakerList.length; index++) {
        var label = speakerList[index].label.toString();
        $("#speaker").append("<option value='"+  label  +"'>"+ label +"</option>");
    }
    $("#speaker").val(speakerList.find(device => device.deviceId === 'default').label)
    form.render('select');
    // ,'speaker'
}) 

async function getSpeakerLabels(){
    await navigator.mediaDevices.getUserMedia({audio:true}); // 获取设备权限
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("atag 不支持 enumerateDevices() .");
        return;
      }
    var devices = await navigator.mediaDevices.enumerateDevices(); // 枚举设备id
    var speakerList = devices.filter(function (device) {
        return device.kind === 'audiooutput' && device.deviceId
    })
    return Promise.resolve(speakerList);
}

layui.form.on('select(speaker)', function(ele) {
    if (!zegoSuperBoard) return;
    zegoSuperBoard.switchSpeaker(ele.value);
});