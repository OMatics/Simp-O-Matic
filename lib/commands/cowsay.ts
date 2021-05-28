import { execFileSync as exec_file_sync } from 'child_process';

exports.description = "Make a cow say something, using Unix-like command-line arguments.";
exports.options = [{
    name: "input",
    type: "STRING",
    description: "cowsay",
    required: true
}];

exports.main = (home_scope: HomeScope) => {
	let { message, args } = home_scope;
	if (args.length === 0)
		args = ['-d', 'Prope finem.'];
	// This is safe because no shell is spawned:
	message.reply(exec_file_sync('./node_modules/.bin/cowsay', args, {
		encoding: 'utf8',
		cwd: process.cwd()
	}).format('```'));
};
