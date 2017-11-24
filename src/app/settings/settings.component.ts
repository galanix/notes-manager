import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/pairwise';
import { Router } from '@angular/router';

import { 
	SettingsWorkSpaceComponent,

	EnterFormService
} from './index';

declare var $: any;

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {

	constructor(
		private router: Router
		) {
		this.router.events.subscribe(path => {
			this.showContent();
		});
	}

	markup: boolean = false;
	colorScheme: boolean = false;
	note: boolean = false;

	ngOnInit() {
		EnterFormService.checkAccess();
	}

// Show content or work-space by url changing with routLink help
	showContent(): void {
		this.markup, this.colorScheme, this.note = false;
		let url: string = window.location.href;

		if ( url.indexOf("settings/markup") != -1  ) {
			this.markup = true;
		}
		 if ( url.indexOf("settings/color") != -1 ) {
			this.colorScheme = true;
		}
		 if ( url.indexOf("settings/note") != -1 ) {
			this.note = true;
		}
	}

}

