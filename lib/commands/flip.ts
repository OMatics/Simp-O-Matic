// (╯°□°)╯︵ ┻━┻

import FLIPS from '../resources/flips';

const flip = c => FLIPS[c] || c;

export default (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.channel.send('(╯°□°)╯︵ '
		+ [...args.join(' ')].map(flip).reverse().join(''));
};

