require(['login'], function(App) {
    if($('#login-alert-modal') && $('#login-alert-modal')[0]) {
        $('#login-alert-modal').modal('show');
    }
    utils.loadCss("/css/login/modal-box.css");
    utils.loadCss("/resources/font-awesome-3.2.1/css/font-awesome.min.css");
    utils.loadCss("/resources/font-awesome-4.5.0/css/font-awesome.css");
    // init i18next
    i18n.init({
        lng: utils.lang,
        useCookie: false,
        detectLngQS: 'ashidjkg123784628gdfui236847fde', //effectively disabling GET query for lang
        fallbackLng: 'en',
        ////useLocalStorage: utils.env == "production", // we will only enable in production
        //localStorageExpirationTime: 86400000, // cached for 1 week when enabled
        // debug: utils.env == "development",
        resGetPath: '/locales/__lng__/__ns__.json?_=' + IdConfig.resmodified,
        sendMissing: false, //utils.env == "development", // send missing only on dev
        sendMissingTo: 'fallback',
        resPostPath: 'locales/add/dev/__ns__'
    }, function() {
        console.log("login_page_loaded");
        $("a.mb-close").unbind("click").click(function(e) {
			$("div.expired").css("display", "none");
			$("div.expired").remove();
			$("#wn-main-lightbox").remove();
        });
        utils.loadTemplate(['Login/BrowserUpgradeView'], function() {
            var chromebook = '';
            var url=(window.location.href).toLowerCase();
            if(url.indexOf('?chromebook=1')>-1){
                chromebook = 1;
            }             
            var login_view = new Login_LoginView({
                model: new Login_Login(IdConfig.customlogin),
                el: jQuery("#login_form_action"),
                chromebook : chromebook
            });
            login_view.render();
        });    
    });
});
