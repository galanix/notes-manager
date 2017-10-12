import { Component, OnInit } from '@angular/core';

import { 
	EnterFormService, GeneralService,
	FolderService, TagService, 
	NoteService 
} from './index';

import * as $ from 'jquery';

@Component({
	selector: 'app-work-space',
	templateUrl: './work-space.component.html',
	styleUrls: ['./work-space.component.css']
})
export class WorkSpaceComponent implements OnInit {

	constructor(
		private generalService: GeneralService,
		private folderService: FolderService,
		private tagService: TagService,
		private noteService: NoteService
		) { }

	ngOnInit() {
	}

// Toggle folders to open and close in tree format
	toggleFolders(): void {
		let target: any = event.target;
		let $target = $(target);
		// Toggle folders to open and close by clicking on folder name
		if ( $target.hasClass("folder_name") && $target.siblings("ul").children().length ) {
			let childUl: any = $target.siblings("ul");
			let $childUl: any = $(childUl);
			childUl.toggle();
			NoteService.renderNoteSize();
			let findedObj: any = GeneralService.find(GeneralService.data.folders, $target.attr("data-folders-tree-id"));
			let span = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
			// Change folder open or close icon and display property to render folders tree  with open or close folders
			if (findedObj.display === "block" && span.next("ul").children().length) {
				findedObj.display = "none";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				$target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
			} else {
				findedObj.display = "block";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				$target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
			}
		}
		// Toggle folders to open and close by clicking on folder icons(arrow, fodler)
		if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
			let parentUl: any = $target.parent().siblings("ul");
			let $parentUl: any = $(parentUl);
			parentUl.toggle();
			NoteService.renderNoteSize();
			let findedObj: any = GeneralService.find(GeneralService.data.folders, $target.parent().attr("data-folders-tree-id"));
			let span: any = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
			// Change folder open or close icon and display property to render folders tree  with open or close folders
			if (findedObj.display === "block" && span.next("ul").children().length) {
				findedObj.display = "none";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				if ( $target.hasClass("fa-folder-o") ) 
					$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
				else 
					$target.removeClass("fa-angle-down").addClass("fa-angle-right");
			} else {
				findedObj.display = "block";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				if ( $target.hasClass("fa-folder-o") ) 
					$target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
				else
					$target.removeClass("fa-angle-right").addClass("fa-angle-down");
			}
		}
	}

	// Toggle tags to open and close in tree format
	toggleTags():void {
		let target: any = event.target;
		let $target: any = $(target);
		// Toggle tags to open and close by clicking on folder name
		if ( $target.hasClass("tag_name") && $target.siblings("ul").children().length ) {
			let childUl: any = $target.siblings("ul");
			childUl.toggle();
			NoteService.renderNoteSize();
			let findedObj: any = GeneralService.find(GeneralService.data.tags, $target.attr("data-tags-tree-id"));
			let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
			// Change folder open or close icon and display property to render tags tree  with open or close tags
			if (findedObj.display === "block" && span.next("ul").children().length) {
				findedObj.display = "none";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				$target.children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
			} else {
				findedObj.display = "block";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				$target.children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
			}
		}

		// Toggle tags to open and close by clicking on tag icons(arrow, tag)
		if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
			let parentUl: any = $target.parent().siblings("ul");
			parentUl.toggle();
			NoteService.renderNoteSize();
			let findedObj: any = GeneralService.find(GeneralService.data.tags, $target.parent().attr("data-tags-tree-id"));
			let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
			// Change folder open or close icon and display property to render tags tree  with open or close tags
			if (findedObj.display === "block" && span.next("ul").children().length) {
				findedObj.display = "none";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				if ( $target.hasClass("fa-tag") ) 
					$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
				else 
					$target.removeClass("fa-angle-down").addClass("fa-angle-right");
			} else {
				findedObj.display = "block";
				localStorage.setItem("structure", JSON.stringify(GeneralService.data));
				if ( $target.hasClass("fa-tag") ) 
					$target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
				else
					$target.removeClass("fa-angle-right").addClass("fa-angle-down");
			}
		}
	}

	// Show note on right side of app
	showNote(): void {
		let target: any = event.target;
		let $target: any = $(target);
		let textArea: any = $("#application textarea");
		if ( $target.hasClass("note") && $(".edit").css("display") != "none" ) {
			let noteID: number = $target.attr("data-note-id");
			textArea.attr("data-textarea-id", noteID);
			NoteService.renderNoteFields();
			TagService.checkNoteForAddTag();
			TagService.renderTags();
		}
		if ( $target.parent().hasClass("note") && $(".edit").css("display") != "none" ) {
			let noteID: number = $target.parent().attr("data-note-id");
			textArea.attr("data-textarea-id", noteID);
			NoteService.renderNoteFields();
			TagService.checkNoteForAddTag();
			TagService.renderTags();
		}
		TagService.paddingCheck();
	}

	// Open add tag popup
	addTag(): void {
		$("#popup_note_tag").fadeIn(500);
		$("#popup_note_tag .tag_list").find("*").remove();
		TagService.renderNoteTagsDisplay(GeneralService.data.tags);
		TagService.checkSelectedTags();

		$(document).keydown(function(e: any) {
			if (e.keyCode == 27) {
				$("#popup_note_tag").fadeOut(500);
				(<HTMLFormElement>$("#popup_note_tag form")[0]).reset();
			}
		});

		$(".popup_close").on("click", function() {
			$("#popup_note_tag").fadeOut(500);
			(<HTMLFormElement>$("#popup_note_tag form")[0]).reset();
		});
	}

}
