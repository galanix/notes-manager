import { Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as $ from 'jquery';

@Injectable()
export class EnterFormService {

	constructor() { }

// ************************************ COOKIES FUNCTION **********************************************
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
		EnterFormService.set_cookie ( cookie_name, "", cookie_year, cookie_month, cookie_day, "/" );
	}

	static get_cookie ( cookie_name: string ) {
		var results: any = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
		if ( results )
			return ( encodeURI( results[2] ) );
		else
			return null;
	}
	// ****************************** COOKIES FUNCTION end **********************************************

	// Check if we have access=granted coockie
	static checkAccess = () => {

		if (  EnterFormService.get_cookie("access")  ) {
			if ( window.location.href == "http://localhost:4200/enter")   {
				window.location.href = "http://localhost:4200/application";
			}
		} 
		else if ( EnterFormService.get_cookie("access") === null ) {
			if ( window.location.href == "http://localhost:4200/application" ) {
				window.location.href = "http://localhost:4200/enter";	
			}
		} 
	}
}
