var i18nLanguage = 'en';

var webLanguage = ['zh', 'en'];

var lang = navigator.language || navigator.userLanguage
lang = lang.substr(0, 2);

function initLang() {
  i18nLanguage = loginUtils.getQueryVariable('lang') || lang
}

initLang()


var execI18n = function () {
  jQuery.i18n.properties({
    name: "i18n",
    path: "i18n/",
    mode: 'map',
    language: i18nLanguage,
    cache: false,
    encoding: 'UTF-8',
    callback: function () {
      $('[data-locale]').each(function () {
        $(this).html($.i18n.prop($(this).data('locale')))
      })
    }
  });
}

execI18n()