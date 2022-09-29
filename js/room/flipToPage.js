/*
 * @Author: ZegoDev
 * @Date: 2021-08-09 22:16:06
 * @LastEditTime: 2021-08-27 01:14:22
 * @LastEditors: Please set LastEditors
 * @Description: whiteboard page turn
 * @FilePath: /superboard/js/room/flipPage.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.

var flipToPageUtils = {
    /**
     * @description: Update related elements on the current page.
     * @param {Number} currPage Current page
     */
    updateCurrPageDomHandle: function(currPage) {
        var pageCount = $('#pageCount').text();
        currPage = currPage > pageCount ? pageCount : currPage;
        // Update the current page-bar page.
        $('#currPage').html(currPage);
        // Update the current thumbnail page.
        $('.thumb-item').removeClass('active');
        $('.thumb-item:nth-of-type(' + currPage + ')').addClass('active');
        // Automatically scroll to the page specified in the thumbnail.
        var scrollTop = 112 * (currPage - 1);
        $('.thumb-main')[0].scrollTop = scrollTop;
    },

    /**
     * @description: Update the thumbnail list.
     * @param {String} thumbnailUrlList Thumbnail URL list, for example, "thumbnails/1.jpg,thumbnails/2.jpg,thumbnails/3.jpg"
     * @param {Number} currPage Current page number
     */
    updateThumbListDomHandle: function(thumbnailUrlList, currPage) {
        $('.thumb-main').html('');
        var $str = '';
        thumbnailUrlList.forEach(function(element, index) {
            $str +=
                '<li onclick="flipToPage(' +
                (index + 1) +
                ')" class="thumb-item' +
                (index === currPage - 1 ? ' active' : '') +
                '"><span>' +
                (index + 1) +
                '</span><div class="thumb-image"><img src="' +
                element +
                '"/></div></li>';
        });
        $('.thumb-main').html($str);
    }
};
/**
 * @description: Redirect to the target page.
 * @param {Number} page Target page
 */
function flipToPage(page) {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.flipToPage(page);

        // Update related elements on the current page.
        flipToPageUtils.updateCurrPageDomHandle(page);
    }
}

/**
 * @description: Bind the previous page event.
 */
$('#previousPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.flipToPrePage();

        flipToPageUtils.updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
    }
});

/**
 * @description: Bind the next page event.
 */
$('#nextPage').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        zegoSuperBoardSubView.flipToNextPage();

        flipToPageUtils.updateCurrPageDomHandle(zegoSuperBoardSubView.getCurrentPage());
    }
});

/**
 * @description: Bind the previous step event.
 */
$('#previousStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.preStep();
});

/**
 * @description: Bind the next step event.
 */
$('#nextStep').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    zegoSuperBoardSubView && zegoSuperBoardSubView.nextStep();
});

/**
 * @description: Bind the event of redirection to the target page.
 */
$('#flipToPageBtn').click(function() {
    // Obtain the target page entered on the page. layui is used here. You can obtain it as required.
    var page = layui.form.val('form2').targetPage;
    if (!page) return roomUtils.toast('Please enter a target page number, starting with 1');

    flipToPage(+page);
});

/**
 * @description: Obtain the thumbnail URL list.
 */
$('#thumb-button').click(function() {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (zegoSuperBoardSubView) {
        var type = zegoSuperBoardSubView.getModel().fileType;
        // Only PDF, PPT, animated PPT, and custom H5 file formats are supported.
        var supportType = [1, 8, 512, 4096];
        if (supportType.includes(type)) {
            var thumbnailUrlList = zegoSuperBoardSubView.getThumbnailUrlList();

            flipToPageUtils.updateThumbListDomHandle(thumbnailUrlList, zegoSuperBoardSubView.getCurrentPage());
        } else {
            roomUtils.toast('Get Thumbnail only supports "PDF, PPT, Dynamic PPT, H5" file format');
        }
    }
});
