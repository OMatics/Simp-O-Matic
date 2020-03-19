// FUCK THIS.  Max 100 searches a day, and terrible terrible errors
//  AND I have to authenticate every hour.
//  I'm scraping YouTube instead.

import { google } from 'googleapis';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
const { OAuth2 } = google.auth;

import '../extensions';

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

type YTSearch = {
	key: string,
	query: string
};

const web_search = (param: YTSearch) => new Promise((resolve, reject) => {
	const yt = google.youtube('v3');
	const auth = new OAuth2({
		clientId: process.env['GOOGLE_OAUTH_ID'],
		clientSecret: process.env['GOOGLE_OAUTH_SECRET'],
		redirectUri: 'https://google.com/'
	});
	// const auth_url = auth.generateAuthUrl({
	//     access_type: 'offline',
	//     scope: SCOPES
	// });
	// console.log('Authorize this app by visiting this url: ', auth_url);
	auth.getToken(process.env['GOOGLE_PERSONAL_CODE']).then(code => {
		auth.setCredentials(code.tokens);
		yt.search.list({
			q: param.query,
			maxResults: 1,
			part: 'snippet',
			auth
		}).then(res => {
			if (!res.data || !res.data.items || res.data.items.length === 0)
				return reject('No such results found.');

			const video = res.data.items[0];
			const id = video.id.videoId;

			yt.videos.list({
				part: 'statistics', id
			}).then(vid_res => {
				const title = video.snippet.title;
				const { viewCount: views,
						likeCount: likes,
						dislikeCount: dislikes } = vid_res.data.items[0].statistics;

				const url = `https://youtu.be/${id}/`;
				const by = video.snippet.channelTitle;
				console.log(video);

				return resolve(`${url}\n> ${title} | ${views} views | \
					:+1: ${likes} — :-1: ${dislikes} \nby: ${by}.`.squeeze());
			}).catch(e =>
				reject(`No results, or API capped...\n\`\`\`\n${e}\n\`\`\``));
		}).catch(e =>
			reject(`No results, or API capped...\n\`\`\`\n${e}\n\`\`\``));
	}).catch(err => {
		console.log('Error with code:', err);
		reject('Token probably expired, i.e. logged out.\n'
			+ '```\n' + err.toString() + '\n```');
	});
});

export default web_search;

web_search({
	key: process.env['GOOGLE_API_KEY'],
	query: 'cat videos'
}).then(res => {
	console.log(res);
}).catch(console.log);
