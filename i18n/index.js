var i18nLanguage = 'en';

var webLanguage = ['cn', 'en'];

//获取网站语言 
function getWebLanguage() {
  if (sessionStorage.getItem("userLanguage")) {
    i18nLanguage = sessionStorage.getItem("userLanguage");
    console.log("language  is:" + i18nLanguage);
  }
  console.log("language  is:" + i18nLanguage);
}

// function changeLanguage(languageName) {
//   var src = languageName.replace('-', '_') + ".js";
//   console.log('国际化easyui中英文包', src);
//   $.getScript(src);
// };


var execI18n = function () {
  //获取网站语言(i18nLanguage,默认为中文简体) 
  getWebLanguage();
  //国际化页面 
  jQuery.i18n.properties({
    name: "i18n", //资源文件名称 
    path: "i18n/", //资源文件路径 
    mode: 'map', //用Map的方式使用资源文件中的值 
    language: i18nLanguage,
    cache: false, //指定浏览器是否对资源文件进行缓存,默认false 
    encoding: 'UTF-8', //加载资源文件时使用的编码。默认为 UTF-8。  
    callback: function () { //加载成功后设置显示内容 
      $('[data-locale]').each(function () {
        console.warn($(this).data('locale'), $.i18n.prop($(this).data('locale')))
        console.warn('html', $(this).html())
        $(this).html($.i18n.prop($(this).data('locale')))
      })
    }
  });
}

execI18n()