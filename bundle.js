(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
            _this.game.load.image('rocket', '../resources/textures/player/Rocket-L.png');
            _this.game.load.image('rocket-thrust', '../resources/textures/player/Rocket-L-T.png');
            _this.game.load.image('rocket-L-L', '../resources/textures/player/Rocket-L-L.png');
            _this.game.load.image('rocket-L-R', '../resources/textures/player/Rocket-L-R.png');
            _this.game.load.image('Launch-L', '../resources/textures/Launch-L.png');
            _this.game.load.image('Fore', '../resources/textures/Foreground-L.png');
            _this.game.load.image('Mountain-E', '../resources/textures/BG_1-L.png');
            _this.game.load.image('Sky', '../resources/textures/Sky Gradient Color Overlay-L.png');
            _this.game.load.image('Back', '../resources/textures/Background-L.png');
            _this.game.load.image('Stars', '../resources/textures/stars.png');
            _this.game.load.image('Explosion', '../resources/textures/explosion.png');
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

},{"./control":2,"./level":4,"./ui":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
var object_2 = require("./object");
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
        this.nextLevel = function () {
            _this.current++;
            for (var i = 1; i != _this.levels.length; i++) {
                _this.levels[i].disable();
            }
            _this.levels[_this.current].enable();
            _this.levels[0].enable();
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
                OBJ = new object_1.GameSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra);
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
        this.frame = function () { return; };
        this.inited = false;
        this.enable = function () {
            _this.objects.forEach(function (element) {
                element.enable();
            });
            if (!_this.inited) {
                _this.init(_this);
                _this.inited = true;
            }
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
        this.frame = frame;
        this.init = init;
        this.done = done;
    }
    return Level;
}());
exports.Level = Level;

},{"./object":6,"./util":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
var wrapper_1 = require("./wrapper");
var background_1 = require("./background");
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
    initGame();
});
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
                var artemis_pos = {
                    x: function () { return window.GAME.game.world.width / 2 - 70; },
                    y: function () { return window.GAME.game.world.height - 60; },
                };
                ___this.addObject(new ship_2.Ship(window.GAME, 'Artemis', artemis_pos, [
                    'rocket',
                    'rocket-thrust',
                    'rocket-L-L',
                    'rocket-L-R',
                    'Explosion'
                ], ___this));
                window.GAME.addControlScheme([
                    ship_1.ShipBinding(window.GAME, ___this.getObject('Artemis')),
                    {
                        key: Phaser.KeyCode.R,
                        callback: function () {
                            ___this.getObject('Artemis').reset();
                        },
                        press: true
                    }
                ]);
                window.GAME.setGravity(100, 0.1);
                window.GAME.game.camera.follow(___this.getObject('Artemis').pObject);
            }
        }
    ];
    for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
        var iter = levels_1[_i];
        game.addLevel(iter);
    }
}

},{"./background":1,"./game":3,"./ship":7,"./wrapper":11}],6:[function(require,module,exports){
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
    function GameSprite(game, level, name, pos, asset, extra) {
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
            }
            _this.pObject.visible = false;
        };
        this.enable = function () {
            _this.pObject.visible = true;
            if (_this.pObject.body != null) {
                _this.pObject.body.static = _this.isStatic;
                _this.pObject.body.moves = true;
            }
        };
        this.level = level;
        this.name = name;
        this.game = game;
        this.asset = asset;
        this.extra = extra;
        this.pos = pos;
        this.pObject = this.game.game.add.sprite(this.pos.x(), this.pos.y(), this.asset);
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

},{"./util":10}],7:[function(require,module,exports){
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
    function Ship(game, name, pos, assets, level) {
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
        _this.reset = function () {
            _this.pObject.body.setZeroForce();
            _this.pObject.body.setZeroRotation();
            _this.pObject.body.setZeroVelocity();
            _this.pObject.body.x = _this.pos.x();
            _this.pObject.body.y = _this.pos.y();
            _this.pObject.body.rotation = 0;
            _this.isDead = false;
            _this.LFO = _this.maxLFO;
            _this.monoProp = _this.maxMono;
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
            var tempVel = _this.calculate_velocity(0.7, angularVelocity);
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
            var tempVel = _this.calculate_velocity(-0.7, angularVelocity);
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
            if (_this.extra.SAS && !_this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && _this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                _this.SAS();
            }
            _this.extra.thrustOn = false;
            _this.gravityAction();
            _this.setResources();
        };
        _this.gravityAction = function () {
            var BODY = _this.pObject.body;
            var relative_thrust = -(_this.game.gravity * _this.pObject.body.mass);
            BODY.velocity.y -= (relative_thrust / 100) * _this.game.get_ratio();
        };
        _this.calculate_velocity = function (acceleration, initialVel) {
            return (acceleration * _this.game.get_ratio()) + initialVel();
        };
        _this.addBooster = function (booster) {
            _this.booster = booster;
            //this.game.game.physics.p2.createPrismaticConstraint (
            //
            //)
        };
        _this.enablePhysics();
        _this.pObject.body.mass = 5;
        _this.loadBody('Rocket-L');
        _this.startAlt = _this.pObject.body.y;
        return _this;
        //this.pObject.body.onBeginContact.add(this.collide, this);
    }
    return Ship;
}(object_1.DynamicSprite));
exports.Ship = Ship;
var Booster = (function (_super) {
    __extends(Booster, _super);
    function Booster(game, level, name, pos, assets) {
        var _this = _super.call(this, game, name, pos, assets, level) || this;
        _this.attached = true;
        return _this;
    }
    return Booster;
}(Ship));
exports.Booster = Booster;

},{"./object":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIController = (function () {
    function UIController() {
        var _this = this;
        this.UIElements = [];
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

},{}],10:[function(require,module,exports){
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
function error(message) {
    try {
        throw new Error(message);
    }
    catch (e) {
        console.log(e.name, +': ' + e.message);
    }
}
exports.error = error;

},{}],11:[function(require,module,exports){
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
            0,
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
    Wrapper.prototype.handleNext = function () {
        if (this.order[this.currentTotal]) {
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
            this.game.levelsequence.nextLevel();
        }
        this.currentTotal++;
    };
    return Wrapper;
}());
exports.Wrapper = Wrapper;

},{"./type":8}]},{},[2,3,4,5,6,7,8,10,11]);
