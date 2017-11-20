export class Data {
	static structure: any = (localStorage.getItem("structure")) 
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
	}

	static idFolderCounter: any = (localStorage.getItem("idFolderCounter")) 
	? localStorage.getItem("idFolderCounter") : 0;

	static idTagCounter: any = (localStorage.getItem("idTagCounter")) 
	? localStorage.getItem("idTagCounter") : 0;

	static idNoteCounter: any = (localStorage.getItem("idNoteCounter")) 
	? localStorage.getItem("idNoteCounter") : 0;

	static markup_3cols: any = (localStorage.getItem("markup_3cols"))
	? localStorage.getItem("markup_3cols") : false;
}