/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
import {KeyBinding} from "./control"
import {MainGame} from "./game"
import {Level} from "./level"
import {_position} from "./object"
import {Animation} from "./animation"

export class Rover extends DynamicSprite {
    bodyName: string;
    constructor (game: MainGame,
                 level: Level,
                 name:string,
                 bodyName: string,
                 pos: _position,
                 assets: string[]) {
        super (game, level, name, pos, assets);
        this.bodyName = bodyName;
        this.loadBody (bodyName);
        
    }
}