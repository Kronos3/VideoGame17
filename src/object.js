"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var UTIL = require("./util");
var $ = require("jquery");
var GameSprite = (function () {
    function GameSprite(game, level, name, pos, asset, extra, repeat) {
        if (repeat === void 0) { repeat = false; }
        var _this = this;
        this.appendToLevel = function () {
            _this.level.objects.push(_this);
        };
        this.gravityAction = function () {
            if (_this.game.gravity == 0) {
                return;
            }
            var BODY = _this.pObject.body;
            var relative_thrust = -(_this.game.gravity * _this.pObject.body.mass);
            BODY.velocity.y -= (relative_thrust / 100) * _this.game.get_ratio();
        };
        this.init = function () {
            if (typeof _this.construct == "undefined") {
                return;
            }
            if (typeof _this.construct.physics !== "undefined") {
                _this.loadBody(_this.construct.physics);
            }
            if (typeof _this.construct.static !== "undefined") {
                _this.pObject.body.static = _this.construct.static;
                _this.isStatic = _this.pObject.body.static;
                _this.isMoves = false;
            }
        };
        this.reset = function () {
            if (_this.pObject.body != null) {
                _this.pObject.body.x = _this.pos.x();
                _this.pObject.body.y = _this.pos.y();
            }
            else {
                _this.pObject.x = _this.pos.x();
                _this.pObject.y = _this.pos.y();
            }
        };
        this.addProperty = function (extra) {
            _this.extra = $.extend({}, _this.extra, external);
        };
        this.enablePhysics = function () {
            _this.level.game.game.physics.p2.enable(_this.pObject);
        };
        this.loadBody = function (key) {
            _this.enablePhysics();
            _this.pObject.body.clearShapes();
            _this.pObject.body.loadPolygon('physicsData', key);
        };
        this.isDead = false;
        this.enable = function () {
            _this.pObject.visible = true;
            if (_this.pObject.body != null) {
                _this.pObject.body.static = _this.isStatic;
                _this.pObject.body.moves = _this.isMoves;
                //this.pObject.body.collides (this.level.getAllBodies ());
            }
        };
        this.getVector = function (_x, _y) {
            return {
                x: _x - _this.pObject.body.x,
                y: _y - _this.pObject.body.y
            };
        };
        this.level = level;
        this.name = name;
        this.game = game;
        this.asset = asset;
        this.extra = extra;
        this.pos = pos;
        if (repeat || typeof repeat === 'undefined') {
            this.pObject = this.game.game.add.tileSprite(this.pos.x(), this.pos.y(), this.pos.width, this.pos.height, asset);
        }
        else {
            this.pObject = this.game.game.add.sprite(this.pos.x(), this.pos.y(), this.asset);
        }
    }
    GameSprite.prototype.disable = function (destroy) {
        if (destroy === void 0) { destroy = false; }
        if (this.isDead) {
            return;
        }
        if (this.pObject.body != null) {
            this.isStatic = this.pObject.body.static;
            this.isMoves = this.pObject.body.moves;
            this.pObject.body.static = true;
            this.pObject.body.moves = false;
            //this.pObject.body.collides ();
        }
        this.pObject.visible = false;
        if (destroy) {
            this.pObject.destroy();
            this.isDead = true;
            var v;
            if ((v = this.game.gravityObjects.indexOf(this)) > -1) {
                this.game.gravityObjects.splice(v, 1); // Remove from gravity
            }
        }
    };
    return GameSprite;
}());
exports.GameSprite = GameSprite;
var DynamicSprite = (function (_super) {
    __extends(DynamicSprite, _super);
    function DynamicSprite(game, level, name, pos, assets, extra) {
        var _this = _super.call(this, game, level, name, pos, assets[0], extra) || this;
        _this.assets = [];
        _this.follow = function () {
            _this.game.game.camera.follow(_this.pObject);
        };
        _this.switchToIndex = function (index) {
            _this.pObject.key = _this.assets[index];
            _this.pObject.loadTexture(_this.pObject.key, 0);
        };
        _this.switchTo = function (name) {
            if (UTIL.find(name, _this.assets) != -1) {
                _this.pObject.key = name;
                _this.pObject.loadTexture(_this.pObject.key, 0);
            }
        };
        _this.resetPosition = function () {
            return;
        };
        _this.assets = assets;
        return _this;
    }
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;
