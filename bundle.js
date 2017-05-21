(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../imports/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ControlScheme = (function () {
    function ControlScheme(game, _bindings, captureInput, enabled) {
        if (captureInput === void 0) { captureInput = true; }
        if (enabled === void 0) { enabled = true; }
        this.bindings = [];
        this.game = game;
        this.captureInput = captureInput;
        for (var i = 0; i != _bindings.length; i++) {
            this.bindings.push(_bindings[i]);
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
        this.bindings.push(binding);
    };
    return ControlScheme;
}());
exports.ControlScheme = ControlScheme;

},{}],2:[function(require,module,exports){
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
            _this.game.load.physics('physicsData', '../resources/physics/mappings.json');
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
            _this.onReady(_this);
            _this.game.time.advancedTiming = true;
            _this.game.time.desiredFps = 60;
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
        this.render = function () {
            _this.game.debug.text('render FPS: ' + (_this.game.time.fps || '--'), 2, 14, "#00ff00");
            if (_this.game.time.suggestedFps !== null) {
                _this.game.debug.text('suggested FPS: ' + _this.game.time.suggestedFps, 2, 28, "#00ff00");
                _this.game.debug.text('desired FPS: ' + _this.game.time.desiredFps, 2, 42, "#00ff00");
            }
            _this.game.debug.text(_this.getLevel('global').getObject('Artemis').pObject.body.velocity.y, 2, 56, "#00ff00");
            _this.game.debug.text(_this.getLevel('global').getObject('Artemis').pObject.body.velocity.x, 2, 70, "#00ff00");
        };
        this.resize = function () {
            var height = $(window).height();
            var width = $(window).width();
            _this.game.width = width;
            _this.game.height = height;
            _this.game.renderer.resize(width, height);
            _this.levelsequence.levels.forEach(function (element) {
                element.resetPositions();
            });
        };
        this.newLevel = function (name) {
            var level = new level_2.Level(_this, name);
            _this.levelsequence.addLevel(level);
            return level;
        };
        this.getLevel = function (name) {
            return _this.levelsequence.getLevel(name);
        };
        this.loadAsset = function (name, path) {
            /*console.log (name + ':' + path)
            this.game.load.image (name, path);*/
        };
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: this.preload, create: this.create, update: this.update, render: this.render }, true);
        $(window).resize(function () {
            _this.resize();
        });
        this.newLevel('global');
        this.onReady = onReady;
    }
    MainGame.prototype.addLevel = function (l) {
        if (l instanceof level_2.Level) {
            this.levelsequence.addLevel(l);
        }
        else {
            this.levelsequence.addLevel(level_3.createLevel(l));
        }
    };
    MainGame.prototype.setGravity = function (value, restitution) {
        if (restitution === void 0) { restitution = 0.8; }
        this.gravity = value;
        this.game.physics.p2.restitution = restitution;
    };
    return MainGame;
}());
exports.MainGame = MainGame;

},{"./control":1,"./level":3}],3:[function(require,module,exports){
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
        ;
    }
    return LevelSequence;
}());
exports.LevelSequence = LevelSequence;
function createLevel(_const) {
    var out = new Level(_const.game, _const.name);
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
    function Level(game, name) {
        var _this = this;
        this.objects = [];
        this.enable = function () {
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
    }
    return Level;
}());
exports.Level = Level;

},{"./object":5,"./util":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var ship_1 = require("./ship");
var ship_2 = require("./ship");
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
    var testControlBindings = [
        {
            key: Phaser.Keyboard.SPACEBAR,
            callback: function () {
                console.log('pressed space');
            }
        },
        {
            key: Phaser.Keyboard.SHIFT,
            callback: function () {
                console.log('pressed shift');
            }
        }
    ];
    game.addControlScheme(testControlBindings);
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
                    name: "sky",
                    assets: "Sky",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.height - 820; }
                    }
                },
                {
                    name: "mountains",
                    assets: "Mountain-E",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.height - 520; }
                    }
                },
                {
                    name: 'backdrop',
                    assets: "Fore",
                    position: {
                        x: function () { return 0; },
                        y: function () { return window.GAME.game.height - 120; }
                    }
                },
                {
                    name: "Launch-L",
                    assets: "Launch-L",
                    physics: "Launch-L",
                    static: true,
                    position: {
                        x: function () { return window.GAME.game.width / 2; },
                        y: function () { return window.GAME.game.height - 120; }
                    }
                },
            ]
        }
    ];
    for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
        var iter = levels_1[_i];
        game.addLevel(iter);
    }
    var artemis_pos = {
        x: function () { return window.GAME.game.width / 2 + 70; },
        y: function () { return window.GAME.game.height - 60; },
    };
    game.getLevel('global').addObject(new ship_2.Ship(game, 'Artemis', artemis_pos, [
        'rocket',
        'rocket-thrust',
        'rocket-L-L',
        'rocket-L-R'
    ]));
    game.controls[0].addBinding(ship_1.ShipBinding(game, game.getLevel('global').getObject('Artemis')));
    game.setGravity(100, 0.1);
    game.show();
}

},{"./game":2,"./ship":6}],5:[function(require,module,exports){
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
            console.log(_this.pObject.body);
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

},{"./util":7}],6:[function(require,module,exports){
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
    };
};
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(game, name, pos, assets) {
        var _this = _super.call(this, game, game.levelsequence.getLevel('global'), name, pos, assets, { angularRot: 0, SAS: false, thrustOn: false, inSpace: false }) || this;
        _this.thrust = function (newtons) {
            var BODY = _this.pObject.body;
            var relative_thrust = newtons; // Dont subtract newtons (done in postframe)
            var magnitude = BODY.world.pxmi(-relative_thrust);
            var angle = BODY.data.angle + Math.PI / 2;
            BODY.velocity.x -= magnitude * Math.cos(angle);
            BODY.velocity.y -= magnitude * Math.sin(angle);
        };
        _this.engineOn = function () {
            _this.switchTo('rocket-thrust');
            // Rocket weighs 200
            _this.thrust(270);
            _this.extra.thrustOn = true;
        };
        // Turn right using RCS (reaction control system)
        _this.rightRCS = function () {
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(0.7, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo('rocket-L-L');
        };
        _this.leftRCS = function () {
            var angularVelocity = function () { return _this.pObject.body.angularVelocity / 0.05; }; // Convert to correct unit
            var tempVel = _this.calculate_velocity(-0.7, angularVelocity);
            _this.pObject.body.rotateRight(tempVel);
            _this.extra.angularRot = tempVel;
            _this.switchTo('rocket-L-R');
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
            _this.switchTo('rocket');
        };
        _this.postframe = function () {
            if (_this.extra.SAS && !_this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && _this.game.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                _this.SAS();
            }
            if (_this.extra.inSpace) {
                _this.pObject.body.applyDamping(0);
                //this.pObject.body.rotateRight ((<any>this.extra).angularRot);
            }
            else {
                _this.pObject.body.applyDamping(0.001);
            }
            _this.extra.thrustOn = false;
            _this.gravityAction();
        };
        _this.gravityAction = function () {
            var BODY = _this.pObject.body;
            var relative_thrust = -(_this.game.gravity * _this.pObject.body.mass); // Dont subtract newtons (done in postframe)
            var magnitude = BODY.world.pxmi(-relative_thrust);
            var angle = BODY.data.angle + Math.PI / 2;
            BODY.velocity.y -= relative_thrust / 100;
        };
        _this.calculate_velocity = function (acceleration, initialVel) {
            return acceleration + initialVel();
        };
        _this.enablePhysics();
        _this.pObject.body.mass = 5;
        _this.loadBody('Rocket-L');
        return _this;
    }
    return Ship;
}(object_1.DynamicSprite));
exports.Ship = Ship;

},{"./object":5}],7:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,7]);
