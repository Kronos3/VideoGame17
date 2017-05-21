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
        this.newLevel = function (name) {
            var level = new level_2.Level(_this, name);
            _this.levelsequence.addLevel(level);
            return level;
        };
        this.getAsset = function (name) {
            for (var _i = 0, _a = _this.assets; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.name == name) {
                    return i;
                }
            }
            UTIL.error('Asset {0} could not be found'.format(name));
            return null;
        };
        this.loadAsset = function (name, path) {
            for (var _i = 0, _a = _this.assets; _i < _a.length; _i++) {
                var iter = _a[_i];
                if (iter.name == name) {
                    return;
                }
            }
            _this.game.load.image(name, path);
        };
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'T17', { preload: this.preload, create: this.create, update: this.update }, true);
        $(window).resize(function () {
            _this.resize();
        });
        this.newLevel('global');
    }
    return MainGame;
}());
exports.MainGame = MainGame;

},{"./control":1,"./level":3,"./util":6}],3:[function(require,module,exports){
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
            if (iter.assets instanceof Array) {
                // Dynamic Objects
                // Load the assets
                for (var _b = 0, _c = iter.assets; _b < _c.length; _b++) {
                    var asset_iter = _c[_b];
                    out.game.loadAsset(asset_iter.name, asset_iter.path);
                }
                // Generate the object
                out.addObject(new object_2.DynamicSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra));
            }
            else {
                // Static Object
                // Load the asset
                out.game.loadAsset(iter.assets.name, iter.assets.path);
                // Add the object
                out.addObject(new object_1.GameSprite(out.game, out, iter.name, iter.position, iter.assets, iter.extra));
            }
        }
    }
}
exports.createLevel = createLevel;
var Level = (function () {
    function Level(game, name) {
        var _this = this;
        this.objects = [];
        this.enable = function () {
        };
        this.addObjectFromAsset = function (name, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
            if (UTIL.find(name, _this.game.assets) != -1) {
                _this.objects.push(new object_1.GameSprite(_this.game, _this, name, _pos, _this.game.assets[UTIL.find(name, _this.game.assets)], extra));
            }
            else {
                UTIL.error('Asset {0} has not been preloaded, use newObject()'.format(name));
            }
        };
        this.newObject = function (name, path, _pos, extra) {
            if (_pos === void 0) { _pos = { x: 0, y: 0 }; }
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
        this.game = game;
        this.name = name;
    }
    Level.prototype.addObject = function (obj) {
        this.objects.push(obj);
    };
    return Level;
}());
exports.Level = Level;

},{"./object":5,"./util":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
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
function initGame() {
    game = new game_1.MainGame();
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

},{"./game":2}],5:[function(require,module,exports){
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
        this.addProperty = function (extra) {
            _this.extra = $.extend({}, _this.extra, external);
        };
        this.enablePhysics = function () {
            _this.level.game.game.physics.p2.enable(_this.pObject);
        };
        this.level = level;
        this.name = name;
        this.game = game;
        if (typeof asset !== "string") {
            this.asset = asset;
        }
        else {
            this.game.getAsset(asset);
        }
        this.extra = $.extend({}, this.extra, external);
        this.pObject = this.game.game.add.sprite(pos.x, pos.y, this.asset.name);
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
            _this.pObject.key = _this.assets[index].name;
            _this.pObject.loadTexture(_this.pObject.key);
        };
        _this.switchTo = function (name) {
            if (UTIL.find(name, _this.assets) != -1) {
                _this.pObject.key = name;
                _this.pObject.loadTexture(_this.pObject.key);
            }
        };
        for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
            var iter = assets_1[_i];
            if (typeof iter === "string") {
                _this.assets.push(_this.game.getAsset(iter));
            }
            else {
                _this.assets.push(iter);
            }
        }
        return _this;
    }
    return DynamicSprite;
}(GameSprite));
exports.DynamicSprite = DynamicSprite;

},{"./util":6}],6:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6]);
