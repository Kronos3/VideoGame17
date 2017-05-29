"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateMission(m) {
    var e = $("<div class=\"mission\">\
    <p class=\"title\">{0}</p>\
    <p class=\"description\">{1}</p>\
</div>".format(m.title, m.description));
    return new Mission(e.get(0), m.condition, m.title, m.onDone, m.description, m.update);
}
exports.generateMission = generateMission;
var MissionControl = (function () {
    function MissionControl(level) {
        var _this = this;
        this.missionIndex = 0;
        this.missions = [];
        this.addMission = function (m) {
            m.setControl(_this);
            _this.missions.push(m);
            $(m.element).appendTo(".mission-control > .inner");
        };
        this.begin = function () {
            _this.missionIndex = 0;
        };
        this.nextMission = function () {
            _this.missionIndex++;
        };
        this.frame = function () {
            var current_mission = _this.missions[_this.missionIndex];
            if (typeof current_mission === 'undefined') {
                _this.level.game.wrapper.handleNext();
                return;
            }
            current_mission.frame();
            if (!$(current_mission.element).hasClass('current')) {
                $(current_mission.element).addClass('current');
            }
        };
        this.level = level;
    }
    return MissionControl;
}());
exports.MissionControl = MissionControl;
var Mission = (function () {
    function Mission(e, condition, title, onDone, desc, update) {
        var _this = this;
        this.complete = false;
        this.setControl = function (c) {
            _this.missionControl = c;
        };
        this.frame = function () {
            if (_this.condition()) {
                _this.complete = true;
                _this.onDone();
                $(_this.element).removeClass('current');
                $(_this.element).addClass('finished');
                _this.missionControl.nextMission();
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
