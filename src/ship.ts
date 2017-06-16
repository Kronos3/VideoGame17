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
    constructor (game: MainGame, name:string, bodyName: string, pos: _position, assets: string[], level=game.levelsequence.getLevel ('intro')) {
        super (game, level, name, pos, assets, {angularRot: 0, SAS: false, thrustOn: false, inSpace: false});
        this.enablePhysics ();
        this.pObject.body.mass = 5;
        this.loadBody (bodyName);
        this.startAlt = this.pObject.body.y;
        this.pObject.body.onBeginContact.add(this.collide, this);
        // this.
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

    startAlt: number;
    isDead: boolean = false;
    maxLFO: number = 1000;
    LFO: number = this.maxLFO; // Liquid Fuel and Oxidizer (C10H16)
    Isp: number = 250; // Ratio of thrust to fuel flow for every minute of burn
                       // At max thrust, use 250 LFO after a minute of burn
    
    maxMono:number = 50;
    monoProp:number = this.maxMono;
    monoIsp: number = 10;

    getAltitude = () => {
        return this.startAlt - this.pObject.body.y;
    }

    calcUsage = (isp: number) => {
        return isp / (this.game.game.time.fps * 60)
    }

    fuelFlow = () => {
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
        
        if (t) {
            this.LFO = this.maxLFO;
            this.monoProp = this.maxMono;
        }
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
        this.gravityAction ();
        this.setResources ();
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

export class Artemis extends Ship {
    constructor (game: MainGame, level: Level) {
        var pos = {
            x: ():number => {return (<any>window).GAME.game.world.width / 2 - 70},
            y: ():number => {return (<any>window).GAME.game.world.height - 48}
        }
        
        super (game, 'ship', 'Artemis', pos, [
            'Artemis',
            'ArtemisThrust',
            'ArtemisL',
            'ArtemisR',
            'Explosion'
        ], level);
        this.angularAcceleration = 1.2;
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
            'Explosion'
        ], level);
        this.angularAcceleration = 0.5;
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
            'Explosion'
        ], level);
        this.angularAcceleration = 0.3;
        this.throttle = 640;
        this.pObject.body.mass = 12;
    }
}