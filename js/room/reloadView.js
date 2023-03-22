/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 20:04:01
 * @LastEditTime: 2021-08-31 17:37:40
 * @LastEditors: Please set LastEditors
 * @Description: reloadView reloads the whiteboard view. This method can be used to reload the whiteboard view when dynamically modifying the size of the mounted parent container.
 * @FilePath: /superboard/js/room/reloadView.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.
// parentDomID Container ID

var resizeTicking = false; // Adaptive execution switch, here is a delay of 1000 ms execution
// 储存当前窗口宽度
let windowWidth = window.innerWidth;
// Adaptive whiteboard size: Listen for the page resize event.
window.addEventListener('resize', onResizeHandle);

/**
 * @description: resize callback
 */
function onResizeHandle() {
    // H5 手势下拉/窗口滚动也会触发 resize 方法，加上实际浏览器宽度变化对比来执行 reloadView，应该不影响web端，影响的话可以加上 isH5() 的判断
    if (!resizeTicking && window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        resizeTicking = true;
        setTimeout(function () {
            // After the container size is automatically changed, the whiteboard view is automatically re-loaded.
            autoReloadViewHandle();
            resizeTicking = false;
        }, 1000);
    }
}

/**
 * @description: Re-load the whiteboard view.
 */
function reloadViewHandle() {
    // Before instantiation, trigger resize to return.
    if (!zegoSuperBoard) return;

    var zegoSuperBoardView = zegoSuperBoard.getSuperBoardView();
    if (!zegoSuperBoardView) return;

    var zegoSuperBoardSubView = zegoSuperBoardView.getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        // A whiteboard is mounted.
        setTimeout(function () {
            // true or false
            zegoSuperBoardSubView.reloadView();
        }, 120);
    }
}

/**
 * @description: After the container size is automatically changed, the whiteboard view is automatically re-loaded.
 */
function autoReloadViewHandle() {
    updateSizeDomHandle();
    reloadViewHandle();
}

/**
 * @description: Determine whether Element.requestFullscreen is supported.
 * @description: Element.requestFullscreen compatibility
 * @param {*} dom Full-screen elements needed
 * @return {*} Promise Asynchronous request result
 */
function supportRequestFullscreen(dom) {
    if (dom.requestFullscreen) {
        return dom.requestFullscreen();
    } else if (dom.webkitRequestFullScreen) {
        return dom.webkitRequestFullScreen();
    } else if (dom.mozRequestFullScreen) {
        return dom.mozRequestFullScreen();
    } else {
        return false;
    }
}

/**
 * @description: Update the width and height displayed on the current page.
 */
function updateSizeDomHandle() {
    // Obtain the width and height of the current container.
    var dom = document.getElementById(parentDomID);

    dom.style.cssText += 'width:100%;height:100%;';

    var width = dom.clientWidth + 2; // + board
    var height = dom.clientHeight + 2; // + board

    // Update the width and height displayed on the current page.
    $('#parentWidthHeight').html(width + ' * ' + height);
}

/**
 * @description: Manually update the container size and reload the whiteboard view.
 * @return {*}
 */
function customReloadViewHandle() {
    // Obtain the width and height of the current container.
    var dom = document.getElementById(parentDomID);
    var width = dom.clientWidth + 2; // +board
    var height = dom.clientHeight + 2; // +board

    // Obtain the custom size. Only the obtaining method is displayed here. You can obtain it as required.
    var width_set = +layui.form.val('form2').parentWidth;
    var height_set = +layui.form.val('form2').parentHeight;

    // Determine the custom size. The container has 2 px borders. Therefore, the size cannot be less than 2, which can be determined as required.
    if (!width_set || !height_set || width_set <= 2 || height_set <= 2) return roomUtils.toast('Please enter a valid width and height value');

    // To better display the page layout effect, the customized value cannot exceed the adaptive container size, which can be determined as required.
    // if (width_set > width || height_set > height) return roomUtils.toast('Enter the width and height values less than the current container size.');

    // Update the container size.
    dom.style.cssText += `width:${width_set}px;height:${height_set}px;`;

    // Update the width and height displayed on the current page.
    $('#parentWidthHeight').html(width_set + ' * ' + height_set);

    reloadViewHandle();
}

/**
 * @description: The full-screen feature is implemented using Element.requestFullscreen. However, issues may occur due to browser implementation. The code is for reference only.
 * @description: For details, see https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullScreen.
 * @return {*}
 */
function fullScreenHandle() {
    if (supportRequestFullscreen(document.getElementById(parentDomID))) {
        supportRequestFullscreen(document.getElementById(parentDomID))
        .then(function () {
            roomUtils.toast('full screen');
        })
        .catch(function () {
            roomUtils.toast('The current browser does not support full screen');
        });
    } else {
        roomUtils.toast('The current browser does not support full screen');
    }
}

/**
 * @description: Bind the container size setting event.
 */
$('#setParentSizeBtn').click(customReloadViewHandle);

/**
 * @description: Bind the full screen event.
 */
$('#fullScreenBtn').click(fullScreenHandle);