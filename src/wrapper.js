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
            2
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
    Wrapper.prototype.handleNext = function () {
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
            this.game.levelsequence.nextLevel();
        }
        this.currentTotal++;
    };
    return Wrapper;
}());
exports.Wrapper = Wrapper;
