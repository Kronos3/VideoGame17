/// <reference path="../imports/phaser.d.ts" />
import * as LEVEL from "./level"
import {MainGame} from "./game"
import * as UTIL from "./util"

export interface _position {
    x(): number;
    y(): number;
}

export class GameSprite {
    pObject: Phaser.Sprite;
    level: LEVEL.Level;
    game: MainGame;
    asset: string;
    extra: Object;
    name: string;
    pos: _position;
    constructor (game: MainGame, level: LEVEL.Level, name:string, pos: _position, asset: string, extra?: any) {
        this.level = level;
        this.name = name;
        this.game = game;
        this.asset = asset;
        this.extra = extra;
        this.pos = pos;
        this.pObject = this.game.game.add.sprite (this.pos.x(), this.pos.y(), this.asset);
    }

    addToLevel (level: LEVEL.Level) {

    }

    resetPosition = () => {
        this.pObject.x = this.pos.x ();
        this.pObject.y = this.pos.y ();
    }

    addProperty = (extra: any) => {
        this.extra = $.extend ({}, this.extra, external);
    }

    enablePhysics = () => {
        this.level.game.game.physics.p2.enable (this.pObject);
    }

    loadBody = (key: string) => {
        this.enablePhysics ();
        this.pObject.body.clearShapes();
        this.pObject.body.loadPolygon('physicsData', key);
    }

    isStatic: boolean;

    disable = () => {
        console.log (this.pObject.body)
        if (this.pObject.body != null) {
            this.isStatic = this.pObject.body.static;
            this.pObject.body.static = true;
            this.pObject.body.moves = false;
        }
        this.pObject.visible = false;
    }

    enable = () => {
        this.pObject.visible = true;
        if (this.pObject.body != null) {
            this.pObject.body.static = this.isStatic;
            this.pObject.body.moves = true;
        }
    }
}


export class DynamicSprite extends GameSprite {
    assets: string[] = [];
    constructor (game: MainGame, level: LEVEL.Level, name:string, pos: _position, assets: string[], extra?: any) {
        super (game, level, name, pos, assets[0], extra);
        this.assets = assets;
    }

    switchToIndex = (index: number) => {
        this.pObject.key = this.assets[index];
        this.pObject.loadTexture (this.pObject.key, 0);
    }

    switchTo = (name: string) => {
        if (UTIL.find (name, this.assets) != -1) {
            this.pObject.key = name;
            this.pObject.loadTexture (this.pObject.key, 0);
        }
    }

    resetPosition = () => {
        return;
    }
}