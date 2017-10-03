import { Tag } from "./tag"

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";

export class Note {
	
	id: number;
	folder: number;
	title: string;
	text: any;
	date: any;
	tags: any;

	constructor(theID: any, theFolder: any, theTitle: string, theText: any) {
		this.id = theID;
		this.folder = theFolder;
		this.title = theTitle;
		this.text = theText;
		this.date = new Date();
		this.tags = [];
	}

	// Set textarea(note) height equal to sidebar height
	static renderNoteSize() {
		setTimeout(function() {
			let sidebarHeight: number = $("#sidebar").outerHeight();
			let noteTitleHeight: number = $("#note .note_title").outerHeight();
			let noteInfo: number = $("#note .note_info").outerHeight();
			let sum: number = noteTitleHeight + noteInfo ;
			let res: number = sidebarHeight - sum;
			$("#note textarea").css("height", res);
		}, 10);
	}

	// Math max to array
	static getMaxOfArray<T>(numArray: T[]): T {
		return Math.max.apply(null, numArray);
	}

	// Find last(date) note and return it as object from data
	static findLatestNote<T>(): any {
		let dataArr: T[] = [];
		let maxNote: any;
		for(let i = 0; i < data.notes.length; i++) {
			let item: any = data.notes[i];
			let parseDate: any = Date.parse(item.date);
			dataArr.push(parseDate);
		}
		let max: any = this.getMaxOfArray(dataArr);
		for(let i = 0; i < data.notes.length; i++) {
			let item: any = data.notes[i];
			let parseDate: any = Date.parse(item.date);
			if ( parseDate == max ) {
				maxNote = item;
			}
		}
		return maxNote;
	}

	// Render latest(date) note on load
	static renderLatestNote() {
		let latestNote: any = this.findLatestNote();
		let noteTitle: any = $("#note .note_title");
		let noteTags: any = $("#note .notes_tags");
		let notesFolder: any = $("#note .notes_folder");
		let textArea: any = $("#application textarea");

		if (latestNote) {
			noteTitle.html(latestNote.title);
			let latestNoteFolder = find(data.folders, latestNote.folder);
			notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${latestNoteFolder.name}`);
			textArea.html(latestNote.text);
			textArea.attr("data-textarea-id", latestNote.id);
		}
	}

	// Render note fields(title, tags..) and render last(date) note on load
	static renderNoteFields() {
		let noteTitle: any = $("#note .note_title");
		let noteTags: any = $("#note .notes_tags");
		let notesFolder: any = $("#note .notes_folder");
		let textArea: any = $("#application textarea");

		for (let i = 0; i < data.notes.length; i++) {
			let item: any = data.notes[i];
			if ( item.id == textArea.attr("data-textarea-id") ) {
				noteTitle.html(item.title);
				textArea.val(item.text);
				let folder = find(data.folders, item.folder);
				notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${folder.name}`);
			}
		}
		if ( data.notes.length <= 0 ) {
			noteTitle.html(null);
			textArea.val(null);
			notesFolder.html(null);
		}
	}

	// Render notes in sidebar tree
	static renderNotes<T>(folders: T[]) {
		$("#sidebar").find(".note").remove();
		for (let i = 0; i < folders.length; i++) {
			let item: any = folders[i];
			let id: T = item.id;
			let folderID: T = item.folder;
			let foldersSpan: any = $(`.folders span[data-folders-tree-id="${folderID}"]`);
			let folderUl: any = foldersSpan.next("ul");
			folderUl.append(`<span data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
				${item.title}</span>`);

			let noteTags: any = item.tags;
			for (let j = 0; j < noteTags.length; j++) {
				let tagSpan: any = $(`.tags span[data-tags-tree-id="${noteTags[j]}"]`);
				let tagUl: any = tagSpan.next("ul");
				tagUl.append(`<span data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
					${item.title}</span>`);
			}
		}
	}
	// Check if folder or subfolders has notes
	static checkNotesInFolders(obj: any) {
		obj.notRenderInSelect = true;
		localStorage.setItem("structure", JSON.stringify(data));
		for (let i = 0; i < data.notes.length; i++) {
			if ( data.notes[i].folder == obj.id ) {
				if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" )
					$("#popup_folder .popup_delete_notes_wrapper").show();
			}
		}
		if (obj.children) { 
			let checkNotesInFoldersAgain = (arr: any) => {
				for(let key in arr) {
					let item = arr[key];
					item.notRenderInSelect = true;
					localStorage.setItem("structure", JSON.stringify(data));
					for (let i = 0; i < data.notes.length; i++) {
						if ( data.notes[i].folder == item.id ) {
							if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" )
								$("#popup_folder .popup_delete_notes_wrapper").show();
						}
					}
					if (item.children)
						checkNotesInFoldersAgain(item.children);
				}
			} 
			checkNotesInFoldersAgain(obj.children);
		}
	}

	// Move notes to another folder
	static moveNoteInFolder(oldFolder: any, newFolder: any) {
		for(let key in oldFolder) {
			let item = oldFolder[key];
			for (let i = 0; i < data.notes.length; i++) {
				if ( data.notes[i].folder == item.id ) {
					data.notes[i].folder = newFolder.id;
					localStorage.setItem("structure", JSON.stringify(data));
				}
			}
			if (item.children)
				this.moveNoteInFolder(item.children, newFolder);
		}
	}

	// Move notes wrapper
	static moveNoteWrapper() {
		$("#popup_folder select option:not(:selected)").prop("disabled", false);
		$("#popup_folder .popup_delete_notes_wrapper").hide();
		$("#popup_folder").fadeOut(500);
		$("#popup_folder form")[0].reset();
	}

	// Delete notes in folder and subfolders
	static deleteNotesInFolder(obj: any) {
		for (let key in obj) {
			let item = obj[key];
			for (let i = 0; i < data.notes.length; i++) {
				if ( data.notes[i].folder == item.id ) {
					let index: number = data.notes.indexOf(data.notes[i]);
					data.notes.splice(index, 1);
					i--;
					localStorage.setItem("structure", JSON.stringify(data));
				}
			}
			if (item.children)
				this.deleteNotesInFolder(item.children);
		}
	}

	// Wrapper for note functions call
	static noteWrapper() { 
		Note.renderNoteFields();
		Tag.checkNoteForAddTag();
		Tag.renderTags();
		Note.renderNoteSize();
	}

	// Wrapper for click on save or delete button
	static returnEdit() {
		$(".edit").css("display", "inline-block");
		$(".delete_note").css("display", "none");
		$(".save_note").css("display", "none");
		$("#application textarea").prop("readonly", true);
	}
}