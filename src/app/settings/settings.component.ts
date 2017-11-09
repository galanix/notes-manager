import { Component, OnInit } from '@angular/core';

import { 
	SettingsWorkSpaceComponent
 } from './index';

declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	setTimeout(function() { $("html").css("visibility", "visible"); }, 500);
  }

}
