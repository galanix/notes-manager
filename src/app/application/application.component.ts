import { Component, OnInit, AfterContentChecked } from '@angular/core';

import {
	Data,

	EnterFormService, GeneralService,
	FolderService, TagService, 
	NoteService
} from './index';

declare var $: any;

@Component({
	selector: 'app-application',
	templateUrl: './application.component.html',
	styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements 
OnInit, AfterContentChecked {

	constructor(
		private generalService: GeneralService,
		private noteService: NoteService
		) { }

	// Starting call of functions
	startCall = (): void => {
		NoteService.renderLatestNote();
		TagService.checkNoteForAddTag();
		TagService.paddingCheck();
		TagService.renderTags();
		FolderService.renderFolderSelect(Data.structure.folders, 0);
		TagService.renderTagSelect(Data.structure.tags, 0);
		Data.idFolderCounter++;
		Data.idTagCounter++;
		Data.idNoteCounter++;
		$(".folders").append(FolderService.parseFolders(Data.structure.folders));
		$(".tags").append(TagService.parseTags(Data.structure.tags));
		NoteService.renderNotes(Data.structure.notes);
		FolderService.renderFoldersDisplay(Data.structure.folders);
		TagService.renderTagsDisplay(Data.structure.tags);
		NoteService.renderNoteFields();

		this.generalEvents();
	}

	ngOnInit() {
		// localStorage.clear();
		EnterFormService.checkAccess(this.startCall);
	}

	ngAfterContentChecked() {
		// Set sidebar heigth to window.outerHeight()
		$("#sidebar").css("height", $(window).height() - $("header").outerHeight());
	}

	generalEvents(): void {
		// Set latest note id to textarea attr data-textarea-id
		if ( $("#application textarea").attr("data-textarea-id") ) 
			$("#application textarea").attr("data-textarea-id", NoteService.findLatestNote().id);
		NoteService.renderNoteSize();
		// Set sidebar heigth to window.outerHeight() on resize
		$(window).resize(function() {
			$("#sidebar").css("height", $(window).height() - $("header").outerHeight());
			NoteService.renderNoteSize();
			GeneralService.setColumnHeight();
		});
	}

}
