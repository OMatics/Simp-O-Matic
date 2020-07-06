import fetch from "node-fetch";

//.yt x
//.yt x n, where n < 20
//.yt new x
//.yt channel/playlist x

export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	var query = args.join(" ").trim();
	const sort_by = (args[0] == "new") ? "upload_date" : "relevance";
	const type = (args[0] == "channel" || args[0] == "playlist") ? args.shift() : "video";
	if(query.length === 0 || args.length === 0)
		query = "bruh city";
	else{
		var num_match = query.match(/[ ]+(\d+)$/);
		if (num_match)
			query = query.slice(0, -num_match[1].length).trim();
		else
			num_match = 1;
	}
	
	const result = await fetch(`https://invidio.us/api/v1/search?q=${query}&sort_by=${sort_by}&type=${type}`);
	const res_json = await result.json();
	const res = res_json[Math.abs(num_match - 1)];
	message.answer(`Search for '${query}' (result №${num_match || 1}): https://youtu.be/${res.videoId} \n published ${res.publishedText} view count: ${res.viewCount} length: ${lengthSeconds / 60} minutes`);
	//todo timestamp generation

	/*yt_search({ query })
		.then(message.reply.bind(message))
		.catch(message.answer.bind(message));*/
};
