/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-09-10 11:07:07
 * @LastEditors: Please set LastEditors
 * @Description: Room login and logout related
 * @FilePath: /superboard/js/login/login.js
 */

var list = []; // List of members in the room
var ZegoRoomState = {
    0:'Disconnected',
    1:'Connecting',
    2:'Connected'
}

/**
 * @description: Listen for ZegoExpressEngine.
 */
function onZegoExpressEngineEvent() {
    ZegoExpressEngine.on('onRoomStateUpdate', async (res) => {
        roomUtils.toast(`${ZegoRoomState[res.state]}...`);
        console.warn('mytag demo onRoomStateUpdate',res)
        if (res.state === 2 && res.errorCode == 0) {
           // After successful login, add yourself to the member list.
           pushOwn();
           // Register the Superboard callback. (method in the room)
           onSuperBoardEventHandle();
           // Mount the activated SuperboardSubView. (method in the room)
           attachActiveView();
       
        }
    });
    ZegoExpressEngine.on('onRoomUserUpdate', function (rs) {
        console.log('mytag onRoomUserUpdate',rs)
        const {updateType,userList }= rs
        try {
            if (updateType == 0) {
                userList.forEach(function (v) {
                    list.push({
                        userID: v.userID,
                        userName: v.userName
                    });
                });
            } else if (updateType == 1) {
                userList.forEach(function (v) {
                    var index = list.findIndex(function (item) {
                        return v.userID == item.userID;
                    });
                    if (index != -1) {
                        list.splice(index, 1);
                    }
                });
            }
            // Update the room member list dialog on the room page.
            loginUtils.updateUserListDomHandle(list);
        } catch (error) {
            console.error('roomUserUpdate', error)
        }
    });

    ZegoExpressEngine.on('tokenWillExpire', async function (roomID) {
        var tokenFlag = $('#tokenFlag:checked').val()
        var time = Number(zegoConfig.time)
        console.warn('superboard tokenWillExpire', roomID, tokenFlag)
        if (tokenFlag === 'on') {
            var newtoken = await loginUtils.getToken(time)
            ZegoExpressEngine.renewToken(newtoken)
            zegoSuperBoard.renewToken(newtoken)
            var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
            loginInfo.token = newtoken
            sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        } else {
            console.warn('demo 没开启 token 自动更新')
        }


    })
}

/**
 * @description: After successful login, add yourself to the member list.
 */
function pushOwn() {
    if(list.some(item => item.userID === zegoConfig.userID)) return
    list.unshift({
        userID: zegoConfig.userID,
        userName: zegoConfig.userName
    });
    // Update the room member list dialog on the room page.rList);
}

/**
 * @description: Login to the room.
 * @param {String} token
 */
async function loginRoom() {
    try {
        onZegoExpressEngineEvent();
        ZegoExpressEngine.loginRoom(
            zegoConfig.roomID, {
                userID: zegoConfig.userID,
                userName: zegoConfig.userName
            }, {
                maxMemberCount: 10,
                isUserStatusNotify: true
            }
        );
    } catch (error) {
        console.error('登录失败', error)
    }
}

/**
 * @description: Verify input roomID and userName.
 * @returns {Object|Boolean} When verification passed, { roomID: string; userName: string } is returned. When verification failed, false is returned.
 */
function checkInput() {
    var roomID = $('#roomID').val();
    var userName = $('#userName').val();
    var userID = $('#userID').val()
    var token = $('#token').val()
    var time = !!$('#time').val() ? Number($('#time').val()) : 60
    if (!userName || !roomID || !userID) {
        alert('Please enter username, room ID and userID');
        return false;
    }
    return {
        roomID,
        userName,
        userID,
        token,
        time
    };
}

/**
 * @description: Leave the room.
 */
function logoutRoom() {
    zegoSuperBoardManager.unInit()
    ZegoExpressEngine.logoutRoom(zegoConfig.roomID);
    ZegoExpressEngine.destroyEngine();
    // Clear sessionStorage.
    sessionStorage.removeItem('loginInfo');
    // Clear the member list.
    list = [];
    // Display the login page.
    loginUtils.togglePageDomHandle(false);
    $('#main-whiteboard').html('');
    roomUtils.updateWhiteboardListDomHandle([]);
    roomUtils.toggleSheetSelectDomHandle(false);
    roomUtils.togglePlaceholderDomHandle(true);
    roomUtils.toggleThumbBtnDomHandle(false);
    flipToPageUtils.updateThumbListDomHandle([]);
    $('#user-list').html('');
    $('#memberNum').html('1');
    zegoSuperBoard = null;
}

$('#login-btn').click(async function () {
    var result = checkInput();
    if (!result) return;
    // Obtain configuration information set on the page. layui is used here. The return values are as follows. You can obtain it as required.
    var settingData = layui.form.val('settingForm');
    // Obtain the selected access environment.
    var env = $('.inlineRadio:checked').val();
    var loginInfo = {
        env,
        roomID: result.roomID,
        userName: result.userName,
        userID: result.userID,
        fontFamily: settingData.fontFamily,
        disableH5ImageDrag: settingData.disableH5ImageDrag,
        thumbnailMode: settingData.thumbnailMode,
        pptStepMode: settingData.pptStepMode,
        ventor_img_type: settingData.ventor_img_type,
    };

    Object.assign(zegoConfig, loginInfo);
    console.warn('result', result)
    try {
        // Initialize the SDK.
        console.log('mytag Initialize the SDK = login.js')
        await initZegoSDK(zegoConfig.time);

        await loginRoom();

        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));

        loginUtils.updateUrl('roomID', loginInfo.roomID, 'env', loginInfo.env), 'userID', loginInfo.userID;

        loginUtils.togglePageDomHandle(true);

        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);

        $('#user-list').html('<li class="user-item">' + loginInfo.userName + ' (' + loginInfo.userID + '_自己)' + '</li>');
    } catch (error) {
        console.error(error);
    }
});


$('#logout-btn').click(logoutRoom);

window.addEventListener('beforeunload',()=>{
    ZegoExpressEngine.logoutRoom(zegoConfig.roomID);
    ZegoExpressEngine.destroyEngine();
})