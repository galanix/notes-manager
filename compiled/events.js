define(["require", "exports", "./main", "./main"], function (require, exports, main_1, main_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    $("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
    noteInstance.renderNoteSize();
    $(window).resize(function () {
        $("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
        noteInstance.renderNoteSize();
    });
    $(".btn_folders").on("click", function () {
        $("#popup_folder").fadeIn(500);
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                $("#popup_folder").fadeOut(500);
                $("#popup_folder form")[0].reset();
            }
        });
        $(".popup_close").on("click", function () {
            $("#popup_folder").fadeOut(500);
            $("#popup_folder form")[0].reset();
        });
    });
    $(".btn_notes").on("click", function () {
        $("#popup_note").fadeIn(500);
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                $("#popup_note").fadeOut(500);
                $("#popup_note form")[0].reset();
            }
        });
        $(".popup_close").on("click", function () {
            $("#popup_note").fadeOut(500);
            $("#popup_note form")[0].reset();
        });
    });
    $(".btn_tags").on("click", function () {
        $("#popup_tag").fadeIn(500);
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                $("#popup_tag").fadeOut(500);
                $("#popup_tag form")[0].reset();
            }
        });
        $(".popup_close").on("click", function () {
            $("#popup_tag").fadeOut(500);
            $("#popup_tag form")[0].reset();
        });
    });
    $(".add_tag").on("click", function () {
        $("#popup_note_tag").fadeIn(500);
        $("#popup_note_tag .tag_list").find("*").remove();
        tagInstance.renderNoteTagsDisplay(main_1.data.tags);
        tagInstance.checkSelectedTags();
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                $("#popup_note_tag").fadeOut(500);
                $("#popup_note_tag form")[0].reset();
            }
        });
        $(".popup_close").on("click", function () {
            $("#popup_note_tag").fadeOut(500);
            $("#popup_note_tag form")[0].reset();
        });
    });
    $("#popup_note_tag").on("click", function (e) {
        var target = e.target;
        var textArea = $("#application textarea");
        var note = main_2.find(main_1.data.notes, textArea.attr("data-textarea-id"));
        if ($(target).hasClass("tag_list_tag")) {
            $(target).toggleClass("selected_tag");
            note.tags = [];
            $.each($(".tag_list .tag_list_tag"), function () {
                if ($(this).hasClass("selected_tag")) {
                    note.tags.push($(this).attr("data-tags-tree-id"));
                    localStorage.setItem("structure", JSON.stringify(main_1.data));
                }
            });
        }
    });
    $("#popup_folder .create_folder").on("click", function () {
        if ($("#folder_name").val()) {
            updateFoldersData();
            $(".folders_tree").find("option").not(".select_root").remove();
            folderInstance.renderFolderSelect(main_1.data.folders, 0);
            $(".folders").find("*").remove();
            $(".folders").append(folderInstance.parseFolders(main_1.data.folders));
            noteInstance.renderNotes(main_1.data.notes);
            folderInstance.renderFoldersDisplay(main_1.data.folders);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
        }
        $("#popup_folder").fadeOut(500);
        $("#popup_folder form")[0].reset();
    });
    $("#popup_tag .create_tag").on("click", function () {
        if ($("#tag_name").val()) {
            updateTagsData();
            $("#popup_tag .tags_tree").find("*").remove();
            tagInstance.renderTagSelect(main_1.data.tags, 0);
            $(".tags").find("*").remove();
            $(".tags").append(tagInstance.parseTags(main_1.data.tags));
            noteInstance.renderNotes(main_1.data.notes);
            tagInstance.renderTagsDisplay(main_1.data.tags);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
        }
        $("#popup_tag").fadeOut(500);
        $("#popup_tag form")[0].reset();
    });
    $("#popup_note_tag .create_add_tag").on("click", function () {
        if ($("#tag_note_name").val()) {
            updateTagsData();
            $("#popup_tag .tags_tree").find("*").remove();
            tagInstance.renderTagSelect(main_1.data.tags, 0);
            $(".tags").find("*").remove();
            $(".tags").append(tagInstance.parseTags(main_1.data.tags));
            noteInstance.renderNotes(main_1.data.notes);
            tagInstance.renderTagsDisplay(main_1.data.tags);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
            $("#popup_note_tag .tag_list").find("*").remove();
            tagInstance.renderNoteTagsDisplay(main_1.data.tags);
            tagInstance.checkSelectedTags();
        }
        $("#popup_note_tag form")[0].reset();
    });
    $("#popup_note_tag .add_note_tag").on("click", function () {
        var selectedTags = [];
        var textArea = $("#application textarea");
        var note = main_2.find(main_1.data.notes, textArea.attr("data-textarea-id"));
        $("#popup_note_tag .tag_list_tag").each(function () {
            if ($(this).hasClass("selected_tag"))
                selectedTags.push($(this).attr("data-tags-tree-id"));
        });
        note.tags = selectedTags;
        localStorage.setItem("structure", JSON.stringify(main_1.data));
        $(".tags").find("*").remove();
        $(".tags").append(tagInstance.parseTags(main_1.data.tags));
        noteInstance.renderNotes(main_1.data.notes);
        tagInstance.renderTagsDisplay(main_1.data.tags);
        noteInstance.renderNoteFields();
        tagInstance.paddingCheck();
        tagInstance.checkNoteForAddTag();
        tagInstance.renderTags();
        $("#popup_note_tag").fadeOut(500);
    });
    $("#popup_folder .delete_folder").on("click", function () {
        var selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
        if ($("#popup_folder select").val() && selectedOptionId != "root") {
            for (var i = 0; i < main_1.data.notes.length; i++) {
                if (main_1.data.notes[i].folder == selectedOptionId) {
                    var index = main_1.data.notes.indexOf(main_1.data.notes[i]);
                    main_1.data.notes.splice(index, 1);
                }
            }
            var findedArr = findParent(main_1.data.folders, selectedOptionId);
            for (var i = 0; i < findedArr.length; i++) {
                if (findedArr[i].id == selectedOptionId) {
                    var index = findedArr.indexOf(findedArr[i]);
                    findedArr.splice(index, 1);
                }
            }
            localStorage.setItem("structure", JSON.stringify(main_1.data));
            $(".folders_tree").find("option").not(".select_root").remove();
            folderInstance.renderFolderSelect(main_1.data.folders, 0);
            $(".folders").find("*").remove();
            $(".folders").append(folderInstance.parseFolders(main_1.data.folders));
            noteInstance.renderNotes(main_1.data.notes);
            folderInstance.renderFoldersDisplay(main_1.data.folders);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
        }
        $("#popup_folder form")[0].reset();
    });
    $("#popup_tag .delete_tag").on("click", function () {
        var selectedOptionId = $("#popup_tag select option:selected").attr("data-tags-select-id");
        var textArea = $("#application textarea");
        var note = main_2.find(main_1.data.notes, textArea.attr("data-textarea-id"));
        if ($("#popup_tag select").val() && selectedOptionId != "root") {
            var findedArr = findParent(main_1.data.tags, selectedOptionId);
            for (var i = 0; i < findedArr.length; i++) {
                if (findedArr[i].id == selectedOptionId) {
                    var index = findedArr.indexOf(findedArr[i]);
                    findedArr.splice(findedArr.indexOf(findedArr[i]), 1);
                }
            }
            for (var i = 0; i < note.tags.length; i++) {
                if (note.tags[i] == selectedOptionId) {
                    var index = note.tags.indexOf(note.tags[i]);
                    note.tags.splice(index, 1);
                }
            }
        }
        localStorage.setItem("structure", JSON.stringify(main_1.data));
        $("#popup_tag .tags_tree").find("option").not(".select_root").remove();
        tagInstance.renderTagSelect(main_1.data.tags, 0);
        $(".tags").find("*").remove();
        $(".tags").append(tagInstance.parseTags(main_1.data.tags));
        noteInstance.renderNotes(main_1.data.notes);
        tagInstance.renderTagsDisplay(main_1.data.tags);
        noteInstance.renderNoteFields();
        tagInstance.checkNoteForAddTag();
        tagInstance.renderTags();
        noteInstance.renderNoteSize();
        $("#popup_tag form")[0].reset();
    });
    $("#popup_note .create_note").on("click", function () {
        var selectedOptionId = $("#popup_note select option:selected").attr("data-folders-select-id");
        var textArea = $("#application textarea");
        if ($("#note_name").val() && selectedOptionId != "root") {
            updateNotesData();
            $(".folders").find("*").remove();
            $(".folders").append(folderInstance.parseFolders(main_1.data.folders));
            noteInstance.renderNotes(main_1.data.notes);
            folderInstance.renderFoldersDisplay(main_1.data.folders);
        }
        var latestNote = noteInstance.findLatestNote();
        textArea.attr("data-textarea-id", latestNote.id);
        noteInstance.renderNoteFields();
        tagInstance.checkNoteForAddTag();
        tagInstance.renderTags();
        noteInstance.renderNoteSize();
        $("#popup_note").fadeOut(500);
        $("#popup_note form")[0].reset();
    });
    $("#sidebar").on("click", function (e) {
        var target = e.target;
        var textArea = $("#application textarea");
        if ($(target).hasClass("note") && $(".edit").css("display") != "none") {
            var noteID = $(target).attr("data-note-id");
            textArea.attr("data-textarea-id", noteID);
            noteInstance.renderNoteFields();
            tagInstance.checkNoteForAddTag();
            tagInstance.renderTags();
        }
        if ($(target).parent().hasClass("note") && $(".edit").css("display") != "none") {
            var noteID = $(target).parent().attr("data-note-id");
            textArea.attr("data-textarea-id", noteID);
            noteInstance.renderNoteFields();
            tagInstance.checkNoteForAddTag();
            tagInstance.renderTags();
        }
        tagInstance.paddingCheck();
    });
    $(".edit").on("click", function () {
        var workTextarea = $("#application textarea");
        if (workTextarea.val()) {
            $(".edit").css("display", "none");
            $(".delete_note").css("display", "inline-block");
            $(".save_note").css("display", "inline-block");
            workTextarea.removeAttr("readonly");
        }
    });
    $(".save_note").on("click", function () {
        var workTextarea = $("#application textarea");
        for (var i = 0; i < main_1.data.notes.length; i++) {
            if (main_1.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                main_1.data.notes[i].text = workTextarea.val();
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
        }
        $(".edit").css("display", "inline-block");
        $(".delete_note").css("display", "none");
        $(".save_note").css("display", "none");
        workTextarea.prop("readonly", true);
    });
    $(".delete_note").on("click", function () {
        var workTextarea = $("#application textarea");
        for (var i = 0; i < main_1.data.notes.length; i++) {
            if (main_1.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                var index = main_1.data.notes.indexOf(main_1.data.notes[i]);
                main_1.data.notes.splice(index, 1);
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
            noteInstance.renderNotes(main_1.data.notes);
            folderInstance.renderFoldersDisplay(main_1.data.folders);
        }
        var latestNote = noteInstance.findLatestNote();
        if (latestNote) {
            workTextarea.attr("data-textarea-id", latestNote.id);
            noteInstance.renderNoteFields();
            tagInstance.checkNoteForAddTag();
            tagInstance.renderTags();
            noteInstance.renderNoteSize();
        }
        $(".edit").css("display", "inline-block");
        $(".delete_note").css("display", "none");
        $(".save_note").css("display", "none");
        workTextarea.prop("readonly", true);
    });
    $(".folders").on("dblclick", function (e) {
        var target = e.target;
        if ($(target).hasClass("folder_name") && $(target).siblings("ul").children().length) {
            var childUl = $(target).siblings("ul");
            childUl.toggle();
            if ($(childUl).css("display").toLowerCase() === "none") {
                $(target).children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
            }
            if ($(childUl).css("display").toLowerCase() === "block") {
                $(target).children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
            }
            noteInstance.renderNoteSize();
            var findedObj = main_2.find(main_1.data.folders, $(target).attr("data-folders-tree-id"));
            var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
        }
        if ($(target).hasClass("fa") && $(target).parent().siblings("ul").children().length) {
            var parentUl = $(target).parent().siblings("ul");
            parentUl.toggle();
            if ($(parentUl).css("display").toLowerCase() === "none") {
                if ($(target).hasClass("fa-folder-o"))
                    $(target).siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
                else
                    $(target).removeClass("fa-angle-down").addClass("fa-angle-right");
            }
            if ($(parentUl).css("display").toLowerCase() === "block") {
                if ($(target).hasClass("fa-folder-o"))
                    $(target).siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
                else
                    $(target).removeClass("fa-angle-right").addClass("fa-angle-down");
            }
            noteInstance.renderNoteSize();
            var findedObj = main_2.find(main_1.data.folders, $(target).parent().attr("data-folders-tree-id"));
            var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
        }
    });
    $(".tags").on("dblclick", function (e) {
        var target = e.target;
        if ($(target).hasClass("tag_name") && $(target).siblings("ul").children().length) {
            var childUl = $(target).siblings("ul");
            childUl.toggle();
            if ($(childUl).css("display").toLowerCase() === "none") {
                $(target).children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
            }
            if ($(childUl).css("display").toLowerCase() === "block") {
                $(target).children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
            }
            noteInstance.renderNoteSize();
            var findedObj = main_2.find(main_1.data.tags, $(target).attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
        }
        if ($(target).hasClass("fa") && $(target).parent().siblings("ul").children().length) {
            var parentUl = $(target).parent().siblings("ul");
            parentUl.toggle();
            if ($(parentUl).css("display").toLowerCase() === "none") {
                if ($(target).hasClass("fa-tag"))
                    $(target).siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
                else
                    $(target).removeClass("fa-angle-down").addClass("fa-angle-right");
            }
            if ($(parentUl).css("display").toLowerCase() === "block") {
                if ($(target).hasClass("fa-tag"))
                    $(target).siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
                else
                    $(target).removeClass("fa-angle-right").addClass("fa-angle-down");
            }
            noteInstance.renderNoteSize();
            var findedObj = main_2.find(main_1.data.tags, $(target).parent().attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(main_1.data));
            }
        }
    });
});
//# sourceMappingURL=events.js.map