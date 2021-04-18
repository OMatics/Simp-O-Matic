const noop = (..._) => undefined;
const ftoc = n => 5/9 * (n - 32);
const ftom = n => [0.3048 * n, "m"];

const UNITS = {
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
	"quart": n => [0.946 * n, "l"],
	"gallon": n => [3.785 * n, "l"],
	"oz"  :  n => [28.349 * n, "g"],
	"ounce": n => [28.349 * n, "g"],
	"pound": n => [0.453 * n, "kg"],
	"lb":    n => [0.453 * n, "kg"]
};

const QUANTITY_REGEX = /[\d.]+(F|\s(mile|inch|feet|foot|ft|ounce|gallon|yard|oz|fl.?.?oz|yd|acre|pint|quart|pound|lb|fahrenheit))/gi;

export default async (homescope: HomeScope) => {
	const { message, args } = homescope;

	const msg = args.join(" ").match(QUANTITY_REGEX).map(s => {
		s = s.toLowerCase();
		if (s[s.length - 1] === "f") {
			return Math.round(ftoc(s.slice(0, -1))) + "C";
		}
		if (s.split(" ")[1].startsWith("fl")) {
			return Math.round(29.573 * Number(s.split(" ")[0])) + " ml"
		}
		const out = (UNITS[s.split(" ")[1]] || noop)(Number(s.split(" ")[0]));
		if (out) {
			return `${s} = ${Math.round(out[0] * 10) / 10} ${out[1]}`;
		} else {
			return "";
		}
	}).join("\n").trim();

	if (msg.length > 0) message.channel.send(msg);
};
