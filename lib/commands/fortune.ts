import { fortune } from 'fortune-teller';

exports.description = "Brings you fortune.";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(fortune());
};
