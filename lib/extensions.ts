// Global Extensions:
declare global {
    interface Array<T> {
        head(): T
        tail(): Array<T>
        first(): T
        last(off? : number | undefined): T
        get(i : number): T
        unique(): Array<T>
        squeeze(): Array<T>
        each(callbackfn : (value : T, index : number, array : T[]) => void, thisArg? : T): void
        mut_unique(): Array<T>
        mut_map(f: (T) => any): Array<any>
    }

    interface String {
        squeeze(): string
        capitalize(): string
        leading_space(): string
        head(): string
        tail(): string
        first(): string
        last(off? : number): string
    }

    interface Number {
        round_to(dp: number): number
    }
}

// Array Extensions:
Array.prototype.head = function () {
    return this[0];
};

Array.prototype.first = Array.prototype.head;

Array.prototype.tail = function () {
    return this.slice(1);
};

Array.prototype.last = function (off=0) {
    return this[this.length - 1 - off];
};

Array.prototype.get = function (i) { return this[i] };

Array.prototype.unique = function () {
    return this.filter((e, i) => this.indexOf(e) === i)
};

Array.prototype.squeeze = function () { return this.filter(e => !!e); };

Array.prototype.each = Array.prototype.forEach;

Array.prototype.mut_unique = function () {
    const uniq = this.unique();
    Object.assign(this, uniq);
    this.splice(uniq.length);
    return this;
};

Array.prototype.mut_map = function (f) {
    for (const i in this) {
        this[i] = f(this[i]);
    }
    return this;
};

// String Extensions:
String.prototype.squeeze = function () {
    return this
        .replace(/[ ]+/g, ' ')
        .replace(/\n[ ]/g, '\n');
};

String.prototype.leading_space = function () {
    return this.replace(/\n[ ]([^ ]+)/g, '\n$1');
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.head = Array.prototype.head as any;
String.prototype.tail = Array.prototype.tail as any;
String.prototype.first = Array.prototype.first as any;
String.prototype.last = Array.prototype.last as any;

// Number Extensions:
Number.prototype.round_to = function (dp : number) {
    const exp = 10 ** dp;
    return Math.round(this.valueOf() * exp) / exp;
};

// Discord Extensions:

declare module 'discord.js' {
    interface Message {
        answer(...args: any): void
    }
}
import { Message } from 'discord.js';

Message.prototype.answer = function (...args) {
    return this.channel.send(`${this.author}, ${args[0]}`,
        ...(args.slice(1)));
};
