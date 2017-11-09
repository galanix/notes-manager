import { Component, OnInit } from '@angular/core';


declare var $: any;

@Component({
  selector: 'app-settings-work-space',
  templateUrl: './settings-work-space.component.html',
  styleUrls: ['./settings-work-space.component.css']
})
export class SettingsWorkSpaceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showContent(tab: string): void {
  	let tabsContent = $(".settings_content");
  	for (let i = 0; i < tabsContent.length; i++) {
       $(tabsContent[i]).hide();  
    }
    $(`.${tab}`).show();
  }

}
