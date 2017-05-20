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

export function error (message: string) {
    try {
        throw new Error (message);
    }
    catch (e) {
        console.log (e.name, + ': ' + e.message);
    }
}