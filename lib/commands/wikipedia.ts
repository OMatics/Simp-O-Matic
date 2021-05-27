import fetch from 'node-fetch';
export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${args.join(' ') || 'empty set'}&limit=1&format=json`)
	.then(j => j.json()).then(j => message.reply(j[3] || 'not found'));
};
