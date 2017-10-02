define(["require", "exports", "./folder", "./tag", "./note", "./data", "./main", "./main", "./main"], function (require, exports, folder_1, tag_1, note_1, data_1, main_1, main_2, main_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FolderEvents = (function () {
        function FolderEvents() {
        }
        FolderEvents.folderEvents = function () {
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
                    main_3.updateFoldersData();
                    folder_1.Folder.folderWrapper();
                }
                $("#popup_folder").fadeOut(500);
                $("#popup_folder form")[0].reset();
            });
            $("#popup_folder .delete_folder").on("click", function () {
                var selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
                if ($("#popup_folder select").val() && selectedOptionId != "root") {
                    var findedFolder = main_2.findParent(data_1.data.folders, selectedOptionId);
                    folder_1.Folder.deleteNotesInFolder(findedFolder);
                    var findedArr = main_2.findParent(data_1.data.folders, selectedOptionId);
                    for (var i = 0; i < findedArr.length; i++) {
                        if (findedArr[i].id == selectedOptionId) {
                            var index = findedArr.indexOf(findedArr[i]);
                            findedArr.splice(index, 1);
                            localStorage.setItem("structure", JSON.stringify(data_1.data));
                        }
                    }
                    folder_1.Folder.folderWrapper();
                    note_1.Note.renderLatestNote();
                    tag_1.Tag.checkNoteForAddTag();
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
                    note_1.Note.renderNoteSize();
                    var findedObj = main_1.find(data_1.data.folders, $target.attr("data-folders-tree-id"));
                    var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
                    if (findedObj.display === "block" && span.next("ul").children().length) {
                        findedObj.display = "none";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        $target.children(".folder").removeClass("fa-angle-down").addClass("fa-angle-right");
                    }
                    else {
                        findedObj.display = "block";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        $target.children(".folder").removeClass("fa-angle-right").addClass("fa-angle-down");
                    }
                }
                if ($target.hasClass("fa") && $target.parent().siblings("ul").children().length) {
                    var parentUl = $target.parent().siblings("ul");
                    var $parentUl = $(parentUl);
                    parentUl.toggle();
                    note_1.Note.renderNoteSize();
                    var findedObj = main_1.find(data_1.data.folders, $target.parent().attr("data-folders-tree-id"));
                    var span = $(".folder_name[data-folders-tree-id=\"" + findedObj.id + "\"]");
                    if (findedObj.display === "block" && span.next("ul").children().length) {
                        findedObj.display = "none";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        if ($target.hasClass("fa-folder-o"))
                            $target.siblings().removeClass("fa-angle-down").addClass("fa-angle-right");
                        else
                            $target.removeClass("fa-angle-down").addClass("fa-angle-right");
                    }
                    else {
                        findedObj.display = "block";
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                        if ($target.hasClass("fa-folder-o"))
                            $target.siblings().removeClass("fa-angle-right").addClass("fa-angle-down");
                        else
                            $target.removeClass("fa-angle-right").addClass("fa-angle-down");
                    }
                }
            });
        };
        return FolderEvents;
    }());
    exports.FolderEvents = FolderEvents;
});
//# sourceMappingURL=folder_events.js.map