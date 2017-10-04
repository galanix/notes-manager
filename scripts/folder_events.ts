import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";
import { updateFoldersData } from "./main"

export class FolderEvents { 
	
	static folderEvents() {
		// Open create folder popup
		$(".btn_folders").on("click", function() {
			$("#popup_folder").fadeIn(500);
			$(document).keydown(function(e: any) {
				if (e.keyCode == 27) {
					Folder.resetOnCloseWrapper();
				}
			});

			$(".popup_close").on("click", function() {
				Folder.resetOnCloseWrapper();
			});
		});

		// Create folder render data in folder select and sidebar
		$("#popup_folder .create_folder").on("click", function() {
			if ( $("#folder_name").val() ) {
				updateFoldersData();
				Folder.folderWrapper();
			}

			Folder.resetOnCloseWrapper();
		});

		// Delete folder and render data in select and sidebar. Ask to delte or move notes to another folder.
		$("#popup_folder .delete_folder").on("click", function() {
			let selectedOptionId: any = $("#popup_folder select option:selected").attr("data-folders-select-id");
			let selectedFolder = $(`span[data-folders-tree-id="${selectedOptionId}"]`);
			if ( $("#popup_folder select").val() && selectedOptionId != "root" ) {
				$("#popup_folder .main_form option:not(:selected)").prop("disabled", true);
				let findedFolder: any = find(data.folders, selectedOptionId);
				let findedFolderParent: any = findParent(data.folders, selectedOptionId);
				Note.checkNotesInFolders(findedFolder);

				// checkNotesInFolders if find notes SHOW popup_delete_notes_wrapper content
				if ( $("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "block" ) { 
					$("#popup_folder").on("click", function(e: any) {
						let target = e.target;
						let $target = $(target);
						// If user want to delete notes
						if ( $target.hasClass("delete_notes_yes") ) {
							Note.deleteNotesInFolder(findedFolderParent);
							Folder.deleteFolders();
							Folder.folderWrapper();
							Note.renderLatestNote();
							Tag.checkNoteForAddTag();
							Note.moveNoteWrapper();
						}

						if ( selectedFolder.siblings().length > 1 || 
							selectedFolder.parent().not(selectedFolder.parent(`span[data-folders-tree-id="root"]`)).length > 1 ) { 
							// If user doesn't want to delete notes
						if ( $target.hasClass('delete_notes_no') ) {
							$(".notes_in_folder").find("option").not(".select_root").remove();
							Folder.renderNotDeletedFolderSelect(data.folders, 0);

							$("#popup_folder .main_form").hide();
							$("#popup_folder .select_folder").show();
							// New select whithout folders that will be deleted
							if ( $("#popup_folder .select_folder select").val() && selectedOptionId != "root" ) { 
								$("#popup_folder .note_to_folder").on("click", function(e: any) {
									let selectFolderSelected: any = 
									$("#popup_folder .select_folder select option:selected").attr("data-folders-select-id");
									let newFolder = find(data.folders, selectFolderSelected);
									Note.moveNoteInFolder(findedFolderParent, newFolder);
									Folder.deleteFolders();
									Folder.folderWrapper();
									Note.moveNoteWrapper();

									$("#popup_folder .popup_delete_notes_wrapper").hide();
									$("#popup_folder .main_form").show();
									$("#popup_folder .select_folder").hide();
								}); 
							}
						}
					}
				});
				} else {
					Folder.deleteFolders();
					Folder.folderWrapper();
				}
			}
		});

		// Toggle folders to open and close in tree format
		$(".folders").on("dblclick", function(e: any) {
			let target: any = e.target;
			let $target = $(target);
			// Toggle folders to open and close by clicking on folder name
			if ( $target.hasClass("folder_name") && $target.siblings("ul").children().length ) {
				let childUl: any = $target.siblings("ul");
				let $childUl: any = $(childUl);
				childUl.toggle();
				Note.renderNoteSize();
				let findedObj: any = find(data.folders, $target.attr("data-folders-tree-id"));
				let span = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
				// Change folder open or close icon and display property to render folders tree  with open or close folders
				if (findedObj.display === "block" && span.next("ul").children().length) {
					findedObj.display = "none";
					localStorage.setItem("structure", JSON.stringify(data));
					$target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
				} else {
					findedObj.display = "block";
					localStorage.setItem("structure", JSON.stringify(data));
					$target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
				}
			}
			// Toggle folders to open and close by clicking on folder icons(arrow, fodler)
			if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
				let parentUl: any = $target.parent().siblings("ul");
				let $parentUl: any = $(parentUl);
				parentUl.toggle();
				Note.renderNoteSize();
				let findedObj: any = find(data.folders, $target.parent().attr("data-folders-tree-id"));
				let span: any = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
				// Change folder open or close icon and display property to render folders tree  with open or close folders
				if (findedObj.display === "block" && span.next("ul").children().length) {
					findedObj.display = "none";
					localStorage.setItem("structure", JSON.stringify(data));
					if ( $target.hasClass("fa-folder-o") ) 
						$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
					else 
						$target.removeClass("fa-angle-down").addClass("fa-angle-right");
				} else {
					findedObj.display = "block";
					localStorage.setItem("structure", JSON.stringify(data));
					if ( $target.hasClass("fa-folder-o") ) 
						$target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
					else
						$target.removeClass("fa-angle-right").addClass("fa-angle-down");
				}
			}
		});
	}
}


