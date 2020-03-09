// Global Extensions:
declare global {
    interface Array<T> {
        unique(): Array<T>
        mut_unique(): Array<T>
        mut_map(f: (T) => any): Array<any>
    }
    interface String {
        squeeze(): string
        capitalize(): string
    }
    interface Number {
        round_to(dp: number): number
    }

}

// Array Extensions:
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
String.prototype.squeeze = function () {
    return this.split(/[ ]+/).join(' ');
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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
