import { Injectable, Input, Output } from '@angular/core';

import { GeneralService } from './general.service';
import { TagService } from './tag.service';

declare var $: any;
// import * as $ from 'jquery';

@Injectable()
export class NoteService {

	constructor() { }

	// Set textarea(note) height equal to sidebar height
	static renderNoteSize(filler: number) {
		let sidebarHeight: number = $("#sidebar").outerHeight();
		let noteTitleHeight: number = $("#note .note_title").outerHeight();
		let noteInfo: number = $("#note .note_info").outerHeight();
		let editorTop: number = $("#note .cke_top").outerHeight();
		let editorBottom: number = $("#note .cke_bottom").outerHeight();
		let sumEditor: number = noteTitleHeight + noteInfo + editorBottom + editorTop + filler;
		let sumTextarea: number = noteTitleHeight + noteInfo;
		let resEditor: number = sidebarHeight - sumEditor;
		let resTextarea: number = sidebarHeight - sumTextarea;
		$("#note #textarea_editor").css("height", resTextarea);
		$("#note .cke_contents").css("height", resEditor);
	}

	// Math max to array
	static getMaxOfArray<T>(numArray: T[]): T {
		return Math.max.apply(null, numArray);
	}

	// Find last(date) note and return it as object from data
	static findLatestNote<T>(): any {
		let dataArr: T[] = [];
		let maxNote: any;
		for(let i = 0; i < GeneralService.data.notes.length; i++) {
			let item: any = GeneralService.data.notes[i];
			let parseDate: any = Date.parse(item.date);
			dataArr.push(parseDate);
		}
		let max: any = this.getMaxOfArray(dataArr);
		for(let i = 0; i < GeneralService.data.notes.length; i++) {
			let item: any = GeneralService.data.notes[i];
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
		let textArea: any = $("#textarea_editor");
		let editor: any = $(".note_editor");
		let editorContent: any = $(".cke_wysiwyg_frame").contents().find('body');

		if (latestNote) {
			noteTitle.html(latestNote.title);
			let latestNoteFolder = GeneralService.find(GeneralService.data.folders, latestNote.folder);
			notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${latestNoteFolder.name}`);

			$(".creation_date").html(`Creation date: ${latestNote.date}`);
			$(".note_changes").html(`Changes: ${latestNote.changesCounter}`);
			$(".last_change").html(`Last change: ${latestNote.lastChange}`);

			textArea.html(latestNote.text);
			textArea.attr("data-textarea-id", latestNote.id);
			editor.attr("data-editor-id", latestNote.id);
			editorContent.html(latestNote.text);
		} else {
			noteTitle.html(null);
			notesFolder.html(null);
			noteTags.html(null);
			textArea.html(null);
			editor.val(null);
		}
	}

	// Render note fields(title, tags..) and render last(date) note on load
	static renderNoteFields() {
		let noteTitle: any = $("#note .note_title");
		let noteTags: any = $("#note .notes_tags");
		let notesFolder: any = $("#note .notes_folder");
		let textArea: any = $("#application #textarea_editor");
		let editor: any = $("#application .note_editor");
		let editorContent: any = $(".cke_wysiwyg_frame").contents().find('body');

		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			let item: any = GeneralService.data.notes[i];
			if ( item.id == editor.attr("data-editor-id") ) {
				noteTitle.html(item.title);
				editorContent.html(item.text);
				textArea.html(item.text);
				let folder = GeneralService.find(GeneralService.data.folders, item.folder);
				notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${folder.name}`);
			}
		}
		if ( GeneralService.data.notes.length <= 0 ) {
			noteTitle.html(null);
			notesFolder.html(null);
			noteTags.html(null);
			textArea.html(null);
			editor.val(null);
		}
	}

	// Render notes in sidebar tree
	static renderNotes(folders: any) {
		$("#sidebar").find(".note").remove();
		for (let i = 0; i < folders.length; i++) {
			let item: any = folders[i];
			let id: any = item.id;
			let folderID: any = item.folder;
			let foldersSpan: any = $(`.folders span[data-folders-tree-id="${folderID}"]`);
			let folderUl: any = foldersSpan.next("ul").children(".notes_wrapper");
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
		localStorage.setItem("structure", JSON.stringify(GeneralService.data));
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].folder == obj.id ) {
				if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" )
					$("#popup_folder .popup_delete_notes_wrapper").show();
			}
		}
		if (obj.children) { 
			let checkNotesInFoldersAgain = (arr: any) => {
				for(let key in arr) {
					let item = arr[key];
					item.notRenderInSelect = true;
					localStorage.setItem("structure", JSON.stringify(GeneralService.data));
					for (let i = 0; i < GeneralService.data.notes.length; i++) {
						if ( GeneralService.data.notes[i].folder == item.id ) {
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

	// Move notes wrapper
	static moveNoteWrapper() {
		$("#popup_folder select option:not(:selected)").prop("disabled", false);
		$("#popup_folder .popup_delete_notes_wrapper").hide();
		$("#popup_folder").fadeOut(500);
		$("#popup_folder form").val(null);
	}

	// Move notes to another folder
	static moveNoteInFolder = (oldFolder: any, newFolder: any) => { 
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].folder == oldFolder.id ) {
				GeneralService.data.notes[i].folder = newFolder.id;
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
		}
		if ( oldFolder.children ) { 
			let moveNoteInFolderAgain = (oldFolder: any, newFolder: any) => {
				for(let key in oldFolder) {
					let item = oldFolder[key];
					for (let i = 0; i < GeneralService.data.notes.length; i++) {
						if ( GeneralService.data.notes[i].folder == item.id ) {
							GeneralService.data.notes[i].folder = newFolder.id;
							localStorage.setItem("structure", JSON.stringify(GeneralService.data));
						}
					}
					if (item.children)
						moveNoteInFolderAgain(item.children, newFolder);
				}
			}
			moveNoteInFolderAgain(oldFolder.children, newFolder);
		}
	}

	// Delete notes in folder and subfolders
	static deleteNotesInFolder = (obj: any) => {
		for (let i = 0; i < GeneralService.data.notes.length; i++) {
			if ( GeneralService.data.notes[i].folder == obj.id ) {
				let index: number = GeneralService.data.notes.indexOf(GeneralService.data.notes[i]);
				GeneralService.data.notes.splice(index, 1);
				i--;
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
		}
		if (obj.children) { 
			let deleteNotesInFolderAgain = (arr: any) => {
				for (let key in arr) {
					let item = arr[key];
					for (let i = 0; i < GeneralService.data.notes.length; i++) {
						if ( GeneralService.data.notes[i].folder == item.id ) {
							let index: number = GeneralService.data.notes.indexOf(GeneralService.data.notes[i]);
							GeneralService.data.notes.splice(index, 1);
							i--;
							localStorage.setItem("structure", JSON.stringify(GeneralService.data));
						}
					}
					if (item.children)
						deleteNotesInFolderAgain(item.children);
				}
			}
			deleteNotesInFolderAgain(obj.children);
		}
	}

	// Wrapper for note functions call
	static noteWrapper() { 
		this.renderNoteFields();
		TagService.checkNoteForAddTag();
		TagService.renderTags();
		this.renderNoteSize(-10);
		GeneralService.dragNotesFolders();
		GeneralService.dropNotesFolders();
		GeneralService.sortableFolders();
	}

	// Wrapper for click on save or delete button
	static returnEdit() {
		$(".edit").css("display", "inline-block");
		$(".delete_note").css("display", "none");
		$(".save_note").css("display", "none");
		$("#textarea_editor").show();
		$(".note_editor").hide();
	}

}
