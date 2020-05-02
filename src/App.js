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
var CalculatorWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border: 1px solid black;\n  width: 50%;\n  min-width: 300px;\n  /* height: 500px; */\n"], ["\n  border: 1px solid black;\n  width: 50%;\n  min-width: 300px;\n  /* height: 500px; */\n"])));
var Timer = function () {
    var _a = __read(react_1.useState(new Date().toLocaleTimeString()), 2), nowStr = _a[0], setNowStr = _a[1];
    react_1.useEffect(function () {
        var count = 0;
        var intervalID = setInterval(function () {
            if (count >= 680) {
                clearInterval(intervalID);
                alert("15분 경과");
            }
            setNowStr(new Date().toLocaleTimeString());
            count += 1;
        }, 1000);
    }, []);
    return react_1["default"].createElement("span", null, nowStr);
};
function App() {
    var _a = __read(react_1.useState(new RouteLinkedList_1["default"]()), 2), rLL = _a[0], setRLL = _a[1];
    var _b = __read(react_1.useState(rLL.tail), 2), selectedNode = _b[0], setSelectedNode = _b[1];
    var _c = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job), 2), job = _c[0], setJob = _c[1];
    var _d = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo), 2), jobPo = _d[0], setJobPo = _d[1];
    var _e = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.stats), 2), stats = _e[0], setStats = _e[1];
    var _f = __read(react_1.useState(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.currentJobPos), 2), currentJobPos = _f[0], setCurrentJobPos = _f[1];
    var addNewJob = function (event) {
        var selectedValue = event.target
            .textContent;
        rLL.add(selectedValue);
        setSelectedNode(rLL.tail);
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
        setCurrentJobPos(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.currentJobPos);
        setStats(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.stats);
    };
    var adjustJobPoint = function (event) {
        var changeState = event.target
            .textContent;
        if (changeState === "reset") {
            setRLL(function () {
                var newRLL = new RouteLinkedList_1["default"]();
                setSelectedNode(newRLL.tail);
                return newRLL;
            });
            return;
        }
        var numberedChangeState = +changeState;
        console.log("in APP.tsx, adjustJobPoint, changeState " + changeState);
        selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.adjustJobPoint(numberedChangeState);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
        setCurrentJobPos(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.currentJobPos);
        setStats(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.stats);
    };
    react_1.useEffect(function () {
        setJob(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.job);
        setJobPo(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.jobPo);
        setCurrentJobPos(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.currentJobPos);
        setStats(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.stats);
    }, [rLL, selectedNode]);
    return (react_1["default"].createElement(CalculatorWrapper, null,
        react_1["default"].createElement("section", null,
            react_1["default"].createElement("label", { htmlFor: "job-select" }),
            job_1["default"].reduce(function (jobButtons, jobName, idx) {
                jobButtons.push(react_1["default"].createElement("button", { onClick: addNewJob, key: idx }, jobName));
                return jobButtons;
            }, [])),
        react_1["default"].createElement("section", null, buttonStates.map(function (buttonState, idx) {
            return (react_1["default"].createElement("button", { onClick: adjustJobPoint, key: idx }, buttonState));
        })),
        react_1["default"].createElement("section", null,
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("h5", null, "\uD604\uC7AC \uB178\uB4DC"),
                react_1["default"].createElement("div", null, "\uC9C1\uC5C5 : " + job),
                react_1["default"].createElement("span", null, " \uC7A1\uD3EC\uC778\uD2B8 : " + jobPo)),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("h5", null, "\uB204\uC801 \uC2A4\uD0EF"),
                react_1["default"].createElement("div", null, JSON.stringify(stats, null, 2)),
                react_1["default"].createElement("h5", null, "\uB204\uC801 \uC7A1\uD3EC"),
                react_1["default"].createElement("div", null, JSON.stringify(currentJobPos, null, 2)))),
        react_1["default"].createElement("section", null,
            react_1["default"].createElement("table", null,
                react_1["default"].createElement("tr", null,
                    react_1["default"].createElement("th", null, "\uC9C1\uC5C5"),
                    react_1["default"].createElement("th", null, "STR"),
                    react_1["default"].createElement("th", null, "INT"),
                    react_1["default"].createElement("th", null, "AGI"),
                    react_1["default"].createElement("th", null, "VIT"),
                    react_1["default"].createElement("th", null, "\uC7A1\uD3EC\uC778\uD2B8")),
                rLL.getAllNodes().map(function (routeNode, index) {
                    return (react_1["default"].createElement("tr", { id: "" + index, key: index, onClick: function (event) {
                            setSelectedNode(rLL.get(+event.currentTarget.id));
                            console.log(event.currentTarget);
                        } },
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.job),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.STR),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.INT),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.AGI),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.stats.VIT),
                        react_1["default"].createElement("td", null, routeNode === null || routeNode === void 0 ? void 0 : routeNode.jobPo)));
                })))));
}
exports["default"] = App;
var templateObject_1;
