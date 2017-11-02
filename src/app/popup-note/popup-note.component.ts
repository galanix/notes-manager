import { Component, OnInit } from '@angular/core';

import { 
	GeneralService, FolderService,
	TagService, NoteService,

	Note
} from './index';

declare var $: any;
// import * as $ from 'jquery';

@Component({
	selector: 'app-popup-note',
	templateUrl: './popup-note.component.html',
	styleUrls: ['./popup-note.component.css']
})
export class PopupNoteComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
	}

	// Add new note to localStorage then render tree in sidebar
	createNote(): void {
		let selectedOptionId: any = $("#popup_note select option:selected").attr("data-folders-select-id");
		let textArea: any = $("#application #editor");
		if ( $("#note_name").val() && selectedOptionId != "root" ) {
			GeneralService.updateNotesData();
			$(".folders").find("*").remove();
			$(".folders").append(FolderService.parseFolders(GeneralService.data.folders));
			NoteService.renderNotes(GeneralService.data.notes);
			FolderService.renderFoldersDisplay(GeneralService.data.folders);
		}

		if ( selectedOptionId == "root" ) {
			GeneralService.updateNotesData();
			$(".folders").find("*").remove();
			$(".folders").append(FolderService.parseFolders(GeneralService.data.folders));
			NoteService.renderNotes(GeneralService.data.notes);
			FolderService.renderFoldersDisplay(GeneralService.data.folders);
		}

		let latestNote: any = NoteService.findLatestNote();
		textArea.attr("data-textarea-id", latestNote.id);
		NoteService.noteWrapper();
		NoteService.renderLatestNote();

		$("#popup_note").fadeOut(500);
		(<HTMLFormElement>$("#popup_note form")[0]).reset();
	}
}
