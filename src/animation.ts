import {Ship} from "./ship"

export class Animation {
    parent: Ship;
    animationAssets: string[];
    interval: number;
    current: number;
    intervalAfter: number;
    callback: () => void;
    constructor (obj: Ship, animationAssets: string[], callback: () => void, interval = 50, intervalAfter = 300) {
        this.parent = obj;
        this.animationAssets = animationAssets;
        this.interval = interval;
        this.intervalAfter = intervalAfter;
        this.current = 0;
        this.callback = callback;
    }

    run = () => {
        this.parent.game.game.time.events.add(this.interval, this.setFrame, this);
    }

    setFrame = () => {
        this.parent.switchTo (this.animationAssets[this.current]);
        this.current++;
        if (this.current > this.animationAssets.length) {
            this.parent.game.game.time.events.add(this.intervalAfter, this.callback, this);
            this.current = 0;
        }
        else {
            this.parent.game.game.time.events.add(this.interval, this.setFrame, this);
        }
    }
}