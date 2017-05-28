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
        $(this.UIElements[index]).children('span').text(<any>value.toFixed(0));
    }
}