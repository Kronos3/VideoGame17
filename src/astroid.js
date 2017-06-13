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
var UTIL = require("./util");
var AstroidBelt = (function () {
    function AstroidBelt(game, level) {
        var _this = this;
        this.astroids = [];
        this.spawn = function () {
            //Determine type of astroid
            var type = UTIL.getRandomInt(0, 1);
            var pos = {
                x: function () { return UTIL.getRandomInt(0, _this.game.game.world.bounds.width); },
                y: function () { return UTIL.getRandomInt(0, _this.game.game.world.bounds.height); }
            };
            var force = {
                x: UTIL.getRandomArbitrary(80, 120) * (type ? -1 : 1),
                y: UTIL.getRandomArbitrary(80, 120) * (type ? -1 : 1),
                r: UTIL.getRandomArbitrary(40, 70) * (type ? -1 : 1)
            };
            if (type) {
                var buffer = new Astroid(_this.game, _this.level, 'SMALL-astroid{0}'.format(_this.astroids.length), pos, 'Meteor-Small', 'Meteor_Small-L', force);
            }
            else {
                var buffer = new Astroid(_this.game, _this.level, 'LARGE-astroid{0}'.format(_this.astroids.length), pos, 'Meteor', 'Meteor-L', force);
            }
            _this.level.addObject(buffer);
            _this.astroids.push(buffer);
        };
        this.game = game;
        this.level = level;
    }
    return AstroidBelt;
}());
exports.AstroidBelt = AstroidBelt;
var Astroid = (function (_super) {
    __extends(Astroid, _super);
    function Astroid(game, level, name, pos, asset, body, force) {
        var _this = _super.call(this, game, level, name, pos, asset) || this;
        _this.body = body;
        _this.enablePhysics();
        if (asset == "Meteor") {
            _this.pObject.body.setCircle(130);
        }
        else {
            _this.pObject.body.setCircle(60);
        }
        _this.force = force;
        _this.setForce(_this.force);
        var vector = _this.getVector(_this.level.getObject('reference').pObject.body.x, _this.level.getObject('reference').pObject.body.y);
        var distance = Math.sqrt(vector.x ^ 2 + vector.y ^ 2);
        _this.game.game.physics.p2.createDistanceConstraint(_this.pObject.body, _this.level.getObject('reference').pObject.body, distance);
        return _this;
        //this.pObject.body.collideWorldBounds = false;
    }
    Astroid.prototype.setForce = function (f) {
        this.pObject.body.velocity.x = f.x;
        this.pObject.body.velocity.y = f.y;
        this.pObject.body.angularForce = f.r;
        this.pObject.body.damping = 0;
        this.pObject.body.mass = 100;
    };
    return Astroid;
}(object_1.GameSprite));
exports.Astroid = Astroid;
