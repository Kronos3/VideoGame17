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
            $(_this.UIElements[index]).children('span').text(Math.abs(value.toFixed(0)));
            if (value > 60) {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('emergency');
            }
            else if (value < 60 && value > 20) {
                $(_this.UIElements[index])
                    .removeClass('emergency');
                $(_this.UIElements[index])
                    .addClass('warning');
            }
            else {
                $(_this.UIElements[index])
                    .removeClass('warning');
                $(_this.UIElements[index])
                    .addClass('emergency');
            }
        };
        this.UIElements = document.querySelectorAll('.ui-ob');
    }
    return UIController;
}());
exports.UIController = UIController;
