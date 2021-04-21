const noop = (..._) => undefined;
const ftoc = (n: number): [number, string] => [5/9 * (n - 32), "C"];
const ftom = (n: number): [number, string] => [0.3048 * n, "m"];

type Conversions = {
	[key: string]: (n: number) => [number, string]
};

const UNITS: Conversions = {
	"fahrenheit": ftoc,
	"inch": n => [2.54 * n, "cm"],
	"feet": ftom,
	"foot": ftom,
	"ft":   ftom,
	"mile": n => [1.609344 * n, "km"],
	"yard": n => [0.9144 * n, "m"],
	"yd":   n => [0.9144 * n, "m"],
	"acre": n => [4046.873 * n, "m^2"],
	"pint": n => [473.176 * n, "ml"],
	"fl oz":  n => [29.573 * n, " ml"],
	"quart":  n => [0.946 * n, "l"],
	"gallon": n => [3.785 * n, "l"],
	"oz"  :  n => [28.349 * n, "g"],
	"ounce": n => [28.349 * n, "g"],
	"pound": n => [0.453 * n, "kg"],
	"lb":    n => [0.453 * n, "kg"]
};

const QUANTITY_REGEX = /(\d*\.?\d+)\s*(mile|inch|feet|foot|ft|ounce|gallon|yard|oz|fl(?:.?.?oz)|yd|acre|pint|quart|pound|lb|fahrenheit|f)(?:es|s)?\b/gi;

export default async (homescope: HomeScope) => {
	const { message, args } = homescope;
	if (message.author.bot) 
		return;
	const sentence = args.join(" ");
	const matches: [string, string][] = [];  // Pairs of a quantity with its unit.

	let match = undefined;
	while (match = QUANTITY_REGEX.exec(sentence))
		matches.push([match[1], match[2]]);

	const msg = matches.map(pair => {
		let [quantity, unit] = [Number(pair[0]), pair[1].toLowerCase()];

		if (unit === "f") {
			const c = ftoc(quantity);
			return `${quantity}F = ${Math.round(c[0])}${c[1]}`;
		}
		if (unit.startsWith("fl"))
			unit = "fl oz";

		const out = (UNITS[unit] || noop)(quantity);
		if (out && !isNaN(out[0])) {
			return `${quantity} ${unit} = ${Math.round(out[0] * 10) / 10} ${out[1]}`;
		} else {
			return "";
		}
	}).join("\n").trim();

	if (msg.length > 0) message.channel.send(msg);
};
