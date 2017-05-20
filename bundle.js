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
            if (typeof this.bindings[iter].press == "undefined") {
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
var object_1 = require("./object");
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
        this.loadAsset('rocket', 'resources/textures/player/Rocket-L.png');
        this.loadAsset('rocket-thrust', 'resources/textures/player/Rocket-L-T.png');
        this.loadAsset('rocket-L-L', 'resources/textures/player/Rocket-L-L.png');
        this.loadAsset('rocket-L-R', 'resources/textures/player/Rocket-L-R.png');
    };
    MainGame.prototype.hide = function () {
        $('#canvas-wrapper').css('display', "none");
    };
    MainGame.prototype.show = function () {
        $('#canvas-wrapper').css('display', "block");
    };
    MainGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var mainCanvas = $(this.game.canvas);
        $('#canvas-wrapper').append(mainCanvas);
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
    MainGame.prototype.loadAsset = function (name, path) {
        this.game.load.image(name, path);
        this.assets.push({ path: path, name: name });
    };
    MainGame.prototype.addObjectFromAsset = function (assetName, extra) {
        this.objects.push(new object_1.GameSprite(this, assetName, extra));
    };
    MainGame.prototype.newObject = function (name, path, extra) {
        this.loadAsset(name, path);
    };
    return MainGame;
}());
exports.MainGame = MainGame;

},{"./control":1,"./object":4}],3:[function(require,module,exports){
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

},{"./game":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameSprite = (function () {
    function GameSprite(game, asset, extra) {
        this.game = game;
        this.assetName = asset;
        this.extra = $.extend({}, this.extra, external);
        this.pObject = this.game.game.add.sprite(0, 0, this.assetName);
    }
    GameSprite.prototype.addProperty = function (extra) {
        this.extra = $.extend({}, this.extra, external);
    };
    GameSprite.prototype.enablePhysics = function () {
        this.game.game.physics.p2.enable(this.pObject);
    };
    return GameSprite;
}());
exports.GameSprite = GameSprite;

},{}]},{},[1,2,3]);
