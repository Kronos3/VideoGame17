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
            }, 'Meteor-Small');
        }
        else if (type == 1) {
            var buffer = new Astroid(this.game, this.level, 'LARGE-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor');
        }
        else if (type == 2) {
            var buffer = new Astroid(this.game, this.level, '3-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor-3');
        }
        else if (type == 3) {
            var buffer = new Astroid(this.game, this.level, 'ice-astroid{0}'.format(this.astroids.length), {
                x: function () { return _this.game.game.world.randomX; },
                y: function () { return _this.game.game.world.height; }
            }, 'Meteor-Ice');
        }
    };
    return AstroidBelt;
}());
exports.AstroidBelt = AstroidBelt;
var Astroid = (function (_super) {
    __extends(Astroid, _super);
    function Astroid(game, level, name, pos, asset) {
        var _this = _super.call(this, game, level, name, pos, asset) || this;
        _this.enablePhysics();
        if (asset == "Meteor-Small") {
            _this.pObject.body.setCircle(60);
        }
        else if (asset == "Meteor") {
            _this.pObject.body.setCircle(130);
        }
        else if (asset == "Meteor-3") {
            _this.pObject.body.setCircle(130);
        }
        else if (asset == "Meteor-Ice") {
            _this.pObject.body.setCircle(60);
        }
        _this.pObject.body.mass = 30;
        return _this;
    }
    return Astroid;
}(object_1.GameSprite));
exports.Astroid = Astroid;
