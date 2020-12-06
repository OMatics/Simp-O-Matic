/* default: .ai --temp 8 --length 5000 --anon
.ai <--temp 1-10> <--raw> <--length 10-2000>  <--anon> <starting words>
default AI uses cache, 10 caches for 0.1~1.0
-raw dumps it all and resets */
var cp = require('child_process');
var by = /.*: /;
export default async (home_scope: HomeScope) => {
	const { message, args, SECRETS, CONFIG } = home_scope;
	var argv = require('yargs/yargs')(args).argv;
	if(CONFIG.aiCache[argv.temp].length){
		if(argv.raw)
			message.answer(CONFIG.aiCache[argv.temp].join('\n'))
		else
			message.answer(CONFIG.aiCache[argv.temp].pop().replace(by, argv.anon?"":a=>a))
	} else {
		message.answer("wait 5 min")
		var string = cp.execSync(`python3.8 ai/maketext.py ${(argv.temp || 8) / 10} ${argv.length || 2000} "${argv._?argv._.join(' '):"None"}"`)
		message.answer("Fresh AI Replies Baked.")
		CONFIG.aiCache[argv.temp] = string.split('\n').filter(s => by.test(s) && !s.contains("youtube.com")) // filter out too gibberish and youtube links
	}
}