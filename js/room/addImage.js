/*
 * @Author: ZegoDev
 * @Date: 2021-08-10 16:50:36
 * @LastEditTime: 2021-08-27 01:13:33
 * @LastEditors: Please set LastEditors
 * @Description: Add custom graphics, insert pictures
 * @FilePath: /superboard/js/room/addImage.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var selectedInsetImgFile = null; // The currently selected local file
var customGraphList = [
    'https://storage.zego.im/goclass/wbpic/diamond.png',
    'https://storage.zego.im/goclass/wbpic/star.png',
    'https://storage.zego.im/goclass/wbpic/axis.png',
    'https://storage.zego.im/goclass/wbpic/chemical_instrument.png'
]; // Zego built-in custom graphics list

/**
 * @description: Select insert local images.
 * @description: Only selected local files are displayed here. You can handle it as required.
 */
layui.upload.render({
    elem: '#selectImage',
    accept: 'images',
    auto: false,
    choose: function (obj) {
        // The file is selected.
        obj.preview(function (index, file, result) {
            // Save the selected file. The file parameter indicates the file that is currently selected.
            selectedInsetImgFile = file;
            roomUtils.toast('file selected successfully');
        });
    }
});

/**
 * @description: Set the current custom graph under the custom graph tool.
 * @param {Number} graphIndex The custom graph subscript in the list. It is used to identify the URL of the target custom graph.
 * @param {Event} event event Mouse click event
 */
async function setCustomGraph(graphIndex, event) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    await zegoSuperBoardSubView.addImage(1, 0, 0, customGraphList[graphIndex]);

    // Update the style of the currently selected custom graph.
    addImageUtils.updateActiveGraphDomHandle(graphIndex, event);
}

/**
 * @description: Add custom graphs through the URL.
 */
$('#addImageByURLBtn1').click(async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the URL of the custom graph entered on the page. layui is used here. You can obtain the URL as required.
    var url = layui.form.val('form1').customGraphUrl;
    if (!url) return roomUtils.toast('Please enter URL');

    // Check whether this custom graph URL already exists in the local customGraphList.
    var index = customGraphList.findIndex(function (element) {
        return element === url;
    });
    try {
        await zegoSuperBoardSubView.addImage(1, 0, 0, url, roomUtils.toast);
        roomUtils.toast('Uploaded successfully');
        if (index === -1) {
            // If it does not exist, add it to the local custom graph list.
            customGraphList.push(url);
            // Add custom graphs to the custom graph list on the page through the URL.
            addImageUtils.appendGraphDomHandle(url);
        }
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Insert network images through the URL.
 */
$('#addImageByURLBtn2').click(async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Obtain the network image URL entered on the page. layui is used here. You can obtain the URL as required.
    var url = layui.form.val('form1').customImageUrl;
    if (!url) return roomUtils.toast('Please enter URL');

    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, url, roomUtils.toast);
        roomUtils.toast('Uploaded successfully');
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

/**
 * @description: Select local files and set custom graphs to be added to SuperboardView.
 */
$('#addImageByFileBtn').click(async function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;

    // Check whether a file is selected locally.
    if (!selectedInsetImgFile) return roomUtils.toast('Please select a file first');
    try {
        await zegoSuperBoardSubView.addImage(0, 0, 0, selectedInsetImgFile, roomUtils.toast);
        roomUtils.toast('Uploaded successfully');
    } catch (errorData) {
        roomUtils.toast(errorData.code + '：' + errorData.message);
    }
});

// DOM update methods and related tool methods
var addImageUtils = {
    /**
     * @description: Add custom graphs to the custom graph list on the page through the URL.
     * @description: Only updated functions on the page are displayed here. You can handle it as required.
     * @description: Bind the click event to the added custom graph in the <li> tag to set the custom graph to be added to SuperboardView.
     * @param {String} address Custom graph URL
     */
    appendGraphDomHandle: function (address) {
        var $str =
            '<li data-index="' +
            (customGraphList.length - 1) +
            '" class="custom-graph-item" onclick="setCustomGraph(' +
            (customGraphList.length - 1) +
            ',event)"><img src="' +
            address +
            '" alt=""></li>';
        $('.custom-graph-setting').append($str);
        // Update the size. 12 and 46 are used to calculate the size of the custom graph container on the page.
        $('.custom-graph-setting').css('width', 12 + 46 * Math.ceil(customGraphList.length / 4) + 'px');
    },

    /**
     * @description: Update the custom graph list to the page.
     * @description: Only updated functions on the page are displayed here. You can handle it as required.
     * @description: Bind a click event to each custom graph in the <li> tag to set custom graphs to be added to SuperboardView.
     */
    initGraphListDomHandle: function () {
        var $str = '';
        customGraphList.forEach(function (element, index) {
            $str +=
                '<li data-index="' +
                index +
                '" class="custom-graph-item active" onclick="setCustomGraph(' +
                index +
                ',event)"><img src="' +
                element +
                '" alt="" /></li>';
        });
        $('.custom-graph-setting').html($str);
    },

    /**
     * @description: Update the style of the currently selected custom graph.
     * @description: Only updated functions on the page are displayed here. You can handle it as required.
     * @param {Number} graphIndex The custom graph subscript in the list. It is used to identify the URL of the target custom graph.
     * @param {Event} event Mouse click event.
     */
    updateActiveGraphDomHandle: function (graphIndex, event) {
        event.stopPropagation();
        $('.custom-graph-item').removeClass('active');
        $('.custom-graph-item:nth-of-type(' + (graphIndex + 1) + ')').addClass('active');
    }
};

// Page DOM loaded. Update the custom graph list to the page.
$(document).ready(addImageUtils.initGraphListDomHandle);