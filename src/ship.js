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
    function Ship(game, name, bodyName, pos, assets, level) {
        if (level === void 0) { level = game.levelsequence.getLevel('intro'); }
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
        _this.maxLFO = 1000;
        _this.LFO = _this.maxLFO; // Liquid Fuel and Oxidizer (C10H16)
        _this.Isp = 250; // Ratio of thrust to fuel flow for every minute of burn
        // At max thrust, use 250 LFO after a minute of burn
        _this.maxMono = 50;
        _this.monoProp = _this.maxMono;
        _this.monoIsp = 10;
        _this.getAltitude = function () {
            return _this.startAlt - _this.pObject.body.y;
        };
        _this.calcUsage = function (isp) {
            return isp / (_this.game.game.time.fps * 60);
        };
        _this.fuelFlow = function () {
            _this.LFO -= _this.calcUsage(_this.Isp);
        };
        _this.setResources = function () {
            _this.game.uicontroller.setElement(0, (_this.LFO / _this.maxLFO) * 100);
            _this.game.uicontroller.setElement(1, (_this.monoProp / _this.maxMono) * 100);
        };
        _this.monoFlow = function () {
            _this.monoProp -= _this.calcUsage(_this.monoIsp);
        };
        _this.reset = function (t) {
            if (t === void 0) { t = true; }
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
            _this.pObject.body.x = _this.pos.x();
            _this.pObject.body.y = _this.pos.y();
            _this.pObject.body.rotation = 0;
            _this.isDead = false;
            if (t) {
                _this.LFO = _this.maxLFO;
                _this.monoProp = _this.maxMono;
            }
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
            _this.fuelFlow();
        };
        _this.throttle = 270;
        _this.angularAcceleration = 0.7;
        _this.engineOn = function () {
            if (_this.LFO <= 0) {
                return;
            }
            _this.switchTo(_this.assets[1]);
            // Rocket weighs 200 (gravity * mass)
            _this.thrust(_this.throttle); // Lower when in 0G
            _this.extra.thrustOn = true;
        };
        // Turn right using RCS (reaction control system)
        _this.rightRCS = function () {
            if (_this.monoProp <= 0) {
                return;
            }
            _this.monoFlow();
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(_this.angularAcceleration, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo(_this.assets[2]);
        };
        _this.leftRCS = function () {
            if (_this.monoProp <= 0) {
                return;
            }
            _this.monoFlow();
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(-1 * _this.angularAcceleration, angularVelocity);
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
            if (_this.extra.SAS && !_this.game.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && _this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                _this.SAS();
            }
            _this.extra.thrustOn = false;
            _this.gravityAction();
            _this.setResources();
        };
        _this.gravityAction = function () {
            if (_this.game.gravity == 0) {
                return;
            }
            var BODY = _this.pObject.body;
            var relative_thrust = -(_this.game.gravity * _this.pObject.body.mass);
            BODY.velocity.y -= (relative_thrust / 100) * _this.game.get_ratio();
        };
        _this.calculate_velocity = function (acceleration, initialVel) {
            return (acceleration * _this.game.get_ratio()) + initialVel();
        };
        _this.enablePhysics();
        _this.pObject.body.mass = 5;
        _this.loadBody(bodyName);
        _this.startAlt = _this.pObject.body.y;
        _this.pObject.body.onBeginContact.add(_this.collide, _this);
        return _this;
        // this.
    }
    return Ship;
}(object_1.DynamicSprite));
exports.Ship = Ship;
var Artemis = (function (_super) {
    __extends(Artemis, _super);
    function Artemis(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 48; }
        };
        _this = _super.call(this, game, 'ship', 'Artemis', pos, [
            'Artemis',
            'ArtemisThrust',
            'ArtemisL',
            'ArtemisR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 1.2;
        _this.throttle = 300;
        _this.pObject.body.mass = 5;
        return _this;
    }
    return Artemis;
}(Ship));
exports.Artemis = Artemis;
var Athena = (function (_super) {
    __extends(Athena, _super);
    function Athena(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 57; }
        };
        _this = _super.call(this, game, 'ship', 'Athena', pos, [
            'Athena',
            'AthenaThrust',
            'AthenaL',
            'AthenaR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 0.5;
        _this.throttle = 240;
        _this.pObject.body.mass = 5;
        return _this;
    }
    return Athena;
}(Ship));
exports.Athena = Athena;
var Vulcan = (function (_super) {
    __extends(Vulcan, _super);
    function Vulcan(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 69; }
        };
        _this = _super.call(this, game, 'ship', 'Vulcan', pos, [
            'Vulcan',
            'VulcanThrust',
            'VulcanL',
            'VulcanR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 0.3;
        _this.throttle = 640;
        _this.pObject.body.mass = 12;
        return _this;
    }
    return Vulcan;
}(Ship));
exports.Vulcan = Vulcan;
