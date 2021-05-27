import { fortune } from 'fortune-teller';

export default (homescope: HomeScope) => {
	const { message } = homescope;
	message.channel.send(fortune());
};
