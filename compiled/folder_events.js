define(["require", "exports", "./folder", "./note", "./main", "./main", "./main", "./main"], function (require, exports, folder_1, note_1, main_1, main_2, main_3, main_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FolderEvents;
    (function (FolderEvents) {
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
        $("#popup_folder .create_folder").on("click", function () {
            if ($("#folder_name").val()) {
                main_4.updateFoldersData();
                folder_1.Folder.folderWrapper();
            }
            $("#popup_folder").fadeOut(500);
            $("#popup_folder form")[0].reset();
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
                var findedArr = main_3.findParent(main_1.data.folders, selectedOptionId);
                for (var i = 0; i < findedArr.length; i++) {
                    if (findedArr[i].id == selectedOptionId) {
                        var index = findedArr.indexOf(findedArr[i]);
                        findedArr.splice(index, 1);
                    }
                }
                localStorage.setItem("structure", JSON.stringify(main_1.data));
                folder_1.Folder.folderWrapper();
            }
            $("#popup_folder form")[0].reset();
        });
        $(".folders").on("dblclick", function (e) {
            var target = e.target;
            var $target = $(target);
            if ($target.hasClass("folder_name") && $target.siblings("ul").children().length) {
                var childUl = $target.siblings("ul");
                var $childUl = $(childUl);
                childUl.toggle();
                if ($childUl.css("display").toLowerCase() === "none") {
                    $target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
                }
                if ($childUl.css("display").toLowerCase() === "block") {
                    $target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
                }
                note_1.Note.renderNoteSize();
                var findedObj = main_2.find(main_1.data.folders, $target.attr("data-folders-tree-id"));
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
            if ($target.hasClass("fa") && $target.parent().siblings("ul").children().length) {
                var parentUl = $target.parent().siblings("ul");
                var $parentUl = $(parentUl);
                parentUl.toggle();
                if ($parentUl.css("display").toLowerCase() === "none") {
                    if ($target.hasClass("fa-folder-o"))
                        $target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
                    else
                        $target.removeClass("fa-angle-down").addClass("fa-angle-right");
                }
                if ($parentUl.css("display").toLowerCase() === "block") {
                    if ($target.hasClass("fa-folder-o"))
                        $target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
                    else
                        $target.removeClass("fa-angle-right").addClass("fa-angle-down");
                }
                note_1.Note.renderNoteSize();
                var findedObj = main_2.find(main_1.data.folders, $target.parent().attr("data-folders-tree-id"));
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
    })(FolderEvents = exports.FolderEvents || (exports.FolderEvents = {}));
});
//# sourceMappingURL=folder_events.js.map