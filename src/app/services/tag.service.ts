import { Injectable } from '@angular/core';

import { GeneralService } from './general.service';
import { NoteService } from './note.service';

import * as $ from 'jquery';


@Injectable()
export class TagService {

	constructor() { }

	// Render tag select list 
	static renderTagSelect(arr: any, counter: number): any {
		for(let i = 0; i < arr.length; i++) {
			let item: any = arr[i];
			let name: string = item.name;
			let id: number = item.id;

			if (item.children) {
				let dashes: string = "";
				for (let i = 0; i < counter - 1; i++) {
					dashes += "-";
				}
				$("#popup_tag .tags_tree").append(`
					<option data-tags-select-id="${id}" value="${name}">${dashes} ${name}</option>
					`);
				dashes = "";

				this.renderTagSelect(item.children, counter + 1);
			} 
		}
	}

	// Takes a folders array and turns it into a <ul>
	static parseTags(tags: any) { 
		let ul: any = $("<ul>");
		for(var i = 0; i < tags.length; i++) {
			ul.append(this.parseTag(tags[i]));
		}
		return ul;
	}

	// Takes a folder object and turns it into a <li>
	static parseTag(tag: any) { 
		let li: any = $("<li>");
		li.append(`<span data-tags-tree-id="${tag.id}" class="tag_name">
			<i class="fa tag" aria-hidden="true"></i> <i class="fa fa-tag" aria-hidden="true"></i> 
			${tag.name}</span>`);
		if(tag.children) li.append(this.parseTags(tag.children));
		return li;
	}

	// Render tags tree  with open or close folders
	static renderTagsDisplay<T>(tags: T[]) { 
		for (let key in tags) {
			let item: any = tags[key];
			let display: string = item.display;
			let id: number = item.id;
			let tagsSpan: any = $(`.tags span[data-tags-tree-id="${id}"]`);
			let tagI: any = $(`.tags span[data-tags-tree-id="${id}"] .tag`);
			if (display === "block") {
				tagsSpan.siblings("ul").css("display", "block");
			} else {
				tagsSpan.siblings("ul").css("display", "none");
			}
			if (display === "block" && tagsSpan.next("ul").children().length) {
				tagI.removeClass("fa-angle-right").addClass("fa-angle-down");
			} else {
				tagI.removeClass("fa-angle-down").addClass("fa-angle-right");
			}
			if (!tagsSpan.next("ul").children().length) {
				tagI.remove();
			}
			if (item.children)
				this.renderTagsDisplay(item.children);
		}
	}

	// Render tags list in #popup_note_tag div
	static renderNoteTagsDisplay<T>(tags: T[]) {
		for (let key in tags) {
			let item: any = tags[key];
			let name: string = item.name;
			let tagsDiv: any = $("#popup_note_tag .tag_list");
			if ( item.id != "root" ) 
				tagsDiv.append(`<span class="tag_list_tag" data-tags-tree-id="${item.id}" >${name}</span>`);
			if ( item.children )
				this.renderNoteTagsDisplay(item.children);
		}
	}

	// Check and render add_tag button in note_info
	static checkNoteForAddTag() {
		if ( $(".note_title").text().length > 0 ) { 
			$(".add_tag").css("display", "inline-block");
		}
		else
			$(".add_tag").css("display", "none");
	}

	// Check and add .selected_tag class to tags that are applied to note
	static checkSelectedTags() {
		let textArea: any = $("#application #textarea_editor");
		let spanTags: any = $(".tag_list .tag_list_tag");
		let note: any = GeneralService.find(GeneralService.data.notes, textArea.attr("data-textarea-id"));

		for (let i = 0; i < spanTags.length; i++) {
			for (let j = 0; j < note.tags.length; j++) {
				if ( note.tags[j] == $(spanTags[i]).attr("data-tags-tree-id") )
					$(spanTags[i]).addClass("selected_tag");
			}
		}
	}

	// Render tags(spans) in note_info
	static renderTags() {
		let note: any = GeneralService.find(GeneralService.data.notes, $("#application #textarea_editor").attr("data-textarea-id"));
		$(".notes_tags").find("span").remove();
		if ( note ) { 
			for (let i = 0; i < note.tags.length; i++) {
				let tag: any = GeneralService.find(GeneralService.data.tags, note.tags[i]);
				if ( tag ) {
					$(".notes_tags").append(`<span class="tag_list_tag">${tag.name}</span>`);
				}
			}
		}
	}

	// Check and render padding for tags in note_info
	static paddingCheck() {
		if ( $("#note .notes_tags span") ) $("#note .notes_tags span").css({"padding": "5px 10px", "display": "inline-block"});
		else $("#note .notes_tags span").css({"padding": "0px"});
	}

	// Wrapper for tag functions call
	 static tagWrapper() {
		$(".tags").find("*").remove();
		$(".tags").append(this.parseTags(GeneralService.data.tags));
		NoteService.renderNotes(GeneralService.data.notes);
		this.renderTagsDisplay(GeneralService.data.tags);
		NoteService.renderNoteFields();
		NoteService.renderNoteSize(-10);
	}

}
