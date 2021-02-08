export default (home_scope: HomeScope) => {
	const { CLIENT, message, args } = home_scope;
	try {
		var cmd = require('../drug-o-matic/commands/' + args.shift())();
		cmd.run(CLIENT, message, args);
	} catch(e) {
		message.answer('Command not found')
	}
};
