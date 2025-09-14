    checkLogin: function() {
        var verifyCaptcha, os, ithis = this, user_name = ($(".cl-alert", this.el).remove(),
        $.trim($("#username", this.el).val())), user_password = $("#password", this.el).val(), school_code = $.trim($("#code", this.el).val()), code = ithis.model.get("schoolcode"), userdn = ($("#code").parent().is(":visible") || (school_code = ithis.model.get("schoolcode")),
        "undefined" != typeof widgetCaptcha && (verifyCaptcha = grecaptcha.getResponse(widgetCaptcha)),
        $.trim($("#userdn", this.el).val()));
        "" == user_name ? utils.showElementError(i18n.t("login.user_name_is_incorrect"), $('input[name="username"]', this.el), {
            side: "top"
        }) : "" == user_password ? utils.showElementError(i18n.t("login.password_is_incorrect"), $('input[name="password"]', this.el), {
            side: "top"
        }) : null != code && "" == school_code && 0 == new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(user_name) ? utils.showElementError(i18n.t("login.a_school_code_is_required_msg"), $('input[name="code"]', this.el), {
            side: "top"
        }) : "undefined" != typeof widgetCaptcha && "" == verifyCaptcha ? utils.showElementError("Please verify captcha", $("#clre_captcha", this.el), {
            side: "top",
            secSide: "right"
        }) : (code = utils.getBrowser(),
        os = utils.getOS(),
        console.log("OS==>", os),
        user_name = {
            username: user_name,
            password: user_password,
            os: os,
            userdn: userdn,
            code: school_code,
            Browser: code,
            Resolution: screen.width + "x" + screen.height
        },
        void 0 !== verifyCaptcha && "" != verifyCaptcha && (user_name.recaptchaToken = verifyCaptcha),
        $("#signin", ithis.el).button("loading"),
        0 == ithis.checkloginprogress && (ithis.checkloginprogress = !0,
        $.ajax({
            url: "/login",
            type: "POST",
            data: user_name,
            headers: {
                "csrf-token": IdConfig.csrfToken || ""
            },
            timeout: 1e5,
            success: function(r) {
                if (ithis.checkloginprogress = !1,
                0 != parseInt(r.ResultCode) && $("#signin", ithis.el).button("reset"),
                1 == parseInt(r.ResultCode))
                    window.location.pathname + window.location.search + window.location.hash == r.login_url ? window.location.reload() : (console.log(r),
                    window.location.href = r.login_url);
                else if (2 == parseInt(r.ResultCode)) {
                    var domainCollection = new Backbone.Collection(r.UserDomainList)
                      , domainCollection = new Login_DomainListView({
                        collection: domainCollection
                    });
                    jQuery("body").append(domainCollection.render().el),
                    $("body").append("<div id='wn-main-lightbox'></div>"),
                    jQuery("#wn-main-lightbox").css("display", "block"),
                    jQuery(domainCollection.el).css("display", "block")
                } else if (3 == parseInt(r.ResultCode)) {
                    var token = r.token;
                    window.location.href = "/login/twoformauth/" + token
                } else if (4 == parseInt(r.ResultCode)) {
                    token = r.token;
                    window.location.href = "/login/settwoformauth/" + token
                } else {
                    if (jQuery("#userdn").val(""),
                    "NAPI0102" == r.ErrorCode && "NAPI0103" == r.ErrorCode || $("#signin", ithis.el).button("reset"),
                    "AUTH0001" == r.ErrorCode || "NAPI0101" == r.ErrorCode)
                        return utils.showElementError(i18n.t("login.invalid_school_code"), $('input[name="code"]', this.el), {
                            side: "top"
                        }),
                        !1;
                    if ("AUTH0002" == r.ErrorCode || "AUTH0003" == r.ErrorCode || "AUTH0004" == r.ErrorCode || "AUTH0024" == r.ErrorCode)
                        return domainCollection = new Login_TenantExpiryView,
                        jQuery("body").append(domainCollection.render().el),
                        $("body").append("<div id='wn-main-lightbox'></div>"),
                        jQuery("#wn-main-lightbox").css("display", "block"),
                        jQuery(domainCollection.el).css("display", "block"),
                        !1;
                    if ("NAPI0102" == r.ErrorCode)
                        ithis.setCountDown(r.Delay),
                        utils.showElementError("<p class='msg'>" + i18n.t("login.too_many_login_attempts_%s_sec", r.Delay + "") + "</p>", $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("NAPI0103" == r.ErrorCode)
                        ithis.setCountDown(60 * parseInt(r.Delay)),
                        utils.showElementError("<p class='msg'>" + i18n.t("login.too_many_login_attempts_%s_min", r.Delay + "") + "</p>", $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0007" == r.ErrorCode || "AUTH0008" == r.ErrorCode || "Must change password at login." == r.ResultDescription) {
                        var ResultToken = r.ExpiredPwdToken || ""
                          , ResultDescriptionType = (ResultToken || utils.showElementError(i18n.t("invalid_request"), $('input[name="username"]', this.el), {
                            side: "top"
                        }),
                        0)
                          , changePassword = ("AUTH0008" == r.ErrorCode ? ResultDescriptionType = 1 : "Must change password at login." == r.ResultDescription && (ResultDescriptionType = 2),
                        new Login_ChangePassword({
                            schoolcode: school_code
                        }));
                        changePassword.fetch(utils.ajaxArgsForProxy({
                            success: function() {
                                changePassword.get("ResetPasswordPolicy") && "" != changePassword.get("ResetPasswordPolicy").trim() && changePassword.set("ResetPasswordPolicy", changePassword.get("ResetPasswordPolicy")),
                                changePassword.set({
                                    schoolcode: school_code,
                                    ResultDescriptionType: ResultDescriptionType,
                                    ResultToken: ResultToken
                                }),
                                $("#login-change-password").remove(),
                                $("body").append(new Login_ChangePasswordView({
                                    model: changePassword
                                }).render().el),
                                $("#login-change-password").modal({
                                    show: !1
                                }),
                                $("#login-change-password").modal("show")
                            }
                        }))
                    } else if ("AUTH0022" == r.ErrorCode || "AUTH0025" == r.ErrorCode || "AUTH9001" == r.ErrorCode || "AUTH9002" == r.ErrorCode || "AUTH9003" == r.ErrorCode)
                        utils.showElementError(r.ResultDescription, $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("User is not associated with any group." == r.ResultDescription || "AUTH0011" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.you_group_has_not_been_given_access_to_classlink"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0012" == r.ErrorCode || "AUTH0013" == r.ErrorCode || "AUTH9999" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.invalid_username_or_password"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0014" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.your_trial_account_expired_msg"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0015" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.your_account_has_not_been_authorized_to_access"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0016" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.maximum_users_license_has_been_exhausted_msg"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0017" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.you_have_entered_an_invalid_username_or_password"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0018" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.you_have_entered_an_invalid_code"), $('input[name="code"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0019" == r.ErrorCode || "AUTH0020" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.please_email_assistance_msg"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else if ("AUTH0021" == r.ErrorCode)
                        utils.showElementError(i18n.t("login.you_have_not_been_permitted_access_to_classLink"), $('input[name="username"]', this.el), {
                            side: "top"
                        });
                    else {
                        if ("AUTH0023" != r.ErrorCode)
                            return "RCAPTCH429.1" == r.ErrorCode ? ("undefined" == typeof widgetCaptcha && (widgetCaptcha = grecaptcha.render("clre_captcha", {
                                sitekey: "6LcM7CAcAAAAADHawXOeCew1KVhkcSjG-TQvVDgJ"
                            })),
                            "Your account has been locked. Please contact your administrator or email helpdesk@classlink.com." == r.ResultDescription ? utils.showElementError(r.ResultDescription, $('input[name="username"]', this.el), {
                                side: "top"
                            }) : "undefined" != typeof widgetCaptcha && "" != verifyCaptcha && grecaptcha.reset(widgetCaptcha)) : (token = {
                                NAPI0104: i18n.t("login.please_provide_a_valid_phone_number"),
                                NAPI0105: i18n.t("login.invalid_token"),
                                NAPI0106: i18n.t("login.invalid_user"),
                                NAPI0107: i18n.t("login.no_active_students"),
                                NAPI0108: i18n.t("login.error"),
                                NAPI0109: i18n.t("login.502_bad_gateway"),
                                NAPI0110: i18n.t("login.saml_token_cant_be_blank"),
                                NAPI0111: i18n.t("login.invalid_user"),
                                NAPI0112: i18n.t("login.invalid_saml_code"),
                                NAPI0113: i18n.t("login.saml_is_not_enabled"),
                                NAPI0114: i18n.t("login.502_bad_gateway")
                            },
                            _.has(token, r.ErrorCode) ? utils.showElementError(token[r.ErrorCode], $('input[name="username"]', this.el), {
                                side: "top"
                            }) : "Object reference not set to an instance of an object." == r.ResultDescription && 0 == r.ResultCode ? utils.showElementError(i18n.t("common.something_bad_happened"), $('input[name="username"]', this.el), {
                                side: "top"
                            }) : r.ResultDescription ? (utils.showElementError(r.ResultDescription, $('input[name="username"]', this.el), {
                                side: "top"
                            }),
                            "undefined" != typeof widgetCaptcha && "" != verifyCaptcha && grecaptcha.reset(widgetCaptcha)) : r.ErrorDescription ? utils.showElementError(r.ResultDescription + " - " + r.ErrorDesc, $('input[name="username"]', this.el), {
                                side: "top"
                            }) : utils.showElementError(i18n.t("common.something_bad_happened"), $('input[name="username"]', this.el), {
                                side: "top"
                            })),
                            !1;
                        utils.showElementError(i18n.t("login.your_login_attempt_has_failed_msg"), $('input[name="username"]', this.el), {
                            side: "top"
                        })
                    }
                }
            },
            error: function(r) {
                if ($("#signin", ithis.el).button("reset"),
                "Invalid CSRF Token" == r.responseText)
                    return utils.showElementError(i18n.t("login.invalid_session"), $('input[name="username"]', ithis.el), {
                        side: "top"
                    }),
                    void setTimeout(function() {
                        window.location.reload()
                    }, 3e3);
                utils.showElementError(i18n.t("common.something_bad_happened"), $('input[name="username"]', ithis.el), {
                    side: "top"
                })
            }
        })))
    }

//end function
