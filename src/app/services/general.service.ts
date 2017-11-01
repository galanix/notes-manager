import { Injectable } from '@angular/core';

import { Folder } from '../data/folder';
import { Tag } from '../data/tag';
import { Note } from '../data/note';

import { FolderService } from './folder.service'

declare var $: any;
// import * as $ from 'jquery';

@Injectable()
export class GeneralService {

	constructor() { }

	static data: any = (localStorage.getItem("structure")) 
	? JSON.parse(localStorage.getItem("structure")) : {
		"folders": [{
			"id": "root",
			"name": "Folders",
			"display": "block",
			"children": []
		}],
		"notes": [],
		"tags": [{
			"id": "root",
			"name": "Tags",
			"display": "block",
			"children": []
		}]
	}

	static idFolderCounter: any = (localStorage.getItem("idFolderCounter")) 
	? localStorage.getItem("idFolderCounter") : 0;

	static idTagCounter: any = (localStorage.getItem("idTagCounter")) 
	? localStorage.getItem("idTagCounter") : 0;

	static idNoteCounter: any = (localStorage.getItem("idNoteCounter")) 
	? localStorage.getItem("idNoteCounter") : 0;


	static addSortableClass(): void {
		// $(".folders").children(".folder_content").children().children().children("ul").addClass("sortable");
		// $(".folders > .folder_content").addClass("sortable");
		let sortableUl = $(".folders").find(".folder_content")[1];
		let $sortableUl = $(sortableUl);
		$sortableUl.addClass("sortable");
	}
	
