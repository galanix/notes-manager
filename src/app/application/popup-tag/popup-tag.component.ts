import { Component, OnInit } from '@angular/core';

import {
	Data,
	 
	GeneralService, FolderService,
	TagService, NoteService
} from './index';

declare var $: any;
// import * as $ from 'jquery';

@Component({
	selector: 'app-popup-tag',
	templateUrl: './popup-tag.component.html',
	styleUrls: ['./popup-tag.component.css']
})
export class PopupTagComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
	}

	// Create tag render data in tags select and sidebar
	createTag(): void {
		if ( $("#tag_name").val() ) {
			this.tagService.updateTagsData();
			$("#popup_tag .tags_tree").find("*").remove();
			TagService.renderTagSelect(Data.structure.tags, 0);
			TagService.tagWrapper(); 
		}
		$("#popup_tag").fadeOut(500);
		(<HTMLFormElement>$("#popup_tag form")[0]).reset();
	}

	// Delete tag and render data in select and sidebar
	deleteTag(): void {
		let selectedOptionId: any = $("#popup_tag select option:selected").attr("data-tags-select-id");
		let textArea: any = $("#application #textarea_editor");
		let note: any = GeneralService.find(Data.structure.notes, textArea.attr("data-textarea-id"));
		if ( $("#popup_tag select").val() && selectedOptionId != "root" ) {
			let findedArr: any = GeneralService.findParent(Data.structure.tags, selectedOptionId);
			for (let i = 0; i < findedArr.length; i++) {
				if ( findedArr[i].id == selectedOptionId ) {
					let index: number = findedArr.indexOf(findedArr[i]);
					findedArr.splice(findedArr.indexOf(findedArr[i]), 1);
				}
			}

			for (let i = 0; i < note.tags.length; i++) {
				if ( note.tags[i] ==  selectedOptionId ) {
					let index: number = note.tags.indexOf(note.tags[i]);
					note.tags.splice(index, 1);
				}
			}
		}
		localStorage.setItem("structure", JSON.stringify(Data.structure));

		$("#popup_tag .tags_tree").find("option").not(".select_root").remove();
		TagService.renderTagSelect(Data.structure.tags, 0);
		TagService.tagWrapper(); 
		TagService.checkNoteForAddTag();
		TagService.renderTags();
		NoteService.renderNoteSize();

		(<HTMLFormElement>$("#popup_tag form")[0]).reset();
	}

}
