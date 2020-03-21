export default home_scope => {
	const { message } = home_scope;
	Promise.all(
		['✅', '❎']
			.map(message.react.bind(message)))
		.then(console.log)
		.catch(console.warn);
};
