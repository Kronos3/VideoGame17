/// <reference path="../imports/phaser.d.ts" />
import * as LEVEL from "./level"
import {MainGame} from "./game"
import * as UTIL from "./util"

export interface _position {
    x(): number;
    y(): number;
    width?: number;
    height?: number;
}

export class GameSprite {
    pObject: Phaser.Sprite | Phaser.TileSprite;
    level: LEVEL.Level;
    game: MainGame;
    asset: string;
    extra: Object;
    name: string;
    pos: _position;
    constructor (game: MainGame, level: LEVEL.Level, name:string, pos: _position, asset: string, extra?: any, repeat = false) {
        this.level = level;
        this.name = name;
        this.game = game;
        this.asset = asset;
        this.extra = extra;
        this.pos = pos;
        if (repeat || typeof repeat ==='undefined') {
            this.pObject = this.game.game.add.tileSprite (this.pos.x(), this.pos.y(), this.pos.width, this.pos.height, asset);
        }
        else {
            this.pObject = this.game.game.add.sprite (this.pos.x(), this.pos.y(), this.asset);
        }
        
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
    
    disable = (destroy=false) => {
        if (this.pObject.body != null) {
            this.isStatic = this.pObject.body.static;
            this.pObject.body.static = true;
            this.pObject.body.moves = false;
            //this.pObject.body.collides ();
        }
        this.pObject.visible = false;
        if (destroy) {
            this.pObject.destroy()
        }
    }

    enable = () => {
        this.pObject.visible = true;
        if (this.pObject.body != null) {
            this.pObject.body.static = this.isStatic;
            this.pObject.body.moves = true;
            //this.pObject.body.collides (this.level.getAllBodies ());
        }
    }

    getVector = (_x: number, _y:number) => {
        return {
            x: _x - this.pObject.body.x,
            y: _y - this.pObject.body.y
        }
    }
}

export class DynamicSprite extends GameSprite {
    pObject: Phaser.Sprite;
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