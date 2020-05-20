import { SimpOMatic } from './main';

// Global Extensions:
declare global {
	type HomeScope = {
		message: Message, args: string[],
		HELP_SOURCE: string, HELP_KEY: string,
		GIT_URL: string, HELP_MESSAGES: string[],
		HELP_SECTIONS: string[] , ALL_HELP: string[],
		CONFIG: Types.Config, SECRETS: any, KNOWN_COMMANDS: string[],
		expand_alias: (operator: string, args: string[], message: Message) => string,
		main: SimpOMatic;
	};

	namespace Types {
		export type Match = {
			match: string | RegExp,
			response: string,
			listens?: string[]
		};

		export type Ignore = {
			commands?: boolean,
			commands_elevated?: boolean,
			speech?: boolean
		};

		type Config = {
			main_channel: string,
			system_channel: string,
			pp_sizes: { [key: string]: number }
			cron_jobs: any[],
			cron_interval: number;
			weather_locations: { [key: string]: string },
			commands: {
				prefix: string,
				max_history: number,
				not_understood: string,
				aliases: { [key: string]: string },
			}
			rules: {
				respond: Match[],
				reject:  Match[],
				replace: Match[],
				trigger: Match[],
				blacklist: {
					channels: string[],
					users: {
						[key: string]: Ignore
					},
					groups: {
						[key: string]: Ignore
					}
				},
				whitelist: {
					users: string[],
					groups: string[]
				}
			}
		};

		type GlobalConfig = {
			name: string,
			tag: string,
			permissions: number,
			lang: 'en' | 'en-us' | 'en-gb',
			guilds: { [key: string]: Config }
		};
	}

	interface Array<T> {
		head(): T;
		tail(): T[];
		first(): T;
		last(off? : number | undefined): T;
		get(i : number): T;
		unique(): T[];
		squeeze(): T[];
		each(callbackfn : (value : T, index : number, array : T[]) => void, thisArg? : T): void;
		mut_unique(): T[];
		mut_map(f: (T) => any): any[];
		choose(): T;
	}

	interface TextFormat {
		italics: string;
		bold: string;
		bold_italics: string;
		underline: string;
		underline_italics: string;
		underline_bold: string;
		underline_bold_italics: string;
		strikethrough: string;
		block: string;
		code_block: string;
		block_quote: string;
		multiline_block_quote: string;
		hidden: string;
	}

	interface String {
		squeeze(): string;
		capitalize(): string;
		leading_space(): string;
		head(): string;
		tail(): string;
		first(): string;
		last(off? : number): string;
		format(fmt: string, code_block_lang?: string): string;
		emojify(): string;
		shorten(width?: number): string;
		lines(): string[];
	}

	interface Number {
		round_to(dp: number): number;
		to_extension(figures, ext): string;
		to_metric(figures): string;
		to_abbrev(figures): string;
		truncate(): number;
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

Array.prototype.get = function (i) { return this[i]; };

Array.prototype.unique = function () {
	return this.filter((e, i) => this.indexOf(e) === i);
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
	for (const i in this)
		if (this.hasOwnProperty(i) && i !== 'length')
			this[i] = f(this[i]);
	return this;
};

Array.prototype.choose = function () {
	// Math.random gives a value in the range [0;1).
	return this[Math.floor(Math.random() * this.length)];
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

String.prototype.emojify = function () { return `:${this}:`; };

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

String.prototype.format = function (fmt: string, code_block_lang?: string) {
    return `${fmt}${code_block_lang ? code_block_lang + "\n" : ''}${this.toString()}${fmt}`;
};

String.prototype.shorten = function (width=40) {
	if (this.length <= width) return String(this);
	return this.slice(0, width - 3) + '...';
};

String.prototype.lines = function () {
	return this
		.replace(/\n/g, '\n<-|LINE|->')
		.split('<-|LINE|->');
};

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

const NORMIE_EXTENSIONS = [
	{ value: 1, symbol: "" },
	{ value: 1E3, symbol: "K" },
	{ value: 1E6, symbol: "M" },
	{ value: 1E9, symbol: "B" },
	{ value: 1E12, symbol: "t" },
	{ value: 1E15, symbol: "q" },
	{ value: 1E18, symbol: "Q" }
];

Number.prototype.to_extension = function (figures, ext) {
	let i = ext.length - 1;
	for (; i > 0; --i)
		if (this >= ext[i].value)
			break;

	return (this.valueOf() / ext[i].value)
		.toFixed(figures)
		.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1")
		+ ext[i].symbol;
};

Number.prototype.to_metric = function (figures) {
	return this.to_extension(figures, SI_EXTENSIONS);
};

Number.prototype.to_abbrev = function (figures) {
	return this.to_extension(figures, NORMIE_EXTENSIONS);
};

Number.prototype.truncate = function() {
	return this.valueOf() - (this.valueOf() % 1);
};

// Discord Extensions:

declare module 'discord.js' {
	interface Message {
		answer(...args: any): void;
	}
}
import { Message } from 'discord.js';

Message.prototype.answer = function (...args) {
	return this.channel.send(`${this.author}, ${args[0]}`,
		...(args.slice(1)));
};
