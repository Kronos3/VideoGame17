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
var object_1 = require("./object");
var UTIL = require("./util");
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
        this.objects = [];
        this.assets = [];
        this.addControlScheme = function (bindings, captureInput) {
            if (captureInput === void 0) { captureInput = true; }
            var temp = new toggleControlScheme(_this.game, bindings, captureInput);
            _this.controls.push(temp);
        };
        this.addControlSchemeFromScheme = function (scheme) {
            _this.controls.push(scheme);
        };
        this.preload = function () {
            _this.loadAsset('rocket', 'resources/textures/player/Rocket-L.png');
            _this.loadAsset('rocket-thrust', 'resources/textures/player/Rocket-L-T.png');
            _this.loadAsset('rocket-L-L', 'resources/textures/player/Rocket-L-L.png');
            _this.loadAsset('rocket-L-R', 'resources/textures/player/Rocket-L-R.png');
        };
        this.hide = function () {
            $('#canvas-wrapper').css('display', "none");
        };
        this.show = function () {
            $('#canvas-wrapper').css('display', "block");
        };
        this.create = function () {
            _this.game.physics.startSystem(Phaser.Physics.P2JS);
            _this.cursor = _this.game.input.keyboard.createCursorKeys();
            var mainCanvas = $(_this.game.canvas);
            $('#canvas-wrapper').append(mainCanvas);
            _this.hide();
        };
        this.update = function () {
            // Control
            if (_this.controls != undefined) {
                for (var _i = 0, _a = _this.controls; _i < _a.length; _i++) {
                    var iter = _a[_i];
                    iter.frame();
                }
            }
        };
        this.resize = function () {
            var height = $(window).height();
            var width = $(window).width();
            _this.game.width = width;
            _this.game.height = height;
            _this.game.renderer.resize(width, height);
        };
        this.loadAsset = function (name, path) {
            _this.game.load.image(name, path);
            _this.assets.push({ path: path, name: name });
        };
        this.addObjectFromAsset = function (assetName, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            if (UTIL.find(assetName, _this.assets) != -1) {
                _this.objects.push({ name: assetName, object: new object_1.GameSprite(_this, _pos, assetName, extra) });
            }
            else {
                try {
                    throw new Error('Asset {0} has not been preloaded, use newObject()'.format(assetName));
                }
                catch (e) {
                    console.log(e.name, +': ' + e.message);
                }
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            _this.loadAsset(name, path);
            _this.addObjectFromAsset(name, _pos, extra);
        };
        this.getObject = function (name) {
            for (var _i = 0, _a = _this.objects; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i.object;
                }
            }
            try {
                throw new Error('Object {0} could not be found'.format(name));
            }
            catch (e) {
                console.log(e.name, +': ' + e.message);
            }
            return null;
        };
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: this.preload, create: this.create, update: this.update }, true);
        $(window).resize(function () {
            _this.resize();
        });
    }
    return MainGame;
}());
exports.MainGame = MainGame;
