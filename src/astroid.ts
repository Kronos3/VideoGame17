/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
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
    total: number;
    constructor (game: MainGame, level: Level, total:number) {
        this.game = game;
        this.level = level;
        this.game.game.time.events.loop (500, this.loop, this);

        this.total = total;
    }

    loop () {
        if (this.astroids.length > this.total) {
            return;
        }
        this.spawn ();
    }

    spawn () {
        var type = UTIL.getRandomInt (0, 3);
        var _type = UTIL.getRandomInt (0, 1);
        var xrange = {
            min: this.game.levelsequence.getCurrent().getObject ('ship').pObject.x + 600,
            max: this.game.levelsequence.getCurrent().getObject ('ship').pObject.x + 4500,
        }
        var pos = {
            x: () => {return UTIL.getRandomInt (xrange.min, xrange.max)},
            y: () => {return _type ? this.game.game.world.height : 0}
        }
        if (type == 0) {
            var buffer = new Astroid (this,
                this.game,
                this.level,
                'SMALL-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor-Small');
        }
        else if (type == 1) {
            var buffer = new Astroid (this,
                this.game,
                this.level,
                'LARGE-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor');
        }
        else if (type == 2) {
            var buffer = new Astroid (this,
                this.game,
                this.level,
                '3-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor-3');
        }
        else if (type == 3) {
            var buffer = new Astroid (this,
                this.game,
                this.level,
                'ice-astroid{0}'.format (this.astroids.length),
                pos, 
                'Meteor-Ice');
        }
        this.astroids.push (buffer);
    }

    frame = () => {
        for (var i of this.astroids) {
            if (!i.dead) {
                i.frame ();
            }
        }
    }
}

export class Astroid extends DynamicSprite {
    body: string;
    parent: AstroidBelt;
    dead: boolean;
    constructor (belt: AstroidBelt, game: MainGame, level: Level, name: string, pos: _position, asset: string) {
        super (game, level, name, pos, [asset]);
        this.parent = belt;
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
            this.pObject.body.setCircle (30);
        }
        this.pObject.body.mass = 30;
        this.pObject.body.onBeginContact.add(this.collide, this);
        this.dead = false;
        this.pObject.body.velocity.x = 0;
        if (this.pos.y() != 0) {
            this.pObject.body.velocity.y = -1;
        }
        else {
            this.pObject.body.velocity.y = 1;
        }
    }

    collide = (target: Phaser.Physics.P2.Body, this_target: Phaser.Physics.P2.Body, shapeA, shapeB, contactEquation) => {
        if(contactEquation[0]!=null) {

            if (shapeB.id == 14 && this.pos.y() != 0) {
                this.dead = true;
                this.pObject.destroy ();
                this.parent.spawn ();
            }
            else if (shapeB.id == 15 && this.pos.y() == 0) {
                this.dead = true;
                this.pObject.destroy ();
                this.parent.spawn ();
            }
        }
    }

    frame = () => {
        this.pObject.body.velocity.x %= 40;
        if (this.pos.y() != 0) {
            this.pObject.body.velocity.y = -500;
        }
        else {
            this.pObject.body.velocity.y = 500;
        }
    }
}