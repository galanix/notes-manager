import { Component, OnInit } from '@angular/core';

import {
  Data, 
	GeneralService
 } from './index';

declare var $: any;

@Component({
  selector: 'app-markup',
  templateUrl: './markup.component.html',
  styleUrls: ['./markup.component.css']
})
export class MarkupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

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
