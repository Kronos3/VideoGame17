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
        _this.rockNumber = 0;
        _this.return = false;
        _this.collide = function (target, this_target, shapeA, shapeB, contactEquation) {
            var id = _this.game.levelsequence.getCurrent().getObject('ship').pObject.body.id;
            if (shapeB.body == null) {
                return;
            }
            if (shapeB.body.id == id) {
                _this.return = true;
            }
        };
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
        _this.revoluteContraints = [];
        _this.initWheel = function (target, offsetFromTruck) {
            var truckX = target.position.x;
            var truckY = target.position.y;
            //position wheel relative to the truck
            var wheel = _this.game.game.add.sprite(truckX + offsetFromTruck[0], truckY + offsetFromTruck[1]);
            _this.game.game.physics.p2.enable(wheel);
            wheel.body.clearShapes();
            wheel.body.addCircle(9);
            var rev = _this.game.game.physics.p2.createRevoluteConstraint(target.body, offsetFromTruck, wheel.body, [0, 0], 20000);
            //add wheel to wheels group
            _this.wheels.add(wheel);
            /*
            * set the material to be the wheel material so that it can have
            * high friction with the ground
            */
            wheel.body.setMaterial(_this.wheelMaterial);
            wheel.body.debug = true;
            _this.revoluteContraints.push(rev);
            return wheel;
        };
        _this.facingLeft = true;
        _this.speed = 400;
        _this.driveForward = function () {
            if (_this.facingLeft) {
                _this.pObject.scale.x *= -1;
                _this.facingLeft = false;
            }
            _this.frontWheel.body.rotateRight(_this.speed);
            _this.backWheel.body.rotateRight(_this.speed);
            _this.game.levelsequence.getCurrent().getObject('ship').fuelFlow(75);
            _this.game.levelsequence.getCurrent().getObject('ship').setResources();
        };
        _this.driveBackward = function () {
            if (!_this.facingLeft) {
                _this.pObject.scale.x *= -1;
                _this.facingLeft = true;
            }
            _this.frontWheel.body.rotateLeft(_this.speed);
            _this.backWheel.body.rotateLeft(_this.speed);
            _this.game.levelsequence.getCurrent().getObject('ship').fuelFlow(75);
            _this.game.levelsequence.getCurrent().getObject('ship').setResources();
        };
        _this.preframe = function () {
            _this.revoluteContraints[0].disableMotor();
            _this.revoluteContraints[1].disableMotor();
        };
        _this.calculate_velocity = function (acceleration, initialVel) {
            return (acceleration * _this.game.get_ratio()) + initialVel();
        };
        _this.pObject.destroy();
        _this.pObject = _this.game.game.add.sprite(300, _this.game.game.world.height - 200, 'rover', '01.png');
        _this.bodyName = bodyName;
        _this.loadBody(bodyName);
        _this.game.addGravity(_this);
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
        contactMaterial.friction = 2e3;
        contactMaterial.restitution = 0;
        _this.pObject.animations.play('rover');
        _this.frontWheel.body.onBeginContact.add(_this.collide, _this);
        _this.backWheel.body.onBeginContact.add(_this.collide, _this);
        return _this;
    }
    Rover.prototype.disable = function (t) {
        window.GAME.controls[1].disable();
        this.pObject.visible = false;
        this.pObject.body.clearCollision();
        //super.disable (t);
    };
    return Rover;
}(object_1.DynamicSprite));
exports.Rover = Rover;
