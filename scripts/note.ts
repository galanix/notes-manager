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