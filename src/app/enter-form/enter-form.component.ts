import { Component, OnInit } from '@angular/core';

import { EnterFormService } from '../services/enter-form.service';

import * as $ from 'jquery';

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
		$.getJSON("../../assets/pass.json", function(result: any) {
			if ( $("#user_name").val() === result.name && 
				$("#user_password").val() === result.password ) {
				EnterFormService.set_cookie( "access", "granted", 2018, 2, 5, );
			window.location.replace("http://localhost:4200/application");
		}
	});
	}
}