	static resizeSidebar(): void {
		$("#application .sidebar_wrapper").resizable({
			handles: 'e, w',
		});
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

	static sortableFolders(): void {
		$(".sortable").sortable({
			onDrop: function ($item, container, _super) {
				container.el.removeClass("active");
				_super($item, container);
				let draggedFolderId: number = $item.children("span").attr("data-folders-tree-id");
				let draggedFolderObj: any = GeneralService.find(GeneralService.data.folders, draggedFolderId);
				let draggedFolderArr: any = GeneralService.findParent(GeneralService.data.folders, draggedFolderId);
				let indexDraggedFolder: number = draggedFolderArr.indexOf(draggedFolderObj);
				
				let newFolderParent: any = $item.parent().siblings("span");
				let targetFolder: any = GeneralService.find(GeneralService.data.folders, newFolderParent.attr("data-folders-tree-id"));
				let splicedFolderObj: any = draggedFolderArr.splice(indexDraggedFolder, 1);
				
				let nextFolderId: any = $item.next().children("span").attr("data-folders-tree-id");
				let nextFolderObj: any = GeneralService.find(GeneralService.data.folders, nextFolderId);
				let indexNextFolder: any = targetFolder.children.indexOf(nextFolderObj);

				if ( nextFolderId != -1 )
					targetFolder.children.splice(indexNextFolder, 0, splicedFolderObj[0]);
				else
					targetFolder.children.push(splicedFolderObj[0]);

				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
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

	// Add new folder to localStorage and iterate idFolderCounter
	static updateFoldersData() {
		let folderName: any =  $("#folder_name").val();
		let findedObj: any;
		let newFolder: Folder = new Folder();

		newFolder.id = this.idFolderCounter;
		newFolder.name = folderName;
		newFolder.display = "block";
		newFolder.children = [];

		findedObj =	GeneralService.find(GeneralService.data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
		findedObj.children.push(newFolder);

		localStorage.setItem("structure", JSON.stringify(GeneralService.data));
		localStorage.setItem("idFolderCounter", this.idFolderCounter);
		this.idFolderCounter++;
	}

	// Add new tag to localStorage and iterate idTagCounter
	static updateTagsData() {
		let tagName: any;
		if ( $("#popup_tag").css("display").toLowerCase() == "block" )
			tagName =  $("#tag_name").val();
		if ( $("#popup_note_tag").css("display").toLowerCase() == "block" )
			tagName =  $("#tag_note_name").val();
		let findedObj: any;

		let newTag: any = new Tag();

		newTag.id = this.idTagCounter;
		newTag.name = tagName;
		newTag.display = "block";
		newTag.children = [];

		findedObj =	GeneralService.find(GeneralService.data.tags, $(".tags_tree option:selected").attr("data-tags-select-id"));
		findedObj.children.push(newTag);

		localStorage.setItem("structure", JSON.stringify(GeneralService.data));
		localStorage.setItem("idTagCounter", this.idTagCounter);
		this.idTagCounter++;
	}

	// Add new note to localStorage and iterate idNoteCounter
	static updateNotesData() {
		let noteTitle: any = $("#note_name").val();
		let noteText: any = $("#popup_note textarea").val();
		let folderID: any =	$("#popup_note select option:selected").attr("data-folders-select-id");
		let noteDate: any = new Date();

		let newNote = new Note();

		newNote.id = this.idNoteCounter;
		if ( folderID != "root" )
			newNote.folder = folderID;
		if ( folderID == "root" ) {
			if( GeneralService.find(GeneralService.data.folders, "default") == null )
				FolderService.defaultFolder()
			newNote.folder = "default";
		}
		newNote.title = noteTitle;
		newNote.text = noteText;
		newNote.date = new Date();
		newNote.tags = [];

		GeneralService.data.notes.push(newNote);
		localStorage.setItem("structure", JSON.stringify(GeneralService.data));
		localStorage.setItem("idNoteCounter", this.idNoteCounter);
		localStorage.setItem("noteDate", noteDate);
		this.idNoteCounter++;
	}

}

// ********************************* Deprecated ****************************************

// static sortableFolders(): void {
	// 	let folderSpan = $(".folder_name");
	// 	let originHeight = $(".sortable").outerHeight();
	// 	let originWidth = $(".sortable").outerWidth();

	// 		// let test = $(".folder_content", this);

	// 	$('.sortable').nestedSortable({
		// 		handle: folderSpan,
		// 		items: 'li',
		// 		tolerance: 'pointer',
		// 		// toleranceElement: '> div',
		// 		listType: "ul",
		// 		placeholder: 'placeholder',
		// 		forcePlaceholderSize: true,
		// 		forceHelperSize: true,
		// 		stop: function( event, ui ) {
			// 			let draggedFolderId: number = ui.item.children().children("span").attr("data-folders-tree-id");
			// 			let draggedFolderObj: any = GeneralService.find(GeneralService.data.folders, draggedFolderId);
			// 			let draggedFolderParent: any = GeneralService.findParent(GeneralService.data.folders, draggedFolderId);
			// 			let index: number = draggedFolderParent.indexOf(draggedFolderObj);
			// 			let splicedFolderObj: any = draggedFolderParent.splice(index, 1);
			// 			let parent: any;

			// 			if ( ui.item.parent().hasClass("sortable") ) {
				// 				parent = ui.item.parent().siblings("span");
				// 				console.log(`ui.item.parent().siblings("span"): `, parent);
				// 				console.log(`prev span root`, $(ui.item.next().find("span")[0]));
				// 			} else {
					// 				// parent = ui.item.parent().siblings("div").children("span");
					// 				// console.log(`ui.item.parent().siblings("div").children("span"): `, parent);
					// 				parent = $(ui.item.parent().parent().find(".folder_name ")[0]);
					// 				console.log(`ui.item.parent().parent().find(".folder_name ")[0] :`, parent);
					// 				console.log("prev span", $(ui.item.next()));
					// 			}

					// 			let targetFolder: any = GeneralService.find(GeneralService.data.folders, parent.attr("data-folders-tree-id"));
					// 			console.log("targetFolder.children: ", targetFolder.children);
					// 			targetFolder.children.push(splicedFolderObj[0]);
					// 			localStorage.setItem("structure", JSON.stringify(GeneralService.data));

					// 		},
					// 		// over: function( event, ui ) {
						// 		// 	console.log("over this", $(this) );
						// 		// 	$(".sortable").css("height", (index) => {
							// 		// 		index = $(".sortable").outerHeight();
							// 		// 		let elemHeight = ui.item.outerHeight();
							// 		// 		return index + elemHeight;
							// 		// 	});
							// 		// 	$(".sortable").css("width", (index) => {
								// 		// 		index = $(".sortable").outerWidth();
								// 		// 		let elemHeight = ui.item.outerWidth();
								// 		// 		return index + elemHeight;
								// 		// 	});
								// 		// },
								// 		// out: function( event, ui ) {
									// 		// 	$(".sortable").css("height", (index) => {
										// 		// 		index = originHeight + 20;
										// 		// 		return index;
										// 		// 	});
										// 		// 	$(".sortable").css("width", (index) => {
											// 		// 		index = originWidth;
											// 		// 		return index;
											// 		// 	});
											// 		// },
											// 	});
	// }