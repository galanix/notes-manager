import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {
	Data,

	EnterFormService, GeneralService,
	FolderService, TagService,
	NoteService
} from './index';



declare var $: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	providers: [NoteService]
})
export class HeaderComponent implements OnInit {
	noteHTMLonEdit: any;
	noteHTMLonSave: any;

	id: any = 123;

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService,

		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit() {
		this.renderLogoAndUserName();
		GeneralService.showHints();
}

// Open folder popup
openFolderPopup():void {
	$("#popup_folder").fadeIn(500);
}

// Open tag popup
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

// Open note popup
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

// Hide edit button and show save and delete buttons.
enableEdit = (): void  => {
	if ( NoteService.findLatestNote() ) { 
		$(".edit").css("display", "none");
		$(".delete_note").css("display", "inline-block");
		$(".save_note").css("display", "inline-block");

		$(".note_title").hide();
		$(".note_title_edit").children("input").attr("value", $(".note_title").text());
		$(".note_title_edit").show();

		$("#textarea_editor").hide();
		$(".note_editor").show();
		NoteService.renderNoteSize();
		this.noteHTMLonEdit = $(".cke_editable").html();
	}
}

// Save text 
saveNote = (): void => {
	let textArea: any = $("#textarea_editor");
	let textContent: any = $(".cke_wysiwyg_frame").contents().find('body');
	let input = $(".note_title_edit input");
	for (let i = 0; i < Data.structure.notes.length; i++) {
		if ( Data.structure.notes[i].id == $(".note_editor").attr("data-editor-id") && input.val().length >= 1 ) {
			Data.structure.notes[i].text = textContent.html();
			Data.structure.notes[i].title = input.val();
			$(".note_title").text(input.val());
			localStorage.setItem("structure", JSON.stringify(Data.structure));

		}
		this.noteHTMLonSave = $(".cke_editable").html();
		if ( this.noteHTMLonSave != this.noteHTMLonEdit ) {
			Data.structure.notes[i].changesCounter++;
			Data.structure.notes[i].lastChange = new Date().toLocaleString("ua");
		}
		if ( input.val().length >= 1 ) { 
			localStorage.setItem("structure", JSON.stringify(Data.structure));
			$(".note_title_edit").hide();
			$(".note_title").show();
			$(".note_changes").html(`Changes: ${Data.structure.notes[i].changesCounter}`);
			$(".last_change").html(`Last change: ${Data.structure.notes[i].lastChange}`);
			textArea.hide().html(Data.structure.notes[i].text).show();
			NoteService.returnEdit();
		} else {
			$("#note .note_title_popup").slideDown(300).delay(2600).slideUp(300);
		}
	}
	NoteService.renderNotes(Data.structure.notes);
}


deleteNote(): void {
	let workTextarea: any = $("#textarea_editor");
	let url: any = window.location.href;
	for (let i = 0; i < Data.structure.notes.length; i++) {
		if ( Data.structure.notes[i].id == workTextarea.attr("data-textarea-id") ) {
			let index: number = Data.structure.notes.indexOf(Data.structure.notes[i]);
			Data.structure.notes.splice(index, 1);
			localStorage.setItem("structure", JSON.stringify(Data.structure));
		}
		NoteService.renderNotes(Data.structure.notes);
		FolderService.renderFoldersDisplay(Data.structure.folders);
	}
	let latestNote: any = NoteService.findLatestNote();
	if ( latestNote ) { 
		workTextarea.attr("data-textarea-id", latestNote.id);
		NoteService.renderLatestNote();
	}
	GeneralService.removeHash();
	this.noteService.renderLastNotesInColumn();
	$(".note_title_edit").hide();
	$(".note_title").show();
	NoteService.renderLatestNote();
	NoteService.returnEdit();
}

// Content page on click X delete coockieand redirect to form page
exitAppPage(): void {
	EnterFormService.delete_cookie("access");
	// window.location.replace("https://galanix.github.io/notes-manager/enter");
	window.location.replace("http://localhost:4200/enter");
}

// Show hint while mouse cursor over button
showHints(): void {
	let $target: any = $(event.target);
	$(".button_hint").hide();
	let timeoutId;
	if ( $target ) {
		console.log("timeoutId:", timeoutId); 
		if (!timeoutId) {
			timeoutId = window.setTimeout(function() {
				console.log("timeoutId2:", timeoutId); 
				timeoutId = null;
				$target.find(".button_hint").slideDown('slow');
			}, 1500);
		}
	}
	if (timeoutId) {
		window.clearTimeout(timeoutId);
		timeoutId = null;
	}
	else {
		$target.find(".button_hint").slideUp('slow');
	}

}

// Change logo and user name
renderLogoAndUserName(): void {
	// $.getJSON("https://galanix.github.io/notes-manager/assets/pass.json", function(result: any) {
		$.getJSON("http://localhost:4200/assets/pass.json", function(result: any) {
			let firstLetter = result.name.slice(0, 1).toUpperCase();
			$("#logo").html(firstLetter);
			$("#name").html(result.name);
		});
	}
}
