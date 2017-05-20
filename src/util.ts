export function find (a: any, b: any[]): number {
    for (var i=0; i != b.length; i++){
        if (b[i] == a) {
            return i;
        }
    }
    return -1;
}