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

/**
 * @description: File pre-loading
 */
$('#cacheFileBtn').click(async function() {
    // Obtain the file ID entered on the page. layui is used here. You can obtain it as required.
    var fileID = layui.form.val('form3').fileID;
    if (!fileID) return roomUtils.toast('Please enter a file ID');

    try {
        let timer = Date.now();
        const res = await zegoSuperBoard.cacheFile(fileID, (result) => {
            roomUtils.toast(
                `Cache file seq:${result.seq}, </br>
                 Cache state:${result.state === 1 ? 'Caching' : 'Cached'}, </br>
                 Cache progress:${Number(Math.floor((result.loadedFileNum / result.totalFileNum) * 100))}%, </br>
                 Cache failed count:${result.failedFileNum}`
            );
            console.log(`mytag 
        缓存文件的 seq:${result.seq}, 
        缓存状态 :${result.state === 1 ? 'Caching' : 'Cached'}, 
        缓存进度:${Number(Math.floor((result.loadedFileNum / result.totalFileNum) * 100))}%, 
        缓存资源总数量:${result.totalFileNum}
        缓存成功数量:${result.loadedFileNum}
        缓存失败数量:${result.failedFileNum}
        `);
        });
        console.log('mytag cacheFile info', JSON.stringify(res));
    } catch (error) {
        console.error('cacheFile error', error);
    }
});

/**
 * @description: File pre-loading
 */
$('#cancelCacheFileBtn').click(function() {
    // Obtain the file ID entered on the page. layui is used here. You can obtain it as required.
    var seq = layui.form.val('form3').cacheFileSeq;
    const res = zegoSuperBoard.cancelCacheFile(seq);
    // roomUtils.toast(res ? 'option success' : 'option fail');
    console.log('mytag option success ', res);
});
