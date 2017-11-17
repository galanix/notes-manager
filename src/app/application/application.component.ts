import { Component, OnInit, AfterContentChecked } from '@angular/core';

import { 
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
export class ApplicationComponent implements OnInit, AfterContentChecked {

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
