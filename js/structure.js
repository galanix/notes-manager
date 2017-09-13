localStorage.clear();

// Creating folders


let data = (localStorage.getItem("structure")) 
? JSON.parse(localStorage.getItem("structure")) : {
	"folders": [],
	"notes": {}
};

let idCounter = (localStorage.getItem("idCounter")) 
? localStorage.getItem("idCounter") : 0;
let select = $("#folders_tree");
// Amount of dashes = nested level of subfolder
let dashes = "";
// Nested lvl in localStorage
let levelCounter = 0;


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


// Render select 
function renderSelect(obj) {
	for(key in obj) {
		let item = obj[key];
		let name = item.name;
		let id = item.id;
		if (item.root) levelCounter = 0;

		select.append(`
			<option id="${id}" value="${name}">${dashes} ${name}</option>
			`);

		if (item.children) {
			levelCounter ++;
			
			renderSelect(item.children);
		} 
	}
}


function updateData() {
	let folderName =  $("#folder_name").val();
	let findedObj;

	let newFolder = {
		"id": idCounter,
		"name": folderName,
		"dashes": 0,
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

renderSelect(data.folders);
idCounter++;

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
		renderSelect(data.folders);
		console.log(levelCounter);
	}
	
	$("#popup").fadeOut(500);
	$("#popup form")[0].reset();

});

// let folders = 
// [  
// {  
// 	"id":0,
// 	"name":"Folder_1",
// 	"children":[  
// 	{  
// 		"id":1,
// 		"name":"Folder_1.1",
// 		"children":[  
// 		{  
// 			"id":2,
// 			"name":"Folder_1.1.1",
// 			"children":[  
// 			{  
// 				"id":8,
// 				"name":"Folder_1.1.1.1",
// 				"children":[  

// 				]
// 			}
// 			],
// 			"isParent":true
// 		},
// 		{  
// 			"id":3,
// 			"name":"Folder_1.1.2",
// 			"children":[  

// 			]
// 		}
// 		],
// 		"isParent":true
// 	}
// 	],
// 	"isParent":true
// },
// {  
// 	"id":4,
// 	"name":"Folder_2",
// 	"children":[  
// 	{  
// 		"id":5,
// 		"name":"Folder_2.1",
// 		"children":[  

// 		]
// 	},
// 	{  
// 		"id":6,
// 		"name":"Folder_2.2",
// 		"children":[  

// 		]
// 	}
// 	],
// 	"isParent":true
// },
// {  
// 	"id":7,
// 	"name":"Folder_3",
// 	"children":[  

// 	]
// }
// ];


// function renderSelect(obj) {
// 	for(key in obj) {
// 		let item = obj[key];
// 		let name = item.name;
// 		let id = item.id;
// 		console.log(item);
// 		select.append(`
// 			<option id="${id}">${arrows}${name}</option>
// 			`);

// 		if (item.children) {
// 			renderSelect(item.children);
// 		}
// 	}
// }

// renderSelect(folders);