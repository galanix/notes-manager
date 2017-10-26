import { Component, OnInit } from '@angular/core';

import { 
	EnterFormService, GeneralService,
	FolderService, TagService, 
	NoteService
} from './index';

declare var $: any;
// import * as $ from 'jquery';

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
		}, 1000);
		setTimeout(function() {
			NoteService.renderNoteSize(6);
			NoteService.renderLatestNote();
			TagService.checkNoteForAddTag();
			TagService.paddingCheck();
			TagService.renderTags();
		}, 1000);
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

		this.generalEvents();
	}

	generalEvents(): void {
		// Set latest note id to textarea attr data-textarea-id
		if ( $("#application textarea").attr("data-textarea-id") ) 
			$("#application textarea").attr("data-textarea-id", NoteService.findLatestNote().id);
		// Set sidebar heigth to window.outerHeight()
		$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
		NoteService.renderNoteSize(-10);
		// Set sidebar heigth to window.outerHeight() on resize
		$(window).resize(function() {
			$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
			NoteService.renderNoteSize(-15);
		});
	}

}
