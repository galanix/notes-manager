export class Cockie { 

	static set_cookie = ( name: string, value: string, exp_y: number, 
		exp_m: number, exp_d: number, path?: string, domain?: string, secure?: boolean ) => {
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

	static delete_cookie = ( cookie_name: string ) => {
		var current_date = new Date;
		var cookie_year: number = current_date.getFullYear ( );
		var cookie_month: number = current_date.getMonth ( );
		var cookie_day: number = current_date.getDate ( ) - 1;  // Даём кукам дату вчерашним днём, поэтому они удаляются
		Cockie.set_cookie ( cookie_name, "", cookie_year, cookie_month, cookie_day, "/" );
	}

	static get_cookie ( cookie_name: string ){
		var results: any = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		if ( results )
			return ( encodeURI( results[2] ) );
		else
			return null;
	}

		// Check if we have access=granted coockie
	static checkAccess = () => {
		let location: any = window.location;
		if (  Cockie.get_cookie("access")  ) {
			if ( location == "http://app.loc/" 
				|| location == "http://app.loc/index.html")   {
				location = "http://app.loc/content.html";
		}
	} 
	else if ( Cockie.get_cookie("access") === null ) {
		if ( location == "http://app.loc/content.html" ) {
			location = "http://app.loc/index.html";	
		}
	} 
}

// *********************************************************************************

static cockieEvents = () => {
		// Form page on click Enter adds coockie and redirect to content page
	$(".enter_app_page").on("click", function() {
		$.getJSON("scripts/pass.json", function(result: any) {
			if ( $("#user_name").val() === result.name && 
				$("#user_password").val() === result.password ) {
				Cockie.set_cookie( "access", "granted", 2018, 2, 5, );
			window.location.replace("http://app.loc/content.html");
		}
	});
	});

	// Content page on click X delete coockieand redirect to form page
	$(".close").on("click", function() {
		Cockie.delete_cookie("access");
		window.location.replace("http://app.loc/index.html");	
	});

	// Change logo and user name
	$.getJSON("scripts/pass.json", function(result: any) {
		let firstLetter = result.name.slice(0, 1).toUpperCase();
		$("#logo").html(firstLetter);
		$("#name").html(result.name);
	});
}

}











