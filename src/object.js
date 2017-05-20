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
var GameSprite = (function () {
    function GameSprite(level, name, pos, asset, extra) {
        this.level = level;
        this.name = name;
        if (typeof asset !== "string") {
            this.asset = asset;
        }
        else {
            this.level.getAsset(asset);
        }
        this.extra = $.extend({}, this.extra, external);
        this.pObject = this.level.game.game.add.sprite(0, 0, this.asset);
    }
    GameSprite.prototype.addProperty = function (extra) {
        this.extra = $.extend({}, this.extra, external);
    };
    GameSprite.prototype.enablePhysics = function () {
        this.level.game.game.physics.p2.enable(this.pObject);
    };
    return GameSprite;
}());
exports.GameSprite = GameSprite;
var DynamicSprite = (function (_super) {
    __extends(DynamicSprite, _super);
    function DynamicSprite(game, name, pos, assets, extra) {
        var _this = _super.call(this, game, name, pos, assets[0], extra) || this;
        _this.assets = [];
        _this.switchToIndex = function (index) {
            _this.pObject.key = _this.assets[index].name;
            _this.pObject.loadTexture(_this.pObject.key);
        };
        _this.switchTo = function (name) {
            if (UTIL.find(name, _this.assets) != -1) {
                _this.pObject.key = name;
                _this.pObject.loadTexture(_this.pObject.key);
            }
        };
        for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
            var iter = assets_1[_i];
            if (typeof iter === "string") {
                _this.assets.push(_this.level.getAsset(iter));
            }
            else {
                _this.assets.push(iter);
            }
        }
        return _this;
    }
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;
