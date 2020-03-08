// Array Extensions:
interface Array<T> {
    unique() : Array<T>
    mut_unique(): Array<T>
    mut_map(f : (T) => any) : Array<any>
}

Array.prototype.unique = function () {
    return this.filter((e, i) => this.indexOf(e) === i)
}

Array.prototype.mut_unique = function () {
    const uniq = this.unique();
    Object.assign(this, uniq);
    this.splice(uniq.length);
    return this;
}

Array.prototype.mut_map = function (f) {
    for (const i in this) {
        this[i] = f(this[i]);
    }
    return this;
}

// String Extensions:
interface String {
    squeeze() : string
}

String.prototype.squeeze = function () {
    return this.split(/[ ]+/).join(' ');
};


// Number Extensions:
interface Number {
    round_to(dp : number) : number
}

Number.prototype.round_to = function (dp : number) {
    const exp = 10 ** dp;
    return Math.round(this.valueOf() * exp) / exp;
};
