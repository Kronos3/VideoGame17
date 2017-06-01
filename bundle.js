(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        _this.loadBody(_this.body);
        _this.force = force;
        _this.setForce(_this.force);
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

},{"./object":8,"./util":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Task = (function () {
    function Task(fn, repeat, interval) {
        if (repeat === void 0) { repeat = true; }
        if (interval === void 0) { interval = 60; }
        this.fn = fn;
        this.repeat = repeat;
        this.interval = interval;
    }
    Task.prototype.start = function () {
        if (this.repeat) {
            this.timer = setInterval(this.fn, this.interval);
        }
        else {
            this.timer = setTimeout(this.fn, 0);
        }
    };
    Task.prototype.end = function () {
        clearInterval(this.timer);
    };
    return Task;
}());
exports.Task = Task;

},{}],3:[function(require,module,exports){
"use strict";
/// <reference path="../imports/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ControlScheme = (function () {
    function ControlScheme(game, _bindings, captureInput, enabled) {
        if (captureInput === void 0) { captureInput = true; }
        if (enabled === void 0) { enabled = true; }
        this.bindings = [];
        this.keys = [];
        this.game = game;
        this.captureInput = captureInput;
        for (var i = 0; i != _bindings.length; i++) {
            this.addBinding(_bindings[i]);
        }
    }
    ControlScheme.prototype.frame = function (_args) {
        for (var iter = 0; iter != this.bindings.length; iter++) {
            if (typeof this.bindings[iter].press != "undefined") {
                continue;
            }
            if (this.game.input.keyboard.isDown(this.bindings[iter].key)) {
                this.bindings[iter].callback(_args);
            }
            if (this.bindings[iter].key == -1) {
                this.bindings[iter].callback(_args);
            }
        }
    };
    ControlScheme.prototype.addBinding = function (binding) {
        if (binding.press) {
            var key1 = this.game.input.keyboard.addKey(binding.key);
            key1.onDown.add(binding.callback);
            this.keys.push(key1);
        }
        else {
            this.bindings.push(binding);
        }
    };
    return ControlScheme;
}());
exports.ControlScheme = ControlScheme;

},{}],4:[function(require,module,exports){
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
            _this.game.load.image('Launch-L', '../resources/textures/Launch-L.png');
            _this.game.load.image('Fore', '../resources/textures/Foreground-L.png');
            _this.game.load.image('Mountain-E', '../resources/textures/BG_1-L.png');
            _this.game.load.image('Sky', '../resources/textures/Sky Gradient Color Overlay-L.png');
            _this.game.load.image('Back', '../resources/textures/Background-L.png');
            _this.game.load.image('Stars', '../resources/textures/stars.png');
            _this.game.load.image('Explosion', '../resources/textures/explosion.png');
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
            _this.game.load.physics('physicsData', '../resources/physics/mappings.json');
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
            $('.scene-wrapper').removeClass('title');
            $('.scene-wrapper').removeClass('text');
            $('.scene-wrapper').addClass('game');
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
            // Per-Level
            _this.levelsequence.getCurrent().frame();
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
    }
    return MainGame;
}());
exports.MainGame = MainGame;

},{"./control":3,"./level":5,"./ui":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
var object_2 = require("./object");
var mission_1 = require("./mission");
var mission_2 = require("./mission");
var UTIL = require("./util");
var LevelSequence = (function () {
    function LevelSequence() {
        var _this = this;
        this.levels = [];
        this.addLevel = function (_level) {
            _this.levels.push(_level);
        };
        this.getCurrent = function () {
            return _this.levels[_this.current];
        };
        this.start = function () {
            _this.current = 0;
            _this.levels[0].enable();
        };
        this.getLevel = function (name) {
            for (var _i = 0, _a = _this.levels; _i < _a.length; _i++) {
                var iter = _a[_i];
                if (iter.name == name) {
                    return iter;
                }
            }
            UTIL.error('Level {0} could not be found'.format(name));
            return null;
        };
        this.initGame = function () {
            _this.current = -1;
            for (var i = 0; i != _this.levels.length; i++) {
                _this.levels[i].disable();
            }
            _this.levels[0].enable();
        };
        this.nextLevel = function (t) {
            if (t === void 0) { t = false; }
            _this.current++;
            for (var i = 0; i != _this.levels.length; i++) {
                _this.levels[i].disable();
            }
            if (t) {
                UTIL.move(_this.levels[_this.current - 1].getObject('ship'), _this.levels[_this.current - 1].objects, _this.levels[_this.current].objects);
                _this.levels[_this.current].getObject('ship').level = _this.levels[_this.current];
                _this.levels[_this.current].init(_this.levels[_this.current]);
            }
            _this.levels[_this.current].enable(true);
        };
        ;
    }
    return LevelSequence;
}());
exports.LevelSequence = LevelSequence;
function createLevel(_const) {
    var out = new Level(_const.game, _const.name, _const.done, _const.frame, _const.init);
    if (typeof _const.objects !== "undefined") {
        for (var _i = 0, _a = _const.objects; _i < _a.length; _i++) {
            var iter = _a[_i];
            var OBJ;
            if (iter.assets instanceof Array) {
                // Dynamic Objects
                // Generate the object
                OBJ = new object_2.DynamicSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra);
            }
            else {
                // Static Object
                // Add the object
                OBJ = new object_1.GameSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra, iter.repeat);
            }
            if (typeof iter.physics !== "undefined") {
                OBJ.loadBody(iter.physics);
            }
            if (typeof iter.static !== "undefined") {
                OBJ.pObject.body.static = iter.static;
            }
            out.addObject(OBJ);
        }
    }
    return out;
}
exports.createLevel = createLevel;
var Level = (function () {
    function Level(game, name, done, frame, init) {
        if (frame === void 0) { frame = function () { return; }; }
        if (init === void 0) { init = function (l) { return; }; }
        var _this = this;
        this.objects = [];
        this.setframe = function () { return; };
        this.inited = false;
        this.init = function (l) {
            _this.binit(l);
            _this.inited = true;
        };
        this.frame = function () {
            if (_this.inited) {
                _this.missionControl.frame();
                _this.setframe();
            }
        };
        this.getAllBodies = function () {
            var out = [];
            _this.objects.forEach(function (element) {
                out.push(element.pObject.body);
            });
            return out;
        };
        this.addMission = function (l) {
            _this.missionControl.addMission(mission_1.generateMission(l));
        };
        this.enable = function (doInit) {
            if (doInit === void 0) { doInit = false; }
            _this.objects.forEach(function (element) {
                element.enable();
            });
        };
        this.disable = function () {
            _this.objects.forEach(function (element) {
                element.disable();
            });
        };
        this.addObjectFromAsset = function (name, _pos, extra) {
            if (_pos === void 0) { _pos = { x: function () { return 0; }, y: function () { return 0; } }; }
            if (UTIL.find(name, _this.game.assets) != -1) {
                _this.objects.push(new object_1.GameSprite(_this.game, _this, name, _pos, _this.game.assets[UTIL.find(name, _this.game.assets)], extra));
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format(name));
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: function () { return 0; }, y: function () { return 0; } }; }
            _this.game.loadAsset(name, path);
            _this.addObjectFromAsset(name, _pos, extra);
        };
        this.getObject = function (name) {
            for (var _i = 0, _a = _this.objects; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i;
                }
            }
            UTIL.error('Object {0} could not be found'.format(name));
            return null;
        };
        this.addObject = function (obj) {
            _this.objects.push(obj);
        };
        this.resetPositions = function () {
            _this.objects.forEach(function (element) {
                element.resetPosition();
            });
        };
        this.game = game;
        this.name = name;
        this.setframe = frame;
        this.binit = init;
        this.done = done;
        this.missionControl = new mission_2.MissionControl(this);
        this.missionControl.begin();
    }
    return Level;
}());
exports.Level = Level;

},{"./mission":7,"./object":8,"./util":12}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
var ship_3 = require("./ship");
var ship_4 = require("./ship");
var wrapper_1 = require("./wrapper");
var background_1 = require("./background");
var astroid_1 = require("./astroid");
function getlength(number) {
    return number.toString().length;
}
function genImgList(startFrame, endFrame, numlen, prefix, suffix) {
    if (numlen === void 0) { numlen = 4; }
    if (prefix === void 0) { prefix = 'resources/blender/earth_holo/'; }
    if (suffix === void 0) { suffix = '.png'; }
    var out = [];
    for (var i = startFrame; i != endFrame; i++) {
        out.push(prefix + Array(numlen - getlength(i) + 1).join('0') + i.toString() + suffix);
    }
    return out;
}
function GIF(images, element, repeat) {
    if (repeat === void 0) { repeat = true; }
    var n = 0;
    var preLOAD = [];
    images.forEach(function (element) {
        var temp = new Image();
        temp.onload = function () {
            preLOAD.push(temp);
        };
        temp.src = element;
    });
    var task = new background_1.Task(function () {
        console.log(n);
        $(element).attr('src', images[n]);
        if (repeat && n == images.length) {
            n = 0;
            return;
        }
        n++;
    }, true, 60);
    task.start();
}
$(document).ready(function () {
    for (var i = 0; i != 50; i++) {
        $("<img src=\"resources/textures/Star.png\" class=\"pos\">").appendTo(".stars");
    }
    for (var i = 0; i != $('.stars > img').length; i++) {
        setup_pos($('.stars > img').get(i), (Math.random() * (-0.08 - 0.08) + 0.08).toFixed(4), (Math.random() * (-0.120 - 0.12) + 0.12).toFixed(4));
        $($('.stars > img').get(i)).css("top", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
        $($('.stars > img').get(i)).css("left", (Math.random() * (100 - 0) + 0).toFixed(0) + "%");
    }
    setup_pos($('#mars').get(0), .02, .02);
    setup_pos($('#moon').get(0), -.08, .04);
    setup_pos($('.menu').get(0), -.02, .02);
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;
        event = event || window.event;
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;
            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }
        for (var j = 0; j != $('.scene').length; j++) {
            if ($($('.scene').get(j)).css('display') != 'none') {
                for (var i = 0; i != $($('.scene').get(j)).find('.pos').length; i++) {
                    set_pos($($('.scene').get(j)).find('.pos').get(i), event.pageX, event.pageY);
                }
                for (var i = 0; i != $($('.scene').get(j)).find('.rot').length; i++) {
                    set_rot($($('.scene').get(j)).find('.rot').get(i), event.pageX, event.pageY);
                }
            }
        }
    }
    difDone();
    initDif();
    initGame();
});
var shipStats = {
    easy: {
        mass: '30%',
        thrust: '60%',
        angAcc: '80%'
    },
    medium: {
        mass: '50%',
        thrust: '50%',
        angAcc: '70%'
    },
    hard: {
        mass: '100%',
        thrust: '100%',
        angAcc: '30%'
    },
};
function setStats(e_stats, so) {
    $(e_stats[0]).children('.bar').children('span').css('width', so.mass);
    $(e_stats[1]).children('.bar').children('span').css('width', so.thrust);
    $(e_stats[2]).children('.bar').children('span').css('width', so.angAcc);
}
function initDif() {
    $('.difficulty > .dif-choice').toArray().forEach(function (element) {
        element.addEventListener("click", function () {
            $('.dif-choice.active').removeClass('active');
            $(element).addClass('active');
            $('.stats').removeClass('left');
            $('.stats').removeClass('middle');
            $('.stats').removeClass('right');
            var stats = $('.stats > div').toArray();
            if ($(element).attr('id') == 'easy') {
                $('.stats').addClass('left');
                setStats(stats, shipStats.easy);
            }
            else if ($(element).attr('id') == 'medium') {
                $('.stats').addClass('middle');
                setStats(stats, shipStats.medium);
            }
            else if ($(element).attr('id') == 'hard') {
                $('.stats').addClass('right');
                setStats(stats, shipStats.hard);
            }
        });
    });
}
// Global variables
var game;
window.GAME = null;
function initGame() {
    game = new game_1.MainGame(DoGame);
    window.GAME = game;
    var testControlBindings = [];
    game.addControlScheme(testControlBindings);
    var story = [
        ['2061', 'The International Space Exploration Administration (ISEA) is coming off their recent success of their manned mission to Mars.', 'Now, they have set their sights on the next stepping stone in the solar system: Jupiter\'s moons.', 'The ISEA believes that landing a spacecraft near Jupiter will reveal new information about the gas giants and the remainder of the solar system.', 'However, this journey will encounter new challenges that will threaten the lives of the astronauts and the reputation of the ISEA.'],
    ];
    window.MAIN = new wrapper_1.Wrapper(window.GAME, story);
}
;
function set_pos(e, x, y) {
    $(e).css("transform", "matrix(1, 0, 0, 1, " + $(e).data('xfactor') * x + " , " + $(e).data('yfactor') * y + ")");
}
function set_rot(e, x, y) {
    $(e).css("transform", "rotateY(" + x * $(e).data('xfactor') + "deg)" + "rotateX(" + y * $(e).data('yfactor') + "deg)");
}
function setup_pos(e, x_scale, y_scale) {
    $(e).data('xfactor', x_scale);
    $(e).data('yfactor', y_scale);
}
function DoGame(game) {
    var levels = [
        {
            name: "intro",
            game: window.GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; }
                    }
                },
                {
                    name: "stars2",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 1600; }
                    }
                },
                {
                    name: "sky",
                    assets: "Sky",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 820; }
                    }
                },
                {
                    name: "mountains",
                    assets: "Mountain-E",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 520; }
                    }
                },
                {
                    name: 'backdrop',
                    assets: "Fore",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.world.height - 120; }
                    }
                },
                {
                    name: "Launch-L",
                    assets: "Launch-L",
                    physics: "Launch-L",
                    static: true,
                    position: {
                        x: function () { return window.GAME.game.world.width / 2; },
                        y: function () { return window.GAME.game.world.height - 96; }
                    }
                },
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(100, 0.1);
            }
        },
        {
            name: "belt1",
            game: window.GAME,
            objects: [
                {
                    name: "stars",
                    assets: "Stars",
                    position: {
                        x: function () { return 0; },
                        y: function () { return 0; },
                        width: 9200,
                        height: 9200
                    },
                    repeat: true
                },
            ],
            frame: function () {
            },
            done: function () {
                return false; //(<any>window).GAME.getLevel ('intro').getObject('Artemis').getAltitude() > 4000;
            },
            init: function (___this) {
                window.GAME.setGravity(0, 0.1);
                ___this.game.game.world.setBounds(0, 0, 9200, 9200);
                ___this.getObject('ship').pos = {
                    x: function () { return 70; },
                    y: function () { return window.GAME.game.world.centerY; }
                };
                ___this.getObject('ship').reset(false);
                window.GAME.uicontroller.setPlanet('ceres');
                // Initialize the Astroid belt;
                ___this.astroidbelt = new astroid_1.AstroidBelt(window.GAME, ___this);
                for (var i = 0; i != 160; i++) {
                    ___this.astroidbelt.spawn();
                }
            }
        },
    ];
    var missions = [
        [
            {
                title: 'Reach 4000m',
                description: 'Exit Earth\'s atmosphere',
                condition: function () {
                    if (window.GAME.getLevel('intro').getObject('ship') == null) {
                        return false;
                    }
                    return window.GAME.getLevel('intro').getObject('ship').getAltitude() > 4000;
                },
                onDone: function () {
                },
                update: function () {
                    if (window.GAME.getLevel('intro').getObject('ship') == null) {
                        window.GAME.pause();
                        return;
                    }
                    var a = parseInt(window.GAME.getLevel('intro').getObject('ship').getAltitude());
                    if (a < 0) {
                        a = 0;
                    }
                    $('.alt').text(a + 'M');
                    var x = (.95 * (a / 40));
                    if (x > 95) {
                        $('.alt').css('bottom', '95%');
                    }
                    else {
                        $('.alt').css('bottom', x + '%');
                    }
                }
            }
        ],
        [
            {
                title: 'Survive the astroid belt',
                description: 'Manuever around astroids in the belt',
                condition: function () {
                    return false;
                },
                onDone: function () {
                    ;
                },
                update: function () {
                    ;
                }
            }
        ]
    ];
    add_levels(levels, missions);
}
var shipClass;
function add_levels(levels, missions) {
    for (var iter in levels) {
        game.addLevel(levels[iter]);
        for (var _i = 0, _a = missions[iter]; _i < _a.length; _i++) {
            var miter = _a[_i];
            game.levelsequence.levels[iter].addMission(miter);
        }
    }
}
function difDone() {
    $('.finish-dif').get(0).addEventListener('click', function () {
        $('.difficulty').css('display', 'none');
        if ($('.dif-choice.active').attr('id') == 'easy') {
            shipClass = ship_2.Artemis;
        }
        else if ($('.dif-choice.active').attr('id') == 'medium') {
            shipClass = ship_3.Athena;
        }
        else if ($('.dif-choice.active').attr('id') == 'hard') {
            shipClass = ship_4.Vulcan;
        }
        initShip(window.GAME.getLevel('intro'));
        window.GAME.resume();
    });
    $('.mission-control-done').get(0).addEventListener('click', function () {
        window.GAME.wrapper.handleNext(true);
        window.GAME.closeMissionControl();
    });
}
function initShip(___this) {
    var buf = new shipClass(window.GAME, ___this);
    ___this.addObject(buf);
    window.GAME.addControlScheme([
        ship_1.ShipBinding(window.GAME, buf),
        {
            key: Phaser.KeyCode.R,
            callback: function () {
                buf.reset();
            },
            press: true
        }
    ]);
    window.GAME.game.camera.follow(buf.pObject);
    ___this.init(___this);
}
exports.initShip = initShip;

},{"./astroid":1,"./background":2,"./game":4,"./ship":9,"./wrapper":13}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateMission(m) {
    var e = $("<div class=\"mission\">\
    <p class=\"title\">{0}</p>\
    <p class=\"description\">{1}</p>\
</div>".format(m.title, m.description));
    return new Mission(e.get(0), m.condition, m.title, m.onDone, m.description, m.update);
}
exports.generateMission = generateMission;
var MissionControl = (function () {
    function MissionControl(level) {
        var _this = this;
        this.missionIndex = 0;
        this.missions = [];
        this.addMission = function (m) {
            m.setControl(_this);
            _this.missions.push(m);
            $(m.element).appendTo(".mission-control > .inner");
        };
        this.begin = function () {
            _this.missionIndex = 0;
        };
        this.nextMission = function () {
            _this.missionIndex++;
        };
        this.frame = function () {
            var current_mission = _this.missions[_this.missionIndex];
            if (typeof current_mission === 'undefined') {
                _this.level.game.wrapper.handleNext();
                return;
            }
            current_mission.frame();
            if (!$(current_mission.element).hasClass('current')) {
                $(current_mission.element).addClass('current');
            }
        };
        this.level = level;
    }
    return MissionControl;
}());
exports.MissionControl = MissionControl;
var Mission = (function () {
    function Mission(e, condition, title, onDone, desc, update) {
        var _this = this;
        this.complete = false;
        this.setControl = function (c) {
            _this.missionControl = c;
        };
        this.frame = function () {
            if (_this.condition()) {
                _this.complete = true;
                _this.onDone();
                $(_this.element).removeClass('current');
                $(_this.element).addClass('finished');
                _this.missionControl.nextMission();
            }
            _this.update();
        };
        this.element = e;
        this.title = title;
        this.desc = desc;
        this.condition = condition;
        this.update = update;
        this.onDone = onDone;
    }
    return Mission;
}());
exports.Mission = Mission;

},{}],8:[function(require,module,exports){
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
var UTIL = require("./util");
var GameSprite = (function () {
    function GameSprite(game, level, name, pos, asset, extra, repeat) {
        if (repeat === void 0) { repeat = false; }
        var _this = this;
        this.resetPosition = function () {
            _this.pObject.x = _this.pos.x();
            _this.pObject.y = _this.pos.y();
        };
        this.addProperty = function (extra) {
            _this.extra = $.extend({}, _this.extra, external);
        };
        this.enablePhysics = function () {
            _this.level.game.game.physics.p2.enable(_this.pObject);
        };
        this.loadBody = function (key) {
            _this.enablePhysics();
            _this.pObject.body.clearShapes();
            _this.pObject.body.loadPolygon('physicsData', key);
        };
        this.disable = function () {
            if (_this.pObject.body != null) {
                _this.isStatic = _this.pObject.body.static;
                _this.pObject.body.static = true;
                _this.pObject.body.moves = false;
                //this.pObject.body.collides ();
            }
            _this.pObject.visible = false;
        };
        this.enable = function () {
            _this.pObject.visible = true;
            if (_this.pObject.body != null) {
                _this.pObject.body.static = _this.isStatic;
                _this.pObject.body.moves = true;
                //this.pObject.body.collides (this.level.getAllBodies ());
            }
        };
        this.level = level;
        this.name = name;
        this.game = game;
        this.asset = asset;
        this.extra = extra;
        this.pos = pos;
        if (repeat || typeof repeat === 'undefined') {
            this.pObject = this.game.game.add.tileSprite(this.pos.x(), this.pos.y(), this.pos.width, this.pos.height, asset);
        }
        else {
            this.pObject = this.game.game.add.sprite(this.pos.x(), this.pos.y(), this.asset);
        }
    }
    GameSprite.prototype.addToLevel = function (level) {
    };
    return GameSprite;
}());
exports.GameSprite = GameSprite;
var DynamicSprite = (function (_super) {
    __extends(DynamicSprite, _super);
    function DynamicSprite(game, level, name, pos, assets, extra) {
        var _this = _super.call(this, game, level, name, pos, assets[0], extra) || this;
        _this.assets = [];
        _this.switchToIndex = function (index) {
            _this.pObject.key = _this.assets[index];
            _this.pObject.loadTexture(_this.pObject.key, 0);
        };
        _this.switchTo = function (name) {
            if (UTIL.find(name, _this.assets) != -1) {
                _this.pObject.key = name;
                _this.pObject.loadTexture(_this.pObject.key, 0);
            }
        };
        _this.resetPosition = function () {
            return;
        };
        _this.assets = assets;
        return _this;
    }
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;

},{"./util":12}],9:[function(require,module,exports){
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
exports.ShipBinding = function (game, ship) {
    return {
        key: -1,
        callback: function () {
            if (!ship.isDead) {
                ship.preframe();
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    ship.rightRCS();
                }
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    ship.leftRCS();
                }
                if (game.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    ship.engineOn();
                }
                ship.postframe();
            }
            else {
                ship.pObject.body.setZeroForce();
                ship.pObject.body.setZeroRotation();
                ship.pObject.body.setZeroVelocity();
            }
        }
    };
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(game, name, bodyName, pos, assets, level) {
        if (level === void 0) { level = game.levelsequence.getLevel('intro'); }
        var _this = _super.call(this, game, level, name, pos, assets, { angularRot: 0, SAS: false, thrustOn: false, inSpace: false }) || this;
        _this.collide = function (target, this_target, shapeA, shapeB, contactEquation) {
            if (contactEquation[0] != null) {
                var res = Phaser.Point.distance(new Phaser.Point(contactEquation[0].bodyB.velocity[0], contactEquation[0].bodyB.velocity[1]), new Phaser.Point(0, 0));
                if (res > 30) {
                    _this.explode();
                    _this.game.game.time.events.add(300, _this.reset, _this);
                }
            }
        };
        _this.isDead = false;
        _this.maxLFO = 1000;
        _this.LFO = _this.maxLFO; // Liquid Fuel and Oxidizer (C10H16)
        _this.Isp = 250; // Ratio of thrust to fuel flow for every minute of burn
        // At max thrust, use 250 LFO after a minute of burn
        _this.maxMono = 50;
        _this.monoProp = _this.maxMono;
        _this.monoIsp = 10;
        _this.getAltitude = function () {
            return _this.startAlt - _this.pObject.body.y;
        };
        _this.calcUsage = function (isp) {
            return isp / (_this.game.game.time.fps * 60);
        };
        _this.fuelFlow = function () {
            _this.LFO -= _this.calcUsage(_this.Isp);
        };
        _this.setResources = function () {
            _this.game.uicontroller.setElement(0, (_this.LFO / _this.maxLFO) * 100);
            _this.game.uicontroller.setElement(1, (_this.monoProp / _this.maxMono) * 100);
        };
        _this.monoFlow = function () {
            _this.monoProp -= _this.calcUsage(_this.monoIsp);
        };
        _this.reset = function (t) {
            if (t === void 0) { t = true; }
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
            _this.pObject.body.x = _this.pos.x();
            _this.pObject.body.y = _this.pos.y();
            _this.pObject.body.rotation = 0;
            _this.isDead = false;
            if (t) {
                _this.LFO = _this.maxLFO;
                _this.monoProp = _this.maxMono;
            }
            _this.game.game.camera.follow(_this.pObject);
        };
        _this.explode = function () {
            _this.switchTo('Explosion');
            _this.isDead = true;
            _this.game.game.camera.follow(null);
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
        };
        _this.thrust = function (newtons) {
            var BODY = _this.pObject.body;
            var relative_thrust = newtons; // Dont subtract newtons from weight (done in postframe)
            var magnitude = BODY.world.pxmi(-relative_thrust);
            var angle = BODY.data.angle + Math.PI / 2;
            BODY.velocity.x -= magnitude * Math.cos(angle) * _this.game.get_ratio();
            BODY.velocity.y -= magnitude * Math.sin(angle) * _this.game.get_ratio();
            _this.fuelFlow();
        };
        _this.throttle = 270;
        _this.angularAcceleration = 0.7;
        _this.engineOn = function () {
            if (_this.LFO <= 0) {
                return;
            }
            _this.switchTo(_this.assets[1]);
            // Rocket weighs 200 (gravity * mass)
            _this.thrust(_this.throttle); // Lower when in 0G
            _this.extra.thrustOn = true;
        };
        // Turn right using RCS (reaction control system)
        _this.rightRCS = function () {
            if (_this.monoProp <= 0) {
                return;
            }
            _this.monoFlow();
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(_this.angularAcceleration, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo(_this.assets[2]);
        };
        _this.leftRCS = function () {
            if (_this.monoProp <= 0) {
                return;
            }
            _this.monoFlow();
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(-1 * _this.angularAcceleration, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo(_this.assets[3]);
        };
        // Dampen rotation using SAS (stability assist system)
        _this.SAS = function () {
            _this.extra.angularRot *= 0.93;
            if (_this.extra.angularRot >= -0.001 && _this.extra.angularRot <= 0.001) {
                _this.extra.angularRot = 0;
            }
        };
        // Ran before the control function in the frame
        _this.preframe = function () {
            _this.switchTo(_this.assets[0]);
        };
        _this.postframe = function () {
            if (_this.extra.SAS && !_this.game.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && _this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                _this.SAS();
            }
            _this.extra.thrustOn = false;
            _this.gravityAction();
            _this.setResources();
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
        _this.enablePhysics();
        _this.pObject.body.mass = 5;
        _this.loadBody(bodyName);
        _this.startAlt = _this.pObject.body.y;
        _this.pObject.body.onBeginContact.add(_this.collide, _this);
        return _this;
    }
    return Ship;
}(object_1.DynamicSprite));
exports.Ship = Ship;
var Artemis = (function (_super) {
    __extends(Artemis, _super);
    function Artemis(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 48; }
        };
        _this = _super.call(this, game, 'ship', 'Artemis', pos, [
            'Artemis',
            'ArtemisThrust',
            'ArtemisL',
            'ArtemisR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 1.2;
        _this.throttle = 300;
        _this.pObject.body.mass = 5;
        return _this;
    }
    return Artemis;
}(Ship));
exports.Artemis = Artemis;
var Athena = (function (_super) {
    __extends(Athena, _super);
    function Athena(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 57; }
        };
        _this = _super.call(this, game, 'ship', 'Athena', pos, [
            'Athena',
            'AthenaThrust',
            'AthenaL',
            'AthenaR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 0.5;
        _this.throttle = 240;
        _this.pObject.body.mass = 5;
        return _this;
    }
    return Athena;
}(Ship));
exports.Athena = Athena;
var Vulcan = (function (_super) {
    __extends(Vulcan, _super);
    function Vulcan(game, level) {
        var _this = this;
        var pos = {
            x: function () { return window.GAME.game.world.width / 2 - 70; },
            y: function () { return window.GAME.game.world.height - 69; }
        };
        _this = _super.call(this, game, 'ship', 'Vulcan', pos, [
            'Vulcan',
            'VulcanThrust',
            'VulcanL',
            'VulcanR',
            'Explosion'
        ], level) || this;
        _this.angularAcceleration = 0.3;
        _this.throttle = 640;
        _this.pObject.body.mass = 12;
        return _this;
    }
    return Vulcan;
}(Ship));
exports.Vulcan = Vulcan;

},{"./object":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextDisplay = (function () {
    function TextDisplay(element, text, onDone) {
        var _this = this;
        this.skip = false;
        this.typeWriter = function (text, i, fnCallback) {
            _this.fnCall = fnCallback;
            _this.betweenTimeout = -1;
            // check if text isn't finished yet
            if (i < (text.length)) {
                // add next character to h1
                _this.element.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
                // wait for a while and call this function again for next character
                if (!_this.skip) {
                    setTimeout(function () {
                        _this.typeWriter(text, i + 1, fnCallback);
                    }, (Math.random() * (60 - 30) + 30).toFixed(0));
                }
                else {
                    _this.typeWriter(text, i + 1, fnCallback);
                }
            }
            else if (typeof fnCallback == 'function') {
                // call callback after timeout
                _this.betweenTimeout = setTimeout(fnCallback, 1800);
            }
        };
        this.done = false;
        this.start = function (i) {
            if (i === void 0) { i = 0; }
            if (typeof _this.text[i] == 'undefined') {
                if (!_this.done) {
                    _this.done = true;
                    _this.onDone();
                }
                return;
            }
            if (i < _this.text[i].length) {
                // text exists! start typewriter animation
                _this.typeWriter(_this.text[i], 0, function () {
                    // after callback (and whole text has been animated), start next text
                    _this.skip = false;
                    _this.start(i + 1);
                });
            }
        };
        this.text = text;
        this.onDone = onDone;
        this.element = element;
        document.querySelector(".scene.scene1").addEventListener("click", function () {
            _this.skip = true;
            if (_this.betweenTimeout != -1) {
                clearTimeout(_this.betweenTimeout);
                _this.fnCall();
            }
        });
    }
    return TextDisplay;
}());
exports.TextDisplay = TextDisplay;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIController = (function () {
    function UIController() {
        var _this = this;
        this.UIElements = [];
        this.setPlanet = function (x) {
            $('#planet').attr('src', 'resources/planets/{0}.png'.format(x));
        };
        this.setElement = function (index, value) {
            $(_this.UIElements[index])
                .children('.bar')
                .children('span')
                .css('width', value.toString() + '%');
            $(_this.UIElements[index]).children('span').text(Math.abs(value.toFixed(0)));
            if (value > 60) {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('emergency')
                    .removeClass('out');
            }
            else if (value < 60 && value > 20) {
                $(_this.UIElements[index])
                    .removeClass('emergency')
                    .removeClass('out');
                $(_this.UIElements[index])
                    .addClass('warning');
            }
            else if (value > 0) {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('out');
                $(_this.UIElements[index])
                    .addClass('emergency');
            }
            else {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('emergency');
                $(_this.UIElements[index])
                    .addClass('out');
            }
        };
        this.UIElements = document.querySelectorAll('.ui-ob');
    }
    return UIController;
}());
exports.UIController = UIController;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function find(a, b) {
    for (var i = 0; i != b.length; i++) {
        if (b[i] == a) {
            return i;
        }
    }
    return -1;
}
exports.find = find;
String.prototype.format = function () {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    var args = _args;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number] : match;
    });
};
Array.prototype.indexOf || (Array.prototype.indexOf = function (d, e) {
    var a;
    if (null == this)
        throw new TypeError('"this" is null or not defined');
    var c = Object(this), b = c.length >>> 0;
    if (0 === b)
        return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b)
        return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d)
            return a;
        a++;
    }
    return -1;
});
function error(message) {
    try {
        throw new Error(message);
    }
    catch (e) {
        console.error(e.message);
    }
}
exports.error = error;
function move(el, src, desc) {
    var b = el;
    var index = src.indexOf(el);
    if (index != -1) {
        src.splice(index, 1);
    }
    desc.push(b);
}
exports.move = move;
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomArbitrary = getRandomArbitrary;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("./type");
var Wrapper = (function () {
    function Wrapper(game, scene_text) {
        var _this = this;
        this.scenes = [];
        this.order = [
            // 0: level
            // 1: TextScene
            // 2: Open Mission Control
            1,
            0,
            2,
            0
            //0
        ];
        this.currentTotal = 0;
        this.currentText = 0;
        this.textDone = function () {
            _this.handleNext();
        };
        this.game = game;
        scene_text.forEach(function (element) {
            _this.scenes.push(new type_1.TextDisplay($('.buf.anim-typewriter').get(0), element, _this.textDone));
            _this.game.levelsequence.current = 0;
        });
        this.game.wrapper = this;
    }
    Wrapper.prototype.handleNext = function (t) {
        if (t === void 0) { t = false; }
        if (this.order[this.currentTotal] == 2) {
            this.game.openMissionControl();
        }
        else if (this.order[this.currentTotal] == 1) {
            $('.scene-wrapper').removeClass('title');
            $('.scene-wrapper').removeClass('game');
            $('.scene-wrapper').addClass('text');
            this.scenes[this.currentText].start();
            this.currentText++;
        }
        else {
            if (!this.game.isLoaded) {
                return;
            }
            $('.scene-wrapper').removeClass('title');
            $('.scene-wrapper').removeClass('text');
            $('.scene-wrapper').addClass('game');
            this.game.show();
            this.game.levelsequence.nextLevel(t);
        }
        this.currentTotal++;
    };
    return Wrapper;
}());
exports.Wrapper = Wrapper;

},{"./type":10}]},{},[2,3,4,5,6,7,8,9,10,11,12,13]);
