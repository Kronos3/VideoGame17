export function find (a: any, b: any[]): number {
    for (var i=0; i != b.length; i++){
        if (b[i] == a) {
            return i;
        }
    }
    return -1;
}


declare global {
    interface String {
        format(..._args: any[]): string;
    }
}

String.prototype.format = function(..._args: any[]) {
    var args = _args;
    return this.replace(/{(\d+)}/g, (match, number) => { 
        return typeof args[number] != 'undefined'
        ? args[number]: match;
    });
}


Array.prototype.indexOf || (Array.prototype.indexOf = function(d, e) {
    var a;
    if (null == this) throw new TypeError('"this" is null or not defined');
    var c = Object(this),
        b = c.length >>> 0;
    if (0 === b) return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b) return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d) return a;
        a++
    }
    return -1
});

export function error (message: string) {
    try {
        throw new Error (message);
    }
    catch (e) {
        console.error (e.message);
    }
}

export function move (el, src:Array<any>, desc: Array<any>) {
    var b = el;
    var index = src.indexOf (el);
    if (index != -1) {
        src.splice (index, 1);
    }
    desc.push (b);
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}