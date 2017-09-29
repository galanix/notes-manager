import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { FolderEvents } from "./folder_events"

// localStorage.clear();

export let data: any = (localStorage.getItem("structure")) 
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
};

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

// *************************** WRAPPER FUNCTIONS ****************************

// Wrapper for tag functions call
function tagWrapper() {
	$(".tags").find("*").remove();
	$(".tags").append(Tag.parseTags(data.tags));
	Note.renderNotes(data.notes);
	Tag.renderTagsDisplay(data.tags);
	Note.renderNoteFields();
	Note.renderNoteSize();
}

// Wrapper for note functions call
function noteWrapper() { 
	Note.renderNoteFields();
	Tag.checkNoteForAddTag();
	Tag.renderTags();
	Note.renderNoteSize();
}

// Wrapper for click on save or delete button
function returnEdit() {
	$(".edit").css("display", "inline-block");
	$(".delete_note").css("display", "none");
	$(".save_note").css("display", "none");
	$("#application textarea").prop("readonly", true);
}

// *************************** WRAPPER FUNCTIONS end ****************************

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

// ******************************* CALL FUNCTIONS end **************************************

// ************************************* EVENTS *****************************************

// ************************************* GENERAL EVENTS *****************************************
if ( $("#application textarea").attr("data-textarea-id") ) 
	$("#application textarea").attr("data-textarea-id", Note.findLatestNote().id);

$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
Note.renderNoteSize();

$(window).resize(function() {
	$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
	Note.renderNoteSize();
});

// Show note on right side of app
$("#sidebar").on("click", function(e: any) {
	let target: any = e.target;
	let $target: any = $(target);
	let textArea: any = $("#application textarea");
	if ( $target.hasClass("note") && $(".edit").css("display") != "none" ) {
		let noteID: number = $target.attr("data-note-id");
		textArea.attr("data-textarea-id", noteID);
		Note.renderNoteFields();
		Tag.checkNoteForAddTag();
		Tag.renderTags();
	}
	if ( $target.parent().hasClass("note") && $(".edit").css("display") != "none" ) {
		let noteID: number = $target.parent().attr("data-note-id");
		textArea.attr("data-textarea-id", noteID);
		Note.renderNoteFields();
		Tag.checkNoteForAddTag();
		Tag.renderTags();
	}
	Tag.paddingCheck();
});

// Remove attr readonly from textarea. Also shows save and delete buttons. Hide edit button.
$(".edit").on("click", function() {
	let workTextarea: any = $("#application textarea");
	if ( workTextarea.val() ) {
		$(".edit").css("display", "none");
		$(".delete_note").css("display", "inline-block");
		$(".save_note").css("display", "inline-block");
		workTextarea.removeAttr("readonly");
	}
});
// ************************************* GENERAL EVENTS end *****************************************



// ***************************** FOLDERS EVENTS *****************************************

// ***************************** FOLDERS EVENTS end *****************************************

// ***************************** TAGS EVENTS *****************************************
// Open create tag popup
$(".btn_tags").on("click", function() {

	$("#popup_tag").fadeIn(500);
	$(document).keydown(function(e: any) {
		if (e.keyCode == 27) {
			$("#popup_tag").fadeOut(500);
			$("#popup_tag form")[0].reset();
		}
	});


	$(".popup_close").on("click", function() {
		$("#popup_tag").fadeOut(500);
		$("#popup_tag form")[0].reset();
	});
});

// Open add tag popup
$(".add_tag").on("click", function() {
	$("#popup_note_tag").fadeIn(500);
	$("#popup_note_tag .tag_list").find("*").remove();
	Tag.renderNoteTagsDisplay(data.tags);
	Tag.checkSelectedTags();

	$(document).keydown(function(e: any) {
		if (e.keyCode == 27) {
			$("#popup_note_tag").fadeOut(500);
			$("#popup_note_tag form")[0].reset();
		}
	});

	$(".popup_close").on("click", function() {
		$("#popup_note_tag").fadeOut(500);
		$("#popup_note_tag form")[0].reset();
	});

});

