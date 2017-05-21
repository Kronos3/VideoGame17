import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {DynamicSprite} from "./object"
import {MainGame} from "./game"
import {_position} from "./object"
import * as UTIL from "./util"

export class LevelSequence {
    levels: Level[] = [];
    current: number;
    constructor () {
        ;
    }

    addLevel = (_level: Level) => {
        this.levels.push (_level);
    }

    start = () => {
        this.current = 0;
        this.levels[0].enable ();
    }

    getLevel = (name: string): Level => {
        for (var iter of this.levels) {
            if (iter.name == name) {
                return iter;
            }
        }
        UTIL.error ('Level {0} could not be found'.format (name));
        return null;
    }
}

export interface ObjectAsset {
    name: string;
    assets: string | string[];
    position?: _position;
    physics?: string;
    static?: boolean;
    extra?: any;
}

export interface BasicAsset {
    path: string;
    name: string;
}

export interface LevelConstructor {
    name: string;
    game: MainGame;
    objects?: ObjectAsset[];
}

export function createLevel (_const: LevelConstructor): Level {
    var out = new Level (_const.game, _const.name);
    if (typeof _const.objects !== "undefined") {
        for (var iter of _const.objects){
            var OBJ: GameSprite;
            if (iter.assets instanceof Array) {
                // Dynamic Objects
                // Generate the object
                OBJ = new DynamicSprite (out.game, out, iter.name, iter.position, iter.assets, iter.extra);
            }
            else {
                // Static Object
                // Add the object
                OBJ = new GameSprite (out.game, out, iter.name, iter.position, iter.assets, iter.extra);
            }
            if (typeof iter.physics !== "undefined") {
                OBJ.loadBody (iter.physics);
            }
            if (typeof iter.static !== "undefined") {
                OBJ.pObject.body.static = iter.static;
            }
            out.addObject (OBJ);
        }
    }
    return out;
}

export class Level {
    objects: GameSprite[] = [];
    game: MainGame;
    name: string;
    constructor (game: MainGame,  name: string) {
        this.game = game;
        this.name = name;
    }

    enable = () => {
        this.objects.forEach(element => {
            element.enable ();
        });
    }

    disable = () => {
        this.objects.forEach(element => {
            element.disable ();
        });
    }

    addObjectFromAsset = (name: string, _pos = {x: () => {return 0}, y: () => {return 0}}, extra?: any) => {
        if (UTIL.find(name, this.game.assets) != -1) {
            this.objects.push (new GameSprite (this.game, this, name, _pos, this.game.assets[UTIL.find(name, this.game.assets)], extra));
        }
        else {
            UTIL.error('Asset {0} has not been preloaded, use newObject()'.format (name));
        }
    }

    newObject = (name: string, path: string, _pos = {x: () => {return 0}, y: () => {return 0}}, extra?: any) => {
        this.game.loadAsset (name, path);
        this.addObjectFromAsset (name, _pos, extra);
    }

    getObject = (name: string): GameSprite => {
        for (var i of this.objects) {
            if (i.name == name) {
                return i;
            }
        }
        UTIL.error ('Object {0} could not be found'.format (name));
        return null;
    }

    addObject = (obj: GameSprite) => {
        this.objects.push (obj);
    }

    resetPositions = () => {
        this.objects.forEach(element => {
            element.resetPosition ();
        });
    }
}