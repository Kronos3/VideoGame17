/// <reference path="../imports/phaser.d.ts" />
import * as GAME from "./game"
import * as UTIL from "./util"

export interface _position {
    x: number;
    y: number;
}

export class GameSprite {
    pObject: Phaser.Sprite;
    game: GAME.MainGame;
    assetName: string;
    extra: Object;
    constructor (game: GAME.MainGame, pos: _position, asset: string, extra?: any) {
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

export class DynamicSprite extends GameSprite {
    assets: string[] = [];
    constructor (game: GAME.MainGame, pos: _position, assets: string[], extra?: any) {
        super (game, pos, assets[0], extra);
        this.assets = assets;
    }

    switchToIndex = (index: number) => {
        this.pObject.key = this.assets[index];
        this.pObject.loadTexture (this.pObject.key);
    }

    switchTo = (name: string) => {
        if (UTIL.find (name, this.assets) != -1) {
            this.pObject.key = name;
            this.pObject.loadTexture (this.pObject.key);
        }
    }

    make
}