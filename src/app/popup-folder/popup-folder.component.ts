import { Component, OnInit } from '@angular/core';

import { 
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

	}

	// Create folder render data in folder select and sidebar
	createFolder(): void {
		if ( $("#folder_name").val() ) {
			GeneralService.updateFoldersData();
			FolderService.folderWrapper();
		}
		FolderService.resetOnCloseWrapper();
		FolderService.delRootNoteWrappersFolders();
	}

	// Delete folder and render data in select and sidebar. Ask to delte or move notes to another folder
	deleteFolder(): void  {
		let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
		if ( $("#popup_folder #folder_select").val() && selectedOptionId != "root" ) {
			$("#popup_folder .main_form option:not(:selected)").prop("disabled", true);
			let findedFolder: any = GeneralService.find(GeneralService.data.folders, selectedOptionId);
			// checkNotesInFolders if find notes SHOW popup_delete_notes_wrapper content
			NoteService.checkNotesInFolders(findedFolder);
			if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "none" ) {
				FolderService.deleteFolders();
				FolderService.folderWrapper();
			}
		}
	}

	deleteNotesYes(): void {
		let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
		let findedFolder: any = GeneralService.find(GeneralService.data.folders, selectedOptionId);
		NoteService.deleteNotesInFolder(findedFolder);
		FolderService.deleteFolders();
		FolderService.folderWrapper();
		NoteService.renderLatestNote();
		NoteService.renderNoteFields();
		TagService.checkNoteForAddTag();
		NoteService.moveNoteWrapper();
	}

	deleteNotesNo(): void {
		$("#add_note_select").find("option").remove();
		FolderService.renderNotDeletedFolderSelect(GeneralService.data.folders, 0);

		$("#popup_folder .main_form").hide();
		$("#popup_folder .select_folder").show();
	}

	moveNotes(): void {
		let notDeletedFolderSelect: any = $(".not_deleted_folders option:selected").attr("data-folders-select-id");
		if (  notDeletedFolderSelect != "root" ) {
			let selectFolderSelected: any = 
			$("#popup_folder #add_note_select option:selected").attr("data-folders-select-id");
			let newFolder = GeneralService.find(GeneralService.data.folders, selectFolderSelected);
			let selectedOptionId: any = $("#popup_folder #folder_select option:selected").attr("data-folders-select-id");
			let findedFolder: any = GeneralService.find(GeneralService.data.folders, selectedOptionId);
			NoteService.moveNoteInFolder(findedFolder, newFolder);	
			FolderService.deleteFolders();
			FolderService.folderWrapper();
			NoteService.moveNoteWrapper();
			$("#popup_folder .popup_delete_notes_wrapper").hide();
			$("#popup_folder .main_form").show();
			$("#popup_folder .select_folder").hide();
		}
	}

}

