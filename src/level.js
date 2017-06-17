"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
var object_2 = require("./object");
var mission_1 = require("./mission");
var mission_2 = require("./mission");
var UTIL = require("./util");
var LevelSequence = (function () {
    function LevelSequence() {
        var _this = this;
        this.levels = [];
        this.addLevel = function (_level) {
            _this.levels.push(_level);
        };
        this.getCurrent = function () {
            return _this.levels[_this.current];
        };
        this.start = function () {
            _this.current = 0;
            _this.levels[0].enable();
        };
        this.getLevel = function (name) {
            for (var _i = 0, _a = _this.levels; _i < _a.length; _i++) {
                var iter = _a[_i];
                if (iter.name == name) {
                    return iter;
                }
            }
            UTIL.error('Level {0} could not be found'.format(name));
            return null;
        };
        this.initGame = function () {
            _this.current = -1;
            for (var i = 0; i != _this.levels.length; i++) {
                _this.levels[i].disable();
            }
            _this.levels[0].enable();
        };
        this.nextLevel = function (t) {
            if (t === void 0) { t = false; }
            _this.current++;
            if (t) {
                UTIL.move(_this.levels[_this.current - 1].getObject('ship'), _this.levels[_this.current - 1].objects, _this.levels[_this.current].objects);
                _this.levels[_this.current].getObject('ship').level = _this.levels[_this.current];
                _this.levels[_this.current].init(_this.levels[_this.current]);
                _this.levels[_this.current - 1].disable(true);
            }
            _this.levels[_this.current].enable();
        };
        ;
    }
    return LevelSequence;
}());
exports.LevelSequence = LevelSequence;
function createLevel(_const) {
    var out = new Level(_const.game, _const.name, _const.done, _const.frame, _const.init);
    if (typeof _const.objects !== "undefined") {
        for (var _i = 0, _a = _const.objects; _i < _a.length; _i++) {
            var iter = _a[_i];
            var OBJ;
            if (iter.assets instanceof Array) {
                // Dynamic Objects
                // Generate the object
                OBJ = new object_2.DynamicSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra);
            }
            else {
                // Static Object
                // Add the object
                OBJ = new object_1.GameSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra, iter.repeat);
            }
            if (typeof iter.init !== "undefined") {
                iter.init(OBJ);
            }
            if (typeof iter.physics !== "undefined") {
                OBJ.loadBody(iter.physics);
            }
            if (typeof iter.static !== "undefined") {
                OBJ.pObject.body.static = iter.static;
            }
            out.addObject(OBJ);
        }
    }
    return out;
}
exports.createLevel = createLevel;
var Level = (function () {
    function Level(game, name, done, frame, init) {
        if (frame === void 0) { frame = function () { return; }; }
        if (init === void 0) { init = function (l) { return; }; }
        var _this = this;
        this.objects = [];
        this.setframe = function () { return; };
        this.inited = false;
        this.init = function (l) {
            _this.binit(l);
            _this.inited = true;
        };
        this.addFrame = function (a) {
            _this.frameFunctions.push(a);
        };
        this.frame = function () {
            if (_this.inited) {
                _this.missionControl.frame();
                _this.setframe();
            }
            for (var _i = 0, _a = _this.frameFunctions; _i < _a.length; _i++) {
                var i = _a[_i];
                i();
            }
        };
        this.getAllBodies = function () {
            var out = [];
            _this.objects.forEach(function (element) {
                out.push(element.pObject.body);
            });
            return out;
        };
        this.addMission = function (l) {
            _this.missionControl.addMission(mission_1.generateMission(l));
        };
        this.enable = function () {
            _this.objects.forEach(function (element) {
                element.enable();
            });
        };
        this.disable = function (destroy) {
            if (destroy === void 0) { destroy = false; }
            _this.objects.forEach(function (element) {
                element.disable(destroy);
            });
        };
        this.addObjectFromAsset = function (name, _pos, extra) {
            if (_pos === void 0) { _pos = { x: function () { return 0; }, y: function () { return 0; } }; }
            if (UTIL.find(name, _this.game.assets) != -1) {
                _this.objects.push(new object_1.GameSprite(_this.game, _this, name, _pos, _this.game.assets[UTIL.find(name, _this.game.assets)], extra));
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format(name));
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: function () { return 0; }, y: function () { return 0; } }; }
            _this.game.loadAsset(name, path);
            _this.addObjectFromAsset(name, _pos, extra);
        };
        this.getObject = function (name) {
            for (var _i = 0, _a = _this.objects; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i;
                }
            }
            UTIL.error('Object {0} could not be found'.format(name));
            return null;
        };
        this.addObject = function (obj) {
            _this.objects.push(obj);
        };
        this.resetPositions = function () {
            _this.objects.forEach(function (element) {
                element.resetPosition();
            });
        };
        this.game = game;
        this.name = name;
        this.setframe = frame;
        this.binit = init;
        this.done = done;
        this.missionControl = new mission_2.MissionControl(this);
        this.missionControl.begin();
        this.frameFunctions = [];
    }
    return Level;
}());
exports.Level = Level;
