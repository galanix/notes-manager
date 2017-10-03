import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { FolderEvents } from "./folder_events";
import { TagEvents } from "./tag_events";
import { NoteEvents } from "./note_events";
import { GeneralEvents } from "./general_events"

import { data } from "./data"

// ***************************************************************************

// localStorage.clear();

let idFolderCounter: any = (localStorage.getItem("idFolderCounter")) 
? localStorage.getItem("idFolderCounter") : 0;

let idTagCounter: any = (localStorage.getItem("idTagCounter")) 
? localStorage.getItem("idTagCounter") : 0;

let idNoteCounter: any = (localStorage.getItem("idNoteCounter")) 
? localStorage.getItem("idNoteCounter") : 0;

// Find and return nested object 
export function find(source: any, id: number): any {
	for (let key in source) {
		let item: any = source[key];
		if (item.id == id)
			return item;
		// Item not returned yet. Search its children by recursive call.
		if (item.children) {
			let subresult: any = find(item.children, id);
			// If the item was found in the subchildren, return it.
			if (subresult)
				return subresult;
		}
	}
	// Nothing found yet? return null.
	return null;
}

// Find and return nested obj parent(arr)
export function findParent<T>(arr: T[], id: number): T[] {
	for (let i = 0; i < arr.length; i++) {
		let item: any = arr[i];
		let children: T[] = item.children;
		for (let j = 0; j < children.length; j++) {
			let child: any = item.children[j];
			let childID: number = child.id;

			if (childID == id) return children;

			if (item.children) {
				let subresult: any = findParent(item.children, id);
				if (subresult) return subresult;
			}
		}
	}
	return null;
}

// Add new folder to localStorage and iterate idFolderCounter
export function updateFoldersData() {
	let folderName: string =  $("#folder_name").val();
	let findedObj: any;
	let newFolder: any = new Folder(idFolderCounter, folderName);

	findedObj =	find(data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
	findedObj.children.push(newFolder);

	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idFolderCounter", idFolderCounter);
	idFolderCounter++;
}

// Add new tag to localStorage and iterate idTagCounter
export function updateTagsData() {
	let tagName: string;
	if ( $("#popup_tag").css("display").toLowerCase() == "block" )
		tagName =  $("#tag_name").val();
	if ( $("#popup_note_tag").css("display").toLowerCase() == "block" )
		tagName =  $("#tag_note_name").val();
	let findedObj: any;

	let newTag: any = new Tag(idTagCounter, tagName);

	findedObj =	find(data.tags, $(".tags_tree option:selected").attr("data-tags-select-id"));
	findedObj.children.push(newTag);

	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idTagCounter", idTagCounter);
	idTagCounter++;
}

// Add new note to localStorage and iterate idNoteCounter
export function updateNotesData() {
	let noteTitle: any = $("#note_name").val();
	let noteText: any = $("#popup_note textarea").val();
	let folderID: any =	$("#popup_note select option:selected").attr("data-folders-select-id");
	let noteDate: any = new Date();

	let newNote = new Note(idNoteCounter, folderID, noteTitle, noteText);

	data.notes.push(newNote);
	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idNoteCounter", idNoteCounter);
	localStorage.setItem("noteDate", noteDate);
	idNoteCounter++;
}

// ******************************* CALL FUNCTIONS **************************************

Folder.renderFolderSelect(data.folders, 0);
Tag.renderTagSelect(data.tags, 0);
idFolderCounter++;
idTagCounter++;
idNoteCounter++;
$(".folders").append(Folder.parseFolders(data.folders));
$(".tags").append(Tag.parseTags(data.tags));
Note.renderNotes(data.notes);
Folder.renderFoldersDisplay(data.folders);
Tag.renderTagsDisplay(data.tags);
Note.renderNoteFields();
Note.renderLatestNote();
Tag.paddingCheck();
Tag.checkNoteForAddTag();
Tag.renderTags();

// ******************************* CALL FUNCTIONS end ***********************************

// ************************************* CALL EVENTS  ************************************

GeneralEvents.generalEvents();
FolderEvents.folderEvents();
TagEvents.tagEvents();
NoteEvents.noteEvents();

// ************************************* CALL EVENTS end ************************************


	// // Check if folder or subfolders has notes
	// static checkNotesInFolders(obj: any) {
	// 	for(let key in obj) {
	// 		let item = obj[key];
	// 		item.notRenderInSelect = true;
	// 		localStorage.setItem("structure", JSON.stringify(data));
	// 		for (let i = 0; i < data.notes.length; i++) {
	// 			if ( data.notes[i].folder == item.id ) {
	// 				if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" )
	// 				$("#popup_folder .popup_delete_notes_wrapper").show();
	// 			}
	// 		}
	// 		if (item.children)
	// 			this.checkNotesInFolders(item.children);
	// 	}
	// }