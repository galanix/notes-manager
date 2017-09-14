// localStorage.clear();

// Creating folders

let data = (localStorage.getItem("structure")) 
? JSON.parse(localStorage.getItem("structure")) : {
	"folders": [{
		"id": "root",
		"name": "Folders",
		"children": []
	}],
	"notes": {}
};

let idCounter = (localStorage.getItem("idCounter")) 
? localStorage.getItem("idCounter") : 0;
let select = $("#folders_tree");


// Returns nested object 
function find(source, id) {
	for (key in source)
	{
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
				<option id="${id}" value="${name}">${dashes} ${name}</option>
				`);
			dashes = "";

			renderSelect(arr[i].children, counter + 1);
		} 
	}
}

// Render folder tree

function parseFolders(folders) { // takes a nodes array and turns it into a <ol>
	let ul = $("<ul>");
	for(var i = 0; i < folders.length; i++) {
		ul.append(parseFolder(folders[i]));
	}
	return ul;
}

function parseFolder(folder) { // takes a node object and turns it into a <li>
	let li = $("<li>");
	li.html(`<span id="${folder.id}" class="folder_name">
		<i class="fa fa-caret-right" aria-hidden="true"></i> ${folder.name}</span>`);  
	if(folder.children) li.append(parseFolders(folder.children));
	return li;
}

function updateData() {
	let folderName =  $("#folder_name").val();
	let findedObj;

	let newFolder = {
		"id": idCounter,
		"name": folderName,
		"children": []
	};

	if (select.val() === "Root") {
		newFolder.root = true;
		data.folders.push(newFolder);
	} else {
		findedObj =	find(data.folders, $("#folders_tree option:selected").attr("id"));
		findedObj.isParent = true;
		findedObj.children.push(newFolder);
	}

	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idCounter", idCounter);
	idCounter++;

}


renderSelect(data.folders, 0);
idCounter++;
$(".folders").append(parseFolders(data.folders));

	// if ( $(".folders").children("li").children("ul")[0] === undefined ) {
	// 	$(".folders").children("li").append(`
	// 		<ul>
	// 		<li>
	// 		<span id="${newFolder.id}" class="folder_name">
	// 		<i class="fa fa-caret-right" aria-hidden="true"></i> ${folderName}</span>
	// 		</li>
	// 		</ul>
	// 		`);
	// }



	$("#create_folder").on("click", function() {

		$("#popup").fadeIn(500);
		$(document).keydown(function(e) {
			if (e.keyCode == 27) $("#popup").fadeOut(500);
		});


		$(".popup_close").on("click", function() {
			$("#popup").fadeOut(500);
			$("#popup form")[0].reset();
		});
	});

// $(".folders").on("click", function(e) {
// 	let target = e.target;
// 	if ( $(target).hasClass("folder_name") ) {
// 		let folderID = $(target).attr("id");
// 	}

// });


$(".create").on("click", function() {
	if ( $("#folder_name").val() ) {
		updateData();
		select.find("option").not(".select_root").remove();
		renderSelect(data.folders, 0);
		$(".folders").find("*").remove();
		$(".folders").append(parseFolders(data.folders));
	}
	
	$("#popup").fadeOut(500);
	$("#popup form")[0].reset();

});

