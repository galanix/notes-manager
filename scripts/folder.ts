import { Note } from "./note"; 

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";

export class Folder {

	id: number;
	name: string;
	display: string;
	children: any;

	constructor(theID: any, theName: string) {
		this.id = theID;
		this.name = theName;
		this.display = "block";
		this.children = [];
	}

	// Render folder select list 
	static renderFolderSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: number = item.id;

			if ( item.children ) {
				let dashes: string = "";
				for (let i = 0; i < counter - 1; i++) {
					dashes += "-";
				}
				$(".folders_tree").append(`
					<option data-folders-select-id="${id}" value="${name}">${dashes} ${name}</option>
					`);
				dashes = "";
				this.renderFolderSelect(item.children, counter + 1);
			} 
		}
	}

	// Render folder select without folders selected to delete list 
	static renderNotDeletedFolderSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: number = item.id;

			if ( item.children ) {
				let dashes: string = "";
				for (let i = 0; i < counter - 1; i++) {
					dashes += "-";
				}
				if ( !item.notRenderInSelect ) { 
					$(".not_deleted_folders").append(`
						<option data-folders-select-id="${id}" value="${name}">${dashes} ${name}</option>
						`);
					dashes = "";
				}
				this.renderNotDeletedFolderSelect(item.children, counter + 1);
			} 
		}
	}

	// Takes a folders array and turns it into a <ul>
	static parseFolders(folders: any) { 
		let ul: any = $("<ul>");
		for(var i = 0; i < folders.length; i++) {
			ul.append(this.parseFolder(folders[i]));
		}
		return ul;
	}

	// Takes a folder object and turns it into a <li>
	static parseFolder(folder: any) { 
		let li: any = $("<li>");
		li.append(`<span data-folders-tree-id="${folder.id}" class="folder_name">
			<i class="fa folder" aria-hidden="true"></i> <i class="fa fa-folder-o" aria-hidden="true"></i> 
			${folder.name}</span>`);
		if(folder.children) li.append(this.parseFolders(folder.children));
		return li;
	}

	// Render folders tree  with open or close folders
	static renderFoldersDisplay<T>(folders: T[]) { 
		for (let key in folders) {
			let item: any = folders[key];
			let display: string = item.display;
			let id: number = item.id;
			let foldersSpan: any = $(`.folders span[data-folders-tree-id="${id}"]`);
			let folderI: any = $(`.folders span[data-folders-tree-id="${id}"] .folder`);
			if (display === "block") {
				foldersSpan.siblings("ul").css("display", "block");
			} else {
				foldersSpan.siblings("ul").css("display", "none");
			}
			if (display === "block" && foldersSpan.next("ul").children().length) {
				folderI.removeClass("fa-angle-right").addClass("fa-angle-down");
			} else {
				folderI.removeClass("fa-angle-down").addClass("fa-angle-right");
			}
			if (!foldersSpan.next("ul").children().length) {
				folderI.remove();
			}
			if (item.children) {
				this.renderFoldersDisplay(item.children);
			}
		}
	}

	// Delete folders
	static deleteFolders() {
		let selectedOptionId: any = $("#popup_folder .main_form select option:selected").attr("data-folders-select-id");
		let findedArr: any = findParent(data.folders, selectedOptionId);
		for (let i = 0; i < findedArr.length; i++) {
			if ( findedArr[i].id == selectedOptionId ) {
				let index: number = findedArr.indexOf(findedArr[i]);
				findedArr.splice(index, 1);
				localStorage.setItem("structure", JSON.stringify(data));
			}
		}
	}

	// Wrapper for folder functions call
	static folderWrapper() {
		$(".folders_tree").find("option").not(".select_root").remove();
		Folder.renderFolderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(Folder.parseFolders(data.folders));
		Note.renderNotes(data.notes);
		Folder.renderFoldersDisplay(data.folders);
		Note.renderNoteFields();
		Note.renderNoteSize();
	}

	// Wrapper for reset actions on popup close
	static resetOnCloseWrapper() {
		$("#popup_folder").fadeOut(500);
		$("#popup_folder form")[0].reset();
		$("#popup_folder .popup_delete_notes_wrapper").hide();
		$("#popup_folder .main_form option:not(:selected)").prop("disabled", false);
	}
}


