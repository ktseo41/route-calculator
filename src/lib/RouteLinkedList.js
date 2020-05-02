"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var job_1 = require("../database/job");
var jobPointMap_1 = __importDefault(require("../database/jobPointMap"));
var RouteLinkedList = /** @class */ (function () {
    function RouteLinkedList() {
        this.length = 0;
        this.head = null;
        this.tail = null;
        this.add(job_1.Jobs.무직);
    }
    // = push
    // 추가조건 1. 이전 jobPo가 100이면 추가할 수 없게 한다.
    RouteLinkedList.prototype.add = function (job) {
        if (this.tail && this.tail.currentJobPos[job] === 100)
            return null;
        var routeNode = new RouteNode(job);
        if (!this.tail) {
            this.head = routeNode;
            this.tail = routeNode;
        }
        else {
            this.tail.next = routeNode;
            routeNode.prev = this.tail;
            this.tail = routeNode;
            routeNode.getPrevs();
        }
        this.length += 1;
        return routeNode;
    };
    // 추가 조건 1. currentJobPo에서 현재 jobPo가 100이면 추가 못함
    RouteLinkedList.prototype.insertAt = function (job, index) {
        if (index < 0 || index > this.length)
            return null;
        if (index === 0)
            return this.unshift(job);
        if (index === this.length)
            return this.add(job);
        var routeNode = new RouteNode(job);
        var prevRouteNode = this.get(index - 1);
        if (prevRouteNode.currentJobPos[job] === 100)
            return null;
        var nextRouteNode = prevRouteNode.next;
        routeNode.prev = prevRouteNode;
        prevRouteNode.next = routeNode;
        routeNode.next = nextRouteNode;
        nextRouteNode.prev = routeNode;
        this.length -= 1;
        routeNode.getPrevs();
        // routeNode.next.recalculate()가 필요 없는 이유는
        // 추가만한 상황이라서 어떤 변화도 없을 것이기 때문이다.
        return routeNode;
    };
    // 추가 조건 마지막 노드의 jobpo가 100이면 추가 못하게
    RouteLinkedList.prototype.unshift = function (job) {
        if (this.tail && this.tail.currentJobPos[job] === 100)
            return null;
        var routeNode = new RouteNode(job);
        if (!this.length) {
            this.head = routeNode;
            this.tail = routeNode;
        }
        else {
            routeNode.next = this.head;
            this.head.prev = routeNode;
            this.head = routeNode;
            // routeNode.next.getPrevs();
            routeNode.next.recalculate();
        }
        this.length += 1;
        return routeNode;
    };
    RouteLinkedList.prototype.shift = function () {
        var _a;
        if (!this.length)
            return null;
        var nodeToRemove = this.head;
        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        }
        else {
            this.head = nodeToRemove.next;
            this.head.prev = null;
            nodeToRemove.next = null;
            // this.head.next?.getPrevs();
            (_a = this.head.next) === null || _a === void 0 ? void 0 : _a.recalculate();
        }
        this.length -= 1;
        return nodeToRemove;
    };
    RouteLinkedList.prototype.pop = function () {
        if (!this.length) {
            return null;
        }
        else {
            var nodeToRemove = this.tail;
            if (this.length === 1) {
                this.head = null;
                this.tail = null;
            }
            else {
                this.tail = this.tail.prev;
                this.tail.next = null;
                nodeToRemove.prev = null;
            }
            this.length -= 1;
            return nodeToRemove;
        }
    };
    RouteLinkedList.prototype.get = function (index) {
        if (!this.length || index < 0 || index >= this.length)
            return null;
        var current;
        if (index < this.length / 2) {
            var counter = 0;
            current = this.head;
            while (counter < index) {
                current = current.next;
                counter += 1;
            }
        }
        else {
            var counter = this.length - 1;
            current = this.tail;
            while (counter > index) {
                current = current.prev;
                counter -= 1;
            }
        }
        return current;
    };
    // index가 tail일때
    RouteLinkedList.prototype.removeAt = function (index) {
        if (index < 0 && index >= this.length)
            return null;
        if (index === 0)
            return this.shift();
        if (index === this.length - 1)
            return this.pop();
        var nodeToRemove = this.get(index);
        var prevNodeToRemove = nodeToRemove.prev;
        var nextNodeToRemove = nodeToRemove.next;
        nodeToRemove.next = null;
        nodeToRemove.prev = null;
        prevNodeToRemove.next = nextNodeToRemove;
        nextNodeToRemove.prev = prevNodeToRemove;
        this.length -= 1;
        // nextNodeToRemove.getPrevs();
        nextNodeToRemove.recalculate();
        return nodeToRemove;
    };
    RouteLinkedList.prototype.getAllNodes = function () {
        var allNodes = [];
        var count = 0;
        while (count < this.length) {
            allNodes.push(this.get(count));
            count += 1;
        }
        return allNodes;
    };
    return RouteLinkedList;
}());
exports["default"] = RouteLinkedList;
var RouteNode = /** @class */ (function () {
    function RouteNode(job) {
        var _a;
        this.jobPo = 0;
        this.stats = { STR: 5, INT: 5, AGI: 5, VIT: 5 };
        this.currentJobPos = (_a = {}, _a[job_1.Jobs.무직] = 0, _a);
        this.prev = null;
        this.next = null;
        this.job = job;
        this.jobPointMap = jobPointMap_1["default"][this.job];
    }
    RouteNode.prototype.adjustJobPoint = function (jobPoDelta, isRecalculating) {
        var actualChange;
        if (isRecalculating) {
            this.jobPo = 0;
            actualChange = jobPoDelta;
        }
        else {
            actualChange = this.getActualChange(jobPoDelta);
        }
        this.shouldChangeStats(actualChange) && this.changeStats(actualChange);
        this.jobPo += actualChange;
        this.currentJobPos[this.job] += actualChange;
        if (this.next)
            this.next.recalculate();
    };
    RouteNode.prototype.getActualChange = function (jobPoDelta) {
        var _a;
        if (jobPoDelta > 0) {
            return this.jobPo +
                jobPoDelta +
                (((_a = this.prev) === null || _a === void 0 ? void 0 : _a.currentJobPos[this.job]) || 0) >
                100
                ? 100 - this.jobPo
                : jobPoDelta;
        }
        else {
            return this.jobPo + jobPoDelta < 0 ? -this.jobPo : jobPoDelta;
        }
    };
    RouteNode.prototype.shouldChangeStats = function (actualChange) {
        var _this = this;
        return Object.keys(this.jobPointMap).some(function (interval) {
            return (Math.abs(Math.trunc((_this.jobPo + actualChange) / +interval) -
                Math.trunc(_this.jobPo / +interval)) >= 1);
        });
    };
    RouteNode.prototype.changeStats = function (actualChange) {
        var _this = this;
        var _loop_1 = function (interval) {
            if (this_1.jobPointMap.hasOwnProperty(interval)) {
                var quotient_1 = Math.trunc((this_1.jobPo + actualChange) / +interval) -
                    Math.trunc(this_1.jobPo / +interval);
                if (quotient_1 === 0)
                    return { value: void 0 };
                Object.entries(this_1.jobPointMap[interval]).forEach(function (_a) {
                    var _b = __read(_a, 2), stat = _b[0], deltaInfo = _b[1];
                    var _c = __read(deltaInfo, 2), delta = _c[0], limit = _c[1];
                    _this.applyStatDelta(quotient_1, stat, delta, limit);
                });
            }
        };
        var this_1 = this;
        for (var interval in this.jobPointMap) {
            var state_1 = _loop_1(interval);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    RouteNode.prototype.applyStatDelta = function (quotient, stat, delta, limit) {
        if ((quotient > 0 && delta > 0) || (quotient < 0 && delta < 0)) {
            this.increaseStats(quotient, stat, delta, limit);
        }
        if ((quotient > 0 && delta < 0) || (quotient < 0 && delta > 0)) {
            this.decreaseStats(quotient, stat, delta, limit);
        }
    };
    RouteNode.prototype.increaseStats = function (quotient, stat, delta, limit) {
        if (this.stats[stat] > limit)
            return;
        var prevStats = this.getPrevStats();
        var expectStat = this.stats[stat] + delta * quotient;
        if (delta > 0) {
            this.stats[stat] = expectStat > limit ? limit : expectStat;
        }
        else {
            if (prevStats[stat] > expectStat) {
                this.stats[stat] = expectStat;
            }
        }
    };
    RouteNode.prototype.decreaseStats = function (quotient, stat, delta, limit) {
        var prevStats = this.getPrevStats();
        var expectStat = this.stats[stat] + delta * quotient;
        if (delta > 0) {
            if (prevStats[stat] < 10) {
                this.stats[stat] =
                    expectStat < prevStats[stat] ? prevStats[stat] : expectStat;
            }
            else {
                this.stats[stat] = expectStat < 10 ? 10 : expectStat;
            }
        }
        else {
            if (this.stats[stat] < 10)
                return;
            this.stats[stat] = expectStat < limit ? limit : expectStat;
        }
    };
    RouteNode.prototype.getPrevStats = function () {
        return this.prev
            ? __assign({}, this.prev.stats) : { STR: 5, INT: 5, AGI: 5, VIT: 5 };
    };
    RouteNode.prototype.getPrevs = function () {
        var _a;
        this.stats = this.getPrevStats();
        this.currentJobPos = this.prev
            ? __assign({}, this.prev.currentJobPos) : (_a = {}, _a[job_1.Jobs.무직] = 0, _a);
        if (this.currentJobPos[this.job] === undefined)
            this.currentJobPos[this.job] = 0;
    };
    RouteNode.prototype.recalculateJobPo = function () {
        var _a, _b;
        if ((((_a = this.prev) === null || _a === void 0 ? void 0 : _a.currentJobPos[this.job]) || 0) + this.jobPo > 100) {
            return 100 - (((_b = this.prev) === null || _b === void 0 ? void 0 : _b.currentJobPos[this.job]) || 0);
        }
        return this.jobPo;
    };
    RouteNode.prototype.recalculate = function () {
        var isRecalculating = true;
        this.getPrevs();
        var newJobPo = this.recalculateJobPo();
        this.adjustJobPoint(newJobPo, isRecalculating);
        if (this.next)
            this.next.recalculate();
    };
    return RouteNode;
}());
exports.RouteNode = RouteNode;
