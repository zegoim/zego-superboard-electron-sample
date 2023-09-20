/*
 * @Author: ZegoDev
 * @Date: 2021-08-11 15:08:38
 * @LastEditTime: 2021-08-27 01:13:56
 * @LastEditors: Please set LastEditors
 * @Description: file preload
 * @FilePath: /superboard/js/room/cacheFile.js
 */

// zegoSuperBoard is a global Super Board instance.
// toast is a global pop-up box. You can use pop-up boxes as required.
var cacheFileSeq = 0;

/**
 * @description: File pre-loading
 */
$('#cacheFileBtn').click(async function() {
    // Obtain the file ID entered on the page. layui is used here. You can obtain it as required.
    var fileID = layui.form.val('form3').fileID;
    if (!fileID) return roomUtils.toast('Please enter a file ID');

    try {
        const res = await zegoSuperBoard.cacheFile(fileID, (result) => {
            cacheFileSeq = result.seq;
            roomUtils.toast(
                `Cache file seq:${result.seq}, </br>
                 Cache progress:${result.cachePercent}%`
            );
        });
    } catch (error) {
        console.error('cacheFile error', error);
    }
});

/**
 * @description: File pre-loading
 */
$('#cancelCacheFileBtn').click(async function() {
    var fileID = layui.form.val('form3').fileID;
    const cacheFileRes= await zegoSuperBoard.queryFileCached(fileID);
    if(cacheFileRes){
        roomUtils.toast('already cache.')
    }else{
        // Obtain the file ID entered on the page. layui is used here. You can obtain it as required.
        const res = await zegoSuperBoard.cancelCacheFile(cacheFileSeq);
        res ? roomUtils.toast('Cache succeeded.') : roomUtils.toast('Caching failed.')
    }
});
