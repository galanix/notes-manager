define(["require", "exports", "./note", "./data"], function (require, exports, note_1, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Folder = (function () {
        function Folder(theID, theName) {
            this.id = theID;
            this.name = theName;
            this.display = "block";
            this.children = [];
        }
        Folder.renderFolderSelect = function (arr, counter) {
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var name_1 = item.name;
                var id = item.id;
                if (item.children) {
                    var dashes = "";
                    for (var i_1 = 0; i_1 < counter - 1; i_1++) {
                        dashes += "-";
                    }
                    $(".folders_tree").append("\n\t\t\t\t\t<option data-folders-select-id=\"" + id + "\" value=\"" + name_1 + "\">" + dashes + " " + name_1 + "</option>\n\t\t\t\t\t");
                    dashes = "";
                    this.renderFolderSelect(item.children, counter + 1);
                }
            }
        };
        Folder.parseFolders = function (folders) {
            var ul = $("<ul>");
            for (var i = 0; i < folders.length; i++) {
                ul.append(this.parseFolder(folders[i]));
            }
            return ul;
        };
        Folder.parseFolder = function (folder) {
            var li = $("<li>");
            li.append("<span data-folders-tree-id=\"" + folder.id + "\" class=\"folder_name\">\n\t\t\t<i class=\"fa folder\" aria-hidden=\"true\"></i> <i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i> \n\t\t\t" + folder.name + "</span>");
            if (folder.children)
                li.append(this.parseFolders(folder.children));
            return li;
        };
        Folder.renderFoldersDisplay = function (folders) {
            for (var key in folders) {
                var item = folders[key];
                var display = item.display;
                var id = item.id;
                var foldersSpan = $(".folders span[data-folders-tree-id=\"" + id + "\"]");
                var folderI = $(".folders span[data-folders-tree-id=\"" + id + "\"] .folder");
                if (display === "block") {
                    foldersSpan.siblings("ul").css("display", "block");
                }
                else {
                    foldersSpan.siblings("ul").css("display", "none");
                }
                if (display === "block" && foldersSpan.next("ul").children().length) {
                    folderI.removeClass("fa-angle-right").addClass("fa-angle-down");
                }
                else {
                    folderI.removeClass("fa-angle-down").addClass("fa-angle-right");
                }
                if (!foldersSpan.next("ul").children().length) {
                    folderI.remove();
                }
                if (item.children) {
                    this.renderFoldersDisplay(item.children);
                }
            }
        };
        Folder.deleteNotesInFolder = function (obj) {
            for (var key in obj) {
                var item = obj[key];
                for (var i = 0; i < data_1.data.notes.length; i++) {
                    if (data_1.data.notes[i].folder == item.id) {
                        var index = data_1.data.notes.indexOf(data_1.data.notes[i]);
                        data_1.data.notes.splice(index, 1);
                        i--;
                        localStorage.setItem("structure", JSON.stringify(data_1.data));
                    }
                }
                if (item.children)
                    this.deleteNotesInFolder(item.children);
            }
        };
        Folder.folderWrapper = function () {
            $(".folders_tree").find("option").not(".select_root").remove();
            Folder.renderFolderSelect(data_1.data.folders, 0);
            $(".folders").find("*").remove();
            $(".folders").append(Folder.parseFolders(data_1.data.folders));
            note_1.Note.renderNotes(data_1.data.notes);
            Folder.renderFoldersDisplay(data_1.data.folders);
            note_1.Note.renderNoteFields();
            note_1.Note.renderNoteSize();
        };
        return Folder;
    }());
    exports.Folder = Folder;
});
//# sourceMappingURL=folder.js.map