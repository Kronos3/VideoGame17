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
var level_1 = require("./level");
var level_2 = require("./level");
var level_3 = require("./level");
var ui_1 = require("./ui");
var $ = require("jquery");
var mission_1 = require("./mission");
var mission_2 = require("./mission");
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
Object.defineProperty(Object.prototype, 'watch', {
    value: function (prop, handler) {
        var setter = function (val) {
            return val = handler.call(this, val);
        };
        Object.defineProperty(this, prop, {
            set: setter
        });
    }
});
var MainGame = (function () {
    function MainGame(onReady) {
        var _this = this;
        this.controls = [];
        this.levelsequence = new level_1.LevelSequence();
        this.assets = [];
        this.addMission = function (l) {
            _this.missionControl.addMission(mission_1.generateMission(l));
        };
        this.addControlScheme = function (bindings, captureInput) {
            if (captureInput === void 0) { captureInput = true; }
            var temp = new toggleControlScheme(_this.game, bindings, captureInput);
            _this.controls.push(temp);
        };
        this.addControlSchemeFromScheme = function (scheme) {
            _this.controls.push(scheme);
        };
        this.preload = function () {
            _this.game.load.image('Artemis', '../resources/textures/Artemis/Artemis.png');
            _this.game.load.image('ArtemisThrust', '../resources/textures/Artemis/ArtemisThrust.png');
            _this.game.load.image('ArtemisL', '../resources/textures/Artemis/ArtemisL.png');
            _this.game.load.image('ArtemisR', '../resources/textures/Artemis/ArtemisR.png');
            _this.game.load.image('Launch-L', '../resources/textures/Level1/Launch-L.png');
            _this.game.load.image('Fore', '../resources/textures/Level1/Foreground-L.png');
            _this.game.load.image('Mountain-E', '../resources/textures/Level1/BG_1-L.png');
            _this.game.load.image('Sky', '../resources/textures/Level1/Sky Gradient Color Overlay-L.png');
            _this.game.load.image('Back', '../resources/textures/Level1/Background-L.png');
            _this.game.load.image('Stars', '../resources/textures/Level1/stars.png');
            _this.game.load.image('Athena', '../resources/textures/Athena/Athena.png');
            _this.game.load.image('AthenaThrust', '../resources/textures/Athena/AthenaThrust.png');
            _this.game.load.image('AthenaL', '../resources/textures/Athena/AthenaL.png');
            _this.game.load.image('AthenaR', '../resources/textures/Athena/AthenaR.png');
            _this.game.load.image('Vulcan', '../resources/textures/Vulcan/Vulcan.png');
            _this.game.load.image('VulcanR', '../resources/textures/Vulcan/VulcanR.png');
            _this.game.load.image('VulcanL', '../resources/textures/Vulcan/VulcanL.png');
            _this.game.load.image('VulcanThrust', '../resources/textures/Vulcan/VulcanThrust.png');
            _this.game.load.image('Meteor-Small', '../resources/textures/objects/Meteor_Small-L.png');
            _this.game.load.image('Meteor', '../resources/textures/objects/Meteor-L.png');
            _this.game.load.image('Meteor-Ice', '../resources/textures/objects/Ice.png');
            _this.game.load.image('Meteor-3', '../resources/textures/objects/Meteor_03.png');
            _this.game.load.image('ex1', '../resources/animated/explosion/Explosion_01.png');
            _this.game.load.image('ex2', '../resources/animated/explosion/Explosion_02.png');
            _this.game.load.image('ex3', '../resources/animated/explosion/Explosion_03.png');
            _this.game.load.image('ex4', '../resources/animated/explosion/Explosion_04.png');
            _this.game.load.image('ex5', '../resources/animated/explosion/Explosion_05.png');
            _this.game.load.image('rover1', '../resources/textures/rover/01.png');
            _this.game.load.image('IOGround', '../resources/textures/Level3/IOGround.png');
            _this.game.load.image('rock1', '../resources/textures/Level3/IORock.png');
            _this.game.load.image('rock2', '../resources/textures/Level3/IO Rock_02.png');
            _this.game.load.physics('physicsData', '../resources/physics/mappings.json');
            _this.game.load.atlasJSONHash('rover', '../resources/animated/rover/rover.png', '../resources/animated/rover/rover.json');
        };
        this.pause = function () {
            _this.game.paused = true;
        };
        this.resume = function () {
            _this.game.paused = false;
        };
        this.hide = function () {
            $('#canvas-wrapper').css('display', "none");
            _this.pause();
        };
        this.show = function () {
            $('#canvas-wrapper').css('display', "block");
            _this.resume();
        };
        this.openMissionControl = function () {
            $('.scene-wrapper').removeClass('title');
            $('.scene-wrapper').removeClass('text');
            $('.scene-wrapper').addClass('game');
            $('.mission-control').css('display', 'block');
            _this.pause();
        };
        this.closeMissionControl = function () {
            $('.mission-control').css('display', 'none');
            _this.resume();
        };
        this.create = function () {
            var mainCanvas = $(_this.game.canvas);
            mainCanvas.detach();
            $('#canvas-wrapper').append(mainCanvas);
            _this.game.world.setBounds(0, 0, _this.game.width, 4600);
            _this.game.physics.startSystem(Phaser.Physics.P2JS);
            _this.cursor = _this.game.input.keyboard.createCursorKeys();
            _this.hide();
            _this.onReady(_this);
            _this.game.time.advancedTiming = true;
            _this.game.time.desiredFps = 60;
            _this.game.camera.bounds.top = 0;
            _this.game.physics.p2.boundsCollidesWith = [];
            _this.levelsequence.initGame();
            _this.playerCollisionGroup = _this.game.physics.p2.createCollisionGroup();
        };
        this.addGravity = function (t) {
            _this.gravityObjects.push(t);
        };
        this.isLoaded = false;
        this.getGravity = function () {
            return 1;
        };
        this.update = function () {
            // Control
            if (_this.controls != undefined) {
                for (var _i = 0, _a = _this.controls; _i < _a.length; _i++) {
                    var iter = _a[_i];
                    iter.frame();
                }
            }
            if (_this.levelsequence.getCurrent().done()) {
                _this.wrapper.handleNext();
                return;
            }
            // MissionControl
            _this.missionControl.frame();
            // Per-Level
            _this.levelsequence.getCurrent().frame();
            // Gravity
            _this.gravityObjects.forEach(function (element) {
                element.gravityAction();
            });
        };
        this.get_ratio = function () {
            return 60 / _this.game.time.fps;
        };
        this.get_fps = function () {
            return _this.game.time.fps;
        };
        this.render = function () {
            _this.game.debug.text('render FPS: ' + (_this.game.time.fps || '--'), 2, 14, "#00ff00");
        };
        this.resize = function () {
            //var height = $(window).height();
            //var width = $(window).width();
            //this.game.width = width;
            //this.game.height = height;
            //this.game.renderer.resize(width, height);
            _this.levelsequence.levels.forEach(function (element) {
                element.resetPositions();
            });
        };
        this.newLevel = function (name) {
            var level = new level_2.Level(_this, name, function () { return false; });
            _this.levelsequence.addLevel(level);
            return level;
        };
        this.addLevel = function (l) {
            if (l instanceof level_2.Level) {
                _this.levelsequence.addLevel(l);
            }
            else {
                _this.levelsequence.addLevel(level_3.createLevel(l));
            }
        };
        this.getLevel = function (name) {
            return _this.levelsequence.getLevel(name);
        };
        this.setGravity = function (value, restitution) {
            if (restitution === void 0) { restitution = 0.8; }
            _this.gravity = value;
            _this.game.physics.p2.restitution = restitution;
        };
        this.loadAsset = function (name, path) {
            /*console.log (name + ':' + path)
            this.game.load.image (name, path);*/
        };
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: this.preload, create: this.create, update: this.update, render: this.render }, true);
        this.onReady = onReady;
        setTimeout(function () {
            _this.isLoaded = true;
            $('.loading').css('display', 'none');
        }, 1000);
        this.uicontroller = new ui_1.UIController();
        this.missionControl = new mission_2.MissionControl(this);
        this.gravityObjects = [];
    }
    return MainGame;
}());
exports.MainGame = MainGame;
