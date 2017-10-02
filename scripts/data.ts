export let data: any = (localStorage.getItem("structure")) 
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