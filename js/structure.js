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
	"notes": {}
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
	li.html(`<span data-folders-tree-id="${folder.id}" class="folder_name">
		<i class="fa fa-caret-right" aria-hidden="true"></i> ${folder.name}</span>`);  
	if(folder.children) li.append(parseFolders(folder.children));
	return li;
}

// Render folders tree  with open or close folders
function renderDisplay(arr) { 
	for (key in arr) {
		let item = arr[key];
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



function updateData() {
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
// ******************************* PAGE ON LOAD **************************************

renderSelect(data.folders, 0);
idCounter++;
$(".folders").append(parseFolders(data.folders));
renderDisplay(data.folders);


// ******************************* PAGE ON LOAD **************************************


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
$(".create").on("click", function() {
	if ( $("#folder_name").val() ) {
		updateData();
		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
		renderDisplay(data.folders);
	}

	if( $("#note_name").val() ) {

	}
	
	$("#popup_folder").fadeOut(500);
	$("#popup_folder form")[0].reset();

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

let sidebar = document.getElementById("sidebar");

setTimeout(function() {
	// console.log(sidebar.offsetHeight); 
	console.log($("#sidebar").outerHeight());
}, 2000);
 