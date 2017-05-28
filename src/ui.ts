/// <reference path="../imports/phaser.d.ts" />
/// <reference path="../imports/p2.d.ts" />
import {MainGame} from "./game"

export class UIController {
    UIElements : Element[] = [];
    
    constructor () {
        this.UIElements = <any>document.querySelectorAll('.ui-ob');
    }

    setElement = (index:number, value: number) => {
        $(this.UIElements[index])
            .children('.bar')
            .children ('span')
            .css ('width', value.toString() + '%');
        $(this.UIElements[index]).children('span').text(Math.abs(<any>value.toFixed(0)));
        if (value > 60) {
            $(this.UIElements[index])
                .removeClass ('warning')
                .removeClass ('emergency')
                .removeClass ('out');
        }
        else if (value < 60 && value > 20) {
            $(this.UIElements[index])
                .removeClass ('emergency')
                .removeClass ('out');
            $(this.UIElements[index])
                .addClass ('warning');
        }
        else if (value > 0) {
            $(this.UIElements[index])
                .removeClass ('warning')
                .removeClass ('out');
            $(this.UIElements[index])
                .addClass ('emergency');
        }
        else {
            $(this.UIElements[index])
                .removeClass ('warning')
                .removeClass ('emergency');
            $(this.UIElements[index])
                .addClass ('out');
        }
    }
}