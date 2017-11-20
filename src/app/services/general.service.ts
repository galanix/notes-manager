import { Injectable } from '@angular/core';

import { Data } from '../data/data';
import { Folder } from '../data/folder';
import { Tag } from '../data/tag';
import { Note } from '../data/note';

import { FolderService } from './folder.service'
import { NoteService } from './note.service'

declare var $: any;

@Injectable()
export class GeneralService {

	constructor() { }

	// static data: any = (localStorage.getItem("structure")) 
	// ? JSON.parse(localStorage.getItem("structure")) : {
		// 	"folders": [{
			// 		"id": "root",
			// 		"name": "Folders",
			// 		"display": "block",
			// 		"children": []
			// 	}],
			// 	"notes": [],
			// 	"tags": [{
				// 		"id": "root",
				// 		"name": "Tags",
				// 		"display": "block",
				// 		"children": []
				// 	}]
				// }

				// static idFolderCounter: any = (localStorage.getItem("idFolderCounter")) 
				// ? localStorage.getItem("idFolderCounter") : 0;

				// static idTagCounter: any = (localStorage.getItem("idTagCounter")) 
				// ? localStorage.getItem("idTagCounter") : 0;

				// static idNoteCounter: any = (localStorage.getItem("idNoteCounter")) 
				// ? localStorage.getItem("idNoteCounter") : 0;

				// markup_3cols: any = (localStorage.getItem("markup_3cols"))
				// ? localStorage.getItem("markup_3cols") : false;

				static addSortableClass(): void {
					let sortableUl = $(".folders").find(".folder_content")[1];
					let $sortableUl = $(sortableUl);
					$sortableUl.addClass("sortable");
				}

				static resizeSidebar(): void {
					$("#application .sidebar_wrapper").resizable({
						handles: 'e',
						minWidth: 150
					});
				}

				static setColumnHeight(): void {
					let dif: number = $(window).height() - $("header").outerHeight();
					$("#application .notes_info").css("height", dif);
				}

				static resize3dColumn(): void {
					$("#application .notes_info_container").resizable({
						handles: 'e',
					});
				}

				// Find and return nested object 
				static find(source: any, id: any): any {
					for (let key in source) {
						let item: any = source[key];
						if (item.id == id)
							return item;
						// Item not returned yet. Search its children by recursive call.
						if (item.children) {
							let subresult: any = this.find(item.children, id);
							// If the item was found in the subchildren, return it.
							if (subresult)
								return subresult;
						}
					}
					// Nothing found yet? return null.
					return null;
				}

				// Find and return nested obj parent(arr)
				static findParent(arr: any, id: any): any {
					for (let i = 0; i < arr.length; i++) {
						let item: any = arr[i];
						let children: any = item.children;


						for (let j = 0; j < children.length; j++) {
							let child: any = item.children[j];
							let childID: any = child.id;

							if (childID == id) return children;

							if (item.children) {
								let subresult: any = this.findParent(item.children, id);
								if (subresult) 
									return subresult;
							}
						}
					}
					return null;
				}

				// Find all notes in folder and display in 3d column
				static addNotesInFolder(folder: any, notes: any): void {
					let dataNotes: any = Data.structure.notes;
					for ( let note of dataNotes ) {
						if ( note.folder == folder.id ) {
							notes.push(note);
						}
					}
					if ( folder.children ) { 
						for ( let childFolder of folder.children ) {
							this.addNotesInFolder(childFolder, notes);
						}
					}
				}

				// Find all notes in tag and display in 3d column
				static addNotesWithTag(targetTag: any, notes: any): void {
					let dataNotes: any = Data.structure.notes;
					for ( let note of dataNotes ) {
						for ( let tag of note.tags ) {
							if ( tag == targetTag.id ) 
								notes.push(note);
						}
					}
					if ( targetTag.children ) {
						for ( let childTag of targetTag.children ) {
							this.addNotesInFolder(childTag, notes);
						}
					}
				}
				// Show user hints for buttons in header while mouse is over button for 1,5s
				static showHints(): void {
					$(".button_hint").hide();
					let timeoutId;
					let $target: any;
					$(".btn").hover(function(event) {
						$target = $(event.target); 
						if (!timeoutId) {
							timeoutId = window.setTimeout(function() {
								timeoutId = null;
								$target.find(".button_hint").slideDown();
							}, 1500);
						}
					},
					function () {
						if (timeoutId) {
							window.clearTimeout(timeoutId);
							timeoutId = null;
						}
						else {
							$target.find(".button_hint").slideUp();
						}
					});
				}

			}

			// ********************************* Deprecated ****************************************

