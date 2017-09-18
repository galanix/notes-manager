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

let idCounter = (localStorage.getItem("idCounter")) 
? localStorage.getItem("idCounter") : 0;
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
		<i class="fa" aria-hidden="true"></i> ${folder.name}</span>`);
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
		let folderI = $(`.folders span[data-folders-tree-id="${id}"] i`);
		if (display === "block") {
			foldersSpan.siblings("ul").css("display", "block");
		} else {
			foldersSpan.siblings("ul").css("display", "none");
		}
			if (!item.children.length) {
			folderI.remove();
		}
		if (display === "block" && item.children[0]) {
			folderI.removeClass("fa-caret-right").addClass("fa-caret-down");
		} else {
			folderI.removeClass("fa-caret-down").addClass("fa-caret-right");
		}
		if (item.children) {
			renderDisplay(item.children);
		}
	} 
}

function renderNotes(arr) {
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		let folderID = item.folder;
		let foldersSpan = $(`.folders span[data-folders-tree-id="${folderID}"]`);
		let li = foldersSpan.parent();
		li.append(`<span class="note"><i class="fa fa-sticky-note-o" aria-hidden="true"></i>
			${item.title}</span>`);
	}
}

function updateFoldersData() {
	let folderName =  $("#folder_name").val();
	let findedObj;

	let newFolder = {
		"id": idCounter,
		"name": folderName,
		"display": "block",
		"children": []
	};

	findedObj =	find(data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
	findedObj.isParent = true;
	findedObj.children.push(newFolder);


	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idCounter", idCounter);
	idCounter++;

}

function updateNotesData() {
	let noteTitle = $("#note_name").val();
	let folderID =	$("#popup_note select option:selected").attr("data-folders-select-id");
	
	let newNote = {
		"title": noteTitle,
		"text": "",
		"folder": folderID,
		"tags": ""
	};

	data.notes.push(newNote);
	localStorage.setItem("structure", JSON.stringify(data));

}
// ******************************* CALL FUNCTIONS **************************************

renderSelect(data.folders, 0);
idCounter++;
$(".folders").append(parseFolders(data.folders));
renderDisplay(data.folders);
renderNotes(data.notes);

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
		$("#popup_folder form")[0].reset();
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
		renderDisplay(data.folders);
		renderNotes(data.notes);
		renderNoteSize();
	}

	$("#popup_folder").fadeOut(500);
	$("#popup_folder form")[0].reset();

});

// Delete and render data in select and sidebar
$("#popup_folder .delete").on("click", function() {
	let selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
	if ( $("#popup_folder select").val() && selectedOptionId != "root" ) {
		let findedArr = findParent(data.folders, selectedOptionId);
		for (let i = 0; i < findedArr.length; i++) {
			if (findedArr[i].id == selectedOptionId) {
				let index = findedArr.indexOf(findedArr[i]);
				findedArr.splice( findedArr.indexOf(findedArr[i], 1), 1 );
			}
		}

		localStorage.setItem("structure", JSON.stringify(data));

		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
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
		renderDisplay(data.folders);
		renderNotes(data.notes);
		renderNoteSize();
	}

	$("#popup_note").fadeOut(500);
	$("#popup_note form")[0].reset();
});


// Toggle folders to open and close in tree format
$(".folders").on("dblclick", function(e) {
	let target = e.target;
	if ( $(target).hasClass("folder_name") && $(target).siblings("ul").children().length ) {
		let childUl = $(target).siblings("ul");
		childUl.toggle();
		// Change folder open or close icon
		// setTimeout(function() {
			if ( $( childUl ).css("display").toLowerCase() === "none" ) {
				$(target).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			} 
			if ( $( childUl ).css("display").toLowerCase() === "block" ) {
				$(target).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			}
		// }, 10);
		renderNoteSize();
		let findedObj = find(data.folders, $(target).attr("data-folders-tree-id"));
		// Change display property to render folders tree  with open or close folders
		if (findedObj.display === "block" && findedObj.children[0]) {
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
