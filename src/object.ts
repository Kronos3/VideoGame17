/// <reference path="../imports/phaser.d.ts" />
import * as GAME from "./game"

export class GameSprite {
    pObject: Phaser.Sprite;
    game: GAME.MainGame;
    assetName: string;
    extra: Object;
    constructor (game: GAME.MainGame, asset: string, extra?: any) {
        this.game = game;
        this.assetName = asset;
        this.extra = $.extend ({}, this.extra, external);
        this.pObject = this.game.game.add.sprite (0,0, this.assetName)
    }

    addProperty (extra: any) {
        this.extra = $.extend ({}, this.extra, external);
    }

    enablePhysics () {
        this.game.game.physics.p2.enable (this.pObject);
    }
}