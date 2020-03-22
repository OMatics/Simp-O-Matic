// From here: https://github.com/Demonstrandum/boomer/blob/master/boomerfy.js

declare global {
	interface Array<T> {
		demented_join(sep: string, sep_alt: string, prob: number): string;
	}
	interface String {
		demented_upcase(prob: number): string;
		demented_spelling(): string;
	}
}

Array.prototype.demented_join = function (sep = ', ', sep_alt = ' ', prob = 0.2) {
	let s = "";
	let sep_temp = "";
	for (const e of this) {
		if (!e) continue;

		const l_space = Math.random() < prob ? sep_alt : '';
		const r_space = Math.random() < prob ? sep_alt : '';
		const elem = `${l_space}${e}${r_space}`;
		s += `${sep_temp}${elem}`;
		sep_temp = sep;
	}
	return s;
};

String.prototype.demented_upcase = function (prob = 0.2) {
	if (Math.random() < prob)
		return this.toUpperCase() + ((Math.random() < 0.1) ? '!' : '');
	else return this.toString();
};

String.prototype.demented_spelling = function () {
	const given = String(this);
	switch (given) {
		case 'than':
			return 'then';
		case 'then':
			return 'than';
		case 'your':
			return 'yore';
		case 'their':
			return 'there';
		case 'they\'re':
			return 'their';
		case 'there':
			return 'their';
		default:
			break;
	}
	return given;
};

const boomerfy = (original: string): string => {
	if (original.trim().length < 1)
		return boomerfy("Ok, boomer.");

	let string = original
		.toLowerCase()
		.split(' ')
		.map(e => e.demented_spelling()).join(' ')
		.replace(/(.*)n't(.*)/g, "$1'nt$2")
		.replace(/(.*)'re(.*)/, '$1r$2')
		.replace(/([^\.])\./g, '$1 .');

	string = string.split(/[ ]/)
		.map(s => s.demented_upcase(0.1))
		.demented_join(' ', ',', 0.01);
	string = string.split(/[ ]/).demented_join(' ', ' ... ', 0.01);
	string = string.split(/[ ]/).demented_join(' ', ' ', 0.02);

	string = string
		.replace(/,/g, ' ,');
	return string;
};

export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.channel.send(boomerfy(args.join(' ')));
};
