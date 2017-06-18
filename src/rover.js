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
        }
    };
};
var Rover = (function (_super) {
    __extends(Rover, _super);
    function Rover(game, level, name, bodyName, pos, assets) {
        var _this = _super.call(this, game, level, name, pos, assets) || this;
        _this.driveForward = function () {
            _this.pObject.animations.play('rover');
        };
        _this.preframe = function () {
            _this.gravityAction();
            _this.pObject.animations.stop();
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
        _this.drive = {
            leftWheel: new p2.Circle(({ radius: 0.4 })),
            middleWheel: new p2.Circle(({ radius: 0.4 })),
            rightWheel: new p2.Circle(({ radius: 0.4 }))
        };
        _this.pObject.body.debug = true;
        _this.drive.leftWheel = _this.pObject.body.addShape(_this.drive.leftWheel, -30, 20);
        _this.drive.middleWheel = _this.pObject.body.addShape(_this.drive.middleWheel, 0, 20);
        _this.drive.rightWheel = _this.pObject.body.addShape(_this.drive.rightWheel, 30, 20);
        _this.pObject.animations.add('rover', [
            '01.png',
            '02.png',
            '03.png',
            '04.png'
        ], 10, true, false);
        _this.facingRight = true;
        _this.pObject.body.mass = 5;
        return _this;
    }
    return Rover;
}(object_1.DynamicSprite));
exports.Rover = Rover;
