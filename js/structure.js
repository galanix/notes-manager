// localStorage.clear();

// Creating folders
let data = (localStorage.getItem("structure")) 
? JSON.parse(localStorage.getItem("structure")) : {
	"folders": [{
		"id": "root",
		"name": "Folders",
		"display": "block",
		"children": []
	}],
	"notes": []
};

let idFolderCounter = (localStorage.getItem("idFolderCounter")) 
? localStorage.getItem("idFolderCounter") : 0;

let idNoteCounter = (localStorage.getItem("idNoteCounter")) 
? localStorage.getItem("idNoteCounter") : 0;

let select = $(".folders_tree");


// Returns nested object 
function find(source, id) {
	for (key in source) {
		var item = source[key];
		if (item.id == id)
			return item;

 // Item not returned yet. Search its children by recursive call.
 if (item.children) {
 	var subresult = find(item.children, id);
     // If the item was found in the subchildren, return it.
     if (subresult)
     	return subresult;
   }
 }
    // Nothing found yet? return null.
    return null;
  }

  function findParent(arr, id) {
  	for (let i = 0; i < arr.length; i++) {
  		let item = arr[i];
  		let children = item.children;
  		for (let j = 0; j < children.length; j++) {
  			let child = item.children[j];
  			let childID = child.id;

  			if (childID == id) return children;

  			if (item.children) {
  				let subresult = findParent(item.children, id);
  				if (subresult) return subresult;
  			}
  		}
  	}
  	return null;
  }

// Render select list 
function renderSelect(arr, counter) {
	for(let i = 0; i < arr.length; i++) {
		let name = arr[i].name;
		let id = arr[i].id;
		
		if (arr[i].children) {
			let dashes = "";
			for (let i = 0; i < counter - 1; i++) {
				dashes += "-";
			}
			select.append(`
				<option data-folders-select-id="${id}" value="${name}">${dashes} ${name}</option>
				`);
			dashes = "";

			renderSelect(arr[i].children, counter + 1);
		} 
	}
}

// Set textarea(note) height equal to sidebar height
function renderNoteSize() {
	setTimeout(function() {
		let sidebarHeight = ($("#sidebar").height());
		$("#note textarea").css("height", sidebarHeight);
	}, 10);
}


// Takes a folders array and turns it into a <ul>
function parseFolders(folders) { 
	let ul = $("<ul>");
	for(var i = 0; i < folders.length; i++) {
		ul.append(parseFolder(folders[i]));
	}
	return ul;
}

// Takes a folder object and turns it into a <li>
function parseFolder(folder) { 
	let li = $("<li>");
	li.append(`<span data-folders-tree-id="${folder.id}" class="folder_name">
		<i class="fa folder" aria-hidden="true"></i> <i class="fa fa-folder-o" aria-hidden="true"></i> 
		${folder.name}</span>`);
	if(folder.children) li.append(parseFolders(folder.children));
	return li;
}

// Render folders tree  with open or close folders
function renderDisplay(folders) { 
	for (key in folders) {
		let item = folders[key];
		let display = item.display;
		let icon = item.class;
		let id = item.id;
		let foldersSpan = $(`.folders span[data-folders-tree-id="${id}"]`);
		let folderI = $(`.folders span[data-folders-tree-id="${id}"] .folder`);
		if (display === "block") {
			foldersSpan.siblings("ul").css("display", "block");
		} else {
			foldersSpan.siblings("ul").css("display", "none");
		}
		if (display === "block" && foldersSpan.next("ul").children().length) {
			folderI.removeClass("fa-caret-right").addClass("fa-caret-down");
		} else {
			folderI.removeClass("fa-caret-down").addClass("fa-caret-right");
		}
		if (!foldersSpan.next("ul").children().length) {
			folderI.remove();
		}
		if (item.children) {
			renderDisplay(item.children);
		}
	}
}

function renderNotes(arr) {
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		let id = item.id;
		let folderID = item.folder;
		let foldersSpan = $(`.folders span[data-folders-tree-id="${folderID}"]`);
		let ul = foldersSpan.next("ul");
		ul.append(`<span data-note-id="${id}" class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
			${item.title}</span>`);
	}
}

