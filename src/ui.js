"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var UIController = (function () {
    function UIController() {
        var _this = this;
        this.UIElements = [];
        this.setPlanet = function (x) {
            $('#planet').attr('src', 'resources/planets/{0}.png'.format(x));
        };
        this.setElement = function (index, value) {
            $(_this.UIElements[index])
                .children('.bar')
                .children('span')
                .css('width', value.toString() + '%');
            $(_this.UIElements[index]).children('span').text(Math.abs(value.toFixed(0)));
            if (value > 60) {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('emergency')
                    .removeClass('out');
            }
            else if (value < 60 && value > 20) {
                $(_this.UIElements[index])
                    .removeClass('emergency')
                    .removeClass('out');
                $(_this.UIElements[index])
                    .addClass('warning');
            }
            else if (value > 0) {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('out');
                $(_this.UIElements[index])
                    .addClass('emergency');
            }
            else {
                $(_this.UIElements[index])
                    .removeClass('warning')
                    .removeClass('emergency');
                $(_this.UIElements[index])
                    .addClass('out');
            }
        };
        this.UIElements = document.querySelectorAll('.ui-ob');
    }
    return UIController;
}());
exports.UIController = UIController;
