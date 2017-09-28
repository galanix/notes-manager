$(document).ready(function() {

	function set_cookie ( name: string, value: string, exp_y: number, 
		exp_m: number, exp_d: number, path?: string, domain?: string, secure?: boolean ){
		var cookie_string: string = name + "=" + encodeURI( value );
		if ( exp_y ){
			var expires = new Date ( exp_y, exp_m, exp_d );
			cookie_string += "; expires=" + expires.toUTCString();
		}
		if ( path )
			cookie_string += "; path=" + encodeURI( path );
		if ( domain )
			cookie_string += "; domain=" + encodeURI( domain );
		if ( secure )
			cookie_string += "; secure";
		document.cookie = cookie_string;
	}

	function delete_cookie ( cookie_name: string ) {
		var current_date = new Date;
		var cookie_year: number = current_date.getFullYear ( );
		var cookie_month: number = current_date.getMonth ( );
		var cookie_day: number = current_date.getDate ( ) - 1;  // Даём кукам дату вчерашним днём, поэтому они удаляются
		set_cookie ( cookie_name, "", cookie_year, cookie_month, cookie_day, "/" );
	}

	function get_cookie ( cookie_name: string ){
		var results: any = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		if ( results )
			return ( encodeURI( results[2] ) );
		else
			return null;
	}


	// Check if we have access=granted coockie
	function checkAccess() {
		let location: any = window.location;
		if (  get_cookie("access")  ) {
			if ( location == "http://app.loc/" 
				|| location == "http://app.loc/index.html")   {
				location = "http://app.loc/content.html";
		}
	} 
	else if ( get_cookie("access") === null ) {
		if ( location == "http://app.loc/content.html" ) {
			location = "http://app.loc/index.html";	
		}
	} 
}

// Set textarea(note) height equal to sidebar height
function renderNoteSizeLoad() {
		let sidebarHeight: number = $("#sidebar").outerHeight();
		let noteTitleHeight: number = $("#note .note_title").outerHeight();
		let noteInfo: number = $("#note .note_info").outerHeight();
		let sum: number = noteTitleHeight + noteInfo;
		let res: number = sidebarHeight - sum;
		$("#note textarea").css("height", res);
	}

	// ******************************* CALL FUNCTIONS **************************************

	checkAccess();
	// Set display property of html tag to block(none by default)
	setTimeout(function() {
		$("html").css("visibility", "visible");
	}, 1500);
	renderNoteSizeLoad();


	// ******************************* CALL FUNCTIONS end **************************************

	// Form page on click Enter adds coockie and redirect to content page
	$(".enter_app_page").on("click", function() {
		$.getJSON("js/pass.json", function(result: any) {
			if ( $("#user_name").val() === result.name && 
				$("#user_password").val() === result.password ) {
				set_cookie( "access", "granted", 2018, 2, 5, );
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
	$.getJSON("js/pass.json", function(result: any) {
		let firstLetter = result.name.slice(0, 1).toUpperCase();
		$("#logo").html(firstLetter);
		$("#name").html(result.name);
	});

});






