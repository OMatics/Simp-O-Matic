export default async (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	const units = {
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
	var r = /[\d.]+(F| (mile|inch|feet|foot|ft|ounce|gallon|yard|oz|fl.?.?oz|yd|acre|pint|quart|pound|lb|fahrenheit))/gi;
	message.channel.send(args.match(r).map(s => s.toLowerCase()).map(s => {
		if(s[s.length - 1] == "f"){
			return Math.round(ftoc(s.slice(0, -1))) + "C";
		}
		if(s.split(" ")[1].startsWith("fl")){
			return Math.round(29.573 * s.split(" ")[0]) + " ml"
		}
		let out = (units[s.split(" ")[1]] || noop)(s.split(" ")[0]);
		if(out){
			return `${s} = ${Math.round(out[0] * 10) / 10} ${out[1]}`;
		} else {
			return "";
		}
	}).join("\n"));
}
function ftoc(n){
	return 5/9 * (n - 32);
}
function ftom(n){
	return [0.3048 * n, "m"];
}
function noop(){

}