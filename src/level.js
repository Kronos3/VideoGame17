"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
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
var Level = (function () {
    function Level(game, name) {
        var _this = this;
        this.objects = [];
        this.assets = [];
        this.enable = function () {
        };
        this.addObjectFromAsset = function (assetName, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            if (UTIL.find(assetName, _this.assets) != -1) {
                _this.objects.push({ name: assetName, object: new object_1.GameSprite(_this.game, _pos, assetName, extra) });
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format(assetName));
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            _this.loadAsset(name, path);
            _this.addObjectFromAsset(name, _pos, extra);
        };
        this.getObject = function (name) {
            for (var _i = 0, _a = _this.objects; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i.object;
                }
            }
            UTIL.error('Object {0} could not be found'.format(name));
            return null;
        };
        this.loadAsset = function (name, path) {
            _this.game.game.load.image(name, path);
            _this.assets.push({ path: path, name: name, level: _this });
        };
        this.game = game;
        this.name = name;
    }
    return Level;
}());
exports.Level = Level;
