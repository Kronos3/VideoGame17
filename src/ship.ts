/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {DynamicSprite} from "./object"
import {KeyBinding} from "./control"
import {MainGame} from "./game"
import {_position} from "./object"

export var ShipBinding = (game: MainGame, ship: Ship): KeyBinding => {return {
        key: -1, // Run every frame
        callback: () => {
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
    }
};

export class Ship extends DynamicSprite {
    constructor (game: MainGame, name:string, pos: _position, assets: string[]) {
        super (game, game.levelsequence.getLevel ('global'), name, pos, assets, {angularRot: 0, SAS: false, thrustOn: false, inSpace: false});
        this.enablePhysics ();
        this.pObject.body.mass = 5;
        this.loadBody ('Rocket-L');
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
        this.switchTo ('rocket-thrust');
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
        this.switchTo ('rocket-L-L');
    }

    leftRCS = () => {
        var angularVelocity = () => {return this.pObject.body.angularVelocity / 0.05} // Convert to correct unit
        var tempVel = this.calculate_velocity (-0.7, angularVelocity);
        this.pObject.body.rotateRight (tempVel);
        (<any>this.extra).angularRot = tempVel;
        this.switchTo ('rocket-L-R');
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
        this.switchTo ('rocket');
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
}