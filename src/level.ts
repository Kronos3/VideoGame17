import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {DynamicSprite} from "./object"
import {MainGame} from "./game"
import {initShip} from "./main"
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

    getCurrent = () => {
        return this.levels[this.current];
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

    initGame = () => {
        this.current = -1;
        for (var i = 0; i!= this.levels.length; i++) {
            this.levels[i].disable ();
        }
        this.levels[0].enable ();
    }

    nextLevel = (t = false) => {
        this.current++;
        if (t) {
            UTIL.move (this.levels[this.current - 1].getObject('ship'),
                this.levels[this.current - 1].objects,
                this.levels[this.current].objects);
            this.levels[this.current].getObject ('ship').level = this.levels[this.current];
            this.levels[this.current].init(this.levels[this.current]);
            this.levels[this.current - 1].disable (true);
        }
        this.levels[this.current].enable ();
    }
}

export interface ObjectAsset {
    name: string;
    assets: string | string[];
    position?: _position;
    physics?: string;
    static?: boolean;
    extra?: any;
    tile?: boolean;
    repeat?: boolean;
    init?: (d: GameSprite) => void;
}

export interface BasicAsset {
    path: string;
    name: string;
}

export interface LevelConstructor {
    name: string;
    game: MainGame;
    done: () => boolean;
    objects?: ObjectAsset[];
    frame?: () => void;
    init?: (l: Level) => void;
}

export function createLevel (_const: LevelConstructor): Level {
    var out = new Level (_const.game, _const.name, _const.done, _const.frame, _const.init);
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
                OBJ = new GameSprite (out.game, out, iter.name, iter.position, iter.assets, iter.extra, iter.repeat);
            }
            
            OBJ.construct = iter;

            out.addObject (OBJ);
        }
    }
    return out;
}

export class Level {
    objects: GameSprite[] = [];
    game: MainGame;
    name: string;
    setframe: () => void = () => {return};
    binit: (l: Level) => void;
    done: () => boolean;
    inited: boolean = false;

    constructor (game: MainGame,  name: string, done: () => boolean, frame = () => {return}, init = (l: Level) => {return}) {
        this.game = game;
        this.name = name;
        this.setframe = frame;
        this.binit = init;
        this.done = done;
        this.frameFunctions = []
    }

    init = (l :Level) => {
        this.inited = true;
        for (var i of this.objects) {
            if (typeof i.init != "undefined") {
                i.init ();
            } 
            i.reset ();
        }
        this.binit (l);
        (<DynamicSprite>this.getObject ('ship')).follow ();
    };

    frameFunctions: (() => void)[];
    
    addFrame = (a: () => void) => {
        this.frameFunctions.push (a);
    }

    frame = () => {
        if (this.inited) {
            this.setframe ();
        }
        for (var i of this.frameFunctions) {
            i ();
        }
    }

    getAllBodies = () => {
        var out = [];
        this.objects.forEach(element => {
            out.push(element.pObject.body);
        });
        return out;
    }

    enable = () => {
        this.objects.forEach(element => {
            element.enable ();
        });
    }

    disable = (destroy = false) => {
        this.objects.forEach((element) => {
            element.disable (destroy);
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
        return null;
    }

    addObject = (obj: GameSprite) => {
        this.objects.push (obj);
    }

    resetPositions = () => {
        this.objects.forEach(element => {
            element.reset ();
        });
    }
}