// Creating folders
let idCounter = 0;

let data = (localStorage.getItem("structure")) 
	? JSON.parse(localStorage.getItem("structure")) : {
		"folders": [],
		"notes": {}
	};
let select = $("#folders_tree");


function updateData() {
	let folderName =  $("#folder_name").val();


	let newFolder = {
		"id": idCounter,
		"name": folderName,
		"isParent": false,
		"children": []
	};

	if (select.val() === "Root") {
		data.folders.push(newFolder);
	}
	
	localStorage.setItem("structure", JSON.stringify(data));
	localStorage.setItem("idCounter", idCounter);
	idCounter++;

		select.append(`
			<option id="${newFolder.id}">${newFolder.name}</option>
			`);
		console.log(select.val())
	}
	
	

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

console.log($(".folders").children("li").children("ul").children());

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
	updateData();

	$("#popup").fadeOut(500);
	$("#popup form")[0].reset();

});


localStorage.clear();