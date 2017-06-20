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
            if (game.game.input.keyboard.isDown (Phaser.Keyboard.RIGHT)) {
                rover.driveForward ();
            }
            else if (game.game.input.keyboard.isDown (Phaser.Keyboard.LEFT)) {
                rover.driveBackward ();
            }
            else {
                rover.stopAnim ();
            }
        }
    }
};

interface Wheels {
    left: p2.Shape | p2.Circle;
    middle: p2.Shape | p2.Circle;
    right: p2.Shape | p2.Circle;
}

interface WheelConstaints {
    left: p2.RevoluteConstraint;
    middle: p2.RevoluteConstraint;
    right: p2.RevoluteConstraint;
}

export class Rover extends DynamicSprite {
    bodyName: string;
    backWheel: Phaser.Sprite;
    frontWheel: Phaser.Sprite;
    wheels: Phaser.Group;
    wheelMaterial: Phaser.Physics.P2.Material;
    worldMaterial: Phaser.Physics.P2.Material;

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
        this.facingLeft = true;
        this.pObject.body.mass = 5;
        this.wheels = this.game.game.add.group();
        this.wheelMaterial = this.game.game.physics.p2.createMaterial("wheelMaterial");
        this.worldMaterial = this.game.game.physics.p2.createMaterial("worldMaterial");
        this.backWheel = this.initWheel (this.pObject, [-30, 20]);
        this.frontWheel = this.initWheel (this.pObject, [30, 20]);
        this.game.game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);
        var contactMaterial = this.game.game.physics.p2.createContactMaterial(this.wheelMaterial,this.worldMaterial);
        contactMaterial.friction = 1e3;
        contactMaterial.restitution = .3;
        this.pObject.animations.play('rover')
    }

    stopAnim = () => {
        this.pObject.animations.paused = false;
        this.frontWheel.body.rotateLeft(0);
        this.backWheel.body.rotateLeft(0);
    }


    reset = () => {
        this.pObject.body.setZeroForce();
        this.pObject.body.setZeroRotation();
        this.pObject.body.setZeroVelocity();
        this.pObject.body.x = this.pos.x();
        this.pObject.body.y = this.pos.y();
        this.pObject.body.rotation = 0;
        [this.backWheel, this.frontWheel].forEach(element => {
            element.body.setZeroRotation();
            element.body.setZeroVelocity();
            element.body.rotation = 0;
        });
        this.backWheel.body.x = this.pObject.body.x + -30;
        this.backWheel.body.y = this.pObject.body.y + 20;
        this.frontWheel.body.x = this.pObject.body.x + 30;
        this.frontWheel.body.y = this.pObject.body.y + 20;
    }

    initWheel = (target, offsetFromTruck) => {
        var truckX = target.position.x;
        var truckY = target.position.y;
        //position wheel relative to the truck
        var wheel = this.game.game.add.sprite(truckX + offsetFromTruck[0],
                                    truckY + offsetFromTruck[1]);

        this.game.game.physics.p2.enable(wheel);
        wheel.body.clearShapes();
        wheel.body.debug = true;
        wheel.body.addCircle(9);

        /*
        * Constrain the wheel to the truck so that it can rotate freely on its pivot
        * createRevoluteConstraint(bodyA, pivotA, bodyB, pivotB, maxForce)
        * change maxForce to see how it affects chassis bounciness
        */
        var maxForce = 100;
        var rev = this.game.game.physics.p2.createRevoluteConstraint(target.body, offsetFromTruck,
            wheel.body, [0,0], maxForce);

        //add wheel to wheels group
        this.wheels.add(wheel);

        /*
        * set the material to be the wheel material so that it can have
        * high friction with the ground
        */
        wheel.body.setMaterial(this.wheelMaterial);
        return wheel;
    }

    facingLeft: boolean = true;

    driveForward = () => {
        if (this.facingLeft) {
            this.pObject.scale.x *= -1;
            this.facingLeft = false;
        }
        this.frontWheel.body.rotateRight(200);
        this.backWheel.body.rotateRight(200);
    }

    driveBackward = () => {
        if (!this.facingLeft) {
            this.pObject.scale.x *= -1;
            this.facingLeft = true;
        }
        this.frontWheel.body.rotateLeft(200);
        this.backWheel.body.rotateLeft(200);
    }

    currentFrame;

    preframe = () => {
        this.gravityAction ();
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