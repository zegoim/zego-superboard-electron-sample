/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 20:04:01
 * @LastEditTime: 2021-08-10 11:23:11
 * @LastEditors: Please set LastEditors
 * @Description: reloadView 重新加载白板 View，动态修改挂载父容器大小时可以使用该方法重新加载白板 View
 * @FilePath: /superboard/js/reloadView.js
 */

// zegoSuperBoard 为全局 SuperBoard Instance
// toast 为全局提示框，开发者根据实际情况使用相应的提示框
// parentDomID 容器 ID

var resizeTicking = false; // 自适应执行开关

// 白板大小自适应：监听页面 resize 事件
window.addEventListener('resize', onResizeHandle);

/**
 * @description: resize 回调
 * @param {*} e
 * @return {*}
 */
function onResizeHandle() {
    if (!resizeTicking) {
        resizeTicking = true;
        setTimeout(function () {
            autoReloadViewHandle();
            resizeTicking = false;
        }, 1000);
    }
}

/**
 * @description: 重新加载白板 View
 * @param {*}
 * @return {*}
 */
function reloadViewHandle() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        // 当前有白板挂载
        setTimeout(function () {
            zegoSuperBoardSubView.reloadView();
        }, 120); // 动画120ms
    }
}

/**
 * @description: 容器尺寸自动变更后，自动重新加载白板 View
 * @param {*}
 * @return {*}
 */
function autoReloadViewHandle() {
    updateSizeDomHandle();
    reloadViewHandle();
}

/**
 * @description: 判断当前是否支持 Element.requestFullscreen
 * @description: Element.requestFullscreen 兼容性
 * @param {*} dom 当前需要全屏的 Element
 * @return {*} Promise 异步请求结果
 */
function supportRequestFullscreen(dom) {
    if (dom.requestFullscreen) {
        return dom.requestFullscreen();
    } else if (dom.webkitRequestFullScreen) {
        return dom.webkitRequestFullScreen();
    } else if (dom.mozRequestFullScreen) {
        return dom.mozRequestFullScreen();
    } else {
        return dom.msRequestFullscreen();
    }
}

/**
 * @description: 更新当前页面显示 width、height
 * @param {*}
 * @return {*}
 */
function updateSizeDomHandle() {
    // 获取当前容器宽高
    var dom = document.getElementById(parentDomID);
    var width = dom.clientWidth + 2; // +边框
    var height = dom.clientHeight + 2; // +边框

    // 更新当前页面显示 width、height
    $('#parentWidthHeight').html(width + ' * ' + height);
}

/**
 * @description: 手动变更容器尺寸，重新加载白板 View
 * @return {*}
 */
function customReloadViewHandle() {
    // 获取当前容器宽高
    var dom = document.getElementById(parentDomID);
    var width = dom.clientWidth + 2; // +边框
    var height = dom.clientHeight + 2; // +边框

    // 获取自定义尺寸，这里只展示获取方法，开发者根据实际情况获取
    var width_set = +layui.form.val('form2').parentWidth;
    var height_set = +layui.form.val('form2').parentHeight;

    // 判断当前自定义的尺寸，这里容器有 2px 边框，所以不允许小于 2，可视实际情况而定
    // if (!width_set || !height_set || width_set <= 2 || height_set <= 2) return toast('请输入有效的宽高值');

    // 为更好的显示页面布局效果，这里自定义的值不允许超过当前自适应的容器尺寸，可视实际情况而定
    // if (width_set > width || height_set > height) return toast('请输入小于当前容器尺寸的宽高值');

    // 更新容器尺寸
    dom.style.cssText += `width:${width_set}px;height:${height_set}px;`;

    // 更新当前页面显示 width、height
    $('#parentWidthHeight').html(width_set + ' * ' + height_set);

    reloadViewHandle();
}

/**
 * @description: 全屏功能，用 Element.requestFullscreen 实现，但是由于部分浏览器实现可能有问题，代码仅供参考
 * @description: 详见文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullScreen
 * @return {*}
 */
function fullScreenHandle() {
    supportRequestFullscreen(document.getElementById(parentDomID))
        .then(function () {
            toast('已全屏');
        })
        .catch(function () {
            toast('当前浏览器不支持全屏');
        });
}

/**
 * @description: 绑定设置容器尺寸事件
 */
$('#setParentSizeBtn').click(customReloadViewHandle);

/**
 * @description: 绑定全屏事件
 */
$('#fullScreenBtn').click(fullScreenHandle);