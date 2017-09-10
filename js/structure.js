// Creating folders

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

$(".folders").on("click", function(e) {
	let target = e.target;
	if ( $(target).hasClass("folder_name") ) {
		let folderID = $(target).attr("id");
		console.log(folderID);
	}
	console.log(target);

});

$(".create").on("click", function() {


	let folderName =  $("#folder_name").val();
	let data = (localStorage.getItem("structure")) 
	? JSON.parse(localStorage.getItem("structure")) : {
		"folders": [],
		"notes": {}
	};

	let newFolder = {
		"id": data.folders.length,
		"name": folderName,
	};

	data.folders.push(newFolder);

	localStorage.setItem("structure", JSON.stringify(data));

	$.each( $(".folders .folder_name"), function(i, val) {
		if ( $(this).hasClass("colored") ) {
			$(this).siblings("ul").append(`
				<li>
				<span id="${newFolder.id}" class="folder_name">
				<i class="fa fa-caret-right" aria-hidden="true"></i> ${folderName}</span>
				<ul></ul>
				</li>
				`);
		} 
	});

	$("#popup").fadeOut(500);
	$("#popup form")[0].reset();


});

// function renderStructure() {
// 	let parseData = JSON.parse( localStorage.getItem("structure") );
// 	for (let i = 0; i < parseData.folders.length; i++) {
// 		$(".folders ul").html(`
// 			<li>
// 			<span  class="folder_name">
// 			<i class="fa fa-caret-right" aria-hidden="true"></i> ${folderName}</span>
// 			<ul></ul>
// 			</li>
// 			`);
// 	}
// }

// renderStructure();
localStorage.clear();