import fetch from 'node-fetch';
exports.description = "Search through Wikipedia, returning the most relevant wiki-link.";
exports.options = [{
    name: "query",
    type: "STRING",
    description: "Query to look up.",
    required: true
}];
exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.defer();
	fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${message.options[0].value}&limit=1&format=json`)
	.then(j => j.json()).then(j => message.editReply(j[3] || 'not found'));
};
