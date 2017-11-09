import { Injectable } from '@angular/core';

import { Folder } from '../data/folder';
import { Tag } from '../data/tag';
import { Note } from '../data/note';

import { FolderService } from './folder.service'
import { NoteService } from './note.service'

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
		let sortableUl = $(".folders").find(".folder_content")[1];
		let $sortableUl = $(sortableUl);
		$sortableUl.addClass("sortable");
	}
	
	static resizeSidebar(): void {
		$("#application .sidebar_wrapper").resizable({
			handles: 'e, w',
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
		newNote.date = new Date().toLocaleString("ua");
		newNote.changesCounter = 0;
		newNote.lastChange = new Date().toLocaleString("ua");
		newNote.tags = [];
		
		GeneralService.data.notes.push(newNote);
		localStorage.setItem("structure", JSON.stringify(GeneralService.data));
		localStorage.setItem("idNoteCounter", this.idNoteCounter);
		localStorage.setItem("noteDate", noteDate);
		this.idNoteCounter++;
	}

}

// ********************************* Deprecated ****************************************

