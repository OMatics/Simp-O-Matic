import fetch from 'node-fetch';
export default home_scope => {
	const { message, args } = home_scope;
	fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${args.join(' ') || 'empty set'}&limit=1&format=json`)
	.then(j => j.json()).then(j => message.answer(j[3] || 'not found'));
};
