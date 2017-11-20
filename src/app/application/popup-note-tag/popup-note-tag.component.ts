import { Component, OnInit } from '@angular/core';

import {
	Data,

	GeneralService, FolderService,
	TagService, NoteService
} from './index';

declare var $: any;

@Component({
	selector: 'app-popup-note-tag',
	templateUrl: './popup-note-tag.component.html',
	styleUrls: ['./popup-note-tag.component.css']
})
export class PopupNoteTagComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
	}

	// Toggle class selected_tag on click to add tag
	toggleTag(): void {
		let target: any = event.target;
		let $target: any = $(target);
		let textArea: any = $("#application #textarea_editor");
		let note: any = GeneralService.find(Data.structure.notes, textArea.attr("data-textarea-id"));
		if ( $target.hasClass("tag_list_tag") ) {
			$target.toggleClass("selected_tag");
			note.tags = [];
			$.each($(".tag_list .tag_list_tag"), function() {
				if ( $(this).hasClass("selected_tag") ) {
					note.tags.push( $(this).attr("data-tags-tree-id") );
					localStorage.setItem("structure", JSON.stringify(Data.structure));
				}
			});
		}
	}

	// Create and add tag render data in tags list and sidebar
	createTag(): void {
		if ( $("#tag_note_name").val() ) {
			this.tagService.updateTagsData();
			$("#popup_tag .tags_tree").find("*").remove();
			TagService.renderTagSelect(Data.structure.tags, 0);
			TagService.tagWrapper(); 
			$("#popup_note_tag .tag_list").find("*").remove();
			TagService.renderNoteTagsDisplay(Data.structure.tags);
			TagService.checkSelectedTags();
		}

		(<HTMLFormElement>$("#popup_note_tag form")[0]).reset();
	}

	// Add selected tags to note
	addTags(): void {
		let selectedTags: any = [];
		let textArea: any = $("#application #textarea_editor");
		let note: any = GeneralService.find(Data.structure.notes, textArea.attr("data-textarea-id"));

		$("#popup_note_tag .tag_list_tag").each(function() {
			if ( $(this).hasClass("selected_tag") )
				selectedTags.push( $(this).attr("data-tags-tree-id") );
		});

		note.tags = selectedTags;
		localStorage.setItem("structure", JSON.stringify(Data.structure));

		TagService.tagWrapper(); 
		TagService.paddingCheck();
		TagService.checkNoteForAddTag();
		TagService.renderTags();

		$("#popup_note_tag").fadeOut(500);
	}

}