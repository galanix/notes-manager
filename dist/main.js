define(["require", "exports", "./folder"], function (require, exports, folder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var idFolderCounter = (localStorage.getItem("idFolderCounter"))
        ? localStorage.getItem("idFolderCounter") : 0;
    var idNoteCounter = (localStorage.getItem("idNoteCounter"))
        ? localStorage.getItem("idNoteCounter") : 0;
    var idTagCounter = (localStorage.getItem("idTagCounter"))
        ? localStorage.getItem("idTagCounter") : 0;
    var data = (localStorage.getItem("structure"))
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
    var Tag = (function () {
        function Tag(theID, theName) {
            this.id = theID;
            this.name = theName;
            this.display = "block";
            this.children = [];
        }
        Tag.prototype.renderTagSelect = function (arr, counter) {
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var name_1 = item.name;
                var id = item.id;
                if (item.children) {
                    var dashes = "";
                    for (var i_1 = 0; i_1 < counter - 1; i_1++) {
                        dashes += "-";
                    }
                    $("#popup_tag .tags_tree").append("\n\t\t\t\t\t<option data-tags-select-id=\"" + id + "\" value=\"" + name_1 + "\">" + dashes + " " + name_1 + "</option>\n\t\t\t\t\t");
                    dashes = "";
                    this.renderTagSelect(item.children, counter + 1);
                }
            }
        };
        Tag.prototype.parseTags = function (tags) {
            var ul = $("<ul>");
            for (var i = 0; i < tags.length; i++) {
                ul.append(this.parseTag(tags[i]));
            }
            return ul;
        };
        Tag.prototype.parseTag = function (tag) {
            var li = $("<li>");
            li.append("<span data-tags-tree-id=\"" + tag.id + "\" class=\"tag_name\">\n\t\t\t<i class=\"fa tag\" aria-hidden=\"true\"></i> <i class=\"fa fa-tag\" aria-hidden=\"true\"></i> \n\t\t\t" + tag.name + "</span>");
            if (tag.children)
                li.append(this.parseTags(tag.children));
            return li;
        };
        Tag.prototype.renderTagsDisplay = function (tags) {
            for (var key in tags) {
                var item = tags[key];
                var display = item.display;
                var id = item.id;
                var tagsSpan = $(".tags span[data-tags-tree-id=\"" + id + "\"]");
                var tagI = $(".tags span[data-tags-tree-id=\"" + id + "\"] .tag");
                if (display === "block") {
                    tagsSpan.siblings("ul").css("display", "block");
                }
                else {
                    tagsSpan.siblings("ul").css("display", "none");
                }
                if (display === "block" && tagsSpan.next("ul").children().length) {
                    tagI.removeClass("fa-angle-right").addClass("fa-angle-down");
                }
                else {
                    tagI.removeClass("fa-angle-down").addClass("fa-angle-right");
                }
                if (!tagsSpan.next("ul").children().length) {
                    tagI.remove();
                }
                if (item.children)
                    this.renderTagsDisplay(item.children);
            }
        };
        Tag.prototype.renderNoteTagsDisplay = function (tags) {
            for (var key in tags) {
                var item = tags[key];
                var name_2 = item.name;
                var tagsDiv = $("#popup_note_tag .tag_list");
                if (item.id != "root")
                    tagsDiv.append("<span class=\"tag_list_tag\" data-tags-tree-id=\"" + item.id + "\" >" + name_2 + "</span>");
                if (item.children)
                    this.renderNoteTagsDisplay(item.children);
            }
        };
        Tag.prototype.checkNoteForAddTag = function () {
            if ($(".note_title").text().length > 0) {
                $(".add_tag").css("display", "inline-block");
            }
            else
                $(".add_tag").css("display", "none");
        };
        Tag.prototype.checkSelectedTags = function () {
            var textArea = $("#application textarea");
            var spanTags = $(".tag_list .tag_list_tag");
            var note = find(data.notes, textArea.attr("data-textarea-id"));
            for (var i = 0; i < spanTags.length; i++) {
                for (var j = 0; j < note.tags.length; j++) {
                    if (note.tags[j] == $(spanTags[i]).attr("data-tags-tree-id"))
                        $(spanTags[i]).addClass("selected_tag");
                }
            }
        };
        Tag.prototype.renderTags = function () {
            var note = find(data.notes, $("#application textarea").attr("data-textarea-id"));
            $(".notes_tags").find("span").remove();
            if (note) {
                for (var i = 0; i < note.tags.length; i++) {
                    var tag = find(data.tags, note.tags[i]);
                    if (tag) {
                        $(".notes_tags").append("<span class=\"tag_list_tag\">" + tag.name + "</span>");
                    }
                }
            }
        };
        Tag.prototype.paddingCheck = function () {
            if ($("#note .notes_tags span"))
                $("#note .notes_tags span").css({ "padding": "5px 10px", "display": "inline-block" });
            else
                $("#note .notes_tags span").css({ "padding": "0px" });
        };
        return Tag;
    }());
    var Note = (function () {
        function Note(theID, theFolder, theTitle, theText) {
            this.id = theID;
            this.folder = theFolder;
            this.title = theTitle;
            this.text = theText;
            this.date = new Date();
            this.tags = [];
        }
        Note.prototype.renderNoteSize = function () {
            setTimeout(function () {
                var sidebarHeight = $("#sidebar").outerHeight();
                var noteTitleHeight = $("#note .note_title").outerHeight();
                var noteInfo = $("#note .note_info").outerHeight();
                var sum = noteTitleHeight + noteInfo;
                var res = sidebarHeight - sum;
                $("#note textarea").css("height", res);
            }, 10);
        };
        Note.prototype.getMaxOfArray = function (numArray) {
            return Math.max.apply(null, numArray);
        };
        Note.prototype.findLatestNote = function () {
            var dataArr = [];
            var maxNote;
            for (var i = 0; i < data.notes.length; i++) {
                var item = data.notes[i];
                var parseDate = Date.parse(item.date);
                dataArr.push(parseDate);
            }
            var max = this.getMaxOfArray(dataArr);
            for (var i = 0; i < data.notes.length; i++) {
                var item = data.notes[i];
                var parseDate = Date.parse(item.date);
                if (parseDate == max) {
                    maxNote = item;
                }
            }
            return maxNote;
        };
        Note.prototype.renderLatestNote = function () {
            var latestNote = this.findLatestNote();
            var noteTitle = $("#note .note_title");
            var noteTags = $("#note .notes_tags");
            var notesFolder = $("#note .notes_folder");
            var textArea = $("#application textarea");
            if (latestNote) {
                noteTitle.html(latestNote.title);
                var latestNoteFolder = find(data.folders, latestNote.folder);
                notesFolder.html("<i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i> " + latestNoteFolder.name);
                textArea.html(latestNote.text);
                textArea.attr("data-textarea-id", latestNote.id);
            }
        };
        Note.prototype.renderNoteFields = function () {
            var noteTitle = $("#note .note_title");
            var noteTags = $("#note .notes_tags");
            var notesFolder = $("#note .notes_folder");
            var textArea = $("#application textarea");
            for (var i = 0; i < data.notes.length; i++) {
                var item = data.notes[i];
                if (item.id == textArea.attr("data-textarea-id")) {
                    noteTitle.html(item.title);
                    textArea.val(item.text);
                    var folder = find(data.folders, item.folder);
                    notesFolder.html("<i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i> " + folder.name);
                }
            }
        };
        Note.prototype.renderNotes = function (folders) {
            $("#sidebar").find(".note").remove();
            for (var i = 0; i < folders.length; i++) {
                var item = folders[i];
                var id = item.id;
                var folderID = item.folder;
                var foldersSpan = $(".folders span[data-folders-tree-id=\"" + folderID + "\"]");
                var folderUl = foldersSpan.next("ul");
                folderUl.append("<span data-note-id=\"" + id + "\" class=\"note\"><i class=\"fa fa-sticky-note-o\" aria-hidden=\"true\"></i>\n\t\t\t\t" + item.title + "</span>");
                var noteTags = item.tags;
                for (var j = 0; j < noteTags.length; j++) {
                    var tagSpan = $(".tags span[data-tags-tree-id=\"" + noteTags[j] + "\"]");
                    var tagUl = tagSpan.next("ul");
                    tagUl.append("<span data-note-id=\"" + id + "\" class=\"note\"><i class=\"fa fa-sticky-note-o\" aria-hidden=\"true\"></i>\n\t\t\t\t\t" + item.title + "</span>");
                }
            }
        };
        return Note;
    }());
    function updateFoldersData() {
        var folderName = $("#folder_name").val();
        var findedObj;
        var newFolder = new folder_1.Folder(idFolderCounter, folderName);
        findedObj = find(data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
        findedObj.children.push(newFolder);
        localStorage.setItem("structure", JSON.stringify(data));
        localStorage.setItem("idFolderCounter", idFolderCounter);
        idFolderCounter++;
    }
    function updateNotesData() {
        var noteTitle = $("#note_name").val();
        var noteText = $("#popup_note textarea").val();
        var folderID = $("#popup_note select option:selected").attr("data-folders-select-id");
        var noteDate = new Date();
        var newNote = new Note(idNoteCounter, folderID, noteTitle, noteText);
        data.notes.push(newNote);
        localStorage.setItem("structure", JSON.stringify(data));
        localStorage.setItem("idNoteCounter", idNoteCounter);
        localStorage.setItem("noteDate", noteDate);
        idNoteCounter++;
    }
    function updateTagsData() {
        var tagName;
        if ($("#popup_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_name").val();
        if ($("#popup_note_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_note_name").val();
        var findedObj;
        var newTag = new Tag(idTagCounter, tagName);
        findedObj = find(data.tags, $(".tags_tree option:selected").attr("data-tags-select-id"));
        findedObj.children.push(newTag);
        localStorage.setItem("structure", JSON.stringify(data));
        localStorage.setItem("idTagCounter", idTagCounter);
        idTagCounter++;
    }
    var folderInstance = new folder_1.Folder(idFolderCounter, "test");
    var tagInstance = new Tag(idTagCounter, "test");
    var noteInstance = new Note(idNoteCounter, 0, "test", "text");
    folderInstance.renderFolderSelect(data.folders, 0);
    tagInstance.renderTagSelect(data.tags, 0);
    idFolderCounter++;
    idNoteCounter++;
    idTagCounter++;
    $(".folders").append(folderInstance.parseFolders(data.folders));
    $(".tags").append(tagInstance.parseTags(data.tags));
    noteInstance.renderNotes(data.notes);
    folderInstance.renderFoldersDisplay(data.folders);
    tagInstance.renderTagsDisplay(data.tags);
    noteInstance.renderNoteFields();
    noteInstance.renderLatestNote();
    tagInstance.paddingCheck();
    tagInstance.checkNoteForAddTag();
    tagInstance.renderTags();
    if ($("#application textarea").attr("data-textarea-id"))
        $("#application textarea").attr("data-textarea-id", noteInstance.findLatestNote().id);
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
        tagInstance.renderNoteTagsDisplay(data.tags);
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
        var note = find(data.notes, textArea.attr("data-textarea-id"));
        if ($(target).hasClass("tag_list_tag")) {
            $(target).toggleClass("selected_tag");
            note.tags = [];
            $.each($(".tag_list .tag_list_tag"), function () {
                if ($(this).hasClass("selected_tag")) {
                    note.tags.push($(this).attr("data-tags-tree-id"));
                    localStorage.setItem("structure", JSON.stringify(data));
                }
            });
        }
    });
    $("#popup_folder .create_folder").on("click", function () {
        if ($("#folder_name").val()) {
            updateFoldersData();
            $(".folders_tree").find("option").not(".select_root").remove();
            folderInstance.renderFolderSelect(data.folders, 0);
            $(".folders").find("*").remove();
            $(".folders").append(folderInstance.parseFolders(data.folders));
            noteInstance.renderNotes(data.notes);
            folderInstance.renderFoldersDisplay(data.folders);
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
            tagInstance.renderTagSelect(data.tags, 0);
            $(".tags").find("*").remove();
            $(".tags").append(tagInstance.parseTags(data.tags));
            noteInstance.renderNotes(data.notes);
            tagInstance.renderTagsDisplay(data.tags);
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
            tagInstance.renderTagSelect(data.tags, 0);
            $(".tags").find("*").remove();
            $(".tags").append(tagInstance.parseTags(data.tags));
            noteInstance.renderNotes(data.notes);
            tagInstance.renderTagsDisplay(data.tags);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
            $("#popup_note_tag .tag_list").find("*").remove();
            tagInstance.renderNoteTagsDisplay(data.tags);
            tagInstance.checkSelectedTags();
        }
        $("#popup_note_tag form")[0].reset();
    });
    $("#popup_note_tag .add_note_tag").on("click", function () {
        var selectedTags = [];
        var textArea = $("#application textarea");
        var note = find(data.notes, textArea.attr("data-textarea-id"));
        $("#popup_note_tag .tag_list_tag").each(function () {
            if ($(this).hasClass("selected_tag"))
                selectedTags.push($(this).attr("data-tags-tree-id"));
        });
        note.tags = selectedTags;
        localStorage.setItem("structure", JSON.stringify(data));
        $(".tags").find("*").remove();
        $(".tags").append(tagInstance.parseTags(data.tags));
        noteInstance.renderNotes(data.notes);
        tagInstance.renderTagsDisplay(data.tags);
        noteInstance.renderNoteFields();
        tagInstance.paddingCheck();
        tagInstance.checkNoteForAddTag();
        tagInstance.renderTags();
        $("#popup_note_tag").fadeOut(500);
    });
    $("#popup_folder .delete_folder").on("click", function () {
        var selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
        if ($("#popup_folder select").val() && selectedOptionId != "root") {
            for (var i = 0; i < data.notes.length; i++) {
                if (data.notes[i].folder == selectedOptionId) {
                    var index = data.notes.indexOf(data.notes[i]);
                    data.notes.splice(index, 1);
                }
            }
            var findedArr = findParent(data.folders, selectedOptionId);
            for (var i = 0; i < findedArr.length; i++) {
                if (findedArr[i].id == selectedOptionId) {
                    var index = findedArr.indexOf(findedArr[i]);
                    findedArr.splice(index, 1);
                }
            }
            localStorage.setItem("structure", JSON.stringify(data));
            $(".folders_tree").find("option").not(".select_root").remove();
            folderInstance.renderFolderSelect(data.folders, 0);
            $(".folders").find("*").remove();
            $(".folders").append(folderInstance.parseFolders(data.folders));
            noteInstance.renderNotes(data.notes);
            folderInstance.renderFoldersDisplay(data.folders);
            noteInstance.renderNoteFields();
            noteInstance.renderNoteSize();
        }
        $("#popup_folder form")[0].reset();
    });
    $("#popup_tag .delete_tag").on("click", function () {
        var selectedOptionId = $("#popup_tag select option:selected").attr("data-tags-select-id");
        var textArea = $("#application textarea");
        var note = find(data.notes, textArea.attr("data-textarea-id"));
        if ($("#popup_tag select").val() && selectedOptionId != "root") {
            var findedArr = findParent(data.tags, selectedOptionId);
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
        localStorage.setItem("structure", JSON.stringify(data));
        $("#popup_tag .tags_tree").find("option").not(".select_root").remove();
        tagInstance.renderTagSelect(data.tags, 0);
        $(".tags").find("*").remove();
        $(".tags").append(tagInstance.parseTags(data.tags));
        noteInstance.renderNotes(data.notes);
        tagInstance.renderTagsDisplay(data.tags);
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
            $(".folders").append(folderInstance.parseFolders(data.folders));
            noteInstance.renderNotes(data.notes);
            folderInstance.renderFoldersDisplay(data.folders);
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
        for (var i = 0; i < data.notes.length; i++) {
            if (data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                data.notes[i].text = workTextarea.val();
                localStorage.setItem("structure", JSON.stringify(data));
            }
        }
        $(".edit").css("display", "inline-block");
        $(".delete_note").css("display", "none");
        $(".save_note").css("display", "none");
        workTextarea.prop("readonly", true);
    });
    $(".delete_note").on("click", function () {
        var workTextarea = $("#application textarea");
        for (var i = 0; i < data.notes.length; i++) {
            if (data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                var index = data.notes.indexOf(data.notes[i]);
                data.notes.splice(index, 1);
                localStorage.setItem("structure", JSON.stringify(data));
            }
            noteInstance.renderNotes(data.notes);
            folderInstance.renderFoldersDisplay(data.folders);
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
            var findedObj = find(data.folders, $(target).attr("data-folders-tree-id"));
            var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(data));
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
            var findedObj = find(data.folders, $(target).parent().attr("data-folders-tree-id"));
            var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(data));
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
            var findedObj = find(data.tags, $(target).attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(data));
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
            var findedObj = find(data.tags, $(target).parent().attr("data-tags-tree-id"));
            var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
            if (findedObj.display === "block" && span.next("ul").children().length) {
                findedObj.display = "none";
                localStorage.setItem("structure", JSON.stringify(data));
            }
            else {
                findedObj.display = "block";
                localStorage.setItem("structure", JSON.stringify(data));
            }
        }
    });
});
//# sourceMappingURL=main.js.map