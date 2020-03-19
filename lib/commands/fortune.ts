import { fortune } from 'fortune-teller';

export default home_scope => {
	const { message } = home_scope;
	message.channel.send(fortune());
};
