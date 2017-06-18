"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextDisplay = (function () {
    function TextDisplay(element, text, onDone) {
        var _this = this;
        this.skip = false;
        this.handleClick = function () {
            _this.skip = true;
            if (_this.betweenTimeout != -1) {
                clearTimeout(_this.betweenTimeout);
                _this.fnCall();
            }
        };
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
            if (i == 0) {
                document.querySelector(".scene.scene1").addEventListener("click", _this.handleClick);
            }
            if (typeof _this.text[i] == 'undefined') {
                if (!_this.done) {
                    _this.done = true;
                    document.querySelector(".scene.scene1").removeEventListener("click", _this.handleClick);
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
    }
    return TextDisplay;
}());
exports.TextDisplay = TextDisplay;
