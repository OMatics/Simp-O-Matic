export default home_scope => {
	const { message } = home_scope;
	message.react('✅').then(() => message.react('❎')).catch(console.log)
};