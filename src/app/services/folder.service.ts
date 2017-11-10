import { Injectable } from '@angular/core';

import { GeneralService } from './general.service';
import { NoteService } from './note.service';

declare var $: any;
// import * as $ from 'jquery';


@Injectable()
export class FolderService {

	constructor() { }

	// Render folder select list 
	static renderFolderSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: any = item.id;

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
		FolderService.deleteDefaultSelect();
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

	// Create default folder if user did not pick folder
	static defaultFolder(): any {
		GeneralService.data.folders.push({
			"id": "default",
			"name": "Default",
			"display": "block",
			"children": []
		});

		$(".folders_tree").find("option").remove();
		FolderService.renderFolderSelect(GeneralService.data.folders, 0);
		localStorage.setItem("structure", JSON.stringify(GeneralService.data));

	}

	// Delete default folder from folders select
	static deleteDefaultSelect():void {
		$("#folder_select").find(`option[data-folders-select-id="default"]`).remove();
	}

	// Takes a folders array and turns it into a <ul>
	static parseFolders(folders: any) { 
		let ul: any = $(`<ul class="folder_content">`);
		if ( !(ul.parent().hasClass("folders")) )
			ul.append(`<div class="notes_wrapper"><ul class="notes_container">`);
		for(var i = 0; i < folders.length; i++) {
			ul.append(this.parseFolder(folders[i]));
		}
		return ul;
	}

	// Takes a folder object and turns it into a <li>
	static parseFolder(folder: any) { 
		let li: any = $("<li class='folder_li'>");
		li.append(`<span data-folders-tree-id="${folder.id}" class="folder_name">
			<i class="fa folder" aria-hidden="true"></i> <i class="fa fa-folder-o" aria-hidden="true"></i> 
			${folder.name}</span>`);
		if(folder.children) 
			li.append(this.parseFolders(folder.children));
		return li;
	}

	// Delete root note wrappers for drag notes
	static delRootNoteWrappersFolders(): void {
		let root = $(`span[data-folders-tree-id="root"]`);
		root.siblings("ul").children(".notes_wrapper ").remove();
		root.parent().siblings(".notes_wrapper").remove();
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
			if (display === "block") {
				folderI.removeClass("fa-angle-right").addClass("fa-angle-down");
			} else {
				folderI.removeClass("fa-angle-down").addClass("fa-angle-right");
			}
			// if (!foldersSpan.next("ul").children().length) {
				// 	folderI.remove();
				// }
				if (item.children) {
					this.renderFoldersDisplay(item.children);
				}
			}
		}

		// Delete folders
		static deleteFolders() {
			let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
			let findedArr: any = GeneralService.findParent(GeneralService.data.folders, selectedOptionId);
			let root: any = GeneralService.find(GeneralService.data.folders, "root");
			if ( findedArr ) { 
				for (let i = 0; i < findedArr.length; i++) {
					if ( findedArr[i].id == selectedOptionId ) {
						let index: number = findedArr.indexOf(findedArr[i]);
						findedArr.splice(index, 1);
						localStorage.setItem("structure", JSON.stringify(GeneralService.data));
					}
				}
			} 
			else {
				GeneralService.data.folders.splice(1);
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
			}
		}

		static sortableFolders(): void {
			$(".sortable").sortable({
				handle: ".folder_name",
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
					$("#folder_select option").remove();
					FolderService.renderFolderSelect(GeneralService.data.folders, 0);
				}
			});
		}


		// Wrapper for folder functions call
		static folderWrapper() {
			$(".folders_tree").find("option").not(".select_root").remove();
			this.renderFolderSelect(GeneralService.data.folders, 0);
			$(".folders").find("*").remove();
			$(".folders").append(this.parseFolders(GeneralService.data.folders));
			GeneralService.addSortableClass();
			NoteService.renderNotes(GeneralService.data.notes);
			this.renderFoldersDisplay(GeneralService.data.folders);
			NoteService.renderNoteFields();
			NoteService.renderNoteSize(-10);
		}

		// Wrapper for reset actions on popup close
		static resetOnCloseWrapper() {
			// NoteService.dragNotesFolders();
			// NoteService.dropNotesFolders();
			FolderService.sortableFolders();
			$("#popup_folder").fadeOut(500);
			$("#popup_folder #folder_name").val(null);
			$("#popup_folder .popup_delete_notes_wrapper").hide();
			$("#popup_folder .main_form option:not(:selected)").prop("disabled", false);
		}

	}
