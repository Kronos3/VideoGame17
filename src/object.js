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
    function GameSprite(game, asset, extra) {
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
    function DynamicSprite(game, assets, extra) {
        var _this = _super.call(this, game, assets[0], extra) || this;
        _this.assets = [];
        _this.assets = assets;
        return _this;
    }
    DynamicSprite.prototype.switchToIndex = function (index) {
        this.pObject.key = this.assets[index];
        this.pObject.loadTexture(this.pObject.key);
    };
    DynamicSprite.prototype.switchTo = function (name) {
        if (UTIL.find(name, this.assets) != -1) {
            this.pObject.key = name;
            this.pObject.loadTexture(this.pObject.key);
        }
    };
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;
