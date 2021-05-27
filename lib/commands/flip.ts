// (╯°□°)╯︵ ┻━┻

import FLIPS from '../resources/flips';

const flip = c => FLIPS[c] || c;

export default (homescope: HomeScope) => {
	const { message, args } = homescope;
	message.channel.send('(╯°□°)╯︵ '
		+ [...args.join(' ')].map(flip).reverse().join(''));
};

