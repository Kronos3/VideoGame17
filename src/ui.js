"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIController = (function () {
    function UIController() {
        var _this = this;
        this.UIElements = [];
        this.setElement = function (index, value) {
            $(_this.UIElements[index])
                .children('.bar')
                .children('span')
                .css('width', value.toString() + '%');
            $(_this.UIElements[index]).children('span').text(value.toFixed(0));
        };
        this.UIElements = document.querySelectorAll('.ui-ob');
    }
    return UIController;
}());
exports.UIController = UIController;
