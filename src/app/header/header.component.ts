import { Component, OnInit } from '@angular/core';
// import { WorkSpaceComponent } from '../work-space/work-space.component';

import { 
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

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
		this.renderLogoAndUserName();
		$( "#logo" ).draggable();
	}

	// Open folder popup
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
			NoteService.renderNoteSize(6);
			this.noteHTMLonEdit = $(".cke_editable").html();
		}
	}

	// Save text 
	saveNote = (): void => {
		let textArea: any = $("#textarea_editor");
		let textContent: any = $(".cke_wysiwyg_frame").contents().find('body');
		let input = $(".note_title_edit input");
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].id == $(".note_editor").attr("data-editor-id") && input.val().length >= 1 ) {
				GeneralService.data.notes[i].text = textContent.html();
				GeneralService.data.notes[i].title = input.val();
				$(".note_title").text(input.val());
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				
			}
			this.noteHTMLonSave = $(".cke_editable").html();
			if ( this.noteHTMLonSave != this.noteHTMLonEdit ) {
				GeneralService.data.notes[i].changesCounter++;
				GeneralService.data.notes[i].lastChange = new Date().toLocaleString("ua");
			}
			if ( input.val().length >= 1 ) { 
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				$(".note_title_edit").hide();
				$(".note_title").show();
				$(".note_changes").html(`Changes: ${GeneralService.data.notes[i].changesCounter}`);
				$(".last_change").html(`Last change: ${GeneralService.data.notes[i].lastChange}`);
				textArea.hide().html(GeneralService.data.notes[i].text).show();
				NoteService.returnEdit();
			} else {
				$("#note .note_title_popup").slideDown(300);
				setTimeout( () => {
					$("#note .note_title_popup").slideUp(300)
				}, 2600 );
				}
			}
		}
	

	deleteNote(): void {
		let workTextarea: any = $("#textarea_editor");
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
			NoteService.renderLatestNote();
		}
		NoteService.renderLatestNote();
		NoteService.returnEdit();
	}

	// Content page on click X delete coockieand redirect to form page
	exitAppPage(): void {
		EnterFormService.delete_cookie("access");
		window.location.replace("http://localhost:4200/enter");
	}

	// Change logo and user name
	renderLogoAndUserName(): void {
		$.getJSON("https://galanix.github.io/notes-manager/assets/pass.json", function(result: any) {
			let firstLetter = result.name.slice(0, 1).toUpperCase();
			$("#logo").html(firstLetter);
			$("#name").html(result.name);
		});
	}
}
