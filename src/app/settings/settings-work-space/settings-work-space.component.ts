import { Component, OnInit } from '@angular/core';

import {
  Data, 
	GeneralService
 } from './index';

declare var $: any;

@Component({
  selector: 'app-settings-work-space',
  templateUrl: './settings-work-space.component.html',
  styleUrls: ['./settings-work-space.component.css']
})
export class SettingsWorkSpaceComponent implements OnInit {

  constructor(
  	private generalService:GeneralService
  	) { }

  ngOnInit() {
  }

// // Show tab content in settings page
//   showContent(tab: string): void {
//   	let tabsContent = $(".settings_content");
//   	for (let i = 0; i < tabsContent.length; i++) {
//        $(tabsContent[i]).hide();  
//     }
//     $(`.${tab}`).show();
//   }

// Set application page columns or 3 columns markup
  setMarkup():void {
  	let cols_2 = $("#cols_2:checked");
  	let cols_3 = $("#cols_3:checked");
  	if ( cols_3.length > 0 ) {
  		Data.structure.markup_3cols = true;
  		localStorage.setItem("markup_3cols", "true");
  	} else if ( cols_2.length > 0 ) {
  		Data.structure.markup_3cols = false;
  		localStorage.setItem("markup_3cols", "false");
  	}
  }

}
