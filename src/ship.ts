/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
import {KeyBinding} from "./control"
import {MainGame} from "./game"
import {Level} from "./level"
import {_position} from "./object"

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

export class Ship extends DynamicSprite {
    constructor (game: MainGame, name:string, pos: _position, assets: string[], level=game.levelsequence.getLevel ('global')) {
        super (game, level, name, pos, assets, {angularRot: 0, SAS: false, thrustOn: false, inSpace: false});
        this.enablePhysics ();
        this.pObject.body.mass = 5;
        this.loadBody ('Rocket-L');
        //this.pObject.body.onBeginContact.add(this.collide, this);
    }

    collide = (target: Phaser.Physics.P2.Body, this_target: Phaser.Physics.P2.Body, shapeA, shapeB, contactEquation) => {
        if(contactEquation[0]!=null) {
            var res = Phaser.Point.distance(
                new Phaser.Point(
                    contactEquation[0].bodyB.velocity[0],
                    contactEquation[0].bodyB.velocity[1]
                ),
                new Phaser.Point(0,0));
            if (res > 30) {
                this.explode ();
                this.game.game.time.events.add(300, this.reset, this);
            }
        }
    }

    isDead: boolean = false;
    //LFO: flo = 1000.0;

    reset = () => {
        this.pObject.body.setZeroForce();
        this.pObject.body.setZeroRotation();
        this.pObject.body.setZeroVelocity();
        this.pObject.body.x = this.pos.x();
        this.pObject.body.y = this.pos.y();
        this.pObject.body.rotation = 0;
        this.isDead = false;
        this.game.game.camera.follow (this.pObject);
    }

    explode = () => {
        this.switchTo ('Explosion');
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

    }

    throttle: number = 270;

    engineOn = () => {
        this.switchTo (this.assets[1]);
        // Rocket weighs 200 (gravity * mass)
        this.thrust (this.throttle); // Lower when in 0G
        (<any>this.extra).thrustOn = true;
    }

    // Turn right using RCS (reaction control system)
    rightRCS = () => {
        var angularVelocity = () => {return this.pObject.body.angularVelocity / 0.05} // Convert to correct unit
        var tempVel = this.calculate_velocity (0.7, angularVelocity);
        this.pObject.body.rotateRight (tempVel);
        (<any>this.extra).angularRot = tempVel;
        this.switchTo (this.assets[2]);
    }

    leftRCS = () => {
        var angularVelocity = () => {return this.pObject.body.angularVelocity / 0.05} // Convert to correct unit
        var tempVel = this.calculate_velocity (-0.7, angularVelocity);
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
        if ((<any>this.extra).SAS && !this.game.game.input.keyboard.isDown (Phaser.Keyboard.LEFT) && this.game.game.input.keyboard.isDown (Phaser.Keyboard.LEFT)) {
            this.SAS ();
        }
        (<any>this.extra).thrustOn = false;
        this.gravityAction ();
    }

    gravityAction = () => {
        var BODY = this.pObject.body;
        var relative_thrust = -( this.game.gravity * this.pObject.body.mass);
        BODY.velocity.y -= (relative_thrust / 100) * this.game.get_ratio();
    }
    
    calculate_velocity = (acceleration, initialVel) => {
        return (acceleration * this.game.get_ratio()) + initialVel();
    }

    booster: Booster;

    addBooster = (booster: Booster) => {
        this.booster = booster;
        this.game.game.physics.p2.createLockConstraint(this.pObject, this.booster.pObject, [-20, 0], 0);
    }
}

export class Booster extends Ship {
    parentShip: Ship;
    attached: boolean = true;

    constructor (game: MainGame, level: Level, name:string, pos: _position, assets: string[]) {
        super (game, name, pos, assets, level);
    }
}