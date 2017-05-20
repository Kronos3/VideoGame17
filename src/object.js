"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
