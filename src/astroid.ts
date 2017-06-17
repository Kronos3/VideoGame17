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
                'Meteor-Small');
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
                'Meteor');
        }
        else if (type == 2) {
            var buffer = new Astroid (
                this.game,
                this.level,
                '3-astroid{0}'.format (this.astroids.length),
                {
                    x: () => {return this.game.game.world.randomX},
                    y: () => {return this.game.game.world.height}
                }, 
                'Meteor-3');
        }
        else if (type == 3) {
            var buffer = new Astroid (
                this.game,
                this.level,
                'ice-astroid{0}'.format (this.astroids.length),
                {
                    x: () => {return this.game.game.world.randomX},
                    y: () => {return this.game.game.world.height}
                }, 
                'Meteor-Ice');
        }
    }
}

export class Astroid extends GameSprite {
    body: string;
    constructor (game: MainGame, level: Level, name: string, pos: _position, asset: string) {
        super (game, level, name, pos, asset);
        this.enablePhysics ();
        if (asset == "Meteor-Small") {
            this.pObject.body.setCircle (60);
        }
        else if (asset == "Meteor") {
            this.pObject.body.setCircle (130);
        }
        else if (asset == "Meteor-3") {
            this.pObject.body.setCircle (130);
        }
        else if (asset == "Meteor-Ice") {
            this.pObject.body.setCircle (60);
        }
        this.pObject.body.mass = 30;
    }


}