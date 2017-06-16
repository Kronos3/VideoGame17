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
    function AstroidBelt(game, level, n) {
        this.astroids = [];
        this.game = game;
        this.level = level;
        this.totalMeteor = n;
        this.game.game.time.events.loop(Phaser.Timer.SECOND, this.spawn, this);
    }
    AstroidBelt.prototype.spawn = function () {
        var _this = this;
        var type = UTIL.getRandomInt(0, 3);
        if (type == 0) {
            var buffer = new Astroid(this.game, this.level, 'SMALL-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor-Small', 'Meteor_Small-L');
        }
        else if (type == 1) {
            var buffer = new Astroid(this.game, this.level, 'LARGE-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor', 'Meteor-L');
        }
        else if (type == 2) {
            var buffer = new Astroid(this.game, this.level, 'LARGE-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor', 'Meteor-L');
        }
    };
    return AstroidBelt;
}());
exports.AstroidBelt = AstroidBelt;
var Astroid = (function (_super) {
    __extends(Astroid, _super);
    function Astroid(game, level, name, pos, asset, body) {
        var _this = _super.call(this, game, level, name, pos, asset) || this;
        _this.body = body;
        _this.enablePhysics();
        if (asset == "Meteor") {
            _this.pObject.body.setCircle(130);
        }
        else {
            _this.pObject.body.setCircle(60);
        }
        _this.pObject.body.mass = 30;
        return _this;
        //this.pObject.body.createBodyCallback(this.game.game.physics.p2.walls.top, this.collideTop, this);
        //this.pObject.body.collideWorldBounds = false;
    }
    Astroid.prototype.collideTop = function (body1, body2) {
        console.log(this);
    };
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