$("#popup_note_tag").on("click", function(e: any) {
	let target: any = e.target;
	let textArea: any = $("#application textarea");
	let note: any = find(data.notes, textArea.attr("data-textarea-id"));
	if ( $(target).hasClass("tag_list_tag") ) {
		$(target).toggleClass("selected_tag");
		note.tags = [];
		$.each($(".tag_list .tag_list_tag"), function() {
			if ( $(this).hasClass("selected_tag") ) {
				note.tags.push( $(this).attr("data-tags-tree-id") );
				localStorage.setItem("structure", JSON.stringify(data));
			}
		});
	}
});

// Create tag render data in tags select and sidebar
$("#popup_tag .create_tag").on("click", function() {
	if ( $("#tag_name").val() ) {
		updateTagsData();
		$("#popup_tag .tags_tree").find("*").remove();
		Tag.renderTagSelect(data.tags, 0);
		tagWrapper(); 
	}

	$("#popup_tag").fadeOut(500);
	$("#popup_tag form")[0].reset();

});

// Create and add tag render data in tags list and sidebar
$("#popup_note_tag .create_add_tag").on("click", function() {
	if ( $("#tag_note_name").val() ) {
		updateTagsData();
		$("#popup_tag .tags_tree").find("*").remove();
		Tag.renderTagSelect(data.tags, 0);
		tagWrapper(); 
		$("#popup_note_tag .tag_list").find("*").remove();
		Tag.renderNoteTagsDisplay(data.tags);
		Tag.checkSelectedTags();
	}

	$("#popup_note_tag form")[0].reset();
});

$("#popup_note_tag .add_note_tag").on("click", function() {
	let selectedTags: any = [];
	let textArea: any = $("#application textarea");
	let note: any = find(data.notes, textArea.attr("data-textarea-id"));


	$("#popup_note_tag .tag_list_tag").each(function() {
		if ( $(this).hasClass("selected_tag") )
			selectedTags.push( $(this).attr("data-tags-tree-id") );
	});

	note.tags = selectedTags;
	localStorage.setItem("structure", JSON.stringify(data));

	tagWrapper(); 
	Tag.paddingCheck();
	Tag.checkNoteForAddTag();
	Tag.renderTags();

	$("#popup_note_tag").fadeOut(500);

});

// Delete tag and render data in select and sidebar
$("#popup_tag .delete_tag").on("click", function() {
	let selectedOptionId: any = $("#popup_tag select option:selected").attr("data-tags-select-id");
	let textArea: any = $("#application textarea");
	let note: any = find(data.notes, textArea.attr("data-textarea-id"));
	if ( $("#popup_tag select").val() && selectedOptionId != "root" ) {
		let findedArr: any = findParent(data.tags, selectedOptionId);
		for (let i = 0; i < findedArr.length; i++) {
			if ( findedArr[i].id == selectedOptionId ) {
				let index: number = findedArr.indexOf(findedArr[i]);
				findedArr.splice(findedArr.indexOf(findedArr[i]), 1);
			}
		}

		for (let i = 0; i < note.tags.length; i++) {
			if ( note.tags[i] ==  selectedOptionId ) {
				let index: number = note.tags.indexOf(note.tags[i]);
				note.tags.splice(index, 1);
			}
		}
	}
	localStorage.setItem("structure", JSON.stringify(data));

	$("#popup_tag .tags_tree").find("option").not(".select_root").remove();
	Tag.renderTagSelect(data.tags, 0);
	tagWrapper(); 
	Tag.checkNoteForAddTag();
	Tag.renderTags();
	Note.renderNoteSize();


	$("#popup_tag form")[0].reset();
});

