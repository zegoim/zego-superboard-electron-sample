/**
 *This code block is needed when the ZEGOCLOUD web demo runs. It does not need to be concerned when the demo is opened.
 */

if (location.port === 4003) {
  // Obtain the SDK version.
  function getSDKVersionOptions(list) {
    return list
      .map(function (v) {
        return `<option value="${v}">${v}</option>`;
      })
      .join('');
  }
  // SDK version settings
  $('body').append(`
    <div class="modal fade" id="versionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel2">SDK version</h4>
          </div>
          <div class="modal-body">
            <form id="versionForm" class="layui-form" action="" name="form" lay-filter="versionForm">
              <div class="layui-form-item" id="superBoardVersion">
                <label class="layui-form-label">version</label>
                <div class="layui-input-block">
                  <select name="superBoardVersion" id="superBoard-list" lay-filter="superBoardVersion">
                  </select>
                </div>
              </div>
              <div class="layui-form-item">
                <div class="layui-input-block">
                  <button class="layui-btn" lay-submit lay-filter="versionForm" data-dismiss="modal">立即提交</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `);

  $('#login-page').append(`
  <span id="sdk-version" data-toggle="modal" data-target="#versionModal">SDK 版本（修改版本，demo的SDK版本为2.11.0）</span>`)

  $('#reload-btn').click(()=>{
    console.log('===reload', window.name)
    alert('===reload')
  })

  $.ajaxSettings.async = false;
  $.get(
    'http://zego-public.oss-cn-shanghai.aliyuncs.com/goclass/sdk/sdkVer.json', {},
    function (res) {
      console.log(res);
      $('#superBoard-list').html(getSDKVersionOptions(res.superboard));
    },
    'json'
  );
  $.ajaxSettings.async = true;

  var base_sdk_url = `http://zego-public.oss-cn-shanghai.aliyuncs.com/goclass/sdk/superboard/`

  layui.use(['layer', 'jquery', 'form'], function () {
    var layer = layui.layer,
      $ = layui.jquery,
      form = layui.form;

    form.on('select(superBoardVersion)', function (data) {
      console.log(data.value);
      // Perform rendering one more time.
      form.render('select');
    });
    form.on('submit(versionForm)', function(data){
      console.log('===data', data.field)
      sessionStorage.setItem('superBoardVersion', JSON.stringify(data.field.superBoardVersion));
      // Replace the SDK path.
      loadScript(base_sdk_url + data.field.superBoardVersion);
      return false;
    });
  });

  function loadScript(url) {
    return new Promise(function (resolve) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = url;
      if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
          }
        };
      } else {
        // Others
        script.onload = function () {
          resolve();
        };
      }
      head.appendChild(script);
    });
  }

  var sdkver = JSON.parse(sessionStorage.getItem('superBoardVersion'))
  console.warn('===sdkver', sdkver)
  // Replace the SDK path.
  sdkver ? loadScript(base_sdk_url + sdkver) : loadScript(base_sdk_url + $('#superBoardVersion').val());

}