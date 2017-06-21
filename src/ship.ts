/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
import {KeyBinding} from "./control"
import {MainGame} from "./game"
import {Level} from "./level"
import {_position} from "./object"
import {Animation} from "./animation"

export var ShipBinding = (game: MainGame, ship: Ship): KeyBinding => {return {
        key: -1, // Run every frame
        callback: () => {
            if (!ship.isDead) {
                ship.preframe ();
                if (game.game.input.keyboard.isDown (Phaser.Keyboard.RIGHT)) {
                    ship.rightRCS ();
                }
                if (game.game.input.keyboard.isDown (Phaser.Keyboard.LEFT)) {
                    ship.leftRCS ();
                }
                if (game.game.input.keyboard.isDown (Phaser.Keyboard.UP)) {
                    ship.engineOn ();
                }
                ship.postframe ();
            }
            else {
                ship.pObject.body.setZeroForce();
                ship.pObject.body.setZeroRotation();
                ship.pObject.body.setZeroVelocity();
            }
        }
    }
};

interface vector {
    x: number;
    y: number;
}

export class Ship extends DynamicSprite {
    explosionAnimation: Animation;

    constructor (game: MainGame, name:string, bodyName: string, pos: _position, assets: string[], level=game.levelsequence.getLevel ('intro')) {
        super (game, level, name, pos, assets, {angularRot: 0, SAS: false, thrustOn: false, inSpace: false});
        this.enablePhysics ();
        this.pObject.body.mass = 5;
        this.loadBody (bodyName);
        this.startAlt = this.pObject.body.y;
        this.pObject.body.onBeginContact.add(this.collide, this);
        this.explosionAnimation = new Animation (this, [
            "ex1",
            "ex2",
            "ex3",
            "ex4",
            "ex5"
        ],
        () => {
            this.reset ();
        }, 50);
        this.game.addGravity (this);
    }

    collide = (target: Phaser.Physics.P2.Body, this_target: Phaser.Physics.P2.Body, shapeA, shapeB, contactEquation) => {
        if(contactEquation[0]!=null) {
            var ship = contactEquation[0].bodyA;
            var asteroid = contactEquation[0].bodyB;
            
            // calculate angle of vectors

            /*if (res > 900) {
                this.explode ();
                this.game.game.time.events.add(300, this.reset, this);
            }*/

            var v1m: vector = {
                x:shapeA.body.velocity[0],
                y: shapeA.body.velocity[1]
            };
            var v2m: vector;
            var is_x: boolean;

            switch (shapeB.id){
                case 12: // Left wall
                    v2m = {
                        x: 0,
                        y: 1
                    }
                    is_x = false;
                    break;
                case 13: // Right wall
                    v2m = {
                        x: 0,
                        y: 1
                    }
                    is_x = false;
                    break;
                case 14: // Top wall
                    v2m = {
                        x: 1,
                        y: 0
                    }
                    is_x = true;
                    break;
                case 15: // Bottom wall
                    v2m = {
                        x: 1,
                        y: 0
                    }
                    is_x = true;
                    break;
                default:
                    v2m = {
                        x: shapeB.body.velocity[0],
                        y: shapeB.body.velocity[1]
                    }
            }

            var a = this.vectorAngle (v1m, v2m);
            if (!is_x) {
                a = 90 - a;
            }

            a %= 90;
            a = Math.abs(a);
            var r = a/90;

            var cx = Math.abs(shapeB.body.velocity[0] - shapeA.body.velocity[0]);
            var cy = Math.abs(shapeB.body.velocity[1] - shapeA.body.velocity[1]);

            var magnitude = (cx * (1 - r)) + (cy * r);
            if (magnitude > 25) {
                this.explode ();
            }
        }
    }

    vectorAngle = (v1: vector, v2: vector) => {
        var b =  Math.atan2(v1.y, v1.x) / Math.PI * 180;
        return b;
    }

    startAlt: number;
    isDead: boolean = false;
    maxLFO: number = 400;
    LFO: number = this.maxLFO; // Liquid Fuel and Oxidizer (C10H16)
    Isp: number = 250; // Ratio of thrust to fuel flow for every minute of burn
                       // At max thrust, use 250 LFO after a minute of burn
    
    maxMono:number = 15;
    monoProp:number = this.maxMono;
    monoIsp: number = 10;

    getAltitude = () => {
        return this.startAlt - this.pObject.body.y;
    }

    calcUsage = (isp: number) => {
        return isp / (this.game.game.time.fps * 60)
    }

    fuelFlow = (isp?:number) => {
        if (typeof isp != "undefined") {
            this.LFO -= this.calcUsage (isp);
            return;
        } 
        this.LFO -= this.calcUsage (this.Isp);
    }

    setResources = () => {
        this.game.uicontroller.setElement (0, (this.LFO / this.maxLFO) * 100);
        this.game.uicontroller.setElement (1, (this.monoProp / this.maxMono) * 100);
    }

    monoFlow = () => {
        this.monoProp -= this.calcUsage (this.monoIsp);
    }

    reset = (t = true) => {
        this.pObject.body.setZeroForce();
        this.pObject.body.setZeroRotation();
        this.pObject.body.setZeroVelocity();
        this.pObject.body.x = this.pos.x();
        this.pObject.body.y = this.pos.y();
        this.pObject.body.rotation = 0;
        this.isDead = false;
        
        /*if (t) {
            this.LFO = this.maxLFO;
            this.monoProp = this.maxMono;
        }*/
        this.follow();
    }

