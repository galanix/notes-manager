define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cockie = (function () {
        function Cockie() {
        }
        Cockie.get_cookie = function (cookie_name) {
            var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
            if (results)
                return (encodeURI(results[2]));
            else
                return null;
        };
        return Cockie;
    }());
    Cockie.set_cookie = function (name, value, exp_y, exp_m, exp_d, path, domain, secure) {
        var cookie_string = name + "=" + encodeURI(value);
        if (exp_y) {
            var expires = new Date(exp_y, exp_m, exp_d);
            cookie_string += "; expires=" + expires.toUTCString();
        }
        if (path)
            cookie_string += "; path=" + encodeURI(path);
        if (domain)
            cookie_string += "; domain=" + encodeURI(domain);
        if (secure)
            cookie_string += "; secure";
        document.cookie = cookie_string;
    };
    Cockie.delete_cookie = function (cookie_name) {
        var current_date = new Date;
        var cookie_year = current_date.getFullYear();
        var cookie_month = current_date.getMonth();
        var cookie_day = current_date.getDate() - 1;
        Cockie.set_cookie(cookie_name, "", cookie_year, cookie_month, cookie_day, "/");
    };
    Cockie.checkAccess = function () {
        var location = window.location;
        if (Cockie.get_cookie("access")) {
            if (location == "http://app.loc/"
                || location == "http://app.loc/index.html") {
                location = "http://app.loc/content.html";
            }
        }
        else if (Cockie.get_cookie("access") === null) {
            if (location == "http://app.loc/content.html") {
                location = "http://app.loc/index.html";
            }
        }
    };
    Cockie.cockieEvents = function () {
        $(".enter_app_page").on("click", function () {
            $.getJSON("scripts/pass.json", function (result) {
                if ($("#user_name").val() === result.name &&
                    $("#user_password").val() === result.password) {
                    Cockie.set_cookie("access", "granted", 2018, 2, 5);
                    window.location.replace("http://app.loc/content.html");
                }
            });
        });
        $(".close").on("click", function () {
            Cockie.delete_cookie("access");
            window.location.replace("http://app.loc/index.html");
        });
        $.getJSON("scripts/pass.json", function (result) {
            var firstLetter = result.name.slice(0, 1).toUpperCase();
            $("#logo").html(firstLetter);
            $("#name").html(result.name);
        });
    };
    exports.Cockie = Cockie;
});
//# sourceMappingURL=cockie.js.map