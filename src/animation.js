"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animation = (function () {
    function Animation(obj, animationAssets, callback, interval, intervalAfter) {
        if (interval === void 0) { interval = 50; }
        if (intervalAfter === void 0) { intervalAfter = 300; }
        var _this = this;
        this.run = function () {
            _this.parent.game.game.time.events.add(_this.interval, _this.setFrame, _this);
        };
        this.setFrame = function () {
            _this.parent.switchTo(_this.animationAssets[_this.current]);
            _this.current++;
            if (_this.current > _this.animationAssets.length) {
                _this.parent.game.game.time.events.add(_this.intervalAfter, _this.callback, _this);
                _this.current = 0;
            }
            else {
                _this.parent.game.game.time.events.add(_this.interval, _this.setFrame, _this);
            }
        };
        this.parent = obj;
        this.animationAssets = animationAssets;
        this.interval = interval;
        this.intervalAfter = intervalAfter;
        this.current = 0;
        this.callback = callback;
    }
    return Animation;
}());
exports.Animation = Animation;
