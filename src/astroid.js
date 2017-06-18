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
    function AstroidBelt(game, level, total) {
        var _this = this;
        this.astroids = [];
        this.frame = function () {
            for (var _i = 0, _a = _this.astroids; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.dead) {
                    i.frame();
                }
            }
        };
        this.game = game;
        this.level = level;
        this.game.game.time.events.loop(500, this.loop, this);
        this.total = total;
    }
    AstroidBelt.prototype.loop = function () {
        if (this.astroids.length > this.total) {
            return;
        }
        this.spawn();
    };
    AstroidBelt.prototype.spawn = function () {
        var _this = this;
        var type = UTIL.getRandomInt(0, 3);
        var _type = UTIL.getRandomInt(0, 1);
        var xrange = {
            min: this.game.levelsequence.getCurrent().getObject('ship').pObject.x + 600,
            max: this.game.levelsequence.getCurrent().getObject('ship').pObject.x + 4500,
        };
        var pos = {
            x: function () { return UTIL.getRandomInt(xrange.min, xrange.max); },
            y: function () { return _type ? _this.game.game.world.height : 0; }
        };
        if (type == 0) {
            var buffer = new Astroid(this, this.game, this.level, 'SMALL-astroid{0}'.format(this.astroids.length), pos, 'Meteor-Small');
        }
        else if (type == 1) {
            var buffer = new Astroid(this, this.game, this.level, 'LARGE-astroid{0}'.format(this.astroids.length), pos, 'Meteor');
        }
        else if (type == 2) {
            var buffer = new Astroid(this, this.game, this.level, '3-astroid{0}'.format(this.astroids.length), pos, 'Meteor-3');
        }
        else if (type == 3) {
            var buffer = new Astroid(this, this.game, this.level, 'ice-astroid{0}'.format(this.astroids.length), pos, 'Meteor-Ice');
        }
        this.astroids.push(buffer);
    };
    return AstroidBelt;
}());
exports.AstroidBelt = AstroidBelt;
var Astroid = (function (_super) {
    __extends(Astroid, _super);
    function Astroid(belt, game, level, name, pos, asset) {
        var _this = _super.call(this, game, level, name, pos, [asset]) || this;
        _this.collide = function (target, this_target, shapeA, shapeB, contactEquation) {
            if (contactEquation[0] != null) {
                if (shapeB.id == 14 && _this.pos.y() != 0) {
                    _this.dead = true;
                    _this.pObject.destroy();
                    _this.parent.spawn();
                }
                else if (shapeB.id == 15 && _this.pos.y() == 0) {
                    _this.dead = true;
                    _this.pObject.destroy();
                    _this.parent.spawn();
                }
            }
        };
        _this.frame = function () {
            _this.pObject.body.velocity.x %= 40;
            if (_this.pos.y() != 0) {
                _this.pObject.body.velocity.y = -500;
            }
            else {
                _this.pObject.body.velocity.y = 500;
            }
        };
        _this.parent = belt;
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
            _this.pObject.body.setCircle(30);
        }
        _this.pObject.body.mass = 30;
        _this.pObject.body.onBeginContact.add(_this.collide, _this);
        _this.dead = false;
        _this.pObject.body.velocity.x = 0;
        if (_this.pos.y() != 0) {
            _this.pObject.body.velocity.y = -1;
        }
        else {
            _this.pObject.body.velocity.y = 1;
        }
        return _this;
    }
    return Astroid;
}(object_1.DynamicSprite));
exports.Astroid = Astroid;
