const ytdl = require("ytdl-core");
export default async(home_scope: HomeScope) => {
	const { message, args, CONFIG } = home_scope;
	if(!message.guild) {
		message.answer("Just use youtube-dl at home.");
		return;
	};
	if(!CONFIG.vcqueue)
		CONFIG.vcqueue = [];
	switch(args[0]){
		case "join":
			if(message.member.voice.channel){
				CONFIG.vc = await message.member.voice.channel.join();
				CONFIG.vcc = message.channel;
			}
			else
				message.reply("Join A Channel First.");
			break;
		case "leave":
			try{
				CONFIG.vc.disconnect();
			} catch (error){
				message.answer(error);
			}
			break;
		case "pause":
			if(CONFIG.vcdispatcher)
				CONFIG.vcdispatcher.pause();
			else
				message.answer("Nothing is playng");
			break;
		case "play":
			if(CONFIG.vcdispatcher)
				CONFIG.vcdispatcher.resume();
			else{
				CONFIG.vcdispatcher = CONFIG.vc.play(ytdl(CONFIG.vcqueue.pop(), { filter: 'audioonly' }));
				CONFIG.vcdispatcher.on("finish", () => {
					CONFIG.vcdispatcher.destroy();
					let next = CONFIG.vcqueue.pop();
					if(next){
						CONFIG.vcdispatcher = CONFIG.vc.play(ytdl(CONFIG.vcqueue.pop(), { filter: 'audioonly' }));
						CONFIG.vcc.send("Now playing: " + next)
					}
				})
			}
			break;
		case "d":
		case "i":
			const splice_args : any = args[0] == 'd' ? [1] : [0, args[2]];
			CONFIG.vcqueue = CONFIG.vcqueue.splice(Number(args[1]), ...splice_args);
		case "ls":
			message.answer(ls(CONFIG));
			break;
		case "requeue":
			CONFIG.vcqueue = [];
			message.answer("Queue cleared");
		case "skip":
			CONFIG.vcdispatcher.end();
			break;
		default:
			CONFIG.vcqueue.push(args[0]); //add checking for valid URIs?
	}
}
function ls(CONFIG : Types.Config){ //this could be more sophisticated
	return "length: " + CONFIG.vcqueue.length + CONFIG.vcqueue.map((a, b) => "\n" + b + ": " + a).join("");
}