    explode = () => {
        this.explosionAnimation.run ();
        this.isDead = true;
        this.game.game.camera.follow (null);
        this.pObject.body.setZeroForce();
        this.pObject.body.setZeroRotation();
        this.pObject.body.setZeroVelocity();
    }

    thrust = (newtons) => { // Engine newtons
        var BODY = this.pObject.body;
        var relative_thrust = newtons; // Dont subtract newtons from weight (done in postframe)

        var magnitude = BODY.world.pxmi(-relative_thrust);
        var angle = BODY.data.angle + Math.PI / 2;

        BODY.velocity.x -= magnitude * Math.cos(angle) * this.game.get_ratio();
        BODY.velocity.y -= magnitude * Math.sin(angle) * this.game.get_ratio();

        this.fuelFlow ();
    }

    throttle: number = 270;
    angularAcceleration = 0.7;

    engineOn = () => {
        if (this.LFO <= 0) {
            return;
        }
        this.switchTo (this.assets[1]);
        // Rocket weighs 200 (gravity * mass)
        this.thrust (this.throttle); // Lower when in 0G
        (<any>this.extra).thrustOn = true;
    }

    // Turn right using RCS (reaction control system)
    rightRCS = () => {
        if (this.monoProp <= 0) {
            return;
        }
        this.monoFlow ();
        var angularVelocity = () => {return this.pObject.body.angularVelocity / 0.05} // Convert to correct unit
        var tempVel = this.calculate_velocity (this.angularAcceleration, angularVelocity);
        this.pObject.body.rotateRight (tempVel);
        (<any>this.extra).angularRot = tempVel;
        this.switchTo (this.assets[2]);
    }

    leftRCS = () => {
        if (this.monoProp <= 0) {
            return;
        }
        this.monoFlow ();
        var angularVelocity = () => {return this.pObject.body.angularVelocity / 0.05} // Convert to correct unit
        var tempVel = this.calculate_velocity (-1 * this.angularAcceleration, angularVelocity);
        this.pObject.body.rotateRight (tempVel);
        (<any>this.extra).angularRot = tempVel;
        this.switchTo (this.assets[3]);
    }


    // Dampen rotation using SAS (stability assist system)
    SAS = () => {
        (<any>this.extra).angularRot *= 0.93;
        if ((<any>this.extra).angularRot >= -0.001 && (<any>this.extra).angularRot <= 0.001) {
            (<any>this.extra).angularRot = 0;
        }
    }

    // Ran before the control function in the frame
    preframe = () => {
        this.switchTo (this.assets[0]);
    }

    postframe = () => {
        if ((<any>this.extra).SAS && !this.game.game.input.keyboard.isDown (Phaser.Keyboard.RIGHT) && this.game.game.input.keyboard.isDown (Phaser.Keyboard.LEFT)) {
            this.SAS ();
        }
        (<any>this.extra).thrustOn = false;
        this.setResources ();
    }
    
    calculate_velocity = (acceleration, initialVel) => {
        return (acceleration * this.game.get_ratio()) + initialVel();
    }
}

export class Artemis extends Ship {
    constructor (game: MainGame, level: Level) {
        var pos = {
            x: ():number => {return (<any>window).GAME.game.world.width / 2 - 70},
            y: ():number => {return (<any>window).GAME.game.world.height - 50}
        }
        
        super (game, 'ship', 'Artemis', pos, [
            'Artemis',
            'ArtemisThrust',
            'ArtemisL',
            'ArtemisR',
            'Explosion',
            "ex1",
            "ex2",
            "ex3",
            "ex4",
            "ex5"
        ], level);
        this.angularAcceleration = 2.2;
        this.throttle = 300;
        this.pObject.body.mass = 5;
    }
}

export class Athena extends Ship {
    constructor (game: MainGame, level: Level) {
        var pos = {
            x: ():number => {return (<any>window).GAME.game.world.width / 2 - 70},
            y: ():number => {return (<any>window).GAME.game.world.height - 57}
        }
        super (game, 'ship', 'Athena', pos, [
            'Athena',
            'AthenaThrust',
            'AthenaL',
            'AthenaR',
            'Explosion',
            "ex1",
            "ex2",
            "ex3",
            "ex4",
            "ex5"
        ], level);
        this.angularAcceleration = 1;
        this.throttle = 240;
        this.pObject.body.mass = 5;
    }
}

export class Vulcan extends Ship {
    constructor (game: MainGame, level: Level) {
        var pos = {
            x: ():number => {return (<any>window).GAME.game.world.width / 2 - 90},
            y: ():number => {return (<any>window).GAME.game.world.height - 110}
        }
        super (game, 'ship', 'Vulcan', pos, [
            'Vulcan',
            'VulcanThrust',
            'VulcanL',
            'VulcanR',
            'Explosion',
            "ex1",
            "ex2",
            "ex3",
            "ex4",
            "ex5"
        ], level);
        this.angularAcceleration = 0.8;
        this.throttle = 640;
        this.pObject.body.mass = 12;
        this.Isp = 250 * 1.5;
    }
}