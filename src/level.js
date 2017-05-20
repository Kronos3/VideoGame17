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
                    out.loadAsset(asset_iter.name, asset_iter.path);
                }
                // Generate the object
                object_1.DynamicSprite;
            }
        }
    }
}
exports.createLevel = createLevel;
var Level = (function () {
    function Level(game, name) {
        var _this = this;
        this.objects = [];
        this.assets = [];
        this.enable = function () {
        };
        /* MOVE TO GAME SCOPE
        addObjectFromAsset = (assetName: string, _pos = {x: 0, y: 0}, extra?: any) => {
            if (UTIL.find(assetName, this.assets) != -1) {
                this.objects.push ({name: assetName, object: new GameSprite (this.game, _pos, assetName, extra)});
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format (assetName));
            }
        }
    
        newObject = (name: string, path: string, _pos = {x: 0, y: 0}, extra?: any) => {
            this.loadAsset (name, path);
            this.addObjectFromAsset (name, _pos, extra);
        }
        */
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
        this.getAsset = function (name) {
            for (var _i = 0, _a = _this.assets; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i;
                }
            }
            UTIL.error('Asset {0} could not be found'.format(name));
            return null;
        };
        this.loadAsset = function (name, path) {
            _this.game.game.load.image(name, path);
            var found = false;
            for (var _i = 0, _a = _this.assets; _i < _a.length; _i++) {
                var iter = _a[_i];
                if (iter.path == path) {
                    found = true;
                }
            }
            if (!found) {
                _this.assets.push({ path: path, name: name, level: _this });
            }
        };
        this.game = game;
        this.name = name;
    }
    return Level;
}());
exports.Level = Level;