function updateFoldersData() {
	let folderName =  $("#folder_name").val();
	let findedObj;

	let newFolder = {
		"id": idFolderCounter,
		"name": folderName,
		"display": "block",
		"children": []
	};

	findedObj =	find(data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
	findedObj.isParent = true;
	findedObj.children.push(newFolder);


	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idFolderCounter", idFolderCounter);
	idFolderCounter++;

}

function updateNotesData() {
	let noteTitle = $("#note_name").val();
	let noteText = $("#popup_note textarea").val();
	let folderID =	$("#popup_note select option:selected").attr("data-folders-select-id");
	
	let newNote = {
		"id": idNoteCounter,
		"title": noteTitle,
		"text": noteText,
		"folder": folderID,
		"tags": ""
	};

	data.notes.push(newNote);
	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idNoteCounter", idNoteCounter);
	idNoteCounter++;

}
// ******************************* CALL FUNCTIONS **************************************

renderSelect(data.folders, 0);
idFolderCounter++;
idNoteCounter++;
$(".folders").append(parseFolders(data.folders));
renderNotes(data.notes);
renderDisplay(data.folders);


// ******************************* CALL FUNCTIONS end **************************************

// Open create folder popup
$("#create_folder").on("click", function() {

	$("#popup_folder").fadeIn(500);
	$(document).keydown(function(e) {
		if (e.keyCode == 27) $("#popup_folder").fadeOut(500);
	});


	$(".popup_close").on("click", function() {
		$("#popup_folder").fadeOut(500);
		$("#popup_folder form")[0].reset();
	});
});

// Open create note popup
$("#create_note").on("click", function() {

	$("#popup_note").fadeIn(500);
	$(document).keydown(function(e) {
		if (e.keyCode == 27) $("#popup_note").fadeOut(500);
	});


	$(".popup_close").on("click", function() {
		$("#popup_note").fadeOut(500);
		$("#popup_note form")[0].reset();
	});
});

// Render data in select and sidebar
$("#popup_folder .create").on("click", function() {
	if ( $("#folder_name").val() ) {
		updateFoldersData();
		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
		renderNotes(data.notes);
		renderDisplay(data.folders);
		renderNoteSize();
	}

	$("#popup_folder").fadeOut(500);
	$("#popup_folder form")[0].reset();

});

// Delete and render data in select and sidebar
$("#popup_folder .delete_folder").on("click", function() {
	let selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
	if ( $("#popup_folder select").val() && selectedOptionId != "root" ) {
		let findedArr = findParent(data.folders, selectedOptionId);
		console.log(selectedOptionId);
		console.log(findedArr);
		for (let i = 0; i < findedArr.length; i++) {
			if (findedArr[i].id == selectedOptionId) {
				let index = findedArr.indexOf(findedArr[i]);
				findedArr.splice( findedArr.indexOf(findedArr[i]), 1);
			}
		}

		localStorage.setItem("structure", JSON.stringify(data));

		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
		renderNotes(data.notes);
		renderDisplay(data.folders);
		renderNoteSize();
	}

	$("#popup_folder").fadeOut(500);
	$("#popup_folder form")[0].reset();
});

$("#popup_note .create").on("click", function() {
	let selectedOptionId = $("#popup_note select option:selected").attr("data-folders-select-id");
	if ( $("#note_name").val() && selectedOptionId != "root" ) {
		updateNotesData();
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
		renderNotes(data.notes);
		renderDisplay(data.folders);
		renderNoteSize();
	}

	$("#popup_note").fadeOut(500);
	$("#popup_note form")[0].reset();
});


// Toggle folders to open and close in tree format
$(".folders").on("dblclick", function(e) {
	let target = e.target;
	// Toggle folders to open and close by clicking on folder name
	if ( $(target).hasClass("folder_name") && $(target).siblings("ul").children().length ) {
		let childUl = $(target).siblings("ul");
		childUl.toggle();
		// Change folder open or close icon
		if ( $( childUl ).css("display").toLowerCase() === "none" ) {
			$(target).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
		} 
		if ( $( childUl ).css("display").toLowerCase() === "block" ) {
			$(target).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
		}
		renderNoteSize();
		let findedObj = find(data.folders, $(target).attr("data-folders-tree-id"));
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
		let parentUl = $(target).parent().siblings("ul");
		parentUl.toggle();
		// Change folder open or close icon
		if ( $( parentUl ).css("display").toLowerCase() === "none" ) {
			$(target).removeClass("fa-caret-down").addClass("fa-caret-right");
			$(target).siblings().removeClass("fa-caret-down").addClass("fa-caret-right");
		} 
		if ( $( parentUl ).css("display").toLowerCase() === "block" ) {
			$(target).removeClass("fa-caret-right").addClass("fa-caret-down");
			$(target).siblings().removeClass("fa-caret-right").addClass("fa-caret-down");
		}
		renderNoteSize();
		let findedObj = find(data.folders, $(target).parent().attr("data-folders-tree-id"));
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
});


// Toggle tags to open and close in tree format
$(".tags").on("dblclick", function(e) {
	let target = e.target;
	if ( $(target).hasClass("tag_name") ) {
		let childUl = $(target).siblings("ul");
		childUl.toggle();
		setTimeout(function() {
			if ( $( childUl ).css("display").toLowerCase() === "none" ) {
				$(target).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			} 
			if ( $( childUl ).css("display").toLowerCase() === "block" ) {
				$(target).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			}
		}, 10);
	}
});

// Show note on right side of app
$(".folders").on("click", function(e) {
	let target = e.target;
	let textArea = $("#application textarea");
	if ( $(target).hasClass("note") ) {
		let span = $(target).parent().siblings(".folder_name");
		let noteID = $(target).attr("data-note-id");
		textArea.attr("data-textarea-id", noteID);
		for (let i = 0; i < data.notes.length; i++) {
			if (data.notes[i].folder == span.attr("data-folders-tree-id")) {
				textArea.text(data.notes[i].text);
			}
		} }
	});

$(".edit").on("click", function() {
	let workTextarea = $("#application textarea");
	if ( workTextarea.val() ) {
		$(".edit").css("display", "none");
		$(".delete_note").css("display", "inline-block");
		$(".save_note").css("display", "inline-block");
		workTextarea.removeAttr("readonly");
	}
});

$(".save_note").on("click", function() {
	let workTextarea = $("#application textarea");
	for (let i = 0; i < data.notes.length; i++) {
		if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
			data.notes[i].text = workTextarea.val();
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}
	$(".edit").css("display", "inline-block");
	$(".delete_note").css("display", "none");
	$(".save_note").css("display", "none");
});

$(".delete_note").on("click", function() {
	let workTextarea = $("#application textarea");
	for (let i = 0; i < data.notes.length; i++) {
		if ( data.notes[i].id == workTextarea.attr("data-textarea-id") ) {
			let index = data.notes.indexOf(data.notes[i]);
			data.notes.splice(index, 1);
			localStorage.setItem("structure", JSON.stringify(data));
		}
	}

		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
		renderNotes(data.notes);
		renderDisplay(data.folders);
		renderNoteSize();

	workTextarea.val("");
	$(".edit").css("display", "inline-block");
	$(".delete_note").css("display", "none");
	$(".save_note").css("display", "none");
});

// let testData = {  
// 	"folders":[  
// 	{  
// 		"id":"root",
// 		"name":"Folders",
// 		"display":"block",
// 		"children":[  
// 		{  
// 			"id":1,
// 			"name":"1",
// 			"display":"block",
// 			"children":[  
// 			{  
// 				"id":2,
// 				"name":"1.1",
// 				"display":"block",
// 				"children":[  
// 				{  
// 					"id":3,
// 					"name":"1.1.1",
// 					"display":"block",
// 					"children":[  

// 					]
// 				}
// 				],
// 				"isParent":true
// 			},
// 			{  
// 				"id":4,
// 				"name":"1.2",
// 				"display":"block",
// 				"children":[  

// 				]
// 			}
// 			],
// 			"isParent":true
// 		},
// 		{  
// 			"id":5,
// 			"name":"2",
// 			"display":"block",
// 			"children":[  
// 			{  
// 				"id":6,
// 				"name":"2.1",
// 				"display":"block",
// 				"children":[  

// 				]
// 			}
// 			],
// 			"isParent":true
// 		}
// 		],
// 		"isParent":true
// 	}
// 	],
// 	"notes":{  

// 	}
// }
