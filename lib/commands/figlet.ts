import { execFileSync as exec_file_sync } from 'child_process';
exports.description = "Print text in ASCII format, using Unix-like command-line arguments.";
exports.main = (home_scope: HomeScope) => {
	let { message, args } = home_scope;
	if (args.length === 0)
		args = ['-f', 'Train', 'Simp'];
	// This is safe because no shell is spawned:
	message.reply(exec_file_sync('./node_modules/.bin/figlet', args, {
		encoding: 'utf8',
		cwd: process.cwd()
	}).format('```'));
};
