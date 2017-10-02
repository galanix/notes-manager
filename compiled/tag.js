define(["require", "exports", "./note", "./data", "./main"], function (require, exports, note_1, data_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tag = (function () {
        function Tag(theID, theName) {
            this.id = theID;
            this.name = theName;
            this.display = "block";
            this.children = [];
        }
        Tag.renderTagSelect = function (arr, counter) {
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
        Tag.parseTags = function (tags) {
            var ul = $("<ul>");
            for (var i = 0; i < tags.length; i++) {
                ul.append(this.parseTag(tags[i]));
            }
            return ul;
        };
        Tag.parseTag = function (tag) {
            var li = $("<li>");
            li.append("<span data-tags-tree-id=\"" + tag.id + "\" class=\"tag_name\">\n\t\t\t<i class=\"fa tag\" aria-hidden=\"true\"></i> <i class=\"fa fa-tag\" aria-hidden=\"true\"></i> \n\t\t\t" + tag.name + "</span>");
            if (tag.children)
                li.append(this.parseTags(tag.children));
            return li;
        };
        Tag.renderTagsDisplay = function (tags) {
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
        Tag.renderNoteTagsDisplay = function (tags) {
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
        Tag.checkNoteForAddTag = function () {
            if ($(".note_title").text().length > 0) {
                $(".add_tag").css("display", "inline-block");
            }
            else
                $(".add_tag").css("display", "none");
        };
        Tag.checkSelectedTags = function () {
            var textArea = $("#application textarea");
            var spanTags = $(".tag_list .tag_list_tag");
            var note = main_1.find(data_1.data.notes, textArea.attr("data-textarea-id"));
            for (var i = 0; i < spanTags.length; i++) {
                for (var j = 0; j < note.tags.length; j++) {
                    if (note.tags[j] == $(spanTags[i]).attr("data-tags-tree-id"))
                        $(spanTags[i]).addClass("selected_tag");
                }
            }
        };
        Tag.renderTags = function () {
            var note = main_1.find(data_1.data.notes, $("#application textarea").attr("data-textarea-id"));
            $(".notes_tags").find("span").remove();
            if (note) {
                for (var i = 0; i < note.tags.length; i++) {
                    var tag = main_1.find(data_1.data.tags, note.tags[i]);
                    if (tag) {
                        $(".notes_tags").append("<span class=\"tag_list_tag\">" + tag.name + "</span>");
                    }
                }
            }
        };
        Tag.paddingCheck = function () {
            if ($("#note .notes_tags span"))
                $("#note .notes_tags span").css({ "padding": "5px 10px", "display": "inline-block" });
            else
                $("#note .notes_tags span").css({ "padding": "0px" });
        };
        Tag.tagWrapper = function () {
            $(".tags").find("*").remove();
            $(".tags").append(Tag.parseTags(data_1.data.tags));
            note_1.Note.renderNotes(data_1.data.notes);
            Tag.renderTagsDisplay(data_1.data.tags);
            note_1.Note.renderNoteFields();
            note_1.Note.renderNoteSize();
        };
        return Tag;
    }());
    exports.Tag = Tag;
});
//# sourceMappingURL=tag.js.map