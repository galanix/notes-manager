import { Component, OnInit } from '@angular/core';

import { EnterFormService } from '../services/enter-form.service';

import { GeneralService } from '../services/general.service';
import { FolderService } from '../services/folder.service';
import { TagService } from '../services/tag.service';
import { NoteService } from '../services/note.service';

import * as $ from 'jquery';

@Component({
	selector: 'app-application',
	templateUrl: './application.component.html',
	styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

	constructor() { }

// Starting call of functions
	ngOnInit() {
		EnterFormService.checkAccess();
		setTimeout(function() {
			$("html").css("visibility", "visible");
		}, 500);
		NoteService.renderNoteSizeLoad();
		FolderService.renderFolderSelect(GeneralService.data.folders, 0);
		TagService.renderTagSelect(GeneralService.data.tags, 0);
		GeneralService.idFolderCounter++;
		GeneralService.idTagCounter++;
		GeneralService.idNoteCounter++;
		$(".folders").append(FolderService.parseFolders(GeneralService.data.folders));
		$(".tags").append(TagService.parseTags(GeneralService.data.tags));
		NoteService.renderNotes(GeneralService.data.notes);
		FolderService.renderFoldersDisplay(GeneralService.data.folders);
		TagService.renderTagsDisplay(GeneralService.data.tags);
		NoteService.renderNoteFields();
		NoteService.renderLatestNote();
		TagService.paddingCheck();
		TagService.checkNoteForAddTag();
		TagService.renderTags();

		this.generalEvents();
	}

	generalEvents(): void {
		// Set latest note id to textarea attr data-textarea-id
		if ( $("#application textarea").attr("data-textarea-id") ) 
			$("#application textarea").attr("data-textarea-id", NoteService.findLatestNote().id);
		// Set sidebar heigth to window.outerHeight()
		$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
		NoteService.renderNoteSize();
		// Set sidebar heigth to window.outerHeight() on resize
		$(window).resize(function() {
			$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
			NoteService.renderNoteSize();
		});
	}

}
