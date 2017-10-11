import { Component, OnInit } from '@angular/core';

import { EnterFormService } from '../services/enter-form.service';
import { GeneralService } from '../services/general.service';
import { FolderService } from '../services/folder.service';
import { TagService } from '../services/tag.service';
import { NoteService } from '../services/note.service';

import * as $ from 'jquery';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
		this.renderLogoAndUserName();
	}

	openFolderPopup():void {
		$("#popup_folder").fadeIn(500);
		$(document).keydown(function(e: any) {
			if (e.keyCode == 27) {
				FolderService.resetOnCloseWrapper();
			}
		});
		$(".popup_close").on("click", function() {
			FolderService.resetOnCloseWrapper();
		});
	}

	openTagPopup(): void {
		$("#popup_tag").fadeIn(500);
		$(document).keydown(function(e: any) {
			if (e.keyCode == 27) {
				$("#popup_tag").fadeOut(500);
				$("#popup_tag form").val(null);
			}
		});
		$(".popup_close").on("click", function() {
			$("#popup_tag").fadeOut(500);
			$("#popup_tag form").val(null);
		});
	}

	openNotePopup(): void {
		$("#popup_note").fadeIn(500);
		$(document).keydown(function(e: any) {
			if (e.keyCode == 27) {
				$("#popup_note").fadeOut(500);
				$("#popup_note form").val(null);
			}
		});

		$(".popup_close").on("click", function() {
			$("#popup_note").fadeOut(500);
			$("#popup_note form").val(null);
		});
	}

	enableEdit(): void {
		let workTextarea: any = $("#application textarea");
		if ( workTextarea.val() ) {
			$(".edit").css("display", "none");
			$(".delete_note").css("display", "inline-block");
			$(".save_note").css("display", "inline-block");
			workTextarea.removeAttr("readonly");
		}
	}

	saveNote(): void {
		let workTextarea: any = $("#application textarea");
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
				GeneralService.data.notes[i].text = workTextarea.val();
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
		}
		NoteService.returnEdit();
	}

	deleteNote(): void {
		let workTextarea: any = $("#application textarea");
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
				let index: number = GeneralService.data.notes.indexOf(GeneralService.data.notes[i]);
				GeneralService.data.notes.splice(index, 1);
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
			NoteService.renderNotes(GeneralService.data.notes);
			FolderService.renderFoldersDisplay(GeneralService.data.folders);
		}
		let latestNote: any = NoteService.findLatestNote();
		if ( latestNote ) { 
			workTextarea.attr("data-textarea-id", latestNote.id);
			NoteService.noteWrapper();
		}
		NoteService.returnEdit();
	}

	// Content page on click X delete coockieand redirect to form page
	exitAppPage(): void {
		EnterFormService.delete_cookie("access");
		window.location.replace("http://localhost:4200/enter");
	}

	renderLogoAndUserName(): void {
		$.getJSON("../../assets/pass.json", function(result: any) {
		let firstLetter = result.name.slice(0, 1).toUpperCase();
		$("#logo").html(firstLetter);
		$("#name").html(result.name);
	});
}

}
