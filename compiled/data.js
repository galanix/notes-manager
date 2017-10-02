define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = (localStorage.getItem("structure"))
        ? JSON.parse(localStorage.getItem("structure")) : {
        "folders": [{
                "id": "root",
                "name": "Folders",
                "display": "block",
                "children": []
            }],
        "notes": [],
        "tags": [{
                "id": "root",
                "name": "Tags",
                "display": "block",
                "children": []
            }]
    };
});
//# sourceMappingURL=data.js.map