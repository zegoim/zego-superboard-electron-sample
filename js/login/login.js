/*
 * @Author: ZegoDev
 * @Date: 2021-07-29 12:57:58
 * @LastEditTime: 2021-09-10 11:07:07
 * @LastEditors: Please set LastEditors
 * @Description: Room login and logout related
 * @FilePath: /superboard/js/login/login.js
 */

var userList = []; // List of members in the room

/**
 * @description: Listen for zegoEngine.
 */
function onZegoEngineEvent() {
    zegoEngine.on('roomUserUpdate', function (roomID, type, list) {
        try {
            if (type == 'ADD') {
                list.forEach(function (v) {
                    userList.push({
                        userID: v.userID,
                        userName: v.userName
                    });
                });
            } else if (type == 'DELETE') {
                list.forEach(function (v) {
                    var index = userList.findIndex(function (item) {
                        return v.userID == item.userID;
                    });
                    if (index != -1) {
                        userList.splice(index, 1);
                    }
                });
            }
            // Update the room member list dialog on the room page.
            loginUtils.updateUserListDomHandle(userList);
        } catch (error) {
            console.error('roomUserUpdate', error)
        }
    });

    zegoEngine.on('tokenWillExpire', async function (roomID) {
        var tokenFlag = $('#tokenFlag:checked').val()
        var time = Number(zegoConfig.time)
        console.warn('superboard tokenWillExpire', roomID, tokenFlag)
        if (tokenFlag === 'on') {
            var newtoken = await loginUtils.getToken(time)
            zegoEngine.renewToken(newtoken)
            zegoSuperBoard.renewToken(newtoken)
            var loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
            loginInfo.token = newtoken
            sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        } else {
            console.warn('demo 没开启 token 自动更新')
        }


    })

    zegoEngine.on('roomStateUpdate', function (roomID, state, errorCode, extendedData) {
        console.warn('roomID,state,errorCode,extendedData', roomID, state, errorCode, extendedData)
    })
}

/**
 * @description: After successful login, add yourself to the member list.
 */
function pushOwn() {
    userList.unshift({
        userID: zegoConfig.userID,
        userName: zegoConfig.userName
    });
    // Update the room member list dialog on the room page.rList);
}

/**
 * @description: Login to the room.
 * @param {String} token
 */
async function loginRoom(token) {
    try {
        onZegoEngineEvent();
        const res = await zegoEngine.loginRoom(
            zegoConfig.roomID,
            token, {
                userID: zegoConfig.userID,
                userName: zegoConfig.userName
            }, {
                maxMemberCount: 10,
                userUpdate: true
            }
        );
        if (res) {
            // After successful login, add yourself to the member list.
            pushOwn();
            // Register the Superboard callback. (method in the room)
            onSuperBoardEventHandle();
        } else {
            console.error('登录失败', res)
        }
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
    zegoEngine.logoutRoom(zegoConfig.roomID);
    // Clear sessionStorage.
    sessionStorage.removeItem('loginInfo');
    // Clear the member list.
    userList = [];
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
        time: result.time,
        superBoardEnv: settingData.superBoardEnv,
        fontFamily: settingData.fontFamily,
        disableH5ImageDrag: settingData.disableH5ImageDrag,
        thumbnailMode: settingData.thumbnailMode,
        pptStepMode: settingData.pptStepMode,
        dynamicPPT_HD: settingData.dynamicPPT_HD,
        dynamicPPT_AutomaticPage: settingData.dynamicPPT_AutomaticPage,
        unloadVideoSrc: settingData.unloadVideoSrc,
        disableH5Mouse: settingData.disableH5Mouse,
        ventor_img_type: settingData.ventor_img_type,
    };

    Object.assign(zegoConfig, loginInfo);
    console.warn('result', result)
    try {
        // Initialize the SDK.
        var token = await initZegoSDK(zegoConfig.time);

        await loginRoom(token);

        sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));

        loginUtils.updateUrl('roomID', loginInfo.roomID, 'env', loginInfo.env), 'userID', loginInfo.userID;

        loginUtils.togglePageDomHandle(true);

        loginUtils.updateRoomIDDomHandle(zegoConfig.roomID);

        // Mount the activated SuperboardSubView. (method in the room)
        attachActiveView();
        $('#user-list').html('<li class="user-item">' + loginInfo.userName + ' (' + loginInfo.userID + '_自己)' + '</li>');
    } catch (error) {
        console.error(error);
    }
});


$('#logout-btn').click(logoutRoom);