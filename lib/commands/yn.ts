export default home_scope => {
	const { message } = home_scope;
	Promise.all(['✅', '❎'].map(message.react)).then(console.log)
};
