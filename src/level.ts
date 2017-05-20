import {ControlScheme} from "./control"
import {KeyBinding} from "./control"
import {GameSprite} from "./object"
import {MainGame} from "./game"
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

export interface __object {
    name: string;
    object: GameSprite;
}

export interface asset {
    path: string;
    name: string;
    level: Level;
}

export class Level {
    objects: __object[] = [];
    game: MainGame;
    name: string;
    assets: asset[] = [];
    constructor (game: MainGame,  name: string) {
        this.game = game;
        this.name = name;
    }

    enable = () => {

    }

    addObjectFromAsset = (assetName: string, _pos = {x: 0, y: 0}, extra?: any) => {
        if (UTIL.find(assetName, this.assets) != -1) {
            this.objects.push ({name: assetName, object: new GameSprite (this.game, _pos, assetName, extra)});
        }
        else {
            UTIL.error('Asset {0} has not been preloaded, use newObject()'.format (assetName));
        }
    }

    newObject = (name: string, path: string, _pos = {x: 0, y: 0}, extra?: any) => {
        this.loadAsset (name, path);
        this.addObjectFromAsset (name, _pos, extra);
    }

    getObject = (name: string): GameSprite => {
        for (var i of this.objects) {
            if (i.name == name) {
                return i.object;
            }
        }
        UTIL.error ('Object {0} could not be found'.format (name));
        return null;
    }

    loadAsset = (name: string, path: string, all = false) => {
        this.game.game.load.image (name, path);
        if (all) {
            
            for (var iter of this.game.levelsequence.levels) {
                iter.assets.push ({path: path, name, level: iter})
            }
        }
        else {
            this.assets.push ({path: path, name: name, level: this});
        }
    }
}