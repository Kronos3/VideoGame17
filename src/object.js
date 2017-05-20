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
    function GameSprite(game, pos, asset, extra) {
        this.game = game;
        this.assetName = asset;
        this.extra = $.extend({}, this.extra, external);
        this.pObject = this.game.game.add.sprite(0, 0, this.assetName);
    }
    GameSprite.prototype.addProperty = function (extra) {
        this.extra = $.extend({}, this.extra, external);
    };
    GameSprite.prototype.enablePhysics = function () {
        this.game.game.physics.p2.enable(this.pObject);
    };
    return GameSprite;
}());
exports.GameSprite = GameSprite;
var DynamicSprite = (function (_super) {
    __extends(DynamicSprite, _super);
    function DynamicSprite(game, pos, assets, extra) {
        var _this = _super.call(this, game, pos, assets[0], extra) || this;
        _this.assets = [];
        _this.switchToIndex = function (index) {
            _this.pObject.key = _this.assets[index];
            _this.pObject.loadTexture(_this.pObject.key);
        };
        _this.switchTo = function (name) {
            if (UTIL.find(name, _this.assets) != -1) {
                _this.pObject.key = name;
                _this.pObject.loadTexture(_this.pObject.key);
            }
        };
        _this.assets = assets;
        return _this;
    }
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;
