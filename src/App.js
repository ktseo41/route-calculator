"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var job_1 = __importDefault(require("./database/job"));
var RouteLinkedList_1 = __importDefault(require("./lib/RouteLinkedList"));
var buttonStates = [
    "1",
    "-1",
    "5",
    "-5",
    "10",
    "-10",
    "100",
    "-100",
    "reset",
];
var CalculatorWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  /* border: 1px solid black;\n  width: 50%;\n  min-width: 300px; */\n"], ["\n  /* border: 1px solid black;\n  width: 50%;\n  min-width: 300px; */\n"])));
var AccusTable = styled_components_1["default"].table(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-collapse: collapse;\n  text-align: center;\n  width: 100%;\n\n  & tr {\n    padding: 0 5px;\n  }\n\n  & tr.selected {\n    background-color: #ffbb00 !important;\n  }\n\n  & tr:nth-child(even) {\n    background-color: #efefef;\n  }\n"], ["\n  border-collapse: collapse;\n  text-align: center;\n  width: 100%;\n\n  & tr {\n    padding: 0 5px;\n  }\n\n  & tr.selected {\n    background-color: #ffbb00 !important;\n  }\n\n  & tr:nth-child(even) {\n    background-color: #efefef;\n  }\n"])));
var H5Div = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline;\n  font-weight: bold;\n  margin: 0px 10px;\n"], ["\n  display: inline;\n  font-weight: bold;\n  margin: 0px 10px;\n"])));
var SelectedNodeDiv = styled_components_1["default"].div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-start;\n"], ["\n  display: flex;\n  justify-content: flex-start;\n"])));
var SelectedInsideDiv = styled_components_1["default"].div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-around;\n\n  & span {\n    margin: 0px 10px;\n  }\n"], ["\n  display: flex;\n  justify-content: space-around;\n\n  & span {\n    margin: 0px 10px;\n  }\n"])));
function App() {
    var _a = __read(react_1.useState(new RouteLinkedList_1["default"]()), 2), rLL = _a[0], setRLL = _a[1];
    var _b = __read(react_1.useState(rLL.tail), 2), selectedNode = _b[0], setSelectedNode = _b[1];
    var _c = __read(react_1.useState(0), 2), selectedNodeIdx = _c[0], setSelectedNodeIdx = _c[1];
    var _d = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job), 2), job = _d[0], setJob = _d[1];
    var _e = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo), 2), jobPo = _e[0], setJobPo = _e[1];
    var addNewJob = function (event) {
        var _a;
        var selectedValue = event.target
            .textContent;
        if (((_a = rLL.tail) === null || _a === void 0 ? void 0 : _a.job) === selectedValue)
            return;
        rLL.add(selectedValue);
        setSelectedNode(rLL.tail);
        setSelectedNodeIdx(rLL.length - 1);
    };
    var adjustJobPoint = function (event) {
        var changeState = event.target
            .textContent;
        if (changeState === "reset") {
            setRLL(function () {
                var newRLL = new RouteLinkedList_1["default"]();
                setSelectedNode(newRLL.tail);
                setSelectedNodeIdx(0);
                return newRLL;
            });
            return;
        }
        var numberedChangeState = +changeState;
        selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.adjustJobPoint(numberedChangeState);
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
    };
    var deleteNode = function () {
        if (rLL.length === 1)
            return;
        rLL.removeAt(selectedNodeIdx);
        setSelectedNode(rLL.get(selectedNodeIdx - 1));
        setSelectedNodeIdx(selectedNodeIdx - 1);
    };
    react_1.useEffect(function () {
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
    }, [rLL, selectedNode]);
    return (react_1["default"].createElement(CalculatorWrapper, { className: "container" },
        react_1["default"].createElement("nav", { className: "navbar" },
            react_1["default"].createElement("div", { className: "container has-text-centered" },
                react_1["default"].createElement("a", { className: "navbar-item has-text-dark title is-5" }, "\uC77C\uB79C\uC2DC\uC544 \uB8E8\uD2B8 \uACC4\uC0B0\uAE30"))),
        react_1["default"].createElement("section", { className: "jobs" },
            react_1["default"].createElement("div", { className: "buttons are-small" }, job_1["default"].reduce(function (jobButtons, jobName, idx) {
                jobButtons.push(react_1["default"].createElement("button", { className: "button is-primary", onClick: addNewJob, key: idx }, jobName));
                return jobButtons;
            }, []))),
        react_1["default"].createElement("section", { className: "adjust" },
            react_1["default"].createElement("div", { className: "buttons are-small" },
                buttonStates.map(function (buttonState, idx) {
                    return (react_1["default"].createElement("button", { className: "button", onClick: adjustJobPoint, key: idx }, buttonState));
                }),
                react_1["default"].createElement("button", { className: "button", onClick: deleteNode }, "remove"))),
        react_1["default"].createElement("section", { className: "currentStates" },
            react_1["default"].createElement(AccusTable, { className: "table is-narrow" },
                react_1["default"].createElement("thead", null,
                    react_1["default"].createElement("tr", null,
                        react_1["default"].createElement("th", null, "\uC9C1\uC5C5"),
                        react_1["default"].createElement("th", null, "STR"),
                        react_1["default"].createElement("th", null, "INT"),
                        react_1["default"].createElement("th", null, "AGI"),
                        react_1["default"].createElement("th", null, "VIT"),
                        react_1["default"].createElement("th", null, "\uC7A1\uD3EC\uC778\uD2B8"))),
                react_1["default"].createElement("tbody", null, rLL.getAllNodes().map(function (routeNode, index) {
                    return (react_1["default"].createElement("tr", { id: "" + index, key: index, className: index === selectedNodeIdx ? "selected" : "", onClick: function (event) {
                            setSelectedNode(rLL.get(+event.currentTarget.id));
                            setSelectedNodeIdx(+event.currentTarget.id);
                        } },
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.job),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.STR),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.INT),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.AGI),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.VIT),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.jobPo)));
                }))))));
}
exports["default"] = App;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
