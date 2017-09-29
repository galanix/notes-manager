define(["require", "exports", "./folder", "./tag", "./note"], function (require, exports, folder_1, tag_1, note_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = (localStorage.getItem("structure"))
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
    var idFolderCounter = (localStorage.getItem("idFolderCounter"))
        ? localStorage.getItem("idFolderCounter") : 0;
    var idTagCounter = (localStorage.getItem("idTagCounter"))
        ? localStorage.getItem("idTagCounter") : 0;
    var idNoteCounter = (localStorage.getItem("idNoteCounter"))
        ? localStorage.getItem("idNoteCounter") : 0;
    function find(source, id) {
        for (var key in source) {
            var item = source[key];
            if (item.id == id)
                return item;
            if (item.children) {
                var subresult = find(item.children, id);
                if (subresult)
                    return subresult;
            }
        }
        return null;
    }
    exports.find = find;
    function findParent(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var children = item.children;
            for (var j = 0; j < children.length; j++) {
                var child = item.children[j];
                var childID = child.id;
                if (childID == id)
                    return children;
                if (item.children) {
                    var subresult = findParent(item.children, id);
                    if (subresult)
                        return subresult;
                }
            }
        }
        return null;
    }
    exports.findParent = findParent;
    function tagWrapper() {
        $(".tags").find("*").remove();
        $(".tags").append(tag_1.Tag.parseTags(exports.data.tags));
        note_1.Note.renderNotes(exports.data.notes);
        tag_1.Tag.renderTagsDisplay(exports.data.tags);
        note_1.Note.renderNoteFields();
        note_1.Note.renderNoteSize();
    }
    function noteWrapper() {
        note_1.Note.renderNoteFields();
        tag_1.Tag.checkNoteForAddTag();
        tag_1.Tag.renderTags();
        note_1.Note.renderNoteSize();
    }
    function returnEdit() {
        $(".edit").css("display", "inline-block");
        $(".delete_note").css("display", "none");
        $(".save_note").css("display", "none");
        $("#application textarea").prop("readonly", true);
    }
    function updateFoldersData() {
        var folderName = $("#folder_name").val();
        var findedObj;
        var newFolder = new folder_1.Folder(idFolderCounter, folderName);
        findedObj = find(exports.data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
        findedObj.children.push(newFolder);
        localStorage.setItem("structure", JSON.stringify(exports.data));
        localStorage.setItem("idFolderCounter", idFolderCounter);
        idFolderCounter++;
    }
    exports.updateFoldersData = updateFoldersData;
    function updateTagsData() {
        var tagName;
        if ($("#popup_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_name").val();
        if ($("#popup_note_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_note_name").val();
        var findedObj;
        var newTag = new tag_1.Tag(idTagCounter, tagName);
        findedObj = find(exports.data.tags, $(".tags_tree option:selected").attr("data-tags-select-id"));
        findedObj.children.push(newTag);
        localStorage.setItem("structure", JSON.stringify(exports.data));
        localStorage.setItem("idTagCounter", idTagCounter);
        idTagCounter++;
    }
    exports.updateTagsData = updateTagsData;
    function updateNotesData() {
        var noteTitle = $("#note_name").val();
        var noteText = $("#popup_note textarea").val();
        var folderID = $("#popup_note select option:selected").attr("data-folders-select-id");
        var noteDate = new Date();
        var newNote = new note_1.Note(idNoteCounter, folderID, noteTitle, noteText);
        exports.data.notes.push(newNote);
        localStorage.setItem("structure", JSON.stringify(exports.data));
        localStorage.setItem("idNoteCounter", idNoteCounter);
        localStorage.setItem("noteDate", noteDate);
        idNoteCounter++;
    }
    exports.updateNotesData = updateNotesData;
    folder_1.Folder.renderFolderSelect(exports.data.folders, 0);
    tag_1.Tag.renderTagSelect(exports.data.tags, 0);
    idFolderCounter++;
    idTagCounter++;
    idNoteCounter++;
    $(".folders").append(folder_1.Folder.parseFolders(exports.data.folders));
    $(".tags").append(tag_1.Tag.parseTags(exports.data.tags));
    note_1.Note.renderNotes(exports.data.notes);
    folder_1.Folder.renderFoldersDisplay(exports.data.folders);
    tag_1.Tag.renderTagsDisplay(exports.data.tags);
    note_1.Note.renderNoteFields();
    note_1.Note.renderLatestNote();
    tag_1.Tag.paddingCheck();
    tag_1.Tag.checkNoteForAddTag();
    tag_1.Tag.renderTags();
    if ($("#application textarea").attr("data-textarea-id"))
        $("#application textarea").attr("data-textarea-id", note_1.Note.findLatestNote().id);
    $("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
    note_1.Note.renderNoteSize();
    $(window).resize(function () {
        $("#sidebar").css("height", $(window).outerHeight() - $("header").outerHeight());
        note_1.Note.renderNoteSize();
    });
    $("#sidebar").on("click", function (e) {
        var target = e.target;
        var $target = $(target);
        var textArea = $("#application textarea");
        if ($target.hasClass("note") && $(".edit").css("display") != "none") {
            var noteID = $target.attr("data-note-id");
            textArea.attr("data-textarea-id", noteID);
            note_1.Note.renderNoteFields();
            tag_1.Tag.checkNoteForAddTag();
            tag_1.Tag.renderTags();
        }
        if ($target.parent().hasClass("note") && $(".edit").css("display") != "none") {
            var noteID = $target.parent().attr("data-note-id");
            textArea.attr("data-textarea-id", noteID);
            note_1.Note.renderNoteFields();
            tag_1.Tag.checkNoteForAddTag();
            tag_1.Tag.renderTags();
        }
        tag_1.Tag.paddingCheck();
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
        tag_1.Tag.renderNoteTagsDisplay(exports.data.tags);
        tag_1.Tag.checkSelectedTags();
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
        var note = find(exports.data.notes, textArea.attr("data-textarea-id"));
        if ($(target).hasClass("tag_list_tag")) {
            $(target).toggleClass("selected_tag");
            note.tags = [];
            $.each($(".tag_list .tag_list_tag"), function () {
                if ($(this).hasClass("selected_tag")) {
                    note.tags.push($(this).attr("data-tags-tree-id"));
                    localStorage.setItem("structure", JSON.stringify(exports.data));
                }
            });
        }
    });
    $("#popup_tag .create_tag").on("click", function () {
        if ($("#tag_name").val()) {
            updateTagsData();
            $("#popup_tag .tags_tree").find("*").remove();
            tag_1.Tag.renderTagSelect(exports.data.tags, 0);
            tagWrapper();
        }
        $("#popup_tag").fadeOut(500);
        $("#popup_tag form")[0].reset();
    });
    $("#popup_note_tag .create_add_tag").on("click", function () {
        if ($("#tag_note_name").val()) {
            updateTagsData();
            $("#popup_tag .tags_tree").find("*").remove();
            tag_1.Tag.renderTagSelect(exports.data.tags, 0);
            tagWrapper();
            $("#popup_note_tag .tag_list").find("*").remove();
            tag_1.Tag.renderNoteTagsDisplay(exports.data.tags);
            tag_1.Tag.checkSelectedTags();
        }
        $("#popup_note_tag form")[0].reset();
    });
    $("#popup_note_tag .add_note_tag").on("click", function () {
        var selectedTags = [];
        var textArea = $("#application textarea");
        var note = find(exports.data.notes, textArea.attr("data-textarea-id"));
        $("#popup_note_tag .tag_list_tag").each(function () {
            if ($(this).hasClass("selected_tag"))
                selectedTags.push($(this).attr("data-tags-tree-id"));
        });
        note.tags = selectedTags;
        localStorage.setItem("structure", JSON.stringify(exports.data));
        tagWrapper();
        tag_1.Tag.paddingCheck();
        tag_1.Tag.checkNoteForAddTag();
        tag_1.Tag.renderTags();
        $("#popup_note_tag").fadeOut(500);
    });
    $("#popup_tag .delete_tag").on("click", function () {
        var selectedOptionId = $("#popup_tag select option:selected").attr("data-tags-select-id");
        var textArea = $("#application textarea");
        var note = find(exports.data.notes, textArea.attr("data-textarea-id"));
        if ($("#popup_tag select").val() && selectedOptionId != "root") {
            var findedArr = findParent(exports.data.tags, selectedOptionId);
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
        localStorage.setItem("structure", JSON.stringify(exports.data));
        $("#popup_tag .tags_tree").find("option").not(".select_root").remove();
        tag_1.Tag.renderTagSelect(exports.data.tags, 0);
        tagWrapper();
        tag_1.Tag.checkNoteForAddTag();
        tag_1.Tag.renderTags();
        note_1.Note.renderNoteSize();
        $("#popup_tag form")[0].reset();
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
            note_1.Note.renderNoteSize();
            var findedObj = find(exports.data.tags, $(target).attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(exports.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(exports.data));
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
            note_1.Note.renderNoteSize();
            var findedObj = find(exports.data.tags, $(target).parent().attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(exports.data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(exports.data));
            }
        }
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
    $("#popup_note .create_note").on("click", function () {
        var selectedOptionId = $("#popup_note select option:selected").attr("data-folders-select-id");
        var textArea = $("#application textarea");
        if ($("#note_name").val() && selectedOptionId != "root") {
            updateNotesData();
            $(".folders").find("*").remove();
            $(".folders").append(folder_1.Folder.parseFolders(exports.data.folders));
            note_1.Note.renderNotes(exports.data.notes);
            folder_1.Folder.renderFoldersDisplay(exports.data.folders);
        }
        var latestNote = note_1.Note.findLatestNote();
        textArea.attr("data-textarea-id", latestNote.id);
        noteWrapper();
        $("#popup_note").fadeOut(500);
        $("#popup_note form")[0].reset();
    });
    $(".save_note").on("click", function () {
        var workTextarea = $("#application textarea");
        for (var i = 0; i < exports.data.notes.length; i++) {
            if (exports.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                exports.data.notes[i].text = workTextarea.val();
                localStorage.setItem("structure", JSON.stringify(exports.data));
            }
        }
        returnEdit();
    });
    $(".delete_note").on("click", function () {
        var workTextarea = $("#application textarea");
        for (var i = 0; i < exports.data.notes.length; i++) {
            if (exports.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                var index = exports.data.notes.indexOf(exports.data.notes[i]);
                exports.data.notes.splice(index, 1);
                localStorage.setItem("structure", JSON.stringify(exports.data));
            }
            note_1.Note.renderNotes(exports.data.notes);
            folder_1.Folder.renderFoldersDisplay(exports.data.folders);
        }
        var latestNote = note_1.Note.findLatestNote();
        if (latestNote) {
            workTextarea.attr("data-textarea-id", latestNote.id);
            noteWrapper();
        }
        returnEdit();
    });
});
//# sourceMappingURL=main.js.map