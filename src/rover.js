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
exports.RoverBinding = function (game, rover) {
    return {
        key: -1,
        callback: function () {
            rover.preframe();
            if (game.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                rover.driveForward();
            }
            else if (game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                rover.driveBackward();
            }
            else {
                rover.stopAnim();
            }
        }
    };
};
var Rover = (function (_super) {
    __extends(Rover, _super);
    function Rover(game, level, name, bodyName, pos, assets) {
        var _this = _super.call(this, game, level, name, pos, assets) || this;
        _this.stopAnim = function () {
            _this.pObject.animations.paused = false;
            _this.frontWheel.body.rotateLeft(0);
            _this.backWheel.body.rotateLeft(0);
        };
        _this.reset = function () {
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
            _this.pObject.body.x = _this.pos.x();
            _this.pObject.body.y = _this.pos.y();
            _this.pObject.body.rotation = 0;
            [_this.backWheel, _this.frontWheel].forEach(function (element) {
                element.body.setZeroRotation();
                element.body.setZeroVelocity();
                element.body.rotation = 0;
            });
            _this.backWheel.body.x = _this.pObject.body.x + -30;
            _this.backWheel.body.y = _this.pObject.body.y + 20;
            _this.frontWheel.body.x = _this.pObject.body.x + 30;
            _this.frontWheel.body.y = _this.pObject.body.y + 20;
        };
        _this.initWheel = function (target, offsetFromTruck) {
            var truckX = target.position.x;
            var truckY = target.position.y;
            //position wheel relative to the truck
            var wheel = _this.game.game.add.sprite(truckX + offsetFromTruck[0], truckY + offsetFromTruck[1]);
            _this.game.game.physics.p2.enable(wheel);
            wheel.body.clearShapes();
            wheel.body.debug = true;
            wheel.body.addCircle(9);
            /*
            * Constrain the wheel to the truck so that it can rotate freely on its pivot
            * createRevoluteConstraint(bodyA, pivotA, bodyB, pivotB, maxForce)
            * change maxForce to see how it affects chassis bounciness
            */
            var maxForce = 100;
            var rev = _this.game.game.physics.p2.createRevoluteConstraint(target.body, offsetFromTruck, wheel.body, [0, 0], maxForce);
            //add wheel to wheels group
            _this.wheels.add(wheel);
            /*
            * set the material to be the wheel material so that it can have
            * high friction with the ground
            */
            wheel.body.setMaterial(_this.wheelMaterial);
            return wheel;
        };
        _this.facingLeft = true;
        _this.driveForward = function () {
            if (_this.facingLeft) {
                _this.pObject.scale.x *= -1;
                _this.facingLeft = false;
            }
            _this.frontWheel.body.rotateRight(200);
            _this.backWheel.body.rotateRight(200);
        };
        _this.driveBackward = function () {
            if (!_this.facingLeft) {
                _this.pObject.scale.x *= -1;
                _this.facingLeft = true;
            }
            _this.frontWheel.body.rotateLeft(200);
            _this.backWheel.body.rotateLeft(200);
        };
        _this.preframe = function () {
            _this.gravityAction();
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
        _this.pObject.destroy();
        _this.pObject = _this.game.game.add.sprite(300, _this.game.game.world.height - 200, 'rover', '01.png');
        _this.bodyName = bodyName;
        _this.loadBody(bodyName);
        _this.pObject.animations.add('rover', [
            '01.png',
            '02.png',
            '03.png',
            '04.png'
        ], 10, true, false);
        _this.facingLeft = true;
        _this.pObject.body.mass = 5;
        _this.wheels = _this.game.game.add.group();
        _this.wheelMaterial = _this.game.game.physics.p2.createMaterial("wheelMaterial");
        _this.worldMaterial = _this.game.game.physics.p2.createMaterial("worldMaterial");
        _this.backWheel = _this.initWheel(_this.pObject, [-30, 20]);
        _this.frontWheel = _this.initWheel(_this.pObject, [30, 20]);
        _this.game.game.physics.p2.setWorldMaterial(_this.worldMaterial, true, true, true, true);
        var contactMaterial = _this.game.game.physics.p2.createContactMaterial(_this.wheelMaterial, _this.worldMaterial);
        contactMaterial.friction = 1e3;
        contactMaterial.restitution = .3;
        _this.pObject.animations.play('rover');
        return _this;
    }
    return Rover;
}(object_1.DynamicSprite));
exports.Rover = Rover;
