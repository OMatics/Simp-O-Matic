"use strict";
// (╯°□°)╯︵ ┻━┻
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var flips_1 = require("../resources/flips");
var flip = function (c) { return flips_1["default"][c] || c; };
// export default (home_scope: HomeScope) => {
// 	const { message, args } = home_scope;
// 	message.channel.send([...args.join(' ')].map(flip).join(''));
// };
var args = ['Hello', 'World'];
console.log(__spread(args.join(' ')).map(flip).reverse().join(''));
