define(["require", "exports", "./folder", "./note", "./data", "./main"], function (require, exports, folder_1, note_1, data_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NoteEvents = (function () {
        function NoteEvents() {
        }
        NoteEvents.noteEvents = function () {
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
                    main_1.updateNotesData();
                    $(".folders").find("*").remove();
                    $(".folders").append(folder_1.Folder.parseFolders(data_1.data.folders));
                    note_1.Note.renderNotes(data_1.data.notes);
                    folder_1.Folder.renderFoldersDisplay(data_1.data.folders);
                }
                var latestNote = note_1.Note.findLatestNote();
                textArea.attr("data-textarea-id", latestNote.id);
                note_1.Note.noteWrapper();
                $("#popup_note").fadeOut(500);
                $("#popup_note form")[0].reset();
            });
            $(".save_note").on("click", function () {
                var workTextarea = $("#application textarea");
                for (var i = 0; i < data_1.data.notes.length; i++) {
                    if (data_1.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                        data_1.data.notes[i].text = workTextarea.val();
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                    }
                }
                note_1.Note.returnEdit();
            });
            $(".delete_note").on("click", function () {
                var workTextarea = $("#application textarea");
                for (var i = 0; i < data_1.data.notes.length; i++) {
                    if (data_1.data.notes[i].id == workTextarea.attr("data-textarea-id")) {
                        var index = data_1.data.notes.indexOf(data_1.data.notes[i]);
                        data_1.data.notes.splice(index, 1);
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                    }
                    note_1.Note.renderNotes(data_1.data.notes);
                    folder_1.Folder.renderFoldersDisplay(data_1.data.folders);
                }
                var latestNote = note_1.Note.findLatestNote();
                if (latestNote) {
                    workTextarea.attr("data-textarea-id", latestNote.id);
                    note_1.Note.noteWrapper();
                }
                note_1.Note.returnEdit();
            });
        };
        return NoteEvents;
    }());
    exports.NoteEvents = NoteEvents;
});
//# sourceMappingURL=note_events.js.map