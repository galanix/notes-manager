define(["require", "exports", "./tag", "./note"], function (require, exports, tag_1, note_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeneralEvents = (function () {
        function GeneralEvents() {
        }
        GeneralEvents.generalEvents = function () {
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
        };
        return GeneralEvents;
    }());
    exports.GeneralEvents = GeneralEvents;
});
//# sourceMappingURL=general_events.js.map