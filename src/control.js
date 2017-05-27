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
