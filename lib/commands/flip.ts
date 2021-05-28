// (╯°□°)╯︵ ┻━┻

import FLIPS from '../resources/flips';

const flip = c => FLIPS[c] || c;

exports.description = "GET ANGRY! FLIP SOMETHING OVER!";

exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.reply('(╯°□°)╯︵ '
		+ [...args.join(' ')].map(flip).reverse().join(''));
};

