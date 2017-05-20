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
var control_1 = require("./control");
var toggleControlScheme = (function (_super) {
    __extends(toggleControlScheme, _super);
    function toggleControlScheme(game, _bindings, captureInput, enabled) {
        if (captureInput === void 0) { captureInput = true; }
        if (enabled === void 0) { enabled = true; }
        var _this = _super.call(this, game, _bindings, captureInput) || this;
        _this.enabled = enabled;
        return _this;
    }
    toggleControlScheme.prototype.enable = function () {
        this.enabled = true;
    };
    toggleControlScheme.prototype.disable = function () {
        this.enabled = false;
    };
    toggleControlScheme.prototype.frame = function (_args) {
        if (this.enabled) {
            _super.prototype.frame.call(this, _args);
        }
    };
    return toggleControlScheme;
}(control_1.ControlScheme));
exports.toggleControlScheme = toggleControlScheme;
var MainGame = (function () {
    function MainGame() {
        var _this = this;
        this.controls = [];
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: this.preload, create: this.create, update: this.update }, true);
        $(window).resize(function () {
            _this.resize();
        });
    }
    MainGame.prototype.addControlScheme = function (bindings, captureInput) {
        if (captureInput === void 0) { captureInput = true; }
        var temp = new toggleControlScheme(this.game, bindings, captureInput);
        this.controls.push(temp);
    };
    MainGame.prototype.addControlSchemeFromScheme = function (scheme) {
        this.controls.push(scheme);
    };
    MainGame.prototype.preload = function () {
        this.game.load.image('rocket', 'resources/textures/player/Rocket-L.png');
        this.game.load.image('rocket-thrust', 'resources/textures/player/Rocket-L-T.png');
        this.game.load.image('rocket-L-L', 'resources/textures/player/Rocket-L-L.png');
        this.game.load.image('rocket-L-R', 'resources/textures/player/Rocket-L-R.png');
    };
    MainGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append(mainCanvas);
        $('#canvas-wrapper').css('display', "none");
    };
    MainGame.prototype.update = function () {
        // Control
        if (this.controls != undefined) {
            for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
                var iter = _a[_i];
                iter.frame();
            }
        }
    };
    MainGame.prototype.resize = function () {
        var height = $(window).height();
        var width = $(window).width();
        this.game.width = width;
        this.game.height = height;
        this.game.renderer.resize(width, height);
    };
    return MainGame;
}());
exports.MainGame = MainGame;
