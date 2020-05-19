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
var job_1 = require("./database/job");
var RouteLinkedList_1 = __importDefault(require("./lib/RouteLinkedList"));
var uuid_1 = require("uuid");
// | "reset";
var buttonStates = [
    "1",
    "-1",
    "5",
    "-5",
    "10",
    "-10",
    "100",
    "-100",
];
var CalculatorWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
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
        var numberedChangeState = +changeState;
        selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.adjustJobPoint(numberedChangeState);
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
    };
    var deleteNode = function (selectedNodeIdx) {
        if (selectedNodeIdx === undefined)
            return;
        if (rLL.length === 1)
            return;
        var numberedIndex = +selectedNodeIdx;
        rLL.removeAt(numberedIndex);
        setSelectedNode(rLL.get(numberedIndex - 1));
        setSelectedNodeIdx(numberedIndex - 1);
    };
    var reset = function () {
        setRLL(function () {
            var newRLL = new RouteLinkedList_1["default"]();
            setSelectedNode(newRLL.tail);
            setSelectedNodeIdx(0);
            return newRLL;
        });
    };
    react_1.useEffect(function () {
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
    }, [rLL, selectedNode]);
    return (react_1["default"].createElement(CalculatorWrapper, { className: "container column is-two-thirds is-offset-2" },
        react_1["default"].createElement("nav", null,
            react_1["default"].createElement("div", { style: { padding: "10px 0px" }, className: "has-text-centered title is-5" },
                react_1["default"].createElement("span", { style: { cursor: "pointer" }, onClick: reset }, "\uC77C\uB79C\uC2DC\uC544 \uB8E8\uD2B8 \uACC4\uC0B0\uAE30"))),
        react_1["default"].createElement("section", { className: "jobs box disable-double-tap" },
            react_1["default"].createElement("div", { className: "buttons are-small" }, job_1.classifiedJobs.reduce(function (jobButtons2, classifieds, idx) {
                var buttonedClassfiedJobs = classifieds.reduce(function (jobButtons1, jobName, idx2) {
                    jobButtons1.push(react_1["default"].createElement("button", { style: {
                            fontSize: "0.8rem",
                            padding: "calc(0.5em - 1px) 1em"
                        }, className: "button is-outlined", onClick: addNewJob, onChange: function (evt) {
                            console.log(evt.type);
                        }, key: uuid_1.v4() }, jobName));
                    return jobButtons1;
                }, []);
                jobButtons2.push(react_1["default"].createElement("div", { key: uuid_1.v4(), className: "container" }, buttonedClassfiedJobs));
                return jobButtons2;
            }, []))),
        react_1["default"].createElement("section", { className: "adjust box disable-double-tap" },
            react_1["default"].createElement("div", { className: "buttons columns is-multiline are-small" }, buttonStates.map(function (buttonState, idx) {
                return (react_1["default"].createElement("button", { style: { fontSize: "0.8rem", padding: "calc(0.5em - 1px) 1em" }, className: "button column is-outlined is-mobile", onClick: adjustJobPoint, key: uuid_1.v4() }, buttonState));
            }))),
        react_1["default"].createElement("section", { className: "currentStates is-two-thirds disable-double-tap" },
            react_1["default"].createElement("table", { className: "table is-fullwidth is-narrow is-hoverable" },
                react_1["default"].createElement("thead", null,
                    react_1["default"].createElement("tr", null,
                        react_1["default"].createElement("th", { style: { minWidth: "104px" }, className: "has-text-centered" }, "\uC9C1\uC5C5"),
                        react_1["default"].createElement("th", { className: "has-text-centered" }, "STR"),
                        react_1["default"].createElement("th", { className: "has-text-centered" }, "INT"),
                        react_1["default"].createElement("th", { className: "has-text-centered" }, "AGI"),
                        react_1["default"].createElement("th", { className: "has-text-centered" }, "VIT"),
                        react_1["default"].createElement("th", { style: { minWidth: "46.4px" }, className: "has-text-centered" }, "\uC7A1\uD3EC"),
                        react_1["default"].createElement("th", null))),
                react_1["default"].createElement("tbody", null, rLL.getAllNodes().map(function (routeNode, index) {
                    return (react_1["default"].createElement("tr", { id: "" + index, key: uuid_1.v4(), className: index === selectedNodeIdx ? "has-background-light" : "", onClick: function (event) {
                            setSelectedNode(rLL.get(+event.currentTarget.id));
                            setSelectedNodeIdx(+event.currentTarget.id);
                        } },
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.job),
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.STR),
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.INT),
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.AGI),
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.VIT),
                        react_1["default"].createElement("td", { key: uuid_1.v4(), className: "has-text-centered" }, routeNode === null || routeNode === void 0 ? void 0 : routeNode.jobPo),
                        react_1["default"].createElement("td", { style: { minWidth: "37.6px" }, key: uuid_1.v4(), className: "has-text-centered" }, index !== 0 && (react_1["default"].createElement("a", { onClick: function (event) {
                                var _a, _b;
                                deleteNode((_b = (_a = event.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id);
                            }, className: "delete" })))));
                }))))));
}
exports["default"] = App;
var templateObject_1;
