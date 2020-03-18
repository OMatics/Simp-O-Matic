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

    interface TextFormat {
        italics: string,
        bold: string,
        bold_italics: string,
        underline: string,
        underline_italics: string,
        underline_bold: string,
        underline_bold_italics: string,
        strikethrough: string,
        block: string,
        code_block: string,
        block_quote: string,
        multiline_block_quote: string,
        hidden: string,
    }

	interface String {
		squeeze(): string
		capitalize(): string
		leading_space(): string
		head(): string
		tail(): string
		first(): string
		last(off? : number): string
        format(fmt: string): string
	}

	interface Number {
		round_to(dp: number): number
		to_metric(figures): string
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
		.replace(/[\t ]+/g, ' ')
		.replace(/(\n)[\t ]([^\t ])/g, '$1$2');
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

export const FORMATS: TextFormat = {
    italics: '*',
    bold: '**',
    bold_italics: '***',
    underline: '__',
    underline_italics: '--*',
    underline_bold: '__**',
    underline_bold_italics: '__***',
    strikethrough: '~~',
    block: '`',
    code_block: '```',
    block_quote: '>',
    multiline_block_quote: '>>>',
    hidden: '||',
};

String.prototype.format = function (fmt: string) {
    return `${fmt}${this}${fmt}`;
}

// Number Extensions:
Number.prototype.round_to = function (dp : number) {
	const exp = 10 ** dp;
	return Math.round(this.valueOf() * exp) / exp;
};

const SI_EXTENSIONS = [
	{ value: 1, symbol: "" },
	{ value: 1E3, symbol: "k" },
	{ value: 1E6, symbol: "M" },
	{ value: 1E9, symbol: "G" },
	{ value: 1E12, symbol: "T" },
	{ value: 1E15, symbol: "P" },
	{ value: 1E18, symbol: "E" }
];

Number.prototype.to_metric = function (figures) {
	let i = SI_EXTENSIONS.length - 1;
	for (; i > 0; --i)
		if (this >= SI_EXTENSIONS[i].value)
			break;

	return (this.valueOf() / SI_EXTENSIONS[i].value)
		.toFixed(figures)
		.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1")
		+ SI_EXTENSIONS[i].symbol;
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
