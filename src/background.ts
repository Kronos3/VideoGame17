/*export class Task {
    fn: () => void;
    repeat: boolean;
    interval: number;
    timer: NodeJS.Timer;
    constructor (fn: () => void, repeat = true, interval = 60) {
        this.fn = fn;
        this.repeat = repeat;
        this.interval =interval;
    }

    start () {
        if (this.repeat) {
            this.timer = setInterval (this.fn, this.interval);
        }
        else {
            this.timer = setTimeout (this.fn, 0);
        }
    }

    end () {
        clearInterval (this.timer);
    }
}*/