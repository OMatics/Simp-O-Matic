export default (homescope: HomeScope) => {
	const { message } = homescope;
	Promise.all(
		['✅', '❎']
			.map(message.react.bind(message)))
		.then(console.log)
		.catch(console.warn);
};
