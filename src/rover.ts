/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
import {KeyBinding} from "./control"
import {MainGame} from "./game"
import {Level} from "./level"
import {_position} from "./object"
import {Animation} from "./animation"

export var RoverBinding = (game: MainGame, rover: Rover): KeyBinding => {return {
        key: -1, // Run every frame
        callback: () => {
            rover.preframe ();
        }
    }
};

interface Drive {
    leftWheel: p2.Shape | p2.Circle;
    middleWheel: p2.Shape | p2.Circle;
    rightWheel: p2.Shape | p2.Circle;
}

export class Rover extends DynamicSprite {
    bodyName: string;
    drive: Drive;
    constructor (game: MainGame,
                 level: Level,
                 name:string,
                 bodyName: string,
                 pos: _position,
                 assets: string[]) {
        super (game, level, name, pos, assets);
        this.pObject.destroy ();
        this.pObject = this.game.game.add.sprite(300, this.game.game.world.height - 200, 'rover', '01.png');
        this.bodyName = bodyName;
        this.loadBody (bodyName);
        
        this.drive = {
            leftWheel: new p2.Circle (<any>({radius:0.4})),
            middleWheel: new p2.Circle (<any>({radius:0.4})),
            rightWheel: new p2.Circle (<any>({radius:0.4}))
        }

        this.pObject.body.debug = true;

        this.drive.leftWheel = this.pObject.body.addShape (this.drive.leftWheel, -30, 20);
        this.drive.middleWheel = this.pObject.body.addShape (this.drive.middleWheel, 0, 20);
        this.drive.rightWheel = this.pObject.body.addShape (this.drive.rightWheel, 30, 20);

        this.pObject.animations.add('rover', 
            [
                '01.png',
                '02.png',
                '03.png',
                '04.png'
            ],
            10,
            true,
            false);
        this.facingRight = true;
        this.pObject.body.mass = 5;
    }

    facingRight: boolean;

    driveForward = () => {
        this.pObject.animations.play('rover');

    }

    preframe = () => {
        this.gravityAction ();
        this.pObject.animations.stop();
    }

    gravityAction = () => {
        if (this.game.gravity == 0) {
            return;
        }
        var BODY = this.pObject.body;
        var relative_thrust = -( this.game.gravity * this.pObject.body.mass);
        BODY.velocity.y -= (relative_thrust / 100) * this.game.get_ratio();
    }
    
    calculate_velocity = (acceleration, initialVel) => {
        return (acceleration * this.game.get_ratio()) + initialVel();
    }
}