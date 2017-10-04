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
                        folder_1.Folder.resetOnCloseWrapper();
                    }
                });
                $(".popup_close").on("click", function () {
                    folder_1.Folder.resetOnCloseWrapper();
                });
            });
            $("#popup_folder .create_folder").on("click", function () {
                if ($("#folder_name").val()) {
                    main_3.updateFoldersData();
                    folder_1.Folder.folderWrapper();
                }
                folder_1.Folder.resetOnCloseWrapper();
            });
            $("#popup_folder .delete_folder").on("click", function () {
                var selectedOptionId = $("#popup_folder select option:selected").attr("data-folders-select-id");
                var selectedFolder = $("span[data-folders-tree-id=\"" + selectedOptionId + "\"]");
                if ($("#popup_folder select").val() && selectedOptionId != "root") {
                    $("#popup_folder .main_form option:not(:selected)").prop("disabled", true);
                    var findedFolder = main_1.find(data_1.data.folders, selectedOptionId);
                    var findedFolderParent_1 = main_2.findParent(data_1.data.folders, selectedOptionId);
                    note_1.Note.checkNotesInFolders(findedFolder);
                    if ($("#popup_folder .popup_delete_notes_wrapper").css("display").toLowerCase() == "block") {
                        $("#popup_folder").on("click", function (e) {
                            var target = e.target;
                            var $target = $(target);
                            if ($target.hasClass("delete_notes_yes")) {
                                note_1.Note.deleteNotesInFolder(findedFolderParent_1);
                                folder_1.Folder.deleteFolders();
                                folder_1.Folder.folderWrapper();
                                note_1.Note.renderLatestNote();
                                tag_1.Tag.checkNoteForAddTag();
                                note_1.Note.moveNoteWrapper();
                            }
                            if (selectedFolder.siblings().length > 1 ||
                                selectedFolder.parent().not(selectedFolder.parent("span[data-folders-tree-id=\"root\"]")).length > 1) {
                                if ($target.hasClass('delete_notes_no')) {
                                    $(".notes_in_folder").find("option").not(".select_root").remove();
                                    folder_1.Folder.renderNotDeletedFolderSelect(data_1.data.folders, 0);
                                    $("#popup_folder .main_form").hide();
                                    $("#popup_folder .select_folder").show();
                                    if ($("#popup_folder .select_folder select").val() && selectedOptionId != "root") {
                                        $("#popup_folder .note_to_folder").on("click", function (e) {
                                            var selectFolderSelected = $("#popup_folder .select_folder select option:selected").attr("data-folders-select-id");
                                            var newFolder = main_1.find(data_1.data.folders, selectFolderSelected);
                                            note_1.Note.moveNoteInFolder(findedFolderParent_1, newFolder);
                                            folder_1.Folder.deleteFolders();
                                            folder_1.Folder.folderWrapper();
                                            note_1.Note.moveNoteWrapper();
                                            $("#popup_folder .popup_delete_notes_wrapper").hide();
                                            $("#popup_folder .main_form").show();
                                            $("#popup_folder .select_folder").hide();
                                        });
                                    }
                                }
                            }
                        });
                    }
                    else {
                        folder_1.Folder.deleteFolders();
                        folder_1.Folder.folderWrapper();
                    }
                }
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