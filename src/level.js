"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
var object_2 = require("./object");
var UTIL = require("./util");
var LevelSequence = (function () {
    function LevelSequence() {
        var _this = this;
        this.levels = [];
        this.addLevel = function (_level) {
            _this.levels.push(_level);
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
        ;
    }
    return LevelSequence;
}());
exports.LevelSequence = LevelSequence;
function createLevel(_const) {
    var out = new Level(_const.game, _const.name);
    if (typeof _const.objects !== "undefined") {
        for (var _i = 0, _a = _const.objects; _i < _a.length; _i++) {
            var iter = _a[_i];
            if (iter.assets instanceof Array) {
                // Dynamic Objects
                // Load the assets
                for (var _b = 0, _c = iter.assets; _b < _c.length; _b++) {
                    var asset_iter = _c[_b];
                    out.game.loadAsset(asset_iter.name, asset_iter.path);
                }
                // Generate the object
                out.addObject(new object_2.DynamicSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra));
            }
            else {
                // Static Object
                // Load the asset
                out.game.loadAsset(iter.assets.name, iter.assets.path);
                // Add the object
                out.addObject(new object_1.GameSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra));
            }
        }
    }
}
exports.createLevel = createLevel;
var Level = (function () {
    function Level(game, name) {
        var _this = this;
        this.objects = [];
        this.enable = function () {
        };
        this.addObjectFromAsset = function (name, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            if (UTIL.find(name, _this.game.assets) != -1) {
                _this.objects.push(new object_1.GameSprite(_this.game, _this, name, _pos, _this.game.assets[UTIL.find(name, _this.game.assets)], extra));
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format(name));
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
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
        this.game = game;
        this.name = name;
    }
    Level.prototype.addObject = function (obj) {
        this.objects.push(obj);
    };
    return Level;
}());
exports.Level = Level;
