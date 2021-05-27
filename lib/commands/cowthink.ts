import { execFileSync as exec_file_sync } from 'child_process';

export default (homescope: HomeScope) => {
	let { message, args } = homescope;
	if (args.length === 0)
		args = ['-f', 'milk', 'Cogito, ergo sum.'];
	// This is safe because no shell is spawned:
	message.reply(exec_file_sync('./node_modules/.bin/cowthink', args, {
		encoding: 'utf8',
		cwd: process.cwd()
	}).format('```'));
};
