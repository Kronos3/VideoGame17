"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
var object_1 = require("./object");
exports.ShipBinding = function (game, ship) {
    return {
        key: -1,
        callback: function () {
            if (!ship.isDead) {
                ship.preframe();
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    ship.rightRCS();
                }
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    ship.leftRCS();
                }
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    ship.engineOn();
                }
                ship.postframe();
            }
            else {
                ship.pObject.body.setZeroForce();
                ship.pObject.body.setZeroRotation();
                ship.pObject.body.setZeroVelocity();
            }
        }
    };
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(game, name, pos, assets, level) {
        if (level === void 0) { level = game.levelsequence.getLevel('global'); }
        var _this = _super.call(this, game, level, name, pos, assets, { angularRot: 0, SAS: false, thrustOn: false, inSpace: false }) || this;
        _this.collide = function (target, this_target, shapeA, shapeB, contactEquation) {
            if (contactEquation[0] != null) {
                var res = Phaser.Point.distance(new Phaser.Point(contactEquation[0].bodyB.velocity[0], contactEquation[0].bodyB.velocity[1]), new Phaser.Point(0, 0));
                if (res > 30) {
                    _this.explode();
                    _this.game.game.time.events.add(300, _this.reset, _this);
                }
            }
        };
        _this.isDead = false;
        _this.reset = function () {
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
            _this.pObject.body.x = _this.pos.x();
            _this.pObject.body.y = _this.pos.y();
            _this.pObject.body.rotation = 0;
            _this.isDead = false;
            _this.game.game.camera.follow(_this.pObject);
        };
        _this.explode = function () {
            _this.switchTo('Explosion');
            _this.isDead = true;
            _this.game.game.camera.follow(null);
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
        };
        _this.thrust = function (newtons) {
            var BODY = _this.pObject.body;
            var relative_thrust = newtons; // Dont subtract newtons from weight (done in postframe)
            var magnitude = BODY.world.pxmi(-relative_thrust);
            var angle = BODY.data.angle + Math.PI / 2;
            BODY.velocity.x -= magnitude * Math.cos(angle) * _this.game.get_ratio();
            BODY.velocity.y -= magnitude * Math.sin(angle) * _this.game.get_ratio();
        };
        _this.throttle = 270;
        _this.engineOn = function () {
            _this.switchTo(_this.assets[1]);
            // Rocket weighs 200 (gravity * mass)
            _this.thrust(_this.throttle); // Lower when in 0G
            _this.extra.thrustOn = true;
        };
        // Turn right using RCS (reaction control system)
        _this.rightRCS = function () {
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(0.7, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo(_this.assets[2]);
        };
        _this.leftRCS = function () {
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(-0.7, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo(_this.assets[3]);
        };
        // Dampen rotation using SAS (stability assist system)
        _this.SAS = function () {
            _this.extra.angularRot *= 0.93;
            if (_this.extra.angularRot >= -0.001 && _this.extra.angularRot <= 0.001) {
                _this.extra.angularRot = 0;
            }
        };
        // Ran before the control function in the frame
        _this.preframe = function () {
            _this.switchTo(_this.assets[0]);
        };
        _this.postframe = function () {
            if (_this.extra.SAS && !_this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && _this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                _this.SAS();
            }
            _this.extra.thrustOn = false;
            _this.gravityAction();
        };
        _this.gravityAction = function () {
            var BODY = _this.pObject.body;
            var relative_thrust = -(_this.game.gravity * _this.pObject.body.mass);
            BODY.velocity.y -= (relative_thrust / 100) * _this.game.get_ratio();
        };
        _this.calculate_velocity = function (acceleration, initialVel) {
            return (acceleration * _this.game.get_ratio()) + initialVel();
        };
        _this.addBooster = function (booster) {
            _this.booster = booster;
            _this.game.game.physics.p2.createLockConstraint(_this.pObject, _this.booster.pObject, [-20, 0], 0);
        };
        _this.enablePhysics();
        _this.pObject.body.mass = 5;
        _this.loadBody('Rocket-L');
        return _this;
        //this.pObject.body.onBeginContact.add(this.collide, this);
    }
    return Ship;
}(object_1.DynamicSprite));
exports.Ship = Ship;
var Booster = (function (_super) {
    __extends(Booster, _super);
    function Booster(game, level, name, pos, assets) {
        var _this = _super.call(this, game, name, pos, assets, level) || this;
        _this.attached = true;
        return _this;
    }
    return Booster;
}(Ship));
exports.Booster = Booster;
