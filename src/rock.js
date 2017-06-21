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
var object_1 = require("./object");
var Rock = (function (_super) {
    __extends(Rock, _super);
    function Rock(game, l, name, asset, pos) {
        var _this = _super.call(this, game, l, name, pos, asset) || this;
        _this.collide = function (target, this_target, shapeA, shapeB, contactEquation) {
            var target_id = _this.level.getObject('rover').frontWheel.body.id;
            if (shapeB.body.id == target_id) {
                var b = _this.game.gravityObjects.indexOf(_this);
                if (b > -1) {
                    _this.game.gravityObjects.splice(b, 1);
                }
                else {
                    return;
                }
                _this.pObject.body.clearCollision();
                _this.pObject.visible = false;
                _this.level.getObject('rover').rockNumber++;
                $('#rocknum > span').text(_this.level.getObject('rover').rockNumber);
            }
        };
        switch (asset) {
            case 'rock1':
                _this.bodyName = "IO Rock";
                break;
            case 'rock2':
                _this.bodyName = "IO Rock_02";
                break;
        }
        _this.loadBody(_this.bodyName);
        _this.pObject.body.onBeginContact.add(_this.collide, _this);
        _this.appendToLevel();
        _this.game.addGravity(_this);
        _this.pObject.body.setMaterial(_this.level.getObject('rover').wheelMaterial);
        _this.pObject.body.mass = 3;
        return _this;
    }
    return Rock;
}(object_1.GameSprite));
exports.Rock = Rock;
