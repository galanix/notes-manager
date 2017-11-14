import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

import { EnterFormService } from '../services/enter-form.service';

declare var $: any;

@Component({
	selector: 'app-enter-form',
	templateUrl: './enter-form.component.html',
	styleUrls: ['./enter-form.component.css']
})
export class EnterFormComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		EnterFormService.checkAccess();
		setTimeout(function() {
			$("html").css("visibility", "visible");
		}, 500);
	}

	// Form page on click Enter adds coockie and redirect to content page
	enterAppPage(): void {
		event.preventDefault();
		$(".error").hide();
		let pass: any = $("#user_password").val();
		$.getJSON("https://galanix.github.io/notes-manager/assets/pass.json", function(result: any) {
			if ( $("#user_name").val() === result.name && 
				Md5.hashStr(pass) === result.password ) {
				EnterFormService.set_cookie( "access", "granted", 2018, 2, 5, );
			window.location.replace("http://localhost:4200/application");
		}  

		if ( Md5.hashStr(pass) != result.password && pass != "" ) {
			$(".invalid_password").show();
			$("#user_password").css("border-color", "tomato");
		} else if ( pass == "" ) {
			$(".password_empty").show();
			$("#user_password").css("border-color", "tomato");
		} else if ( Md5.hashStr(pass) === result.password ) {
			$("#user_password").css("border-color", "#0CC481");
			$(".invalid_password").hide();
			$(".password_empty").hide();
		}

		EnterFormService.validateField(result, $("#user_name"), $(".invalid_name"), $(".name_empty"));
	});
	}


}
