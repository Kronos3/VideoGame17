/// <reference path="../imports/phaser.d.ts" />
import * as LEVEL from "./level"
import {MainGame} from "./game"
import * as UTIL from "./util"

export interface _position {
    x: number;
    y: number;
}

export class GameSprite {
    pObject: Phaser.Sprite;
    level: LEVEL.Level;
    game: MainGame;
    asset: LEVEL.Asset;
    extra: Object;
    name: string;
    constructor (game: MainGame, level: LEVEL.Level, name:string, pos: _position, asset: string | LEVEL.Asset, extra?: any) {
        this.level = level;
        this.name = name;
        this.game = game;
        if (typeof asset !== "string") {
            this.asset = asset;
        }
        else {
            this.game.getAsset (asset);
        }
        this.extra = $.extend ({}, this.extra, external);
        this.pObject = this.game.game.add.sprite (pos.x, pos.y, this.asset.name);
    }

    addToLevel (level: LEVEL.Level) {

    }

    addProperty = (extra: any) => {
        this.extra = $.extend ({}, this.extra, external);
    }

    enablePhysics = () => {
        this.level.game.game.physics.p2.enable (this.pObject);
    }
}

export class DynamicSprite extends GameSprite {
    assets: LEVEL.Asset[] = [];
    constructor (game: MainGame, level: LEVEL.Level, name:string, pos: _position, assets: string[] | LEVEL.Asset[], extra?: any) {
        super (game, level, name, pos, assets[0], extra);
        for (var iter of assets) {
            if (typeof iter === "string") {
                this.assets.push (this.game.getAsset(iter));
            }
            else {
                this.assets.push (iter);
            }
        }
    }

    switchToIndex = (index: number) => {
        this.pObject.key = this.assets[index].name;
        this.pObject.loadTexture (this.pObject.key);
    }

    switchTo = (name: string) => {
        if (UTIL.find (name, this.assets) != -1) {
            this.pObject.key = name;
            this.pObject.loadTexture (this.pObject.key);
        }
    }
}