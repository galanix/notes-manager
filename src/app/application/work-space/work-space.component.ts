import { Component, OnInit, Input, 
	AfterContentChecked } from '@angular/core';

	import 'rxjs/add/operator/pairwise';
	import { Router } from '@angular/router';

	import {
		Data,

		EnterFormService, GeneralService,
		FolderService, TagService, 
		NoteService
	} from './index';

	import * as moment from 'moment';

	declare let $: any;
	declare let CKEDITOR:any;

	@Component({
		selector: 'app-work-space',
		templateUrl: './work-space.component.html',
		styleUrls: ['./work-space.component.css'],
		providers: [NoteService]
	})
	export class WorkSpaceComponent implements 
	OnInit, AfterContentChecked {

		ckeditorContent: string;
		editor: any;

		constructor(
			private generalService: GeneralService,
			private folderService: FolderService,
			private tagService: TagService,
			private noteService: NoteService,

			private router: Router
			) {  
			this.ckeditorContent = ``; 
			this.router.events.subscribe(path => {
				this.findInstanceWithUrlHint();
			});
		}

		startCall = (): void => {
			GeneralService.addSortableClass();
			GeneralService.resizeSidebar();
			FolderService.sortableFolders();
			FolderService.delRootNoteWrappersFolders();
			NoteService.dragNotesFolders();
			NoteService.dropNotesFolders();
			GeneralService.resize3dColumn();
			this.noteService.renderLastNotesInColumn();
		}

		ngOnInit() {
			EnterFormService.checkAccess(this.startCall);
			this.findInstanceWithUrlHint();
		}

		ngAfterContentChecked() {
			this.checkMarkup();
		}

		// Toggle folders to open and close in tree format
		toggleFolders(): void {
			let target: any = event.target;
			let $target: any = $(target);
			let childUl: any = $target.siblings("ul");
			// Toggle folders to open and close by clicking on folder name
			if ( $target.hasClass("folder_name") && (childUl.children().length > 1 
				|| childUl.children(".notes_wrapper").children().length) ) {
				let $childUl: any = $(childUl);
			childUl.toggle();
			NoteService.renderNoteSize();
			let findedObj: any = GeneralService.find(Data.structure.folders, $target.attr("data-folders-tree-id"));
			let span = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
			// Change folder open or close icon and display property to render folders tree  with open or close folders
			if ( findedObj.display === "block" && span.next("ul").children().length ) {
				findedObj.display = "none";
				localStorage.setItem("structure", JSON.stringify(Data.structure));
				$target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
			} else {
				findedObj.display = "block";
				localStorage.setItem("structure", JSON.stringify(Data.structure));
				$target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
			}
		}
		// Toggle folders to open and close by clicking on folder icons(arrow, fodler)
		let parentUl: any = $target.parent().siblings("ul");
		let $parentUl: any = $(parentUl);
		if( $target.hasClass("fa") && (parentUl.children().length > 1 
			|| parentUl.children(".notes_wrapper").children().length) ) {
			parentUl.toggle();
		NoteService.renderNoteSize();
		let findedObj: any = GeneralService.find(Data.structure.folders, $target.parent().attr("data-folders-tree-id"));
		let span: any = $(`.folder_name[data-folders-tree-id="${findedObj.id}"]`);
		// Change folder open or close icon and display property to render folders tree  with open or close folders
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
			if ( $target.hasClass("fa-folder-o") ) 
				$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
			else 
				$target.removeClass("fa-angle-down").addClass("fa-angle-right");
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
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
	let childUl: any = $target.siblings("ul");
	// Toggle tags to open and close by clicking on folder name
	if ( $target.hasClass("tag_name") && childUl.children().length ) {
		childUl.toggle();
		NoteService.renderNoteSize();
		let findedObj: any = GeneralService.find(Data.structure.tags, $target.attr("data-tags-tree-id"));
		let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
		// Change folder open or close icon and display property to render tags tree  with open or close tags
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
			$target.children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
			$target.children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
		}
	}

	// Toggle tags to open and close by clicking on tag icons(arrow, tag)
	if( $target.hasClass("fa") && $target.parent().siblings("ul").children().length ) {
		let parentUl: any = $target.parent().siblings("ul");
		parentUl.toggle();
		NoteService.renderNoteSize();
		let findedObj: any = GeneralService.find(Data.structure.tags, $target.parent().attr("data-tags-tree-id"));
		let span: any = $(`.tag_name[data-tags-tree-id="${findedObj.id}"]`);
		// Change folder open or close icon and display property to render tags tree  with open or close tags
		if (findedObj.display === "block" && span.next("ul").children().length) {
			findedObj.display = "none";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
			if ( $target.hasClass("fa-tag") ) 
				$target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
			else 
				$target.removeClass("fa-angle-down").addClass("fa-angle-right");
		} else {
			findedObj.display = "block";
			localStorage.setItem("structure", JSON.stringify(Data.structure));
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
	let textArea: any = $("#application #textarea_editor");
	let editor: any = $("#application .note_editor");
	if ( $target.hasClass("note") && $(".edit").css("display") != "none" ) {
		let noteID: number = $target.attr("data-note-id");
		let noteObj: any = GeneralService.find(Data.structure.notes, noteID);

		$(".creation_date").html(`Creation date: ${moment(noteObj.date).format("DD.MM.YYYY, HH:mm:ss")}`);
		$(".note_changes").html(`Changes: ${noteObj.changesCounter}`);
		$(".last_change").html(`Last change: ${noteObj.lastChange}`);

		textArea.attr("data-textarea-id", noteID);
		editor.attr("data-editor-id", noteID);
		NoteService.renderNoteFields();
		TagService.checkNoteForAddTag();
		TagService.renderTags();
	}
	if ( $target.parent().hasClass("note") && $(".edit").css("display") != "none" ) {
		let noteID: number = $target.parent().attr("data-note-id");
		let noteObj: any = GeneralService.find(Data.structure.notes, noteID);

		$(".creation_date").html(`Creation date: ${moment(noteObj.date).format("DD.MM.YYYY, HH:mm:ss")}`);
		$(".note_changes").html(`Changes: ${noteObj.changesCounter}`);
		$(".last_change").html(`Last change: ${noteObj.lastChange}`);

		textArea.attr("data-textarea-id", noteID);
		editor.attr("data-editor-id", noteID);
		NoteService.renderNoteFields();
		TagService.checkNoteForAddTag();
		TagService.renderTags();
	}
	TagService.paddingCheck();
}

// Show hint(user location) in address bar
showUserLocation(): void {
	let $target: any = $(event.target);
	if ( $target.parent().attr("data-folders-tree-id") != "root" && $target.attr("data-folders-tree-id") != "root" 
		&& $target.hasClass("folder_name") || $target.parent().hasClass("folder_name") ) {
		let span: any = $target.hasClass("folder_name") ? $target : $target.parent(".folder_name");
	let folder: any = GeneralService.find(Data.structure.folders, span.attr("data-folders-tree-id"));
	GeneralService.removeHash();
	window.location.href += `#folder_id:${folder.id}`;
}
if ( $target.hasClass("note") || $target.parent().hasClass("note") ) {
	let span: any = $target.hasClass("note") ? $target : $target.parent(".note");
	let note: any = GeneralService.find(Data.structure.notes, span.attr("data-note-id"));
	GeneralService.removeHash();
	window.location.href += `#note_id:${note.id}`;
}
if ( $target.parent().attr("data-tags-tree-id") != "root" && $target.attr("data-tags-tree-id") != "root" 
	&& $target.hasClass("tag_name") || $target.parent().hasClass("tag_name") ) {
	let span: any = $target.hasClass("tag_name") ? $target : $target.parent(".tag_name");
let tag: any = GeneralService.find(Data.structure.tags, span.attr("data-tags-tree-id"));
GeneralService.removeHash();
window.location.href += `#tag_id:${tag.id}`;
}
}

// Find instance(folder, note, tag) by url with hint
findInstanceWithUrlHint(): void {
	let url: string = window.location.href;
	let notes: any = [];
	if ( url.indexOf("folder_id") != -1 ) {
		let id: any = url.split('folder_id:')[1];
		let folder: any = GeneralService.find(Data.structure.folders, id);
		$(".notes_info h2").text(`Notes in folder ${folder.name}:`);
		GeneralService.addNotesInFolder(folder, notes);
		NoteService.renderNotesInColumn(notes);
	}
	if ( url.indexOf("tag_id") != -1 ) {
		let id: any = url.split('tag_id:')[1];
		let tag: any = GeneralService.find(Data.structure.tags, id);
		$(".notes_info h2").text(`Notes with tag ${tag.name}:`);
		$(".notes_info h2").text(`Notes with tag ${tag.name}:`);
		GeneralService.addNotesWithTag(tag, notes);
		NoteService.renderNotesInColumn(notes);
	}

	if ( url.indexOf("note_id") != -1 ) {
		let id: any = url.split('note_id:')[1];
		let note: any = GeneralService.find(Data.structure.notes, id);

		$("#note .note_title").html(note.title);
		$(".cke_wysiwyg_frame").contents().find('body').html(note.text);
		$("#application #textarea_editor").html(note.text);
		let folder = GeneralService.find(Data.structure.folders, note.folder);
		$("#note .notes_folder").html(`<i class="fa fa-folder-o" aria-hidden="true"></i> ${folder.name}`)

	}
} 

// Render folder notes in additional column
renderFolderNotesInColumn(): void {
	let target: any = event.target;
	let $target: any = $(target);
	let notes: any = [];
	if ( $target.attr("data-folders-tree-id") != "root" 
		&& $target.parent(".folder_name").attr("data-folders-tree-id") != "root" ) { 
		if ( $target.hasClass("folder_name") ) {
			let folder: any = GeneralService.find(Data.structure.folders, $target.attr("data-folders-tree-id"));
			$(".notes_info h2").text(`Notes in folder ${folder.name}:`);
			GeneralService.addNotesInFolder(folder, notes);
			NoteService.renderNotesInColumn(notes);
		}
		else if ( $target.parent(".folder_name") && $target.hasClass("fa") && (!$target.hasClass("fa fa-sticky-note-o")) ) {
			let folder: any = GeneralService.find(Data.structure.folders, $target.parent(".folder_name").attr("data-folders-tree-id"));
			$(".notes_info h2").text(`Notes in folder ${folder.name}:`);
			GeneralService.addNotesInFolder(folder, notes);
			NoteService.renderNotesInColumn(notes);
		}
	}
}

// Render tag notes in additional column
renderTagNotesInColumn(): void {
	let target: any = event.target;
	let $target: any = $(target);
	let notes: any = [];

	if ( $target.attr("data-tags-tree-id") != "root" 
		&& $target.parent(".tag_name").attr("data-tags-tree-id") != "root" ) { 
		if ( $target.hasClass("tag_name") ) {
			let tag: any = GeneralService.find(Data.structure.tags, $target.attr("data-tags-tree-id"));
			$(".notes_info h2").text(`Notes with tag ${tag.name}:`);
			GeneralService.addNotesWithTag(tag, notes);
			NoteService.renderNotesInColumn(notes);
		} 
		else if ( $target.parent(".tag_name") && $target.hasClass("fa") && (!$target.hasClass("fa fa-sticky-note-o") )) {
			let tag: any = GeneralService.find(Data.structure.tags, $target.parent(".tag_name").attr("data-tags-tree-id"));
			$(".notes_info h2").text(`Notes with tag ${tag.name}:`);
			GeneralService.addNotesWithTag(tag, notes);
			NoteService.renderNotesInColumn(notes);
		}
	}
}


// Open add tag popup
addTag(): void {
	$("#popup_note_tag").fadeIn(500);
	$("#popup_note_tag .tag_list").find("*").remove();
	TagService.renderNoteTagsDisplay(Data.structure.tags);
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


// Check markup flag and set 2 or 3 columns markup
checkMarkup():void {
	let markup_3cols: any = localStorage.getItem("markup_3cols");
	if ( markup_3cols == "true" ) {
		$(".notes_info_container").show();
		GeneralService.setColumnHeight();
		// GeneralService.resize3dColumn();
	} 
	else if ( markup_3cols == "false" ) {
		$(".notes_info_container").hide();
	}
}


}
