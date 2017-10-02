import { Folder } from "./folder";
import { Tag } from "./tag";
import { Note } from "./note";

import { data } from "./data";
import { find } from "./main";
import { findParent } from "./main";

export class GeneralEvents {

	static generalEvents() {
		
		if ( $("#application textarea").attr("data-textarea-id") ) 
			$("#application textarea").attr("data-textarea-id", Note.findLatestNote().id);

		$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
		Note.renderNoteSize();

		$(window).resize(function() {
			$("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
			Note.renderNoteSize();
		});

		// Show note on right side of app
		$("#sidebar").on("click", function(e: any) {
			let target: any = e.target;
			let $target: any = $(target);
			let textArea: any = $("#application textarea");
			if ( $target.hasClass("note") && $(".edit").css("display") != "none" ) {
				let noteID: number = $target.attr("data-note-id");
				textArea.attr("data-textarea-id", noteID);
				Note.renderNoteFields();
				Tag.checkNoteForAddTag();
				Tag.renderTags();
			}
			if ( $target.parent().hasClass("note") && $(".edit").css("display") != "none" ) {
				let noteID: number = $target.parent().attr("data-note-id");
				textArea.attr("data-textarea-id", noteID);
				Note.renderNoteFields();
				Tag.checkNoteForAddTag();
				Tag.renderTags();
			}
			Tag.paddingCheck();
		});

		// Remove attr readonly from textarea. Also shows save and delete buttons. Hide edit button.
		$(".edit").on("click", function() {
			let workTextarea: any = $("#application textarea");
			if ( workTextarea.val() ) {
				$(".edit").css("display", "none");
				$(".delete_note").css("display", "inline-block");
				$(".save_note").css("display", "inline-block");
				workTextarea.removeAttr("readonly");
			}
		});
	}
}