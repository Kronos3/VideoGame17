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
