define(["require", "exports", "./tag", "./note", "./data", "./main", "./main", "./main"], function (require, exports, tag_1, note_1, data_1, main_1, main_2, main_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TagEvents = (function () {
        function TagEvents() {
        }
        TagEvents.tagEvents = function () {
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
                tag_1.Tag.renderNoteTagsDisplay(data_1.data.tags);
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
                var note = main_1.find(data_1.data.notes, textArea.attr("data-textarea-id"));
                if ($(target).hasClass("tag_list_tag")) {
                    $(target).toggleClass("selected_tag");
                    note.tags = [];
                    $.each($(".tag_list .tag_list_tag"), function () {
                        if ($(this).hasClass("selected_tag")) {
                            note.tags.push($(this).attr("data-tags-tree-id"));
                            localStorage.setItem("structure", JSON.stringify(data_1.data));
                        }
                    });
                }
            });
            $("#popup_tag .create_tag").on("click", function () {
                if ($("#tag_name").val()) {
                    main_3.updateTagsData();
                    $("#popup_tag .tags_tree").find("*").remove();
                    tag_1.Tag.renderTagSelect(data_1.data.tags, 0);
                    tag_1.Tag.tagWrapper();
                }
                $("#popup_tag").fadeOut(500);
                $("#popup_tag form")[0].reset();
            });
            $("#popup_note_tag .create_add_tag").on("click", function () {
                if ($("#tag_note_name").val()) {
                    main_3.updateTagsData();
                    $("#popup_tag .tags_tree").find("*").remove();
                    tag_1.Tag.renderTagSelect(data_1.data.tags, 0);
                    tag_1.Tag.tagWrapper();
                    $("#popup_note_tag .tag_list").find("*").remove();
                    tag_1.Tag.renderNoteTagsDisplay(data_1.data.tags);
                    tag_1.Tag.checkSelectedTags();
                }
                $("#popup_note_tag form")[0].reset();
            });
            $("#popup_note_tag .add_note_tag").on("click", function () {
                var selectedTags = [];
                var textArea = $("#application textarea");
                var note = main_1.find(data_1.data.notes, textArea.attr("data-textarea-id"));
                $("#popup_note_tag .tag_list_tag").each(function () {
                    if ($(this).hasClass("selected_tag"))
                        selectedTags.push($(this).attr("data-tags-tree-id"));
                });
                note.tags = selectedTags;
                localStorage.setItem("structure", JSON.stringify(data_1.data));
                tag_1.Tag.tagWrapper();
                tag_1.Tag.paddingCheck();
                tag_1.Tag.checkNoteForAddTag();
                tag_1.Tag.renderTags();
                $("#popup_note_tag").fadeOut(500);
            });
            $("#popup_tag .delete_tag").on("click", function () {
                var selectedOptionId = $("#popup_tag select option:selected").attr("data-tags-select-id");
                var textArea = $("#application textarea");
                var note = main_1.find(data_1.data.notes, textArea.attr("data-textarea-id"));
                if ($("#popup_tag select").val() && selectedOptionId != "root") {
                    var findedArr = main_2.findParent(data_1.data.tags, selectedOptionId);
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
                localStorage.setItem("structure", JSON.stringify(data_1.data));
                $("#popup_tag .tags_tree").find("option").not(".select_root").remove();
                tag_1.Tag.renderTagSelect(data_1.data.tags, 0);
                tag_1.Tag.tagWrapper();
                tag_1.Tag.checkNoteForAddTag();
                tag_1.Tag.renderTags();
                note_1.Note.renderNoteSize();
                $("#popup_tag form")[0].reset();
            });
            $(".tags").on("dblclick", function (e) {
                var target = e.target;
                var $target = $(target);
                if ($target.hasClass("tag_name") && $target.siblings("ul").children().length) {
                    var childUl = $target.siblings("ul");
                    childUl.toggle();
                    note_1.Note.renderNoteSize();
                    var findedObj = main_1.find(data_1.data.tags, $target.attr("data-tags-tree-id"));
                    var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
                    if (findedObj.display === "block" && span.next("ul").children().length) {
                        findedObj.display = "none";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        $target.children(".tag").removeClass("fa-angle-down").addClass("fa-angle-right");
                    }
                    else {
                        findedObj.display = "block";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        $target.children(".tag").removeClass("fa-angle-right").addClass("fa-angle-down");
                    }
                }
                if ($target.hasClass("fa") && $target.parent().siblings("ul").children().length) {
                    var parentUl = $target.parent().siblings("ul");
                    parentUl.toggle();
                    note_1.Note.renderNoteSize();
                    var findedObj = main_1.find(data_1.data.tags, $target.parent().attr("data-tags-tree-id"));
                    var span = $(".tag_name[data-tags-tree-id=\"" + findedObj.id + "\"]");
                    if (findedObj.display === "block" && span.next("ul").children().length) {
                        findedObj.display = "none";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        if ($target.hasClass("fa-tag"))
                            $target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
                        else
                            $target.removeClass("fa-angle-down").addClass("fa-angle-right");
                    }
                    else {
                        findedObj.display = "block";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        if ($target.hasClass("fa-tag"))
                            $target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
                        else
                            $target.removeClass("fa-angle-right").addClass("fa-angle-down");
                    }
                }
            });
        };
        return TagEvents;
    }());
    exports.TagEvents = TagEvents;
});
//# sourceMappingURL=tag_events.js.map