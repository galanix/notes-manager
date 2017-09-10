
$(document).ready(function() {

	function set_cookie ( name, value, exp_y, exp_m, exp_d, path, domain, secure ){
		var cookie_string = name + "=" + escape ( value );
		if ( exp_y ){
			var expires = new Date ( exp_y, exp_m, exp_d );
			cookie_string += "; expires=" + expires.toGMTString();
		}
		if ( path )
			cookie_string += "; path=" + escape ( path );
		if ( domain )
			cookie_string += "; domain=" + escape ( domain );
		if ( secure )
			cookie_string += "; secure";
		document.cookie = cookie_string;
	}

	function delete_cookie ( cookie_name ) {
		var current_date = new Date;
		var cookie_year = current_date.getFullYear ( );
		var cookie_month = current_date.getMonth ( );
			var cookie_day = current_date.getDate ( ) - 1;  // Даём кукам дату вчерашним днём, поэтому они удаляются
			set_cookie ( cookie_name, "", cookie_year, cookie_month, cookie_day, "/" );
		}

		function get_cookie ( cookie_name ){
			var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
			if ( results )
				return ( unescape ( results[2] ) );
			else
				return null;
		}


// Check if we have access=granted coockie
function checkAccess() {

	if (  get_cookie("access")  ) {
		if ( window.location == "http://app.loc/" 
			|| window.location == "http://app.loc/index.html")   {
			window.location = "http://app.loc/content.html";
	}
} 
else if ( get_cookie("access") === null ) {
	if ( window.location == "http://app.loc/content.html" ) {
		window.location = "http://app.loc/index.html";	
	}
} 
}


checkAccess();
setTimeout(function() {
	$("html").show();
}, 500);

// Form page on click Enter adds coockie and redirect to content page
$(".enter_app_page").on("click", function() {
	$.getJSON("js/pass.json", function(result) {
		if ( $("#user_name").val() === result.name && 
			$("#user_password").val() === result.password ) {
			set_cookie( "access", "granted", 2018, 02, 05, );
		window.location.replace("http://app.loc/content.html");
	}
});
});

// Content page on click X delete coockieand redirect to form page
$(".close").on("click", function() {
	delete_cookie("access");
	window.location.replace("http://app.loc/index.html");	
});

// Change logo and user name
$.getJSON("js/pass.json", function(result) {
	let firstLetter = result.name.slice(0, 1).toUpperCase();
	$("#logo").html(firstLetter);
	$("#name").html(result.name);
});

// Folders

// Toggle folders to open and close in tree format

$(".folders").on("dblclick", function(e) {
	let target = e.target;
	if ( $(target).hasClass("folder_name") ) {
		let childUl = $(target).siblings("ul");
		childUl.toggle();
		setTimeout(function() {
			if ( $( childUl ).css("display").toLowerCase() === "none" ) {
				$(target).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			} 
			if ( $( childUl ).css("display").toLowerCase() === "block" ) {
				$(target).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			}
		}, 10);
	}
});

$(".folders").on("click", function(e) {
	let target = e.target;
	$.each( $(".folders .folder_name"), function(i, val) {
			if ( $(this).hasClass("colored") ) $(this).removeClass("colored");
		});
	if ( $(target).hasClass("folder_name") ) $(target).toggleClass("colored");
		
});

// Toggle tags to open and close in tree format

$(".tags").on("dblclick", function(e) {
	let target = e.target;
	if ( $(target).hasClass("tag_name") ) {
		let childUl = $(target).siblings("ul");
		childUl.toggle();
		setTimeout(function() {
			if ( $( childUl ).css("display").toLowerCase() === "none" ) {
				$(target).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			} 
			if ( $( childUl ).css("display").toLowerCase() === "block" ) {
				$(target).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			}
		}, 10);
	}
});
$(".tags").on("click", function(e) {
	let target = e.target;
	$.each( $(".tags .tag_name"), function(i, val) {
			if ( $(this).hasClass("colored") ) $(this).removeClass("colored");
		});
	if ( $(target).hasClass("tag_name") ) $(target).toggleClass("colored");
		
});

});