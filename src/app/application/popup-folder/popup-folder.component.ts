import { Component, OnInit } from '@angular/core';

import {
	Data, 

	GeneralService, FolderService,
	TagService, NoteService
} from './index';

declare var $: any;
// import * as $ from 'jquery';

@Component({
	selector: 'app-popup-folder',
	templateUrl: './popup-folder.component.html',
	styleUrls: ['./popup-folder.component.css']
})
export class PopupFolderComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
		this.closeOnEsc();
	}

	// Create folder render data in folder select and sidebar
	createFolder(): void {
		if ( $("#folder_name").val() ) {
			this.folderService.updateFoldersData();
			this.folderWrapper();
		}
		this.resetOnCloseWrapper();
		FolderService.delRootNoteWrappersFolders();
	}

	// Delete folder and render data in select and sidebar. Ask to delte or move notes to another folder
	deleteFolder(): void  {
		let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
		if ( $("#popup_folder #folder_select").val() && selectedOptionId != "root" ) {
			$("#popup_folder .main_form option:not(:selected)").prop("disabled", true);
			let findedFolder: any = GeneralService.find(Data.structure.folders, selectedOptionId);
			// checkNotesInFolders if find notes SHOW popup_delete_notes_wrapper content
			NoteService.checkNotesInFolders(findedFolder);
			if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" ) {
				FolderService.deleteFolders();
				this.folderWrapper();
			}
		}
	}

	deleteNotesYes(): void {
		let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
		let findedFolder: any = GeneralService.find(Data.structure.folders, selectedOptionId);
		NoteService.deleteNotesInFolder(findedFolder);
		FolderService.deleteFolders();
		this.folderWrapper();
		NoteService.renderLatestNote();
		NoteService.renderNoteFields();
		TagService.checkNoteForAddTag();
		NoteService.moveNoteWrapper();
	}

	deleteNotesNo(): void {
		$("#add_note_select").find("option").remove();
		FolderService.renderNotDeletedFolderSelect(Data.structure.folders, 0);

		$("#popup_folder .main_form").hide();
		$("#popup_folder .select_folder").show();
	}

	moveNotes(): void {
		let notDeletedFolderSelect: any = $(".not_deleted_folders option:selected").attr("data-folders-select-id");
		if (  notDeletedFolderSelect != "root" ) {
			let selectFolderSelected: any = 
			$("#popup_folder #add_note_select option:selected").attr("data-folders-select-id");
			let newFolder = GeneralService.find(Data.structure.folders, selectFolderSelected);
			let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
			let findedFolder: any = GeneralService.find(Data.structure.folders, selectedOptionId);
			NoteService.moveNoteInFolder(findedFolder, newFolder);	
			FolderService.deleteFolders();
			this.folderWrapper();
			NoteService.moveNoteWrapper();
			$("#popup_folder .popup_delete_notes_wrapper").hide();
			$("#popup_folder .main_form").show();
			$("#popup_folder .select_folder").hide();
		}
	}

	// Wrapper for reset actions on popup close
	 resetOnCloseWrapper() {
		FolderService.sortableFolders();
		NoteService.dragNotesFolders();
		NoteService.dropNotesFolders();
		
		$("#popup_folder").fadeOut(500);
		$("#popup_folder #folder_name").val(null);
		$("#popup_folder .popup_delete_notes_wrapper").hide();
		$("#popup_folder .main_form option:not(:selected)").prop("disabled", false);
	}

		// Wrapper for folder functions call
	 folderWrapper() {
		$(".folders_tree").find("option").not(".select_root").remove();
		FolderService.renderFolderSelect(Data.structure.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(FolderService.parseFolders(Data.structure.folders));
		GeneralService.addSortableClass();
		NoteService.renderNotes(Data.structure.notes);
		FolderService.renderFoldersDisplay(Data.structure.folders);
		NoteService.renderNoteFields();
		NoteService.renderNoteSize();
	}

	// Close window on esc
	closeOnEsc(): void {
		$(document).keydown( (e: any) => {
			if (e.keyCode == 27) {
				this.resetOnCloseWrapper();
			}
		});
	}

}

