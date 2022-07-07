/**
 *This code block is needed when the ZEGOCLOUD web demo runs. It does not need to be concerned when the demo is opened.
 */

if (location.port == 4003) {
  if (!getSDKVersionOptions) {
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
              <div class="layui-form-item" id="superBoardVer">
                <label class="layui-form-label">version</label>
                <div class="layui-input-block">
                  <select name="superBoardver" id="superBoardver" lay-filter="superBoardver">
                    
                  </select>
                </div>
              </div>
            </form>
            <div onclick="commmit">submit</div>
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
      console.log(data.value);
      sessionStorage.setItem('superBoardver', JSON.stringify(data.value));
      // Replace the SDK path.
      loadScript(base_sdk_url + data.value);
      // Perform rendering one more time.
      form.render('select');
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
  var sdkver = JSON.parse(sessionStorage.getItem('superBoardver'))
  console.warn('===sdkver', sdkver)
  // Replace the SDK path.
  sdkver ? loadScript(base_sdk_url + sdkver) : loadScript(base_sdk_url + $('#superBoardver').val());

}