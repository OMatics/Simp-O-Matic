const search = require('scrape-youtube');
import '../extensions';

type YTSearch = {
	query: string
};

const yt_search = (params: YTSearch) => new Promise((resolve, reject) => {
	search(params.query, {
		limit: 2,
		type: 'video'
	}).then(res => {
		if (!res || res.length === 0) {
			return reject('No YouTube results found.');
		}

		const { channel: by, title, views,
				upload_date, link: url } = res[0];

		return resolve(`Searh for ‘${params.query}’: ${url}\n> ${title} | \
			${views.to_metric()} views | uploaded ${upload_date} | \
			by: ${by}.`.squeeze());
	});
});

export default yt_search;
