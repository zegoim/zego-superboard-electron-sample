

$('#addtext').click(function () {
    var zegoSuperBoardSubView = zegoSuperBoard.getSuperBoardView().getCurrentSuperBoardSubView();
    if (!zegoSuperBoardSubView) return;


    if (zegoSuperBoard.getToolType() !== 2) return roomUtils.toast('该功能仅在工具类型为文本时才生效');
    var text = $('#addtext_val').val();
    var x = +$('#addtext_x').val();
    var y = +$('#addtext_y').val();
    zegoSuperBoardSubView.addText(text, x, y);
});