"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateMission(m) {
    var e = $("<div class=\"mission\">\
    <p class=\"title\">{0}</p>\
    <p class=\"description\">{1}</p>\
</div>".format(m.title, m.description));
    //e.appendTo( ".mission-control > .inner" );
    return new Mission(e.get(0), m.condition, m.title, m.onDone, m.description, m.update);
}
exports.generateMission = generateMission;
var MissionControl = (function () {
    function MissionControl(levelName) {
        var _this = this;
        this.missionIndex = 0;
        this.missions = [];
        this.addMission = function (m) {
            _this.missions.push(m);
        };
        this.begin = function () {
            _this.missionIndex = 0;
        };
        this.nextMission = function () {
            _this.missionIndex++;
        };
        this.frame = function () {
            _this.missions[_this.missionIndex].frame();
        };
    }
    return MissionControl;
}());
exports.MissionControl = MissionControl;
var Mission = (function () {
    function Mission(e, condition, title, onDone, desc, update) {
        var _this = this;
        this.complete = false;
        this.frame = function () {
            if (_this.condition()) {
                _this.complete = true;
                _this.onDone();
            }
            _this.update();
        };
        this.element = e;
        this.title = title;
        this.desc = desc;
        this.condition = condition;
        this.update = update;
        this.onDone = onDone;
    }
    return Mission;
}());
exports.Mission = Mission;
