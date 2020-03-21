export default home_scope => {
	const { message } = home_scope;
	Promise.all(['✅', '❎'].map(c => message.react(c))).then(console.log)
};