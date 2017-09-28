$(document).ready(function () {
    function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
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
    }
    function delete_cookie(cookie_name) {
        var current_date = new Date;
        var cookie_year = current_date.getFullYear();
        var cookie_month = current_date.getMonth();
        var cookie_day = current_date.getDate() - 1;
        set_cookie(cookie_name, "", cookie_year, cookie_month, cookie_day, "/");
    }
    function get_cookie(cookie_name) {
        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
        if (results)
            return (encodeURI(results[2]));
        else
            return null;
    }
    function checkAccess() {
        let location = window.location;
        if (get_cookie("access")) {
            if (location == "http://app.loc/"
                || location == "http://app.loc/index.html") {
                location = "http://app.loc/content.html";
            }
        }
        else if (get_cookie("access") === null) {
            if (location == "http://app.loc/content.html") {
                location = "http://app.loc/index.html";
            }
        }
    }
    function renderNoteSizeLoad() {
        let sidebarHeight = $("#sidebar").outerHeight();
        let noteTitleHeight = $("#note .note_title").outerHeight();
        let noteInfo = $("#note .note_info").outerHeight();
        let sum = noteTitleHeight + noteInfo;
        let res = sidebarHeight - sum;
        $("#note textarea").css("height", res);
    }
    checkAccess();
    setTimeout(function () {
        $("html").css("visibility", "visible");
    }, 1500);
    renderNoteSizeLoad();
    $(".enter_app_page").on("click", function () {
        $.getJSON("js/pass.json", function (result) {
            if ($("#user_name").val() === result.name &&
                $("#user_password").val() === result.password) {
                set_cookie("access", "granted", 2018, 2, 5);
                window.location.replace("http://app.loc/content.html");
            }
        });
    });
    $(".close").on("click", function () {
        delete_cookie("access");
        window.location.replace("http://app.loc/index.html");
    });
    $.getJSON("js/pass.json", function (result) {
        let firstLetter = result.name.slice(0, 1).toUpperCase();
        $("#logo").html(firstLetter);
        $("#name").html(result.name);
    });
});
//# sourceMappingURL=main.js.map