import fetch from "node-fetch";

/*! # Command syntax:
 * Let x : query, n : nth-result, in
 * !youtube x
 * !youtube x n, where 1 <= n <= 20
 * !youtube new x
 * !youtube {channel,playlist} x
 */

export default async (homescope: HomeScope) => {
	const { message, args } = homescope;
	let query = args.join(' ').trim();

	const sort_by = (args[0] == "new")
		? (args.shift(), "upload_date")
		:                "relevance";
	const type = (args[0] == "channel" || args[0] == "playlist")
		? args.shift()
		: "video";

	let num : number = 1;
	if (query.length === 0 || args.length === 0) {
		query = "bruh city";
	} else {
		const num_match = query.match(/[ ]+(\d+)$/);
		if (num_match) {
			num = Number(num_match[1]);
			query = query.slice(0, -num_match[1].length).trim();
		}
	}

	const query_uri = encodeURI(query);
	const result = await fetch(`https://invidious.snopyta.org/api/v1/search`
		+ `?q=${query_uri}&sort_by=${sort_by}&type=${type}`);
	const res_json = await result.json();
	const res = res_json[Math.abs(num - 1)];

	let duration = new Date(res.lengthSeconds * 1000)
		.toISOString()
		.substr(11, 8);
	if (duration.substr(0, 2) == '00')
		duration = duration.slice(3);

	const views : string = Number(res.viewCount).to_abbrev(1);

	message.reply(`Search for '${query}' (result №${num}):`
		+ ` https://youtu.be/${res.videoId}`
		+ `\npublished ${res.publishedText},`
		+ ` view count: ${views}, duration: ${duration}`);

	// TODO: Timestamp generation.

	/* // Old (actual) YT scraping.
	yt_search({ query })
		.then(message.reply.bind(message))
		.catch(message.reply.bind(message));
	 */
};
