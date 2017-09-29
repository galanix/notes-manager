import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { data } from "./main";
import { find } from "./main";
import { findParent } from "./main";
import { updateFoldersData } from "./main"

export namespace FolderEvents { 
	// Open create folder popup
$(".btn_folders").on("click", function() {
	$("#popup_folder").fadeIn(500);
	$(document).keydown(function(e: any) {
		if (e.keyCode == 27) {
			$("#popup_folder").fadeOut(500);
			$("#popup_folder form")[0].reset();
		}
	});

	$(".popup_close").on("click", function() {
		$("#popup_folder").fadeOut(500);
		$("#popup_folder form")[0].reset();
	});
});

// Create folder render data in folder select and sidebar
$("#popup_folder .create_folder").on("click", function() {
	if ( $("#folder_name").val() ) {
		updateFoldersData();
		Folder.folderWrapper();
	}

	$("#popup_folder").fadeOut(500);
	$("#popup_folder form")[0].reset();

});

// Delete folder and render data in select and sidebar
$("#popup_folder .delete_folder").on("click", function() {
	let selectedOptionId: any = $("#popup_folder select option:selected").attr("data-folders-select-id");
	if ( $("#popup_folder select").val() && selectedOptionId != "root" ) {
		// Delete notes(for now) in folder
		for (let i = 0; i < data.notes.length; i++) {
			if ( data.notes[i].folder == selectedOptionId ) {
				let index: number = data.notes.indexOf(data.notes[i]);
				data.notes.splice(index, 1);
			}
		}
		let findedArr: any = findParent(data.folders, selectedOptionId);
		for (let i = 0; i < findedArr.length; i++) {
			if (findedArr[i].id == selectedOptionId) {
				let index: number = findedArr.indexOf(findedArr[i]);
				findedArr.splice(index, 1);
			}
		}
		localStorage.setItem("structure", JSON.stringify(data));
		Folder.folderWrapper();

	}
	$("#popup_folder form")[0].reset();
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
		// Change folder open or close icon
		if ( $childUl.css("display").toLowerCase() === "none" ) {
			$target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
		} 
		if ( $childUl.css("display").toLowerCase() === "block" ) {
			$target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
		}
		Note.renderNoteSize();
		let findedObj: any = find(data.folders, $target.attr("data-folders-tree-id"));
		let span = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
		// Change display property to render folders tree  with open or close folders
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(data));
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}
	// Toggle folders to open and close by clicking on folder icons(arrow, fodler)
	if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
		let parentUl: any = $target.parent().siblings("ul");
		let $parentUl: any = $(parentUl);
		parentUl.toggle();
		// Change folder open or close icon
		if ( $parentUl.css("display").toLowerCase() === "none" ) {
			if ( $target.hasClass("fa-folder-o") ) 
				$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
			else 
				$target.removeClass("fa-angle-down").addClass("fa-angle-right");
		} 
		if ( $parentUl.css("display").toLowerCase() === "block" ) {
			if ( $target.hasClass("fa-folder-o") ) 
				$target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
			else
				$target.removeClass("fa-angle-right").addClass("fa-angle-down");
		}
		Note.renderNoteSize();
		let findedObj: any = find(data.folders, $target.parent().attr("data-folders-tree-id"));
		let span: any = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
		// Change display property to render folders tree  with open or close folders
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(data));
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}
});
}
