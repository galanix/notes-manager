import { Component, OnInit } from '@angular/core';

import { GeneralService } from './services/general.service';
import { FolderService } from './services/folder.service';
import { TagService } from './services/tag.service';
import { NoteService } from './services/note.service';

import * as $ from 'jquery';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	ngOnInit() {
	}

}

