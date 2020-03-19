import { execFileSync as exec } from 'child_process'
export default home_scope => {
	const { message, args } = home_scope;
	// This is safe because no shell is spawned:
	message.answer(exec('./node_modules/.bin/cowthink', args, {
		encoding: 'utf8',
		cwd: process.cwd()
	}).format('```'));
};
