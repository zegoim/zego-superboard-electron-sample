/**
 * zego web demo 运行需要，开源时无需关注
 */

if (location.port == 4003) {
  if (!getSDKVersionOptions) {
    // 获取 SDK 版本
    function getSDKVersionOptions(list) {
      return list
        .map(function (v) {
          return `<option value="${v}">${v}</option>`;
        })
        .join('');
    }

    // SDK 版本设置
    $('body').append(`
      <div class="modal fade" id="versionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel2">SDK 版本</h4>
          </div>
          <div class="modal-body">
            <form id="versionForm" class="layui-form" action="" name="form" lay-filter="versionForm">
              <div class="layui-form-item" id="superBoardVer">
                <label class="layui-form-label">版本</label>
                <div class="layui-input-block">
                  <select name="superBoardver" id="superBoardver" lay-filter="superBoardver">
                    
                  </select>
                </div>
              </div>
            </form>
            <div onclick="commmit">确定</div>
          </div>
        </div>
      </div>
    </div>
  `);
    $('#login-page').append(`
    <span id="sdk-version" data-toggle="modal" data-target="#versionModal">SDK 版本</span>`)

    $.ajaxSettings.async = false;
    $.get(
      'https://storage.zego.im/goclass/sdk/sdkVer.json', {},
      function (res) {
        $('#superBoardver').html(getSDKVersionOptions(res.superboard));
      },
      'json'
    );
    $.ajaxSettings.async = true;
  }

  var base_sdk_url = `https://storage.zego.im/goclass/sdk/superboard/`

  layui.use(['layer', 'jquery', 'form'], function () {
    var layer = layui.layer,
      $ = layui.jquery,
      form = layui.form;

    form.on('select(superBoardver)', function (data) {
      console.log(data.value); //得到被选中的值
      sessionStorage.setItem('superBoardver', JSON.stringify(data.value));
      // 替换SDK路径
      loadScript(base_sdk_url + data.value);
      //最后再渲柒一次
      form.render('select'); //select是固定写法 不是选择器
    });
  });

  function loadScript(url) {
    return new Promise(function (resolve) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = url;
      if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
          }
        };
      } else {
        //Others
        script.onload = function () {
          console.log('======1', url + '加载成功');
          resolve();
        };
      }
      head.appendChild(script);
    });
  }
  var sdkver = JSON.parse(sessionStorage.getItem('superBoardver'))
  console.warn('===sdkver', sdkver)
  // 替换SDK路径
  sdkver ? loadScript(base_sdk_url + sdkver) : loadScript(base_sdk_url + $('#superBoardver').val());

}