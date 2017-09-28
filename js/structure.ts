// localStorage.clear();

let idFolderCounter: any = (localStorage.getItem("idFolderCounter")) 
? localStorage.getItem("idFolderCounter") : 0;

let idNoteCounter: any = (localStorage.getItem("idNoteCounter")) 
? localStorage.getItem("idNoteCounter") : 0;

let idTagCounter: any = (localStorage.getItem("idTagCounter")) 
? localStorage.getItem("idTagCounter") : 0;

// Creating folders
let data: any = (localStorage.getItem("structure")) 
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

// Find and return nested object 
function find(source: any, id: number): any {
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
function findParent<T>(arr: T[], id: number): T[] {
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


class Folder {

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
	renderFolderSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: number = item.id;

			if (item.children) {
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

	// Takes a folders array and turns it into a <ul>
	parseFolders(folders: any) { 
		let ul: any = $("<ul>");
		for(var i = 0; i < folders.length; i++) {
			ul.append(this.parseFolder(folders[i]));
		}
		return ul;
	}

	// Takes a folder object and turns it into a <li>
	parseFolder(folder: any) { 
		let li: any = $("<li>");
		li.append(`<span data-folders-tree-id="${folder.id}" class="folder_name">
			<i class="fa folder" aria-hidden="true"></i> <i class="fa fa-folder-o" aria-hidden="true"></i> 
			${folder.name}</span>`);
		if(folder.children) li.append(this.parseFolders(folder.children));
		return li;
	}

	// Render folders tree  with open or close folders
	renderFoldersDisplay<T>(folders: T[]) { 
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
}

class Tag {

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

	// Render tag select list 
	renderTagSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: number = item.id;

			if (item.children) {
				let dashes: string = "";
				for (let i = 0; i < counter - 1; i++) {
					dashes += "-";
				}
				$("#popup_tag .tags_tree").append(`
					<option data-tags-select-id="${id}" value="${name}">${dashes} ${name}</option>
					`);
				dashes = "";

				this.renderTagSelect(item.children, counter + 1);
			} 
		}
	}

	// Takes a folders array and turns it into a <ul>
	parseTags(tags: any) { 
		let ul: any = $("<ul>");
		for(var i = 0; i < tags.length; i++) {
			ul.append(this.parseTag(tags[i]));
		}
		return ul;
	}

	// Takes a folder object and turns it into a <li>
	parseTag(tag: any) { 
		let li: any = $("<li>");
		li.append(`<span data-tags-tree-id="${tag.id}" class="tag_name">
			<i class="fa tag" aria-hidden="true"></i> <i class="fa fa-tag" aria-hidden="true"></i> 
			${tag.name}</span>`);
		if(tag.children) li.append(this.parseTags(tag.children));
		return li;
	}

	// Render tags tree  with open or close folders
 renderTagsDisplay<T>(tags: T[]) { 
	for (let key in tags) {
		let item: any = tags[key];
		let display: string = item.display;
		let id: number = item.id;
		let tagsSpan: any = $(`.tags span[data-tags-tree-id="${id}"]`);
		let tagI: any = $(`.tags span[data-tags-tree-id="${id}"] .tag`);
		if (display === "block") {
			tagsSpan.siblings("ul").css("display", "block");
		} else {
			tagsSpan.siblings("ul").css("display", "none");
		}
		if (display === "block" && tagsSpan.next("ul").children().length) {
			tagI.removeClass("fa-angle-right").addClass("fa-angle-down");
		} else {
			tagI.removeClass("fa-angle-down").addClass("fa-angle-right");
		}
		if (!tagsSpan.next("ul").children().length) {
			tagI.remove();
		}
		if (item.children)
			this.renderTagsDisplay(item.children);
	}
}

// Render tags list in #popup_note_tag div
 renderNoteTagsDisplay<T>(tags: T[]) {
	for (let key in tags) {
		let item: any = tags[key];
		let name: string = item.name;
		let tagsDiv: any = $("#popup_note_tag .tag_list");
		if ( item.id != "root" ) 
			tagsDiv.append(`<span class="tag_list_tag" data-tags-tree-id="${item.id}" >${name}</span>`);
		if ( item.children )
			this.renderNoteTagsDisplay(item.children);
	}
}

// Check and render add_tag button in note_info
 checkNoteForAddTag() {
	if ( $(".note_title").text().length > 0 ) { 
		$(".add_tag").css("display", "inline-block");
	}
	else
		$(".add_tag").css("display", "none");
}

// Check and add .selected_tag class to tags that are applied to note
 checkSelectedTags() {
	let textArea: any = $("#application textarea");
	let spanTags: any = $(".tag_list .tag_list_tag");
	let note: any = find(data.notes, textArea.attr("data-textarea-id"));

	for (let i = 0; i < spanTags.length; i++) {
		for (let j = 0; j < note.tags.length; j++) {
			if ( note.tags[j] == $(spanTags[i]).attr("data-tags-tree-id") )
				$(spanTags[i]).addClass("selected_tag");
		}
	}
}

// Render tags(spans) in note_info
 renderTags() {
	let note: any = find(data.notes, $("#application textarea").attr("data-textarea-id"));
	$(".notes_tags").find("span").remove();
	if ( note ) { 
		for (let i = 0; i < note.tags.length; i++) {
			let tag: any = find(data.tags, note.tags[i]);
			if ( tag ) {
				$(".notes_tags").append(`<span class="tag_list_tag">${tag.name}</span>`);
			}	
			// else {
				// 	$(".notes_tags").find("span").remove();
				// }
			}
		}
	}


// Check and render padding for tags in note_info
 paddingCheck() {
	if ( $("#note .notes_tags span") ) $("#note .notes_tags span").css({"padding": "5px 10px", "display": "inline-block"});
	else $("#note .notes_tags span").css({"padding": "0px"});
}

}

class Note {
	id: number;
	folder: number;
	title: string;
	text: any;
	date: any;
	tags: any;

	constructor(theID: any, theFolder: any, theTitle: string, theText: any) {
		this.id = theID;
		this.folder = theFolder;
		this.title = theTitle;
		this.text = theText;
		this.date = new Date();
		this.tags = [];
	}

	// Set textarea(note) height equal to sidebar height
 renderNoteSize() {
	setTimeout(function() {
		let sidebarHeight: number = $("#sidebar").outerHeight();
		let noteTitleHeight: number = $("#note .note_title").outerHeight();
		let noteInfo: number = $("#note .note_info").outerHeight();
		let sum: number = noteTitleHeight + noteInfo ;
		let res: number = sidebarHeight - sum;
		$("#note textarea").css("height", res);
	}, 10);
}

// Math max to array
 getMaxOfArray<T>(numArray: T[]): T {
	return Math.max.apply(null, numArray);
}

// Find last(date) note and return it as object from data
 findLatestNote<T>(): any {
	let dataArr: T[] = [];
	let maxNote: any;
	for(let i = 0; i < data.notes.length; i++) {
		let item: any = data.notes[i];
		let parseDate: any = Date.parse(item.date);
		dataArr.push(parseDate);
	}
	let max: any = this.getMaxOfArray(dataArr);
	for(let i = 0; i < data.notes.length; i++) {
		let item: any = data.notes[i];
		let parseDate: any = Date.parse(item.date);
		if ( parseDate == max ) {
			maxNote = item;
		}
	}
	return maxNote;
}



 renderLatestNote() {
	let latestNote: any = this.findLatestNote();
	let noteTitle: any = $("#note .note_title");
	let noteTags: any = $("#note .notes_tags");
	let notesFolder: any = $("#note .notes_folder");
	let textArea: any = $("#application textarea");

	if (latestNote) {
		noteTitle.html(latestNote.title);
		let latestNoteFolder = find(data.folders, latestNote.folder);
		notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${latestNoteFolder.name}`);
		textArea.html(latestNote.text);
		textArea.attr("data-textarea-id", latestNote.id);
	}
}

// Render note fields(title, tags..) and render last(date) note on load
 renderNoteFields() {
	let noteTitle: any = $("#note .note_title");
	let noteTags: any = $("#note .notes_tags");
	let notesFolder: any = $("#note .notes_folder");
	let textArea: any = $("#application textarea");
	
	for (let i = 0; i < data.notes.length; i++) {
		let item: any = data.notes[i];
		if ( item.id == textArea.attr("data-textarea-id") ) {
			noteTitle.html(item.title);
			textArea.val(item.text);
			let folder = find(data.folders, item.folder);
			notesFolder.html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${folder.name}`);
		}
	}
}

	// Render notes in sidebar tree
	 renderNotes<T>(folders: T[]) {
		$("#sidebar").find(".note").remove();
		for (let i = 0; i < folders.length; i++) {
			let item: any = folders[i];
			let id: T = item.id;
			let folderID: T = item.folder;
			let foldersSpan: any = $(`.folders span[data-folders-tree-id="${folderID}"]`);
			let folderUl: any = foldersSpan.next("ul");
			folderUl.append(`<span data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
				${item.title}</span>`);

			let noteTags: any = item.tags;
			for (let j = 0; j < noteTags.length; j++) {
				let tagSpan: any = $(`.tags span[data-tags-tree-id="${noteTags[j]}"]`);
				let tagUl: any = tagSpan.next("ul");
				tagUl.append(`<span data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
					${item.title}</span>`);
			}
		}
	}

}

	// Add new folder to localStorage and iterate idFolderCounter
	function updateFoldersData() {
		let folderName: string =  $("#folder_name").val();
		let findedObj: any;
		let newFolder: any = new Folder(idFolderCounter, folderName);

		findedObj =	find(data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
		findedObj.children.push(newFolder);

		localStorage.setItem("structure", JSON.stringify(data));
		localStorage.setItem("idFolderCounter", idFolderCounter);
		idFolderCounter++;
	}

	// Add new note to localStorage and iterate idNoteCounter
	function updateNotesData() {
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

	function updateTagsData() {
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
	// ******************************* CALL FUNCTIONS **************************************

	let folderInstance = new Folder(idFolderCounter, "test");
	let tagInstance = new Tag(idTagCounter, "test");
	let noteInstance = new Note(idNoteCounter, 0, "test", "text");


	folderInstance.renderFolderSelect(data.folders, 0);
	tagInstance.renderTagSelect(data.tags, 0);
	idFolderCounter++;
	idNoteCounter++;
	idTagCounter++;
	$(".folders").append(folderInstance.parseFolders(data.folders));
	$(".tags").append(tagInstance.parseTags(data.tags));
	noteInstance.renderNotes(data.notes);
	folderInstance.renderFoldersDisplay(data.folders);
	tagInstance.renderTagsDisplay(data.tags);
	noteInstance.renderNoteFields();
	noteInstance.renderLatestNote();
	tagInstance.paddingCheck();
	tagInstance.checkNoteForAddTag();
	tagInstance.renderTags();

	// ******************************* CALL FUNCTIONS end **************************************

	// ******************************* EXECUTE COMMANDS ******************************************

	if ( $("#application textarea").attr("data-textarea-id") ) 
		$("#application textarea").attr("data-textarea-id", findLatestNote().id);


	// ******************************* EXECUTE COMMANDS end **************************************


	$(window).resize(function() {
		$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
		renderNoteSize();
	});


	// Open create folder popup
	$(".btn_folders").on("click", function() {

		$("#popup_folder").fadeIn(500);
		$(document).keydown(function(e) {
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

	// Open create note popup
	$(".btn_notes").on("click", function() {

		$("#popup_note").fadeIn(500);
		$(document).keydown(function(e) {
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

	// Open create tag popup
	$(".btn_tags").on("click", function() {

		$("#popup_tag").fadeIn(500);
		$(document).keydown(function(e) {
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
		renderNoteTagsDisplay(data.tags);

		checkSelectedTags();

		$(document).keydown(function(e) {
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

	// $(".tag_list_tag").on("click", function() {
		$("#popup_note_tag").on("click", function(e) {
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
		// });

		// Create folder render data in folder select and sidebar
		$("#popup_folder .create_folder").on("click", function() {
			if ( $("#folder_name").val() ) {
				updateFoldersData();
				$(".folders_tree").find("option").not(".select_root").remove();
				renderFolderSelect(data.folders, 0);
				$(".folders").find("*").remove();
				$(".folders").append(parseFolders(data.folders));
				renderNotes(data.notes);
				renderFoldersDisplay(data.folders);
				renderNoteFields();
				renderNoteSize();
			}

			$("#popup_folder").fadeOut(500);
			$("#popup_folder form")[0].reset();

		});

		// Create tag render data in tags select and sidebar
		$("#popup_tag .create_tag").on("click", function() {
			if ( $("#tag_name").val() ) {
				updateTagsData();
				$("#popup_tag .tags_tree").find("*").remove();
				renderTagSelect(data.tags, 0);
				$(".tags").find("*").remove();
				$(".tags").append(parseTags(data.tags));
				renderNotes(data.notes);
				renderTagsDisplay(data.tags);
				renderNoteFields();
				renderNoteSize();
			}

			$("#popup_tag").fadeOut(500);
			$("#popup_tag form")[0].reset();

		});

		// Create and add tag render data in tags list and sidebar
		$("#popup_note_tag .create_add_tag").on("click", function() {
			if ( $("#tag_note_name").val() ) {
				updateTagsData();
				$("#popup_tag .tags_tree").find("*").remove();
				renderTagSelect(data.tags, 0);
				$(".tags").find("*").remove();
				$(".tags").append(parseTags(data.tags));
				renderNotes(data.notes);
				renderTagsDisplay(data.tags);
				renderNoteFields();
				renderNoteSize();
				$("#popup_note_tag .tag_list").find("*").remove();
				renderNoteTagsDisplay(data.tags);
				checkSelectedTags();
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

			$(".tags").find("*").remove();
			$(".tags").append(parseTags(data.tags));
			renderNotes(data.notes);
			renderTagsDisplay(data.tags);
			renderNoteFields();
			paddingCheck();
			checkNoteForAddTag();
			renderTags();

			$("#popup_note_tag").fadeOut(500);

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

				$(".folders_tree").find("option").not(".select_root").remove();
				renderFolderSelect(data.folders, 0);
				$(".folders").find("*").remove();
				$(".folders").append(parseFolders(data.folders));
				renderNotes(data.notes);
				renderFoldersDisplay(data.folders);
				renderNoteFields();
				renderNoteSize();

			}
			$("#popup_folder form")[0].reset();
		});

		// Delete tag and render data in select and sidebar
		$("#popup_tag .delete_tag").on("click", function() {
			let selectedOptionId: any = $("#popup_tag select option:selected").attr("data-tags-select-id");
			let textArea: any = $("#application textarea");
			let note: any = find(data.notes, textArea.attr("data-textarea-id"));
			if ( $("#popup_tag select").val() && selectedOptionId != "root" ) {
				let findedArr = findParent(data.tags, selectedOptionId);
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
			renderTagSelect(data.tags, 0);
			$(".tags").find("*").remove();
			$(".tags").append(parseTags(data.tags));
			renderNotes(data.notes);
			renderTagsDisplay(data.tags);
			renderNoteFields();
			checkNoteForAddTag();
			renderTags();
			renderNoteSize();


			$("#popup_tag form")[0].reset();
		});

		// Add new note to localStorage then render tree in sidebar
		$("#popup_note .create_note").on("click", function() {
			let selectedOptionId: any = $("#popup_note select option:selected").attr("data-folders-select-id");
			let textArea: any = $("#application textarea");
			if ( $("#note_name").val() && selectedOptionId != "root" ) {
				updateNotesData();
				$(".folders").find("*").remove();
				$(".folders").append(parseFolders(data.folders));
				renderNotes(data.notes);
				renderFoldersDisplay(data.folders);
			}

			let latestNote: any = findLatestNote();
			textArea.attr("data-textarea-id", latestNote.id);
			renderNoteFields();
			checkNoteForAddTag();
			renderTags();
			renderNoteSize();

			$("#popup_note").fadeOut(500);
			$("#popup_note form")[0].reset();
		});

		// Show note on right side of app
		$("#sidebar").on("click", function(e) {
			let target: any = e.target;
			let textArea: any = $("#application textarea");
			if ( $(target).hasClass("note") && $(".edit").css("display") != "none" ) {
				let noteID: number = $(target).attr("data-note-id");
				textArea.attr("data-textarea-id", noteID);
				renderNoteFields();
				checkNoteForAddTag();
				renderTags();
			}
			if ( $(target).parent().hasClass("note") && $(".edit").css("display") != "none" ) {
				let noteID: number = $(target).parent().attr("data-note-id");
				textArea.attr("data-textarea-id", noteID);
				renderNoteFields();
				checkNoteForAddTag();
				renderTags();
			}
			paddingCheck();
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

		// Save text in textarea in localStorage. Show edit button, hide save and delete buttons.
		$(".save_note").on("click", function() {
			let workTextarea: any = $("#application textarea");
			for (let i = 0; i < data.notes.length; i++) {
				if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
					data.notes[i].text = workTextarea.val();
					localStorage.setItem("structure", JSON.stringify(data));
				}
			}
			$(".edit").css("display", "inline-block");
			$(".delete_note").css("display", "none");
			$(".save_note").css("display", "none");
			workTextarea.prop("readonly", true);
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
				renderNotes(data.notes);
				renderFoldersDisplay(data.folders);
			}
			let latestNote: any = findLatestNote();
			if ( latestNote ) { 
				workTextarea.attr("data-textarea-id", latestNote.id);
				renderNoteFields();
				checkNoteForAddTag();
				renderTags();
				renderNoteSize();
			}

			$(".edit").css("display", "inline-block");
			$(".delete_note").css("display", "none");
			$(".save_note").css("display", "none");
			workTextarea.prop("readonly", true);
		});

		// Toggle folders to open and close in tree format
		$(".folders").on("dblclick", function(e: any) {
			let target: any = e.target;
			// Toggle folders to open and close by clicking on folder name
			if ( $(target).hasClass("folder_name") && $(target).siblings("ul").children().length ) {
				let childUl: any = $(target).siblings("ul");
				childUl.toggle();
				// Change folder open or close icon
				if ( $( childUl ).css("display").toLowerCase() === "none" ) {
					$(target).children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
				} 
				if ( $( childUl ).css("display").toLowerCase() === "block" ) {
					$(target).children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
				}
				renderNoteSize();
				let findedObj: any = find(data.folders, $(target).attr("data-folders-tree-id"));
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
			if( $(target).hasClass("fa") && $(target).parent().siblings("ul").children().length ) {
				let parentUl: any = $(target).parent().siblings("ul");
				parentUl.toggle();
				// Change folder open or close icon
				if ( $( parentUl ).css("display").toLowerCase() === "none" ) {
					if ( $(target).hasClass("fa-folder-o") ) 
						$(target).siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
					else 
						$(target).removeClass("fa-angle-down").addClass("fa-angle-right");
				} 
				if ( $( parentUl ).css("display").toLowerCase() === "block" ) {
					if ( $(target).hasClass("fa-folder-o") ) 
						$(target).siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
					else
						$(target).removeClass("fa-angle-right").addClass("fa-angle-down");
				}
				renderNoteSize();
				let findedObj: any = find(data.folders, $(target).parent().attr("data-folders-tree-id"));
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


		// Toggle tags to open and close in tree format
		$(".tags").on("dblclick", function(e: any) {
			let target: any = e.target;
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
				renderNoteSize();
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
				renderNoteSize();
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