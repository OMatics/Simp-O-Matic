// String Utils:

String.prototype.squeeze = function () {
    return this.split(/\s+/).join(' ');
};

interface String {
    squeeze() : string
}


// Number Utils:
Number.prototype.round_to = function (dp : number) {
    const exp = 10 ** dp;
    return Math.round(this.valueOf() * exp) / exp;
}

interface Number {
    round_to(dp : number) : number
}
