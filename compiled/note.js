define(["require", "exports", "./main", "./main"], function (require, exports, main_1, main_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Note = (function () {
        function Note(theID, theFolder, theTitle, theText) {
            this.id = theID;
            this.folder = theFolder;
            this.title = theTitle;
            this.text = theText;
            this.date = new Date();
            this.tags = [];
        }
        Note.renderNoteSize = function () {
            setTimeout(function () {
                var sidebarHeight = $("#sidebar").outerHeight();
                var noteTitleHeight = $("#note .note_title").outerHeight();
                var noteInfo = $("#note .note_info").outerHeight();
                var sum = noteTitleHeight + noteInfo;
                var res = sidebarHeight - sum;
                $("#note textarea").css("height", res);
            }, 10);
        };
        Note.getMaxOfArray = function (numArray) {
            return Math.max.apply(null, numArray);
        };
        Note.findLatestNote = function () {
            var dataArr = [];
            var maxNote;
            for (var i = 0; i < main_1.data.notes.length; i++) {
                var item = main_1.data.notes[i];
                var parseDate = Date.parse(item.date);
                dataArr.push(parseDate);
            }
            var max = this.getMaxOfArray(dataArr);
            for (var i = 0; i < main_1.data.notes.length; i++) {
                var item = main_1.data.notes[i];
                var parseDate = Date.parse(item.date);
                if (parseDate == max) {
                    maxNote = item;
                }
            }
            return maxNote;
        };
        Note.renderLatestNote = function () {
            var latestNote = this.findLatestNote();
            var noteTitle = $("#note .note_title");
            var noteTags = $("#note .notes_tags");
            var notesFolder = $("#note .notes_folder");
            var textArea = $("#application textarea");
            if (latestNote) {
                noteTitle.html(latestNote.title);
                var latestNoteFolder = main_2.find(main_1.data.folders, latestNote.folder);
                notesFolder.html("<i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i> " + latestNoteFolder.name);
                textArea.html(latestNote.text);
                textArea.attr("data-textarea-id", latestNote.id);
            }
        };
        Note.renderNoteFields = function () {
            var noteTitle = $("#note .note_title");
            var noteTags = $("#note .notes_tags");
            var notesFolder = $("#note .notes_folder");
            var textArea = $("#application textarea");
            for (var i = 0; i < main_1.data.notes.length; i++) {
                var item = main_1.data.notes[i];
                if (item.id == textArea.attr("data-textarea-id")) {
                    noteTitle.html(item.title);
                    textArea.val(item.text);
                    var folder = main_2.find(main_1.data.folders, item.folder);
                    notesFolder.html("<i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i> " + folder.name);
                }
            }
        };
        Note.renderNotes = function (folders) {
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
    exports.Note = Note;
});
//# sourceMappingURL=note.js.map