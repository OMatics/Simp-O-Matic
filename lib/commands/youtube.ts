import fetch from "node-fetch";

//.yt x
//.yt x n, where n < 20
//.yt new x
//.yt channel/playlist x

export default async (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	var query = args.join(" ").trim();
	query = encodeURI(query);
	const sort_by = (args[0] == "new") ? "upload_date" : "relevance";
	const type = (args[0] == "channel" || args[0] == "playlist") ? args.shift() : "video";
	let num : number = 1;
	if (query.length === 0 || args.length === 0)
		query = "bruh city";
	else {
		const num_match = query.match(/[ ]+(\d+)$/);
		if (num_match) {
			num = Number(num_match[1]);
			query = query.slice(0, -num_match[1].length).trim();
		}
	}

	const result = await fetch(`https://invidio.us/api/v1/search?q=${query}&sort_by=${sort_by}&type=${type}`);
	const res_json = await result.json();
	const res = res_json[Math.abs(num - 1)];
	let duration = new Date(res.lengthSeconds * 1000)
		.toISOString()
		.substr(11, 8);
	if (duration.substr(0, 2) == '00')
		duration = duration.slice(3);

	const views = Number(res.viewCount).to_abbrev(1);

	message.answer(`Search for '${query}' (result №${num}):`
		+ ` https://youtu.be/${res.videoId}\n`
		+ `published ${res.publishedText},`
		+ ` view count: ${views}, duration: ${duration}`);
	// TODO timestamp generation

	/*yt_search({ query })
		.then(message.reply.bind(message))
		.catch(message.answer.bind(message));*/
};