// Toggle tags to open and close in tree format
$(".tags").on("dblclick", function(e: any) {
	let target: any = e.target;
	// let $target = $(target);
	// Toggle tags to open and close by clicking on folder name
	if ( $(target).hasClass("tag_name") && $(target).siblings("ul").children().length ) {
		let childUl: any = $(target).siblings("ul");
		childUl.toggle();
		// Change folder open or close icon
		if ( $( childUl ).css("display").toLowerCase() === "none" ) {
			$(target).children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
		} 
		if ( $( childUl ).css("display").toLowerCase() === "block" ) {
			$(target).children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
		}
		Note.renderNoteSize();
		let findedObj: any = find(data.tags, $(target).attr("data-tags-tree-id"));
		let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
		// Change display property to render tags tree  with open or close tags
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(data));
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}

	// Toggle tags to open and close by clicking on tag icons(arrow, tag)
	if( $(target).hasClass("fa") && $(target).parent().siblings("ul").children().length ) {
		let parentUl: any = $(target).parent().siblings("ul");
		parentUl.toggle();
		// Change folder open or close icon
		if ( $( parentUl ).css("display").toLowerCase() === "none" ) {
			if ( $(target).hasClass("fa-tag") ) 
				$(target).siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
			else 
				$(target).removeClass("fa-angle-down").addClass("fa-angle-right");
		} 
		if ( $( parentUl ).css("display").toLowerCase() === "block" ) {
			if ( $(target).hasClass("fa-tag") ) 
				$(target).siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
			else
				$(target).removeClass("fa-angle-right").addClass("fa-angle-down");
		}
		Note.renderNoteSize();
		let findedObj: any = find(data.tags, $(target).parent().attr("data-tags-tree-id"));
		let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
		// Change display property to render tags tree  with open or close tags
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(data));
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}
});
// ***************************** TAGS EVENTS end *****************************************


// ***************************** NOTES EVENTS *****************************************
// Open create note popup
$(".btn_notes").on("click", function() {

	$("#popup_note").fadeIn(500);
	$(document).keydown(function(e: any) {
		if (e.keyCode == 27) {
			$("#popup_note").fadeOut(500);
			$("#popup_note form")[0].reset();
		}
	});

	$(".popup_close").on("click", function() {
		$("#popup_note").fadeOut(500);
		$("#popup_note form")[0].reset();
	});
});

// Add new note to localStorage then render tree in sidebar
$("#popup_note .create_note").on("click", function() {
	let selectedOptionId: any = $("#popup_note select option:selected").attr("data-folders-select-id");
	let textArea: any = $("#application textarea");
	if ( $("#note_name").val() && selectedOptionId != "root" ) {
		updateNotesData();
		$(".folders").find("*").remove();
		$(".folders").append(Folder.parseFolders(data.folders));
		Note.renderNotes(data.notes);
		Folder.renderFoldersDisplay(data.folders);
	}

	let latestNote: any = Note.findLatestNote();
	textArea.attr("data-textarea-id", latestNote.id);
	noteWrapper();

	$("#popup_note").fadeOut(500);
	$("#popup_note form")[0].reset();
});

// Save text in textarea in localStorage. Show edit button, hide save and delete buttons.
$(".save_note").on("click", function() {
	let workTextarea: any = $("#application textarea");
	for (let i = 0; i < data.notes.length; i++) {
		if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
			data.notes[i].text = workTextarea.val();
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}
	returnEdit();
});

// Delete note in localStorage. Show edit button, hide save and delete buttons. Render tree in sidebar.
$(".delete_note").on("click", function() {
	let workTextarea: any = $("#application textarea");
	for (let i = 0; i < data.notes.length; i++) {
		if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
			let index: number = data.notes.indexOf(data.notes[i]);
			data.notes.splice(index, 1);
			localStorage.setItem("structure", JSON.stringify(data));
		}
		Note.renderNotes(data.notes);
		Folder.renderFoldersDisplay(data.folders);
	}
	let latestNote: any = Note.findLatestNote();
	if ( latestNote ) { 
		workTextarea.attr("data-textarea-id", latestNote.id);
		noteWrapper();
	}
	returnEdit();
});
// ***************************** NOTES EVENTS end *****************************************

// ************************************* EVENTS end *****************************************

