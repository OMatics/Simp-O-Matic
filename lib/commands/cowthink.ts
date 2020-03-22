import { execFileSync as exec_file_sync } from 'child_process';

export default (home_scope: HomeScope) => {
	let { message, args } = home_scope;
	if (args.length === 0)
		args = ['-f', 'milk', 'Cogito, ergo sum.'];
	// This is safe because no shell is spawned:
	message.answer(exec_file_sync('./node_modules/.bin/cowthink', args, {
		encoding: 'utf8',
		cwd: process.cwd()
	}).format('```'));
};
