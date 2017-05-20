export function find (a: any, b: any[]): number {
    for (var i=0; i != b.length; i++){
        if (b[i] == a) {
            return i;
        }
    }
    return -1;
}

export interface String {
    format: () => string;
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, (match, number) => { 
        return typeof args[number] != 'undefined'
        ? args[number]: match;
    });
}