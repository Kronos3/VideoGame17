/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {GameSprite} from "./object"
import {MainGame} from "./game"
import {Level} from "./level"
import {_position} from "./object"
import * as UTIL from "./util"

export interface Force {
    x: number; // Force vector on X
    y: number; // Force vector on Y
    r: number; // Rotational vector
}

export class AstroidBelt {
    game: MainGame;
    level: Level;
    astroids: Astroid[] = [];
    constructor (game: MainGame, level: Level) {
        this.game = game;
        this.level = level;
    }

    spawn = () => { // Spawn an astroid
        //Determine type of astroid
        var type = UTIL.getRandomInt (0, 1);
        var pos = {
            x: UTIL.getRandomInt (0, this.game.game.world.bounds.width),
            y: UTIL.getRandomInt (0, this.game.game.world.bounds.height)
        }
        var force = {
            x: UTIL.getRandomArbitrary (-40, 40),
            y: UTIL.getRandomArbitrary (-40, 40),
            r: UTIL.getRandomArbitrary (-2, 2)
        }
        if (type) {
            var buffer = new Astroid (
                this.game,
                this.level,
                'SMALL-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor-Small', 'Meteor_Small-L', force);
            this.astroids.push (buffer);
        }
        else {
            var buffer = new Astroid (
                this.game,
                this.level,
                'LARGE-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor', 'Meteor-L', force);
            this.astroids.push (buffer);
        }
    }
}

export class Astroid extends GameSprite {
    body: string;
    force: Force;
    constructor (game: MainGame, level: Level, name: string, pos: _position, asset: string, body: string, force: Force) {
        super (game, level, name, pos, asset);
        this.body = body;
        this.loadBody (this.body);
        this.force = force;
        this.setForce (this.force);
        this.pObject.body.collideWorldBounds = false;
    }

    setForce (f: Force) {
        this.pObject.body.velocity.x = f.x;
        this.pObject.body.velocity.y = f.y;
        this.pObject.body.angularForce = f.r;
    }
}