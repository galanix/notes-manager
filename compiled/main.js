define(["require", "exports", "./folder", "./tag", "./note", "./folder_events", "./tag_events", "./note_events", "./general_events", "./data"], function (require, exports, folder_1, tag_1, note_1, folder_events_1, tag_events_1, note_events_1, general_events_1, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var idFolderCounter = (localStorage.getItem("idFolderCounter"))
        ? localStorage.getItem("idFolderCounter") : 0;
    var idTagCounter = (localStorage.getItem("idTagCounter"))
        ? localStorage.getItem("idTagCounter") : 0;
    var idNoteCounter = (localStorage.getItem("idNoteCounter"))
        ? localStorage.getItem("idNoteCounter") : 0;
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
    exports.find = find;
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
    exports.findParent = findParent;
    function updateFoldersData() {
        var folderName = $("#folder_name").val();
        var findedObj;
        var newFolder = new folder_1.Folder(idFolderCounter, folderName);
        findedObj = find(data_1.data.folders, $(".folders_tree option:selected").attr("data-folders-select-id"));
        findedObj.children.push(newFolder);
        localStorage.setItem("structure", JSON.stringify(data_1.data));
        localStorage.setItem("idFolderCounter", idFolderCounter);
        idFolderCounter++;
    }
    exports.updateFoldersData = updateFoldersData;
    function updateTagsData() {
        var tagName;
        if ($("#popup_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_name").val();
        if ($("#popup_note_tag").css("display").toLowerCase() == "block")
            tagName = $("#tag_note_name").val();
        var findedObj;
        var newTag = new tag_1.Tag(idTagCounter, tagName);
        findedObj = find(data_1.data.tags, $(".tags_tree option:selected").attr("data-tags-select-id"));
        findedObj.children.push(newTag);
        localStorage.setItem("structure", JSON.stringify(data_1.data));
        localStorage.setItem("idTagCounter", idTagCounter);
        idTagCounter++;
    }
    exports.updateTagsData = updateTagsData;
    function updateNotesData() {
        var noteTitle = $("#note_name").val();
        var noteText = $("#popup_note textarea").val();
        var folderID = $("#popup_note select option:selected").attr("data-folders-select-id");
        var noteDate = new Date();
        var newNote = new note_1.Note(idNoteCounter, folderID, noteTitle, noteText);
        data_1.data.notes.push(newNote);
        localStorage.setItem("structure", JSON.stringify(data_1.data));
        localStorage.setItem("idNoteCounter", idNoteCounter);
        localStorage.setItem("noteDate", noteDate);
        idNoteCounter++;
    }
    exports.updateNotesData = updateNotesData;
    folder_1.Folder.renderFolderSelect(data_1.data.folders, 0);
    tag_1.Tag.renderTagSelect(data_1.data.tags, 0);
    idFolderCounter++;
    idTagCounter++;
    idNoteCounter++;
    $(".folders").append(folder_1.Folder.parseFolders(data_1.data.folders));
    $(".tags").append(tag_1.Tag.parseTags(data_1.data.tags));
    note_1.Note.renderNotes(data_1.data.notes);
    folder_1.Folder.renderFoldersDisplay(data_1.data.folders);
    tag_1.Tag.renderTagsDisplay(data_1.data.tags);
    note_1.Note.renderNoteFields();
    note_1.Note.renderLatestNote();
    tag_1.Tag.paddingCheck();
    tag_1.Tag.checkNoteForAddTag();
    tag_1.Tag.renderTags();
    general_events_1.GeneralEvents.generalEvents();
    folder_events_1.FolderEvents.folderEvents();
    tag_events_1.TagEvents.tagEvents();
    note_events_1.NoteEvents.noteEvents();
});
//# sourceMappingURL=main.js.map