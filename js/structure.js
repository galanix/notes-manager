localStorage.clear();

// Creating folders
let idCounter = 0;

let data = (localStorage.getItem("structure")) 
? JSON.parse(localStorage.getItem("structure")) : {
	"folders": [],
	"notes": {}
};
let select = $("#folders_tree");
let arrows = "";

function drawDashes(obj) {
	for (key in obj) {
		let item = obj[key];
		if (item.isParent) arrows += "-";
		
		if (item.children) {
			drawDashes(item.children);
		}
	}
}

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

  // function renderSelect(obj) {
  // 	for(key in obj) {
  // 		let item = obj[key];
  // 		let name = obj.name;
  // 		let id = obj.id;
  // 		console.log(item);
  // 			select.append(`
  // 			<option id="${id}">${arrows}${name}</option>
  // 			`);

  // 		if (obj.children) {
  // 			renderSelect(obj.children);
  // 		}
  // 	}
  // }


  function updateData() {
  	let folderName =  $("#folder_name").val();
  	let findedObj;

  	let newFolder = {
  		"id": idCounter,
  		"name": folderName,
  		"children": []
  	};

  	if (select.val() === "Root") {
  		data.folders.push(newFolder);
  	} else {
  		findedObj =	find(data.folders, $("#folders_tree option:selected").attr("id"));
  		findedObj.children.push(newFolder);
  		findedObj.isParent = true;
  	}

  	localStorage.setItem("structure", JSON.stringify(data));
  	localStorage.setItem("idCounter", idCounter);
  	idCounter++;
  	
  	drawDashes(findedObj);
  	select.append(`
  		<option id="${newFolder.id}">${arrows}${newFolder.name}</option>
  		`);

  	arrows = "";
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
	if ( $("#folder_name").val() ) updateData();

	
	$("#popup").fadeOut(500);
	$("#popup form")[0].reset();

});

let folders = 
	[  
      {  
         "id":0,
         "name":"Folder_1",
         "children":[  
            {  
               "id":1,
               "name":"Folder_1.1",
               "children":[  
                  {  
                     "id":2,
                     "name":"Folder_1.1.1",
                     "children":[  

                     ]
                  }
               ],
               "isParent":true
            }
         ],
         "isParent":true
      },
      {  
         "id":3,
         "name":"Folder_2",
         "children":[  
            {  
               "id":4,
               "name":"Folder_2.1",
               "children":[  

               ]
            }
         ],
         "isParent":true
      },
      {  
         "id":5,
         "name":"Folder_3",
         "children":[  

         ]
      }
   ];

	  function renderSelect(obj) {
  	for(key in obj) {
  		let item = obj[key];
  		let name = item.name;
  		let id = item.id;
  		console.log(name);
  			select.append(`
  			<option id="${id}">${arrows}${name}</option>
  			`);

  		if (obj.children) {
  			renderSelect(obj.children);
  		}
  	}
  }

  	renderSelect(folders);