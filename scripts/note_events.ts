import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";
import { updateNotesData } from "./main";


export class NoteEvents { 

	static noteEvents() { 
		// Open create note popup
		$(".btn_notes").on("click", function() {

			$("#popup_note").fadeIn(500);
			$(document).keydown(function(e: any) {
				if (e.keyCode == 27) {
					$("#popup_note").fadeOut(500);
					$("#popup_note form")[0].reset();
				}
			});

			$(".popup_close").on("click", function() {
				$("#popup_note").fadeOut(500);
				$("#popup_note form")[0].reset();
			});
		});

		// Add new note to localStorage then render tree in sidebar
		$("#popup_note .create_note").on("click", function() {
			let selectedOptionId: any = $("#popup_note select option:selected").attr("data-folders-select-id");
			let textArea: any = $("#application textarea");
			if ( $("#note_name").val() && selectedOptionId != "root" ) {
				updateNotesData();
				$(".folders").find("*").remove();
				$(".folders").append(Folder.parseFolders(data.folders));
				Note.renderNotes(data.notes);
				Folder.renderFoldersDisplay(data.folders);
			}

			let latestNote: any = Note.findLatestNote();
			textArea.attr("data-textarea-id", latestNote.id);
			Note.noteWrapper();

			$("#popup_note").fadeOut(500);
			$("#popup_note form")[0].reset();
		});

		// Save text in textarea in localStorage. Show edit button, hide save and delete buttons.
		$(".save_note").on("click", function() {
			let workTextarea: any = $("#application textarea");
			for (let i = 0; i < data.notes.length; i++) {
				if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
					data.notes[i].text = workTextarea.val();
					localStorage.setItem("structure", JSON.stringify(data));
				}
			}
			Note.returnEdit();
		});

		// Delete note in localStorage. Show edit button, hide save and delete buttons. Render tree in sidebar.
		$(".delete_note").on("click", function() {
			let workTextarea: any = $("#application textarea");
			for (let i = 0; i < data.notes.length; i++) {
				if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
					let index: number = data.notes.indexOf(data.notes[i]);
					data.notes.splice(index, 1);
					localStorage.setItem("structure", JSON.stringify(data));
				}
				Note.renderNotes(data.notes);
				Folder.renderFoldersDisplay(data.folders);
			}
			let latestNote: any = Note.findLatestNote();
			if ( latestNote ) { 
				workTextarea.attr("data-textarea-id", latestNote.id);
				Note.noteWrapper();
			}
			Note.returnEdit();
		});
	}
}