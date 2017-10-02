import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";
import { updateTagsData } from "./main";

export class TagEvents {

	static tagEvents() {
		// Open create tag popup
		$(".btn_tags").on("click", function() {

			$("#popup_tag").fadeIn(500);
			$(document).keydown(function(e: any) {
				if (e.keyCode == 27) {
					$("#popup_tag").fadeOut(500);
					$("#popup_tag form")[0].reset();
				}
			});


			$(".popup_close").on("click", function() {
				$("#popup_tag").fadeOut(500);
				$("#popup_tag form")[0].reset();
			});
		});

		// Open add tag popup
		$(".add_tag").on("click", function() {
			$("#popup_note_tag").fadeIn(500);
			$("#popup_note_tag .tag_list").find("*").remove();
			Tag.renderNoteTagsDisplay(data.tags);
			Tag.checkSelectedTags();

			$(document).keydown(function(e: any) {
				if (e.keyCode == 27) {
					$("#popup_note_tag").fadeOut(500);
					$("#popup_note_tag form")[0].reset();
				}
			});

			$(".popup_close").on("click", function() {
				$("#popup_note_tag").fadeOut(500);
				$("#popup_note_tag form")[0].reset();
			});

		});

		// Toggle class selected_tag on click to add tag
		$("#popup_note_tag").on("click", function(e: any) {
			let target: any = e.target;
			let textArea: any = $("#application textarea");
			let note: any = find(data.notes, textArea.attr("data-textarea-id"));
			if ( $(target).hasClass("tag_list_tag") ) {
				$(target).toggleClass("selected_tag");
				note.tags = [];
				$.each($(".tag_list .tag_list_tag"), function() {
					if ( $(this).hasClass("selected_tag") ) {
						note.tags.push( $(this).attr("data-tags-tree-id") );
						localStorage.setItem("structure", JSON.stringify(data));
					}
				});
			}
		});

		// Create tag render data in tags select and sidebar
		$("#popup_tag .create_tag").on("click", function() {
			if ( $("#tag_name").val() ) {
				updateTagsData();
				$("#popup_tag .tags_tree").find("*").remove();
				Tag.renderTagSelect(data.tags, 0);
				Tag.tagWrapper(); 
			}

			$("#popup_tag").fadeOut(500);
			$("#popup_tag form")[0].reset();
		});

		// Create and add tag render data in tags list and sidebar
		$("#popup_note_tag .create_add_tag").on("click", function() {
			if ( $("#tag_note_name").val() ) {
				updateTagsData();
				$("#popup_tag .tags_tree").find("*").remove();
				Tag.renderTagSelect(data.tags, 0);
				Tag.tagWrapper(); 
				$("#popup_note_tag .tag_list").find("*").remove();
				Tag.renderNoteTagsDisplay(data.tags);
				Tag.checkSelectedTags();
			}

			$("#popup_note_tag form")[0].reset();
		});

		$("#popup_note_tag .add_note_tag").on("click", function() {
			let selectedTags: any = [];
			let textArea: any = $("#application textarea");
			let note: any = find(data.notes, textArea.attr("data-textarea-id"));


			$("#popup_note_tag .tag_list_tag").each(function() {
				if ( $(this).hasClass("selected_tag") )
					selectedTags.push( $(this).attr("data-tags-tree-id") );
			});

			note.tags = selectedTags;
			localStorage.setItem("structure", JSON.stringify(data));

			Tag.tagWrapper(); 
			Tag.paddingCheck();
			Tag.checkNoteForAddTag();
			Tag.renderTags();

			$("#popup_note_tag").fadeOut(500);

		});

		// Delete tag and render data in select and sidebar
		$("#popup_tag .delete_tag").on("click", function() {
			let selectedOptionId: any = $("#popup_tag select option:selected").attr("data-tags-select-id");
			let textArea: any = $("#application textarea");
			let note: any = find(data.notes, textArea.attr("data-textarea-id"));
			if ( $("#popup_tag select").val() && selectedOptionId != "root" ) {
				let findedArr: any = findParent(data.tags, selectedOptionId);
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
			localStorage.setItem("structure", JSON.stringify(data));

			$("#popup_tag .tags_tree").find("option").not(".select_root").remove();
			Tag.renderTagSelect(data.tags, 0);
			Tag.tagWrapper(); 
			Tag.checkNoteForAddTag();
			Tag.renderTags();
			Note.renderNoteSize();


			$("#popup_tag form")[0].reset();
		});

		// Toggle tags to open and close in tree format
		$(".tags").on("dblclick", function(e: any) {
			let target: any = e.target;
			let $target: any = $(target);
			// Toggle tags to open and close by clicking on folder name
			if ( $target.hasClass("tag_name") && $target.siblings("ul").children().length ) {
				let childUl: any = $target.siblings("ul");
				childUl.toggle();
				Note.renderNoteSize();
				let findedObj: any = find(data.tags, $target.attr("data-tags-tree-id"));
				let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
				// Change folder open or close icon and display property to render tags tree  with open or close tags
				if (findedObj.display === "block" && span.next("ul").children().length) {
					findedObj.display = "none";
					localStorage.setItem("structure", JSON.stringify(data));
					$target.children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
				} else {
					findedObj.display = "block";
					localStorage.setItem("structure", JSON.stringify(data));
					$target.children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
				}
			}

			// Toggle tags to open and close by clicking on tag icons(arrow, tag)
			if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
				let parentUl: any = $target.parent().siblings("ul");
				parentUl.toggle();
				Note.renderNoteSize();
				let findedObj: any = find(data.tags, $target.parent().attr("data-tags-tree-id"));
				let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
				// Change folder open or close icon and display property to render tags tree  with open or close tags
				if (findedObj.display === "block" && span.next("ul").children().length) {
					findedObj.display = "none";
					localStorage.setItem("structure", JSON.stringify(data));
					if ( $target.hasClass("fa-tag") ) 
						$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
					else 
						$target.removeClass("fa-angle-down").addClass("fa-angle-right");
				} else {
					findedObj.display = "block";
					localStorage.setItem("structure", JSON.stringify(data));
					if ( $target.hasClass("fa-tag") ) 
						$target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
					else
						$target.removeClass("fa-angle-right").addClass("fa-angle-down");
				}
			}
		});
	}
}