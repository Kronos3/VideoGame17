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
        console.error(e.message);
    }
}
exports.error = error;
