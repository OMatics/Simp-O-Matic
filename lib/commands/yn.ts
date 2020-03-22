export default (home_scope: HomeScope) => {
	const { message } = home_scope;
	Promise.all(
		['✅', '❎']
			.map(message.react.bind(message)))
		.then(console.log)
		.catch(console.warn);
};
