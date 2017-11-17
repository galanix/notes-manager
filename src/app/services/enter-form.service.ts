import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class EnterFormService {

	constructor() { }

	// ************************************ COOKIES FUNCTION **********************************************
	static set_cookie = ( name: string, value: string, exp_y: number, 
		exp_m: number, exp_d: number, path?: string, domain?: string, secure?: boolean ) => {
		var cookie_string: string = name + "=" + encodeURI( value );
		if ( exp_y ) {
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
		document.cookie = cookie_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
	static checkAccess = (callback = (): void => null )  => {
		if ( EnterFormService.get_cookie("access") ) {
			// if ( window.location.href == "https://galanix.github.io/notes-manager/enter" ) { 
				if ( window.location.href == "http://localhost:4200/enter" ) { 
					// window.location.href = "https://galanix.github.io/notes-manager/application";
					window.location.href = "http://localhost:4200/application";
				}
				// if ( window.location.href == "https://galanix.github.io/notes-manager/application" ) { 
				if ( window.location.href == "http://localhost:4200/application" )
					$("html").css("visibility", "visible");
			}
			else if ( EnterFormService.get_cookie("access") === null ) {
				// if ( window.location.href != "https://galanix.github.io/notes-manager/enter"  ) { 
					if ( window.location.href != "http://localhost:4200/enter"  ) { 
						// window.location.href = "https://galanix.github.io/notes-manager/enter";
						window.location.href = "http://localhost:4200/enter";
					}
					// if ( window.location.href == "https://galanix.github.io/notes-manager/enter" ) { 
					if ( window.location.href == "http://localhost:4200/enter" )
					$("html").css("visibility", "visible");
				}
				if (typeof callback === "function") {
					callback();
				} 
			}

			static validateField(dataProperty: any, input: any, errors: any): void {
				if ( input.val() != dataProperty 
					&& input.val() != "" ) {
					errors.invalid.show();
				input.css("border-color", "tomato");
			} else if ( input.val() == "" ) {
				errors.empty.show();
				input.css("border-color", "tomato");
			} else if ( input.val() == dataProperty ) {
				input.css("border-color", "#0CC481");
				errors.invalid.hide();
				errors.empty.hide();
			}

		}

	}