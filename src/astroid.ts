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
    totalMeteor: number;
    constructor (game: MainGame, level: Level, n:number) {
        this.game = game;
        this.level = level;
        this.totalMeteor = n;
        this.game.game.time.events.loop(
            Phaser.Timer.SECOND,
            this.spawn,
            this);
    }

    spawn () {
        var type = UTIL.getRandomInt (0, 3);
        if (type == 0) {
            var buffer = new Astroid (
                this.game,
                this.level,
                'SMALL-astroid{0}'.format (this.astroids.length),
                {
                    x: () => {return this.game.game.world.randomX},
                    y: () => {return this.game.game.world.height}
                }, 
                'Meteor-Small', 'Meteor_Small-L');
        }
        else if (type == 1) {
            var buffer = new Astroid (
                this.game,
                this.level,
                'LARGE-astroid{0}'.format (this.astroids.length),
                {
                    x: () => {return this.game.game.world.randomX},
                    y: () => {return this.game.game.world.height}
                }, 
                'Meteor', 'Meteor-L');
        }
        else if (type == 2) {
            var buffer = new Astroid (
                this.game,
                this.level,
                'LARGE-astroid{0}'.format (this.astroids.length),
                {
                    x: () => {return this.game.game.world.randomX},
                    y: () => {return this.game.game.world.height}
                }, 
                'Meteor', 'Meteor-L');
        }
    }
}

export class Astroid extends GameSprite {
    body: string;
    constructor (game: MainGame, level: Level, name: string, pos: _position, asset: string, body: string) {
        super (game, level, name, pos, asset);
        this.body = body;
        this.enablePhysics ();
        if (asset == "Meteor") {
            this.pObject.body.setCircle (130);
        }
        else {
            this.pObject.body.setCircle (60);
        }
        this.pObject.body.mass = 30;


        //this.pObject.body.createBodyCallback(this.game.game.physics.p2.walls.top, this.collideTop, this);
        //this.pObject.body.collideWorldBounds = false;
    }

    collideTop (body1, body2) {
        console.log(this);
    }

    setForce (f: Force) {
        this.pObject.body.velocity.x = f.x;
        this.pObject.body.velocity.y = f.y;
        this.pObject.body.angularForce = f.r;
        this.pObject.body.damping = 0;
        this.pObject.body.mass = 100;
    }
}