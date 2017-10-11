import { Component, OnInit } from '@angular/core';

import { GeneralService } from '../services/general.service';
import { FolderService } from '../services/folder.service';
import { TagService } from '../services/tag.service';
import { NoteService } from '../services/note.service';

import * as $ from 'jquery';

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

	createNote(): void {
			let selectedOptionId: any = $("#popup_note select option:selected").attr("data-folders-select-id");
			let textArea: any = $("#application textarea");
			if ( $("#note_name").val() && selectedOptionId != "root" ) {
				GeneralService.updateNotesData();
				$(".folders").find("*").remove();
				$(".folders").append(FolderService.parseFolders(GeneralService.data.folders));
				NoteService.renderNotes(GeneralService.data.notes);
				FolderService.renderFoldersDisplay(GeneralService.data.folders);
			}

			let latestNote: any = NoteService.findLatestNote();
			textArea.attr("data-textarea-id", latestNote.id);
			NoteService.noteWrapper();

			$("#popup_note").fadeOut(500);
			(<HTMLFormElement>$("#popup_note form")[0]).reset();
	}

	

}
