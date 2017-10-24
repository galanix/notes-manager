import { Component, OnInit } from '@angular/core';

import { 
	GeneralService, FolderService,
	TagService, NoteService
} from './index';

import * as $ from 'jquery';

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
	}

	// Delete folder and render data in select and sidebar. Ask to delte or move notes to another folder
	deleteFolder(): void {
		let selectedOptionId: any = $("#popup_folder select option:selected").attr("data-folders-select-id");
		let selectedFolder = $(`span[data-folders-tree-id="${selectedOptionId}"]`);
		if ( $("#popup_folder select").val() && selectedOptionId != "root" ) {
			$("#popup_folder .main_form option:not(:selected)").prop("disabled", true);
			let findedFolder: any = GeneralService.find(GeneralService.data.folders, selectedOptionId);
			let findedFolderParent: any = GeneralService.findParent(GeneralService.data.folders, selectedOptionId);
			NoteService.checkNotesInFolders(findedFolder);

			// checkNotesInFolders if find notes SHOW popup_delete_notes_wrapper content
			if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "block" ) { 
				$("#popup_folder").on("click", function(e: any) {
					let target = e.target;
					let $target = $(target);
					// If user want to delete notes
					if ( $target.hasClass("delete_notes_yes") ) {
						NoteService.deleteNotesInFolder(findedFolder);
						FolderService.deleteFolders();
						FolderService.folderWrapper();
						NoteService.renderNoteFields();
						NoteService.renderLatestNote();
						TagService.checkNoteForAddTag();
						NoteService.moveNoteWrapper();
					}

					if ( selectedFolder.siblings().length >= 1 || 
						selectedFolder.parent().not(selectedFolder.parent(`span[data-folders-tree-id="root"]`)).length >= 1 ) { 
						// If user doesn't want to delete notes
					if ( $target.hasClass('delete_notes_no') ) {
						$(".notes_in_folder").find("option").not(".select_root").remove();
						FolderService.renderNotDeletedFolderSelect(GeneralService.data.folders, 0);

						$("#popup_folder .main_form").hide();
						$("#popup_folder .select_folder").show();
						// New select whithout folders that will be deleted
						if ( $("#popup_folder .select_folder select").val() && selectedOptionId != "root" ) { 
							$("#popup_folder .note_to_folder").on("click", function(e: any) {
								let selectFolderSelected: any = 
								$("#popup_folder .select_folder select option:selected").attr("data-folders-select-id");
								let newFolder = GeneralService.find(GeneralService.data.folders, selectFolderSelected);
								NoteService.moveNoteInFolder(findedFolder, newFolder);
								FolderService.deleteFolders();
								FolderService.folderWrapper();
								NoteService.moveNoteWrapper();

								$("#popup_folder .popup_delete_notes_wrapper").hide();
								$("#popup_folder .main_form").show();
								$("#popup_folder .select_folder").hide();
							}); 
						}
					}
				}
			});
			} else {
				FolderService.deleteFolders();
				FolderService.folderWrapper();
			}
		}
	}

}
