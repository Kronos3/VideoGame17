"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MissionControl = (function () {
    function MissionControl() {
        var _this = this;
        this.missions = [];
        this.addMission = function (m) {
            _this.missions.push(m);
        };
    }
    return MissionControl;
}());
exports.MissionControl = MissionControl;
var Mission = (function () {
    function Mission(e, condition, title, desc, update) {
        var _this = this;
        this.complete = false;
        this.frame = function () {
            if (_this.condition()) {
                _this.complete = true;
            }
            _this.update();
        };
        this.element = e;
        this.title = title;
        this.desc = desc;
        this.condition = condition;
        this.update = update;
    }
    return Mission;
}());
exports.Mission = Mission;
