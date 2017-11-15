import { Injectable, Input, Output } from '@angular/core';

import { GeneralService } from './general.service';
import { FolderService } from './folder.service';
import { TagService } from './tag.service';

import * as moment from 'moment';

declare var $: any;


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
	static getMaxOfArray(numArray: any): any {
		return Math.max.apply(null, numArray);
	}

	// Find last(date) note and return it as object from data
	static findLatestNote(): any {
		let dataArr: any = [];
		let maxNote: any;
		for(let i = 0; i < GeneralService.data.notes.length; i++) {
			let item: any = GeneralService.data.notes[i];
			let parseDate: any = Date.parse(item.date);
			dataArr.push(parseDate);
		}
		let max: any = NoteService.getMaxOfArray(dataArr);
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
		let latestNote: any = NoteService.findLatestNote();
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

			$(".creation_date").html(`Creation date: ${moment(latestNote.date).format("DD.MM.YYYY, HH:mm:ss")}`);
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
		let notesUl: any = $("<ul>");
		for (let i = 0; i < folders.length; i++) {
			let item: any = folders[i];
			let id: any = item.id;
			let folderID: any = item.folder;
			let foldersLi: any = $(`.folders span[data-folders-tree-id="${folderID}"]`);
			let folderUl: any = foldersLi.next("ul").find(".notes_container");
			folderUl.append(`<li data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
				${item.title}</li>`);

			let noteTags: any = item.tags;
			for (let j = 0; j < noteTags.length; j++) {
				let tagLi: any = $(`.tags span[data-tags-tree-id="${noteTags[j]}"]`);
				let tagUl: any = tagLi.next("ul");
				tagUl.append(`<li data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
					${item.title}</li>`);
			}
		}
	}

	// Render last 10 notes in additional column
	renderLastNotesInColumn(): void {
		$(".column_notes .column_note").remove();
		$(".notes_info h2").text("Recent notes:");
		let sliced: any = GeneralService.data.notes.slice(-10);
		for (let note of sliced) {
			let cleanText: string = note.text.replace(/<\/?[^>]+(>|$)/g, "");
			let slicedText: string;
			if ( cleanText.length > 200 )
				slicedText  = cleanText.substring(0, 200) + "...";
			else
				slicedText  = cleanText.substring(0, 200);
			$(".column_notes").append(`
				<div class="column_note">
				<h3>${note.title}</h3>
				<span>${moment(note.date).format("DD.MM.YYYY, HH:mm:ss")}</span>
				<div>${slicedText}</div>
				</div>
				`);
		}
	}

	// Render notes in column by click on folder/tag
	static renderNotesInColumn(notes: any): void {
		$(".column_notes .column_note").remove();
		for (let note of notes) {
			let cleanText: string = note.text.replace(/<\/?[^>]+(>|$)/g, "");
			let slicedText: string;
			if ( cleanText.length > 200 )
				slicedText  = cleanText.substring(0, 200) + "...";
			else
				slicedText  = cleanText.substring(0, 200);
			$(".column_notes").append(`
				<div class="column_note">
				<h3>${note.title}</h3>
				<span>${moment(note.date).format("DD.MM.YYYY, HH:mm:ss")}</span>
				<div>${slicedText}</div>
				</div>
				`);
		}
	}

	// Make notes draggable and add styles to draggable note
	static dragNotesFolders(): void {
		$(".folders .note").draggable({
			containment: $(".folders"),
			helper:"clone",
			start: function(event, ui) {
				$(this).addClass("drag_el");
			},
			stop: function(event, ui) {
				$(this).removeClass("drag_el");
			}
		});
	}

	// Remove dragged note from start place and add it to goal place
	static dropNotesFolders(): void {
		$(".notes_wrapper").droppable({
			tolerance: "touch",
			accept: ".folders .note",
			// Add additional padding to make dropping notes easier
			over: function( event, ui ) {
				$(this).css("padding-bottom", (index) => {
					return index + 20;
				});
			},
			// Remove additional padding on out
			out: function( event, ui ) {
				$(this).css("padding-bottom", (index) => {
					return index;
				});
			},
			// Remove additional padding on drop
			drop:function( event, ui ) {
				ui.draggable.detach().appendTo($(this));
				$(this).css("padding-bottom", (index) => {
					return index;
				});

				let draggedNote = GeneralService.find(GeneralService.data.notes, ui.draggable.attr("data-note-id"));
				let newFolderId = $(this).parent("ul").siblings(".folder_name").attr("data-folders-tree-id");

				draggedNote.folder = newFolderId;
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				NoteService.renderNoteFields();
			},
			activate: function( event, ui ) {
				let target = $(event.target);
				let spanFolder = target.parent().siblings("span");
				let findedObj: any = GeneralService.find(GeneralService.data.folders, spanFolder.attr("data-folders-tree-id"));
				// If folder has no children or notes makes it possible to add notes to it
				if ( $(this).length <= 1 && $(this).parent().children().length <= 1 ) {
					findedObj.display = "block";
					localStorage.setItem("structure", JSON.stringify(GeneralService.data));
					spanFolder.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
				}
			}
		});
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
		GeneralService.addSortableClass();
		FolderService.sortableFolders();
		this.dragNotesFolders();
		this.dropNotesFolders();
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

// // Notes can change folder and order in folder
// static sortableNotes(): void {
	// 	$(".notes_container").sortable({
		// 		group: "notes_container",
		// 		handle: ".note",
		// 		itemSelector: ".note",
		// 		placeholder: "<li class='placeholder'></li>",
		// 		pullPlaceholder: true,
		// 		onDragStart: function ($item, container, _super, event) {
			// 			$(".notes_wrapper ul").css("padding-bottom", 5);
			// 		},
			// 		onDrop: function ($item, container, _super, event) {
				// 			container.el.removeClass("active");
				// 				_super($item, container);
				// 			$(".notes_wrapper ul").css("padding-bottom", 0);
				// 			let noteObj: any = GeneralService.find(GeneralService.data.notes, $item.attr("data-note-id"));
				// 			let newFolder: any = $item.parent().parent().parent().siblings("span");
				// 			noteObj.folder = newFolder.attr("data-folders-tree-id");
				// 			localStorage.setItem("structure", JSON.stringify(GeneralService.data)); 
				// 		}
				// 	});
				// }
